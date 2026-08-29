import { apiClient, ApiClientError, type ApiResponse } from './apiClient';
import { asId, mapCourse, resolveMediaUrl } from './mappers';
import type { Course, VideoLesson } from '../types';

export interface CourseFilterParams {
  search?: string;
  grade_id?: number;
  category_id?: number;
  featured?: boolean | number;
  page?: number;
  per_page?: number;
}

function mapLessonFromCourse(course: Course, lessonId: string): VideoLesson | null {
  for (const chapter of course.chapters) {
    const match = chapter.lessons.find((lesson) => lesson.id === lessonId);
    if (match) return match;
  }
  return course.chapters[0]?.lessons[0] || null;
}

export class CoursesService {
  static async getAllCourses(params?: CourseFilterParams): Promise<ApiResponse<Course[]>> {
    const result = await apiClient.getPaginated<any>('/public/courses', {
      search: params?.search,
      grade_id: params?.grade_id,
      category_id: params?.category_id,
      featured: params?.featured === true ? 1 : params?.featured === false ? 0 : undefined,
      page: params?.page,
      per_page: params?.per_page ?? 50,
    });
    return apiClient.wrap(result.data.map(mapCourse));
  }

  static async getFeaturedCourses(): Promise<ApiResponse<Course[]>> {
    const featured = await CoursesService.getAllCourses({ featured: true, per_page: 9 });
    if (featured.data.length > 0) return featured;
    return CoursesService.getAllCourses({ per_page: 9 });
  }

  static async getCourseBySlug(slug: string): Promise<ApiResponse<Course | null>> {
    try {
      const raw = await apiClient.get<any>(`/public/courses/${slug}`);
      return apiClient.wrap(mapCourse(raw));
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 404) {
        return apiClient.wrap(null);
      }
      throw error;
    }
  }

  static async getCourseById(id: string): Promise<ApiResponse<Course | null>> {
    const list = await CoursesService.getAllCourses({ per_page: 100 });
    const course = list.data.find((item) => item.id === id) || null;
    return apiClient.wrap(course);
  }

  static async getMyCourses(page = 1, perPage = 50): Promise<ApiResponse<Course[]>> {
    const result = await apiClient.getPaginated<any>('/student/courses', {
      page,
      per_page: perPage,
    });
    return apiClient.wrap(result.data.map(mapCourse));
  }

  static async getStudentCourse(courseId: string): Promise<ApiResponse<Course | null>> {
    try {
      const raw = await apiClient.get<any>(`/student/courses/${courseId}`);
      return apiClient.wrap(mapCourse(raw));
    } catch (error) {
      if (error instanceof ApiClientError && (error.status === 403 || error.status === 404)) {
        return apiClient.wrap(null);
      }
      throw error;
    }
  }

  static async getStudentCourseBySlug(slug: string): Promise<ApiResponse<Course | null>> {
    if (/^\d+$/.test(slug)) {
      return CoursesService.getStudentCourse(slug);
    }

    const mine = await CoursesService.getMyCourses();
    const match = mine.data.find((course) => course.slug === slug);
    if (!match) return apiClient.wrap(null);
    return CoursesService.getStudentCourse(match.id);
  }

  static async getLessonDetails(
    courseSlug: string,
    lessonId: string,
  ): Promise<ApiResponse<{ lesson: VideoLesson; course: Course } | null>> {
    const courseRes = await CoursesService.getStudentCourseBySlug(courseSlug);
    if (!courseRes.data) return apiClient.wrap(null);

    const course = courseRes.data;
    let lesson = mapLessonFromCourse(course, lessonId);

    try {
      const raw = await apiClient.get<any>(`/student/courses/${course.id}/lessons/${lessonId}`);
      lesson = {
        id: asId(raw.id),
        chapterId: lesson?.chapterId || asId(raw.section_id),
        title: raw.title || lesson?.title || '',
        description: raw.description || lesson?.description || '',
        durationMinutes: raw.duration_seconds
          ? Math.max(1, Math.round(Number(raw.duration_seconds) / 60))
          : lesson?.durationMinutes || 0,
        videoUrl: '',
        isFreePreview: Boolean(raw.is_free_preview),
        isCompleted: Boolean(raw.user_progress?.completed_at || lesson?.isCompleted),
        order: Number(raw.sort_order || lesson?.order || 0),
        pdfResources: Array.isArray(raw.attachments)
          ? raw.attachments.map((att: any) => ({
              id: asId(att.id),
              title: att.title || 'مرفق',
              fileUrl: resolveMediaUrl(att.file_path || att.url || att.file_url),
              fileSize: att.size_bytes ? `${Math.round(Number(att.size_bytes) / 1024)} KB` : '',
            }))
          : lesson?.pdfResources,
      };

      const videoId = String(raw.video_id || '').trim();
      const storedUrl = String(raw.video_url || '');

      if (videoId) {
        try {
          const playback = await apiClient.get<{
            otp?: string;
            playbackInfo?: string;
            embed_url?: string;
          }>(`/videos/${encodeURIComponent(videoId)}/playback`);
          if (playback?.embed_url) {
            lesson.videoUrl = playback.embed_url;
          } else if (playback?.otp && playback?.playbackInfo) {
            lesson.videoUrl = `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(playback.otp)}&playbackInfo=${encodeURIComponent(playback.playbackInfo)}`;
          } else {
            lesson.videoError = 'تعذر تجهيز مشغل Video Cipher لهذا الدرس.';
          }
        } catch (error) {
          lesson.videoError =
            error instanceof ApiClientError
              ? error.message
              : 'تعذر تشغيل فيديو Video Cipher. تحقق من المفتاح ومعرف الفيديو.';
        }
      } else if (storedUrl) {
        lesson.videoUrl = storedUrl;
      }
    } catch {
      /* fall back to syllabus lesson */
    }

    if (!lesson) return apiClient.wrap(null);
    return apiClient.wrap({ lesson, course });
  }

  static async getRelatedCourses(currentCourseId: string): Promise<ApiResponse<Course[]>> {
    const all = await CoursesService.getAllCourses({ per_page: 8 });
    return apiClient.wrap(all.data.filter((course) => course.id !== currentCourseId).slice(0, 4));
  }
}

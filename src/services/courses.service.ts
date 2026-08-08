import { apiClient, type ApiResponse } from './apiClient';
import type { Course, VideoLesson } from '../types';
import { mockCourses } from '../mocks/data';

export class CoursesService {
  static async getAllCourses(): Promise<ApiResponse<Course[]>> {
    return apiClient.mockDelay(mockCourses);
  }

  static async getCourseBySlug(slug: string): Promise<ApiResponse<Course | null>> {
    const course = mockCourses.find((c) => c.slug === slug) || mockCourses[0];
    return apiClient.mockDelay(course || null);
  }

  static async getCourseById(id: string): Promise<ApiResponse<Course | null>> {
    const course = mockCourses.find((c) => c.id === id) || mockCourses[0];
    return apiClient.mockDelay(course || null);
  }

  static async getLessonDetails(courseSlug: string, lessonId: string): Promise<ApiResponse<{ lesson: VideoLesson; course: Course } | null>> {
    const course = mockCourses.find((c) => c.slug === courseSlug) || mockCourses[0];
    let foundLesson: VideoLesson | undefined;

    for (const chap of course.chapters) {
      const match = chap.lessons.find((l) => l.id === lessonId);
      if (match) {
        foundLesson = match;
        break;
      }
    }

    if (!foundLesson && course.chapters[0]?.lessons[0]) {
      foundLesson = course.chapters[0].lessons[0];
    }

    if (!foundLesson) return apiClient.mockDelay(null);

    return apiClient.mockDelay({ lesson: foundLesson, course });
  }

  static async getRelatedCourses(currentCourseId: string): Promise<ApiResponse<Course[]>> {
    const related = mockCourses.filter((c) => c.id !== currentCourseId);
    return apiClient.mockDelay(related);
  }
}

import { apiClient, type ApiResponse } from './apiClient';
import { mapProgress } from './mappers';
import type { StudentProgress } from '../types';

export class ProgressService {
  static async getCourseProgress(courseId: string): Promise<ApiResponse<StudentProgress>> {
    const raw = await apiClient.get<any>(`/student/courses/${courseId}/progress`);
    return apiClient.wrap(mapProgress(raw, courseId));
  }

  static async updateLessonProgress(
    courseId: string,
    lessonId: string,
    watchedSeconds: number,
    lastPositionSeconds: number,
  ): Promise<ApiResponse<StudentProgress>> {
    await apiClient.post(`/student/courses/${courseId}/lessons/${lessonId}/progress`, {
      watched_seconds: watchedSeconds,
      last_position_seconds: lastPositionSeconds,
    });
    return ProgressService.getCourseProgress(courseId);
  }

  static async markLessonCompleted(courseId: string, lessonId: string): Promise<ApiResponse<StudentProgress>> {
    await apiClient.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
    return ProgressService.getCourseProgress(courseId);
  }
}

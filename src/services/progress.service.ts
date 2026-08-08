import { apiClient, type ApiResponse } from './apiClient';
import type { StudentProgress } from '../types';
import { mockStudentProgress } from '../mocks/data';

export class ProgressService {
  static async getCourseProgress(courseId: string): Promise<ApiResponse<StudentProgress>> {
    return apiClient.mockDelay({
      ...mockStudentProgress,
      courseId,
    });
  }

  static async markLessonCompleted(_courseId: string, lessonId: string): Promise<ApiResponse<StudentProgress>> {
    if (!mockStudentProgress.completedLessonIds.includes(lessonId)) {
      mockStudentProgress.completedLessonIds.push(lessonId);
    }
    mockStudentProgress.lastStudiedLessonId = lessonId;
    return apiClient.mockDelay(mockStudentProgress);
  }
}

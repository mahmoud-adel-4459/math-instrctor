import { apiClient, type ApiResponse } from './apiClient';
import { asId, mapUser, resolveMediaUrl } from './mappers';
import type { StudentDashboard, User } from '../types';

export class StudentService {
  static async getDashboard(): Promise<ApiResponse<StudentDashboard>> {
    const raw = await apiClient.get<any>('/student/dashboard');
    const continueLearning = Array.isArray(raw.continue_learning) ? raw.continue_learning : [];
    const recentResults = Array.isArray(raw.recent_results) ? raw.recent_results : [];
    const stats = raw.stats || {};

    return apiClient.wrap({
      enrolledCourses: Number(stats.enrolled_courses ?? raw.enrolled_courses_count ?? 0),
      completedCourses: Number(stats.completed_courses ?? raw.completed_courses_count ?? 0),
      activeCourses: Number(stats.active_courses ?? 0),
      unreadNotifications: Number(stats.unread_notifications ?? 0),
      continueLearning: continueLearning.map((item: any) => ({
        courseId: asId(item.course_id),
        courseTitle: item.course_title || '',
        courseSlug: item.course_slug,
        thumbnail: resolveMediaUrl(item.course_thumbnail),
        progressPercentage: Number(item.progress?.percentage ?? item.progress?.completion_percentage ?? 0),
        completedLessons: Number(item.progress?.completed_lessons ?? item.progress?.completed_lessons_count ?? 0),
        totalLessons: Number(item.progress?.total_lessons ?? item.progress?.total_lessons_count ?? 0),
      })),
      recentResults: recentResults.map((item: any) => ({
        type: item.type === 'exam' ? 'exam' : 'quiz',
        title: item.title || item.quiz?.title || item.exam?.title || '',
        score: Number(item.score || 0),
        maxScore: Number(item.max_score || 0),
        percentage: Number(item.percentage || 0),
        passed: Boolean(item.passed),
        submittedAt: item.submitted_at || '',
      })),
    });
  }

  static async getProfile(): Promise<ApiResponse<User>> {
    const raw = await apiClient.get<any>('/student/profile');
    return apiClient.wrap(mapUser(raw));
  }

  static async updateProfile(payload: { name?: string; phone?: string }): Promise<ApiResponse<User>> {
    const raw = await apiClient.put<any>('/student/profile', payload);
    return apiClient.wrap(mapUser(raw));
  }

  static async changePassword(currentPassword: string, password: string): Promise<ApiResponse<null>> {
    await apiClient.put('/student/profile/password', {
      current_password: currentPassword,
      password,
      password_confirmation: password,
    });
    return apiClient.wrap(null);
  }
}

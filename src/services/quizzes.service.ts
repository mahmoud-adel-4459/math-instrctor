import { apiClient, type ApiResponse } from './apiClient';
import type { Quiz, QuizAttempt } from '../types';
import { mockQuizzes, mockQuizAttempts } from '../mocks/data';

export class QuizzesService {
  static async getQuizById(quizId: string): Promise<ApiResponse<Quiz | null>> {
    const quiz = mockQuizzes[quizId] || mockQuizzes['quiz_calc_1'];
    return apiClient.mockDelay(quiz || null);
  }

  static async submitQuizAttempt(
    quizId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<ApiResponse<QuizAttempt>> {
    const quiz = mockQuizzes[quizId] || mockQuizzes['quiz_calc_1'];
    let score = 0;

    if (quiz) {
      quiz.questions.forEach((q) => {
        if (answers[q.id] === q.correctOptionId) {
          score += q.points;
        }
      });
    }

    const percentage = quiz ? Math.round((score / quiz.totalPoints) * 100) : 0;
    const passed = quiz ? percentage >= quiz.passPercentage : false;

    const attempt: QuizAttempt = {
      id: `qa_${Date.now()}`,
      quizId,
      quizTitle: quiz?.title || 'اختبار تفاعلي',
      courseSlug: 'calculus-third-secondary',
      studentId: 'stu_101',
      answers,
      score,
      totalPoints: quiz?.totalPoints || 20,
      percentage,
      passed,
      completedAt: new Date().toLocaleString('ar-EG'),
      timeSpentSeconds,
    };

    mockQuizAttempts.unshift(attempt);
    return apiClient.mockDelay(attempt);
  }

  static async getStudentQuizAttempts(): Promise<ApiResponse<QuizAttempt[]>> {
    return apiClient.mockDelay(mockQuizAttempts);
  }
}

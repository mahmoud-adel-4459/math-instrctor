import { apiClient, type ApiResponse } from './apiClient';
import { mapQuiz, mapQuizAttempt, toAnswerPayload } from './mappers';
import type { Quiz, QuizAttempt } from '../types';

export class QuizzesService {
  static async getQuizById(quizId: string): Promise<ApiResponse<Quiz | null>> {
    const raw = await apiClient.get<any>(`/student/quizzes/${quizId}`);
    return apiClient.wrap(mapQuiz(raw));
  }

  static async startAttempt(quizId: string): Promise<ApiResponse<{ attemptId: string; timeRemainingSeconds?: number }>> {
    const raw = await apiClient.post<any>(`/student/quizzes/${quizId}/attempts`);
    return apiClient.wrap({
      attemptId: String(raw.id),
      timeRemainingSeconds: raw.time_remaining_seconds ?? undefined,
    });
  }

  static async saveAnswers(attemptId: string, answers: Record<string, string>): Promise<ApiResponse<null>> {
    await apiClient.post(`/student/quizzes/attempts/${attemptId}/answers`, {
      answers: toAnswerPayload(answers),
    });
    return apiClient.wrap(null);
  }

  static async submitAttempt(attemptId: string, fallback?: Partial<QuizAttempt>): Promise<ApiResponse<QuizAttempt>> {
    const raw = await apiClient.post<any>(`/student/quizzes/attempts/${attemptId}/submit`);
    return apiClient.wrap(mapQuizAttempt(raw, fallback));
  }

  static async getAttemptResult(attemptId: string, fallback?: Partial<QuizAttempt>): Promise<ApiResponse<QuizAttempt>> {
    const raw = await apiClient.get<any>(`/student/quizzes/attempts/${attemptId}/result`);
    return apiClient.wrap(mapQuizAttempt(raw, fallback));
  }

  static async submitQuizAttempt(
    quizId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number,
  ): Promise<ApiResponse<QuizAttempt>> {
    const started = await QuizzesService.startAttempt(quizId);
    await QuizzesService.saveAnswers(started.data.attemptId, answers);
    return QuizzesService.submitAttempt(started.data.attemptId, {
      quizId,
      answers,
      timeSpentSeconds,
    });
  }

  static async getStudentQuizAttempts(): Promise<ApiResponse<QuizAttempt[]>> {
    const raw = await apiClient.get<any[]>('/student/results');
    const quizzes = (raw || [])
      .filter((item) => item.type === 'quiz')
      .map((item) => mapQuizAttempt(item));
    return apiClient.wrap(quizzes);
  }
}

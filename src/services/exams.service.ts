import { apiClient, type ApiResponse } from './apiClient';
import { mapExam, mapExamAttempt, toAnswerPayload } from './mappers';
import type { Exam, ExamAttempt } from '../types';

export class ExamsService {
  static async getExamById(examId: string): Promise<ApiResponse<Exam | null>> {
    const raw = await apiClient.get<any>(`/student/exams/${examId}`);
    return apiClient.wrap(mapExam(raw));
  }

  static async startAttempt(examId: string): Promise<ApiResponse<{ attemptId: string; timeRemainingSeconds?: number }>> {
    const raw = await apiClient.post<any>(`/student/exams/${examId}/attempts`);
    return apiClient.wrap({
      attemptId: String(raw.id),
      timeRemainingSeconds: raw.time_remaining_seconds ?? undefined,
    });
  }

  static async saveAnswers(attemptId: string, answers: Record<string, string>): Promise<ApiResponse<null>> {
    await apiClient.post(`/student/exams/attempts/${attemptId}/answers`, {
      answers: toAnswerPayload(answers),
    });
    return apiClient.wrap(null);
  }

  static async submitAttempt(attemptId: string, fallback?: Partial<ExamAttempt>): Promise<ApiResponse<ExamAttempt>> {
    const raw = await apiClient.post<any>(`/student/exams/attempts/${attemptId}/submit`);
    return apiClient.wrap(mapExamAttempt(raw, fallback));
  }

  static async getAttemptResult(attemptId: string, fallback?: Partial<ExamAttempt>): Promise<ApiResponse<ExamAttempt>> {
    const raw = await apiClient.get<any>(`/student/exams/attempts/${attemptId}/result`);
    return apiClient.wrap(mapExamAttempt(raw, fallback));
  }

  static async submitExamAttempt(
    examId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number,
  ): Promise<ApiResponse<ExamAttempt>> {
    const started = await ExamsService.startAttempt(examId);
    await ExamsService.saveAnswers(started.data.attemptId, answers);
    return ExamsService.submitAttempt(started.data.attemptId, {
      examId,
      answers,
      timeSpentSeconds,
    });
  }

  static async getStudentExamAttempts(): Promise<ApiResponse<ExamAttempt[]>> {
    const raw = await apiClient.get<any[]>('/student/results');
    const exams = (raw || [])
      .filter((item) => item.type === 'exam')
      .map((item) => mapExamAttempt(item));
    return apiClient.wrap(exams);
  }
}

import { apiClient, type ApiResponse } from './apiClient';
import type { Exam, ExamAttempt } from '../types';
import { mockExams, mockExamAttempts } from '../mocks/data';

export class ExamsService {
  static async getExamById(examId: string): Promise<ApiResponse<Exam | null>> {
    const exam = mockExams[examId] || mockExams['exam_calc_final'];
    return apiClient.mockDelay(exam || null);
  }

  static async submitExamAttempt(
    examId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ): Promise<ApiResponse<ExamAttempt>> {
    const exam = mockExams[examId] || mockExams['exam_calc_final'];
    let score = 0;

    if (exam) {
      exam.questions.forEach((q) => {
        if (answers[q.id] === q.correctOptionId) {
          score += q.points;
        }
      });
    }

    const percentage = exam ? Math.round((score / exam.totalPoints) * 100) : 0;
    const passed = exam ? percentage >= exam.passPercentage : false;

    const attempt: ExamAttempt = {
      id: `ea_${Date.now()}`,
      examId,
      examTitle: exam?.title || 'الامتحان النهائي',
      courseSlug: 'calculus-third-secondary',
      studentId: 'stu_101',
      answers,
      score,
      totalPoints: exam?.totalPoints || 50,
      percentage,
      passed,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toLocaleString('ar-EG'),
      completedAt: new Date().toLocaleString('ar-EG'),
      timeSpentSeconds,
    };

    mockExamAttempts.unshift(attempt);
    return apiClient.mockDelay(attempt);
  }

  static async getStudentExamAttempts(): Promise<ApiResponse<ExamAttempt[]>> {
    return apiClient.mockDelay(mockExamAttempts);
  }
}

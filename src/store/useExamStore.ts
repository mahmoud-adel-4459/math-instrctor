import { create } from 'zustand';
import type { Exam, ExamAttempt, Question } from '../types';

interface ExamState {
  currentExam: Exam | null;
  answers: Record<string, string>; // questionId -> selectedOptionId
  timeRemainingSeconds: number;
  isExamActive: boolean;
  isSubmitted: boolean;
  latestAttempt: ExamAttempt | null;
  startExam: (exam: Exam) => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  tickTimer: () => void;
  submitExam: (studentId: string) => ExamAttempt;
  resetExam: () => void;
}

// Mock exam for testing demo
export const MOCK_EXAM_CALCULUS: Exam = {
  id: 'exam_calc_chap1',
  title: 'اختبار الفصل الأول: الاشتقاق وتطبيقاته',
  courseId: 'course_sec3_calc',
  chapterId: 'chap_calc_1',
  description: 'اختبار تقييمي شامل يغطي اشتقاق الدوال المثلثية، الاشتقاق الضمني، والمشتقات العليا وفق نظام البابل شيت الحديث.',
  durationMinutes: 30,
  passPercentage: 60,
  totalPoints: 20,
  questionsCount: 4,
  attemptsAllowed: 3,
  isPublished: true,
  questions: [
    {
      id: 'q_1',
      examId: 'exam_calc_chap1',
      text: 'إذا كانت ص = ظا(٣س)، فإن المشتقة الأولى (دص / دس) تساوي:',
      type: 'multiple_choice',
      points: 5,
      explanation: 'قاعدة اشتقاق الظا: مشتقة الزاويه × قا² (الزاوية) => ٣ × قا²(٣س).',
      options: [
        { id: 'opt_1_a', text: '٣ قا²(٣س)' },
        { id: 'opt_1_b', text: 'قا²(٣س)' },
        { id: 'opt_1_c', text: '-٣ قتا²(٣س)' },
        { id: 'opt_1_d', text: '٣ جتا(٣س)' },
      ],
      correctOptionId: 'opt_1_a',
    },
    {
      id: 'q_2',
      examId: 'exam_calc_chap1',
      text: 'إذا كانت س² + ص² = ٢٥، فإن قيمة (دص / دس) عند النقطة (٣، ٤) هي:',
      type: 'multiple_choice',
      points: 5,
      explanation: 'بالاشتقاق الضمني بالنسبة لـ س: ٢س + ٢ص (دص/دس) = ٠ => دص/دس = -س / ص => -٣ / ٤.',
      options: [
        { id: 'opt_2_a', text: '-٣ / ٤' },
        { id: 'opt_2_b', text: '٣ / ٤' },
        { id: 'opt_2_c', text: '-٤ / ٣' },
        { id: 'opt_2_d', text: '٤ / ٣' },
      ],
      correctOptionId: 'opt_2_a',
    },
    {
      id: 'q_3',
      examId: 'exam_calc_chap1',
      text: 'ميل المماس للمنحنى ص = جا(س) عند س = π / ٦ هو:',
      type: 'multiple_choice',
      points: 5,
      explanation: 'دص/دس = جتا(س) => جتا(٣٠°) = √٣ / ٢.',
      options: [
        { id: 'opt_3_a', text: '√٣ / ٢' },
        { id: 'opt_3_b', text: '١ / ٢' },
        { id: 'opt_3_c', text: '١ / √٢' },
        { id: 'opt_3_d', text: '٠' },
      ],
      correctOptionId: 'opt_3_a',
    },
    {
      id: 'q_4',
      examId: 'exam_calc_chap1',
      text: 'المشتقة الثانية للدالة ص = س³ + ٥س - ٧ تساوي:',
      type: 'multiple_choice',
      points: 5,
      explanation: 'المشتقة الأولى: ٣س² + ٥، المشتقة الثانية: ٦س.',
      options: [
        { id: 'opt_4_a', text: '٦س' },
        { id: 'opt_4_b', text: '٣س²' },
        { id: 'opt_4_c', text: '٦' },
        { id: 'opt_4_d', text: '٣س' },
      ],
      correctOptionId: 'opt_4_a',
    },
  ],
};

export const useExamStore = create<ExamState>((set, get) => ({
  currentExam: null,
  answers: {},
  timeRemainingSeconds: 0,
  isExamActive: false,
  isSubmitted: false,
  latestAttempt: null,

  startExam: (exam) => {
    set({
      currentExam: exam,
      answers: {},
      timeRemainingSeconds: exam.durationMinutes * 60,
      isExamActive: true,
      isSubmitted: false,
      latestAttempt: null,
    });
  },

  selectAnswer: (questionId, optionId) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: optionId,
      },
    }));
  },

  tickTimer: () => {
    const { timeRemainingSeconds, isExamActive, isSubmitted } = get();
    if (!isExamActive || isSubmitted) return;

    if (timeRemainingSeconds <= 1) {
      set({ timeRemainingSeconds: 0 });
      get().submitExam('stu_101');
    } else {
      set({ timeRemainingSeconds: timeRemainingSeconds - 1 });
    }
  },

  submitExam: (studentId) => {
    const { currentExam, answers, timeRemainingSeconds } = get();
    if (!currentExam) throw new Error('No active exam');

    let totalScore = 0;
    currentExam.questions.forEach((q: Question) => {
      if (answers[q.id] === q.correctOptionId) {
        totalScore += q.points;
      }
    });

    const percentage = (totalScore / currentExam.totalPoints) * 100;
    const passed = percentage >= currentExam.passPercentage;
    const timeSpent = currentExam.durationMinutes * 60 - timeRemainingSeconds;

    const attempt: ExamAttempt = {
      id: `att_${Date.now()}`,
      examId: currentExam.id,
      studentId,
      answers,
      score: totalScore,
      totalPoints: currentExam.totalPoints,
      passed,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
    };

    set({
      isSubmitted: true,
      isExamActive: false,
      latestAttempt: attempt,
    });

    return attempt;
  },

  resetExam: () => {
    set({
      currentExam: null,
      answers: {},
      timeRemainingSeconds: 0,
      isExamActive: false,
      isSubmitted: false,
      latestAttempt: null,
    });
  },
}));

import type {
  AttemptReviewAnswer,
  Certificate,
  Chapter,
  Course,
  Exam,
  ExamAttempt,
  GradeLevel,
  Notification,
  Question,
  QuestionType,
  Quiz,
  QuizAttempt,
  StudentProgress,
  SubjectBranch,
  User,
  UserRole,
  VideoLesson,
} from '../types';
import { INSTRUCTOR_NAME, INSTRUCTOR_TITLE } from '../utils/constants';
import { apiOrigin } from './apiClient';

export function resolveMediaUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/storage/${path}`;
  return `${apiOrigin}${normalized}`;
}

export function asId(value: string | number | undefined | null): string {
  return value === undefined || value === null ? '' : String(value);
}

export function mapGradeLevel(grade?: { slug?: string; name?: string } | null): GradeLevel {
  const raw = `${grade?.slug || ''} ${grade?.name || ''}`.toLowerCase();
  if (raw.includes('prep') || raw.includes('إعداد') || raw.includes('اعداد')) return 'prep_3';
  if (raw.includes('sec-1') || raw.includes('sec_1') || raw.includes('أول') || raw.includes('اول')) return 'sec_1';
  if (raw.includes('sec-2') || raw.includes('sec_2') || raw.includes('ثاني')) return 'sec_2';
  return 'sec_3';
}

export function mapBranch(category?: { slug?: string; name?: string } | null): SubjectBranch {
  const raw = `${category?.slug || ''} ${category?.name || ''}`.toLowerCase();
  if (raw.includes('algebra') || raw.includes('جبر')) return 'algebra';
  if (raw.includes('geometry') || raw.includes('هندس')) return 'geometry';
  if (raw.includes('static') || raw.includes('استات') || raw.includes('إحص')) return 'statics';
  if (raw.includes('dynamic') || raw.includes('دينام')) return 'dynamics';
  if (raw.includes('trigon') || raw.includes('مثلث')) return 'trigonometry';
  if (raw.includes('calculus') || raw.includes('تفاضل') || raw.includes('تكامل')) return 'calculus';
  return 'general_math';
}

function mapQuestionType(type?: string): QuestionType {
  if (type === 'true_false' || type === 'boolean') return 'true_false';
  if (type === 'essay' || type === 'text') return 'essay';
  return 'multiple_choice';
}

export function mapQuestion(raw: any, examId?: string, quizId?: string): Question {
  const options = Array.isArray(raw.options) ? raw.options : [];
  const correct = options.find((opt: any) => opt.is_correct);
  const img = raw.image_url || raw.image;
  return {
    id: asId(raw.id),
    examId,
    quizId,
    text: raw.text || '',
    image: img ? resolveMediaUrl(img) : undefined,
    type: mapQuestionType(raw.type),
    options: options.map((opt: any) => ({
      id: asId(opt.id),
      text: opt.text || '',
      image: opt.image ? resolveMediaUrl(opt.image) : undefined,
    })),
    correctOptionId: correct ? asId(correct.id) : undefined,
    points: Number(raw.points || 0),
    explanation: raw.explanation || undefined,
  };
}

export function mapUser(raw: any, enrolledCourseIds: string[] = []): User {
  const roles: string[] = Array.isArray(raw.roles) ? raw.roles : raw.role ? [raw.role] : [];
  const role: UserRole = roles.includes('super_admin') || roles.includes('admin')
    ? 'admin'
    : roles.includes('instructor')
      ? 'instructor'
      : 'student';

  return {
    id: asId(raw.id),
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    role,
    avatar: resolveMediaUrl(raw.avatar) || undefined,
    enrolledCourseIds,
    joinedAt: raw.created_at || raw.joined_at || new Date().toISOString(),
    roles,
  };
}

function mapLesson(raw: any, chapterId: string): VideoLesson {
  const durationSeconds = Number(raw.duration_seconds || 0);
  const attachments = Array.isArray(raw.attachments) ? raw.attachments : [];
  return {
    id: asId(raw.id),
    chapterId,
    title: raw.title || '',
    description: raw.description || '',
    durationMinutes: raw.duration_minutes || Math.max(1, Math.round(durationSeconds / 60)),
    videoUrl: raw.video_url || '',
    isFreePreview: Boolean(raw.is_free_preview),
    isCompleted: Boolean(raw.is_completed || raw.user_progress?.completed_at),
    order: Number(raw.sort_order || raw.order || 0),
    pdfResources: attachments.map((att: any) => ({
      id: asId(att.id),
      title: att.title || 'مرفق',
      fileUrl: resolveMediaUrl(att.file_path || att.url || att.file_url),
      fileSize: att.file_size || (att.size_bytes ? `${Math.round(Number(att.size_bytes) / 1024)} KB` : ''),
    })),
  };
}

export function mapCourse(raw: any): Course {
  const sections = Array.isArray(raw.sections) ? raw.sections : Array.isArray(raw.chapters) ? raw.chapters : [];
  const quizzes = Array.isArray(raw.quizzes) ? raw.quizzes : [];
  const exams = Array.isArray(raw.exams) ? raw.exams : [];

  const chapters: Chapter[] = sections.map((section: any, index: number) => {
    const chapterId = asId(section.id);
    const lessons = Array.isArray(section.lessons) ? section.lessons.map((lesson: any) => mapLesson(lesson, chapterId)) : [];
    const sectionQuizzes = quizzes.filter((q: any) => asId(q.section_id) === chapterId);
    const sectionExams = exams.filter((e: any) => asId(e.section_id) === chapterId);
    const sectionQuiz = sectionQuizzes[0];
    const sectionExam = sectionExams[0];
    const totalMinutes = lessons.reduce((sum: number, lesson: VideoLesson) => sum + lesson.durationMinutes, 0);

    return {
      id: chapterId,
      courseId: asId(raw.id),
      title: section.title || `الوحدة ${index + 1}`,
      description: section.description || '',
      order: Number(section.sort_order || index + 1),
      totalDurationMinutes: totalMinutes,
      lessonsCount: lessons.length,
      lessons,
      quizId: sectionQuiz ? asId(sectionQuiz.id) : undefined,
      examId: sectionExam ? asId(sectionExam.id) : undefined,
      quizIds: sectionQuizzes.map((q: any) => asId(q.id)),
      examIds: sectionExams.map((e: any) => asId(e.id)),
      isUnlocked: true,
    };
  });

  const courseLevelQuiz = quizzes.find((q: any) => !q.section_id);
  if (courseLevelQuiz && chapters[0] && !chapters[0].quizId) {
    chapters[0].quizId = asId(courseLevelQuiz.id);
  }

  const courseLevelExam = exams.find((e: any) => e.is_final || !e.section_id);
  if (courseLevelExam && chapters[0] && !chapters[0].examId) {
    chapters[0].examId = asId(courseLevelExam.id);
  }

  return {
    id: asId(raw.id),
    title: raw.title || '',
    slug: raw.slug || asId(raw.id),
    gradeLevel: mapGradeLevel(raw.grade),
    branch: mapBranch(raw.category),
    description: raw.description || '',
    fullDescription: raw.full_description || raw.description || '',
    thumbnail: resolveMediaUrl(raw.thumbnail) || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    instructorName: raw.instructor?.name || INSTRUCTOR_NAME,
    instructorTitle: INSTRUCTOR_TITLE,
    rating: Number(raw.rating || 4.8),
    reviewCount: Number(raw.review_count || raw.reviews_count || 0),
    totalStudents: Number(raw.total_students || raw.students_count || raw.enrollments_count || 0),
    price: Number(raw.price || 0),
    discountPrice: raw.discount_price != null ? Number(raw.discount_price) : undefined,
    chapters,
    features: Array.isArray(raw.features) && raw.features.length
      ? raw.features
      : ['فيديوهات شرح', 'اختبارات تفاعلية', 'مذكرات PDF', 'متابعة تقدم الطالب'],
    requirements: raw.requirements,
    whatYouWillLearn: raw.what_you_will_learn,
    isFeatured: Boolean(raw.is_featured),
    createdAt: raw.published_at || raw.created_at || '',
    updatedAt: raw.updated_at || '',
    lessonsCount: Number(raw.lessons_count || chapters.reduce((sum, chap) => sum + chap.lessons.length, 0)),
    durationMinutes: Number(raw.duration_minutes || 0),
  };
}

export function mapQuiz(payload: any): Quiz {
  const quiz = payload.quiz || payload;
  const questions = Array.isArray(payload.questions)
    ? payload.questions
    : Array.isArray(quiz.questions)
      ? quiz.questions
      : [];
  const mappedQuestions = questions.map((q: any) => mapQuestion(q, undefined, asId(quiz.id)));
  const totalPoints = mappedQuestions.reduce((sum: number, q: Question) => sum + q.points, 0);

  return {
    id: asId(quiz.id),
    title: quiz.title || '',
    courseId: asId(quiz.course_id),
    chapterId: quiz.section_id ? asId(quiz.section_id) : undefined,
    lessonId: quiz.lesson_id ? asId(quiz.lesson_id) : undefined,
    description: quiz.description || quiz.instructions || '',
    durationMinutes: Number(quiz.duration_minutes || 20),
    passPercentage: Number(quiz.pass_percentage || 60),
    totalPoints: totalPoints || Number(quiz.total_points || 0),
    questionsCount: Number(quiz.questions_count || mappedQuestions.length),
    questions: mappedQuestions,
    attemptsAllowed: Number(quiz.attempts_allowed || 1),
  };
}

export function mapExam(payload: any): Exam {
  const exam = payload.exam || payload;
  const questions = Array.isArray(payload.questions)
    ? payload.questions
    : Array.isArray(exam.questions)
      ? exam.questions
      : [];
  const mappedQuestions = questions.map((q: any) => mapQuestion(q, asId(exam.id)));
  const totalPoints = mappedQuestions.reduce((sum: number, q: Question) => sum + q.points, 0);

  return {
    id: asId(exam.id),
    title: exam.title || '',
    courseId: asId(exam.course_id),
    chapterId: exam.section_id ? asId(exam.section_id) : undefined,
    description: exam.description || exam.instructions || '',
    durationMinutes: Number(exam.duration_minutes || 60),
    passPercentage: Number(exam.pass_percentage || 60),
    totalPoints: totalPoints || Number(exam.total_points || 0),
    questionsCount: Number(exam.questions_count || mappedQuestions.length),
    questions: mappedQuestions,
    attemptsAllowed: Number(exam.attempts_allowed || 1),
    isPublished: exam.status ? exam.status === 'published' : true,
  };
}

export function mapReviewAnswers(rawAnswers: any[]): AttemptReviewAnswer[] {
  return (rawAnswers || []).map((ans) => ({
    questionId: asId(ans.question_id),
    questionText: ans.question_text || '',
    selectedOptionIds: (ans.selected_option_ids || []).map(asId),
    isCorrect: Boolean(ans.is_correct),
    pointsAwarded: Number(ans.points_awarded || 0),
    explanation: ans.explanation || undefined,
    correctOptionIds: (ans.correct_option_ids || []).map(asId),
  }));
}

export function mapQuizAttempt(raw: any, fallback?: Partial<QuizAttempt>): QuizAttempt {
  const quiz = raw.quiz || {};
  const answersMap: Record<string, string> = {};
  (raw.answers || []).forEach((ans: any) => {
    const first = Array.isArray(ans.selected_option_ids) ? ans.selected_option_ids[0] : undefined;
    if (first !== undefined) answersMap[asId(ans.question_id)] = asId(first);
  });

  return {
    id: asId(raw.id),
    quizId: asId(quiz.id || raw.quiz_id || fallback?.quizId),
    quizTitle: quiz.title || fallback?.quizTitle || 'كويز',
    courseSlug: fallback?.courseSlug || '',
    studentId: asId(raw.user_id || fallback?.studentId),
    answers: Object.keys(answersMap).length ? answersMap : fallback?.answers || {},
    score: Number(raw.score ?? fallback?.score ?? 0),
    totalPoints: Number(raw.max_score ?? fallback?.totalPoints ?? 0),
    percentage: Math.round(Number(raw.percentage ?? fallback?.percentage ?? 0)),
    passed: Boolean(raw.passed),
    completedAt: raw.submitted_at || fallback?.completedAt || new Date().toISOString(),
    timeSpentSeconds: Number(fallback?.timeSpentSeconds || 0),
    review: Array.isArray(raw.answers) ? mapReviewAnswers(raw.answers) : fallback?.review,
  };
}

export function mapExamAttempt(raw: any, fallback?: Partial<ExamAttempt>): ExamAttempt {
  const exam = raw.exam || {};
  const answersMap: Record<string, string> = {};
  (raw.answers || []).forEach((ans: any) => {
    const first = Array.isArray(ans.selected_option_ids) ? ans.selected_option_ids[0] : undefined;
    if (first !== undefined) answersMap[asId(ans.question_id)] = asId(first);
  });

  return {
    id: asId(raw.id),
    examId: asId(exam.id || raw.exam_id || fallback?.examId),
    examTitle: exam.title || fallback?.examTitle || 'امتحان',
    courseSlug: fallback?.courseSlug || '',
    studentId: asId(raw.user_id || fallback?.studentId),
    answers: Object.keys(answersMap).length ? answersMap : fallback?.answers || {},
    score: Number(raw.score ?? fallback?.score ?? 0),
    totalPoints: Number(raw.max_score ?? fallback?.totalPoints ?? 0),
    percentage: Math.round(Number(raw.percentage ?? fallback?.percentage ?? 0)),
    passed: Boolean(raw.passed),
    startedAt: raw.started_at || fallback?.startedAt || '',
    completedAt: raw.submitted_at || fallback?.completedAt || new Date().toISOString(),
    timeSpentSeconds: Number(fallback?.timeSpentSeconds || 0),
    review: Array.isArray(raw.answers) ? mapReviewAnswers(raw.answers) : fallback?.review,
  };
}

export function mapProgress(raw: any, courseId: string): StudentProgress {
  return {
    studentId: '',
    courseId,
    completedLessonIds: (raw.completed_lesson_ids || []).map(asId),
    completedExamIds: [],
    completedQuizIds: [],
    lastStudiedLessonId: raw.last_accessed_lesson_id ? asId(raw.last_accessed_lesson_id) : undefined,
    overallPercentage: Number(raw.percentage ?? raw.completion_percentage ?? 0),
    totalHoursWatched: 0,
    lastStudiedAt: raw.last_studied_at || new Date().toISOString(),
    completedCount: Number(raw.completed_lessons ?? raw.completed_lessons_count ?? 0),
    totalCount: Number(raw.total_lessons ?? raw.total_lessons_count ?? 0),
  };
}

export function mapNotification(raw: any): Notification {
  const typeName = String(raw.type || '').toLowerCase();
  const type: Notification['type'] = typeName.includes('exam')
    ? 'exam'
    : typeName.includes('quiz')
      ? 'quiz'
      : typeName.includes('course')
        ? 'course'
        : 'system';

  return {
    id: asId(raw.id),
    title: raw.title || 'إشعار',
    message: raw.body || raw.message || '',
    type,
    isRead: Boolean(raw.read_at),
    createdAt: raw.created_at || '',
    link: raw.data?.link || raw.data?.url,
  };
}

export function mapCertificate(raw: any): Certificate {
  return {
    id: asId(raw.id),
    courseId: asId(raw.course?.id),
    courseTitle: raw.course?.title || 'كورس',
    studentName: raw.student_name || raw.user?.name || '',
    issueDate: raw.issued_at || '',
    grade: raw.grade || (raw.score_percentage != null ? `${Math.round(Number(raw.score_percentage))}%` : '—'),
    scorePercentage: Number(raw.score_percentage || 0),
    downloadUrl: raw.download_url || undefined,
  };
}

export function toAnswerPayload(answers: Record<string, any>) {
  return Object.entries(answers)
    .filter(([, val]) => val)
    .map(([questionId, val]) => {
      if (typeof val === 'object' && val !== null) {
        return {
          question_id: Number(questionId),
          selected_option_ids: val.selectedOptionId ? [Number(val.selectedOptionId)] : [],
          answer_text: val.answerText || null,
          answer_image: val.answerImage || null,
        };
      }
      return {
        question_id: Number(questionId),
        selected_option_ids: [Number(val)],
      };
    });
}

// Types & Interfaces for Math Instructor Platform (منصة ماث انستركتور)

export type UserRole = 'student' | 'instructor' | 'admin';

export type GradeLevel = 
  | 'sec_3' // الصف الثالث الثانوي (علمي رياضة)
  | 'sec_2' // الصف الثاني الثانوي
  | 'sec_1' // الصف الأول الثانوي
  | 'prep_3'; // الصف الثالث الإعدادي

export type SubjectBranch = 
  | 'algebra'      // الجبر
  | 'calculus'     // التفاضل والتكامل
  | 'geometry'     // الهندسة الفراغية
  | 'statics'      // الإستاتيكا
  | 'dynamics'     // الديناميكا
  | 'trigonometry' // حساب المثلثات
  | 'general_math';// الرياضيات العامة

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  gradeLevel?: GradeLevel;
  enrolledCourseIds: string[];
  joinedAt: string;
}

export interface VideoLesson {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl: string; // Embed or HLS video link
  isFreePreview: boolean;
  isCompleted?: boolean;
  order: number;
  pdfResources?: {
    id: string;
    title: string;
    fileUrl: string;
    fileSize: string;
  }[];
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  totalDurationMinutes: number;
  lessonsCount: number;
  lessons: VideoLesson[];
  quizId?: string; // Optional quiz per chapter
  examId?: string; // Optional exam for the entire chapter
  isUnlocked?: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  gradeLevel: GradeLevel;
  branch: SubjectBranch;
  description: string;
  fullDescription: string;
  thumbnail: string;
  instructorName: string;
  instructorTitle: string;
  rating: number;
  reviewCount: number;
  totalStudents: number;
  price: number;
  discountPrice?: number;
  chapters: Chapter[];
  features: string[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'essay';

export interface QuestionOption {
  id: string;
  text: string;
  image?: string;
}

export interface Question {
  id: string;
  examId?: string;
  quizId?: string;
  text: string; // Supports LaTeX or Math syntax
  image?: string;
  type: QuestionType;
  options: QuestionOption[];
  correctOptionId: string;
  points: number;
  explanation?: string; // الشرح النموذجي للإجابة
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  chapterId?: string;
  lessonId?: string;
  description: string;
  durationMinutes: number;
  passPercentage: number;
  totalPoints: number;
  questionsCount: number;
  questions: Question[];
  attemptsAllowed: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  courseSlug: string;
  studentId: string;
  answers: Record<string, string>; // questionId -> optionId
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  timeSpentSeconds: number;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  chapterId?: string;
  description: string;
  durationMinutes: number;
  passPercentage: number;
  totalPoints: number;
  questionsCount: number;
  questions: Question[];
  attemptsAllowed: number;
  isPublished: boolean;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  courseSlug: string;
  studentId: string;
  answers: Record<string, string>; // questionId -> optionId
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  completedLessonIds: string[];
  completedExamIds: string[];
  completedQuizIds: string[];
  lastStudiedLessonId?: string;
  overallPercentage: number;
  totalHoursWatched: number;
  lastStudiedAt: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  grade: string;
  scorePercentage: number;
  downloadUrl?: string;
}

export type OrderStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface Order {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'course' | 'exam' | 'quiz' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

import type { GradeLevel, SubjectBranch } from '../types';

/**
 * Format currency in Egyptian Pounds (EGP / ج.م)
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ar-EG')} ج.م`;
};

/**
 * Format minutes into Arabic hours and minutes string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتان' : 'ساعات'}`;
  }
  return `${hours} ساعة و ${remainingMinutes} دقيقة`;
};

/**
 * Format Grade Level into Arabic display text
 */
export const formatGradeName = (grade: GradeLevel): string => {
  const gradeMap: Record<GradeLevel, string> = {
    sec_3: 'الصف الثالث الثانوي (علمي رياضة)',
    sec_2: 'الصف الثاني الثانوي',
    sec_1: 'الصف الأول الثانوي',
    prep_3: 'الصف الثالث الإعدادي',
  };
  return gradeMap[grade] || grade;
};

/**
 * Format Math Subject Branch into Arabic display text
 */
export const formatBranchName = (branch: SubjectBranch): string => {
  const branchMap: Record<SubjectBranch, string> = {
    algebra: 'الجبر والتوافيق',
    calculus: 'التفاضل والتكامل',
    geometry: 'الهندسة الفراغية',
    statics: 'الإستاتيكا',
    dynamics: 'الديناميكا',
    trigonometry: 'حساب المثلثات',
    general_math: 'الرياضيات العامة',
  };
  return branchMap[branch] || branch;
};

/**
 * Format seconds into mm:ss format for exam timers or video length
 */
export const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return `${paddedMins}:${paddedSecs}`;
};

/**
 * Format Arabic date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

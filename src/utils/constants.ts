import type { GradeLevel, SubjectBranch } from '../types';

export const APP_NAME = 'Math with Kabil';
export const APP_TAGLINE = 'منصة التفوق الأكاديمي في الرياضيات مع مستر قابيل';
export const INSTRUCTOR_NAME = 'مستر قابيل';
export const INSTRUCTOR_TITLE = 'خبير ومعد مادة الرياضيات للثانوية العامة والإعدادية';

export const GRADE_LEVELS: { id: GradeLevel; label: string; description: string }[] = [
  {
    id: 'sec_3',
    label: 'الثالث الثانوي (علمي رياضة)',
    description: 'منهج كورس الرياضيات الكامل: تفاضل، تكامل، جبر، هندسة فراغية، استاتيكا وديناميكا.',
  },
  {
    id: 'sec_2',
    label: 'الثاني الثانوي',
    description: 'تأسيس متين وقوي في الجبر وحساب المثلثات والتفاضل والميكانيكا.',
  },
  {
    id: 'sec_1',
    label: 'الأول الثانوي',
    description: 'شرح مبسط وممتع لمفاهيم الهندسة والجبر والدوال المثلثية.',
  },
  {
    id: 'prep_3',
    label: 'الثالث الإعدادي',
    description: 'التحضير والتجهيز للمرحلة الثانوية بإتقان الأساسيات الرياضية.',
  },
];

export const SUBJECT_BRANCHES: { id: SubjectBranch; label: string; iconName: string; color: string }[] = [
  { id: 'calculus', label: 'التفاضل والتكامل', iconName: 'TrendingUp', color: 'from-blue-600 to-indigo-600' },
  { id: 'algebra', label: 'الجبر والمصفوفات', iconName: 'Grid', color: 'from-purple-600 to-pink-600' },
  { id: 'geometry', label: 'الهندسة الفراغية', iconName: 'Box', color: 'from-emerald-600 to-teal-600' },
  { id: 'statics', label: 'الإستاتيكا', iconName: 'Scale', color: 'from-amber-600 to-orange-600' },
  { id: 'dynamics', label: 'الديناميكا', iconName: 'Zap', color: 'from-red-600 to-rose-600' },
  { id: 'trigonometry', label: 'حساب المثلثات', iconName: 'Compass', color: 'from-cyan-600 to-blue-600' },
];

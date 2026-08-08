import type { GradeLevel, SubjectBranch } from '../types';

export const APP_NAME = 'Math with Kabil';
export const APP_TAGLINE = 'منصة تعليمية أُنشئت لتكون رفيقًا لكل طالب يسعى إلى التفوق وإتقان الرياضيات';

export const INSTRUCTOR_NAME = 'أ. أحمد قابيل';
export const INSTRUCTOR_TITLE = 'مدرس رياضيات بخبرة تتجاوز 27 عامًا';
export const PLATFORM_MOTTO = 'بالعلم نرتقي… وبالإتقان نتميز… وبعون الله نصل.';

export const PLATFORM_VISION =
  'أن تكون منصة Math with Kabil منارةً للعلم النافع، تُخرِّج جيلًا متقنًا للرياضيات، معتزًا بدينه، متحلّيًا بالأخلاق، مسلحًا بالعلم، وقادرًا على المنافسة والنجاح في الدنيا، راجيًا ثواب الله في الآخرة.';

export const PLATFORM_MISSION =
  'تقديم تعليم علمي متميز يجمع بين الإتقان العلمي والقيم الإسلامية، من خلال تبسيط المفاهيم، وترسيخ الفهم، وتنمية التفكير، وغرس قيم الصدق، والأمانة، والاجتهاد، والإحسان في العمل، إيمانًا بأن العلم عبادة، وأن أعظم ما يورثه المعلم لطلابه هو العلم النافع والخلق الكريم.';

export const PLATFORM_VALUES = [
  'الإخلاص لله في طلب العلم وتعليمه.',
  'الإتقان في الأداء والعمل.',
  'الصدق والأمانة.',
  'الاحترام والتعاون.',
  'الانضباط والالتزام.',
  'التعلم المستمر.',
  'بناء شخصية واثقة ومتميزة.',
];

export const QURAN_VERSES = [
  { text: 'وَقُلْ رَبِّ زِدْنِي عِلْمًا', surah: 'طه: 114' },
  { text: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ', surah: 'المجادلة: 11' },
];

export const HADITH = 'من سلك طريقًا يلتمس فيه علمًا، سهَّل الله له به طريقًا إلى الجنة.';

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

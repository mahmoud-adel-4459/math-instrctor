import { create } from 'zustand';
import type { Course, GradeLevel, SubjectBranch, VideoLesson } from '../types';

interface CourseState {
  courses: Course[];
  selectedGrade: GradeLevel | 'all';
  selectedBranch: SubjectBranch | 'all';
  searchQuery: string;
  activeCourse: Course | null;
  activeLesson: VideoLesson | null;
  setSelectedGrade: (grade: GradeLevel | 'all') => void;
  setSelectedBranch: (branch: SubjectBranch | 'all') => void;
  setSearchQuery: (query: string) => void;
  setActiveCourse: (course: Course | null) => void;
  setActiveLesson: (lesson: VideoLesson | null) => void;
}

// Initial Mock Courses data representing Math Instructor content structure
export const MOCK_COURSES: Course[] = [
  {
    id: 'course_sec3_calc',
    title: 'منهج التفاضل والتكامل كاملاً - 3 ثانوى',
    slug: 'calculus-sec-3',
    gradeLevel: 'sec_3',
    branch: 'calculus',
    description: 'شرح مفيض وشامل لكل أفكار التفاضل والتكامل، النهايات، المشتقات العليا، والتطبيقات الفيزيائية والهندسية.',
    fullDescription: 'يقدم هذا الكورس التفاعلي شرحاً دقيقاً لجميع أجزاء المنهج بدءاً من نهايات الدوال المثلثية وتفاضل وتكامل الدوال الأسية واللوغاريتمية وصولاً للمساحات والحجوم ورسم المنحنيات. يشتمل الكورس على مئات التمارين المحلولة والأسئلة المقالية والاختيارية وفقاً لنظام البابل شيت الحديث.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    instructorName: 'مستر قابيل',
    instructorTitle: 'كبير معلمي الرياضيات بالوزارة',
    rating: 4.95,
    reviewCount: 342,
    totalStudents: 1850,
    price: 350,
    discountPrice: 250,
    isFeatured: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-02-01',
    features: [
      'أكثر من 45 فيديو شرح عالي الدقة HD',
      'ملخصات PDF قابلة للطباعة لكل فصل',
      'اختبار بعد كل درس وبانك أسئلة لكل فصل',
      'امتحانات بابل شيت تفاعلية مع الشرح الفوري',
      'متابعة دورية وإحصائيات لنسبة إنجاز الطالب',
    ],
    chapters: [
      {
        id: 'chap_calc_1',
        courseId: 'course_sec3_calc',
        title: 'الفصل الأول: الاشتقاق وتطبيقاته',
        description: 'اشتقاق الدوال المثلثية، الاشتقاق الضمني والبارامترى، والمشتقات العليا.',
        order: 1,
        totalDurationMinutes: 240,
        lessonsCount: 4,
        examId: 'exam_calc_chap1',
        isUnlocked: true,
        lessons: [
          {
            id: 'les_calc_101',
            chapterId: 'chap_calc_1',
            title: 'الدرس الأول: اشتقاق الدوال المثلثية الأساسية والعكسية',
            description: 'قوانين اشتقاق الجا والظا والقاطا مع حل نماذج امتحانات سابقة.',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFreePreview: true,
            isCompleted: true,
            order: 1,
            pdfResources: [
              { id: 'pdf_1', title: 'مذكرة شرح الدرس الأول - تفاضل.pdf', fileUrl: '#', fileSize: '4.2 MB' },
              { id: 'pdf_2', title: 'واجب الدرس الأول وتدريبات.pdf', fileUrl: '#', fileSize: '1.8 MB' },
            ],
          },
          {
            id: 'les_calc_102',
            chapterId: 'chap_calc_1',
            title: 'الدرس الثاني: الاشتقاق الضمني والبارامترى',
            description: 'كيفية التعامل مع المعادلات الضمنية وإيجاد ميل المماس والعمودي.',
            durationMinutes: 55,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFreePreview: false,
            isCompleted: false,
            order: 2,
          },
          {
            id: 'les_calc_103',
            chapterId: 'chap_calc_1',
            title: 'الدرس الثالث: المشتقات ذات الرتب العليا',
            description: 'إيجاد المشتقة الثانية والثالثة مع أفكار المتطابقات الإثباتية.',
            durationMinutes: 60,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFreePreview: false,
            isCompleted: false,
            order: 3,
          },
          {
            id: 'les_calc_104',
            chapterId: 'chap_calc_1',
            title: 'الدرس الرابع: معادلا المماس والعمودي والعدلات الزمانية المرتبطة',
            description: 'حل مسائل معدلات التغير والتطبيقات الفيزيائية والهندسية.',
            durationMinutes: 80,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFreePreview: false,
            isCompleted: false,
            order: 4,
          },
        ],
      },
      {
        id: 'chap_calc_2',
        courseId: 'course_sec3_calc',
        title: 'الفصل الثاني: تفاضل وتكامل الدوال الأسية واللوغاريتمية',
        description: 'العدد النيبيري e، اللوغاريتم الطبيعي، وتكاملات الدوال الخاصة.',
        order: 2,
        totalDurationMinutes: 190,
        lessonsCount: 3,
        examId: 'exam_calc_chap2',
        isUnlocked: true,
        lessons: [
          {
            id: 'les_calc_201',
            chapterId: 'chap_calc_2',
            title: 'الدرس الأول: العدد النيبيري وتفاضل الدوال الأسية',
            description: 'خواص الدوال الأسية وكيفية استخدام القاعدة الأساسية.',
            durationMinutes: 60,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFreePreview: false,
            isCompleted: false,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'course_sec3_algebra',
    title: 'الجبر والهندسة الفراغية - 3 ثانوى',
    slug: 'algebra-geometry-sec-3',
    gradeLevel: 'sec_3',
    branch: 'algebra',
    description: 'التباديل والتوافيق، ذات الحدين، الأعداد المركبة، المحددات والمصفوفات والهندسة الفراغية.',
    fullDescription: 'كورس كامل يغطي كافة متطلبات فرعي الجبر والهندسة الفراغية. يتضمن شرحاً مبسطاً لطرق التفكير المنطقي، نظرية ذات الحدين، الأعداد المركبة في الصورة المثلثية والأسية (أويلر)، مع حل جميع أفكار كتاب المدرسة والامتحانات الوزارية.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    instructorName: 'مستر قابيل',
    instructorTitle: 'كبير معلمي الرياضيات بالوزارة',
    rating: 4.90,
    reviewCount: 218,
    totalStudents: 1420,
    price: 300,
    discountPrice: 220,
    isFeatured: true,
    createdAt: '2026-01-12',
    updatedAt: '2026-01-28',
    features: [
      '38 فيديو شرح وأفكار نادرة',
      'تطبيق أمثلة محلولة خطوة بخطوة',
      'خرائط ذهنية مجمعة للقوانين',
      'اختبارات إلكترونية ذاتية التصحيح',
    ],
    chapters: [
      {
        id: 'chap_alg_1',
        courseId: 'course_sec3_algebra',
        title: 'الفصل الأول: التباديل والتوافيق ونظرية ذات الحدين',
        description: 'مبدأ العد الأساسي، التباديل، التوافيق، ومفكوك ذات الحدين.',
        order: 1,
        totalDurationMinutes: 180,
        lessonsCount: 3,
        isUnlocked: true,
        lessons: [
          {
            id: 'les_alg_101',
            chapterId: 'chap_alg_1',
            title: 'الدرس الأول: مبدأ العد والتباديل والتوافيق',
            description: 'شرح الفرق بين الترتيب والإحلال مع مسائل حياتية.',
            durationMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFreePreview: true,
            isCompleted: false,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'course_sec3_statics',
    title: 'الإستاتيكا - الاحتكاك والعزوم والاتزان - 3 ثانوى',
    slug: 'statics-sec-3',
    gradeLevel: 'sec_3',
    branch: 'statics',
    description: 'شرح ميكانيكا الإستاتيكا، الاحتكاك على المستويات، العزوم، والقوى المتوازية والازدواجات.',
    fullDescription: 'تعلم كيفية تحليل القوى ورسم الأجسام وتطبيق شروط الاتزان العام بحرفية عالية جداً.',
    thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
    instructorName: 'مستر قابيل',
    instructorTitle: 'كبير معلمي الرياضيات بالوزارة',
    rating: 4.88,
    reviewCount: 175,
    totalStudents: 980,
    price: 280,
    discountPrice: 200,
    isFeatured: false,
    createdAt: '2026-01-20',
    updatedAt: '2026-02-02',
    features: ['شرح بالرسوم التوضيحية', 'امتحانات جزئية بعد كل باب'],
    chapters: [],
  },
];

export const useCourseStore = create<CourseState>((set) => ({
  courses: MOCK_COURSES,
  selectedGrade: 'all',
  selectedBranch: 'all',
  searchQuery: '',
  activeCourse: MOCK_COURSES[0],
  activeLesson: MOCK_COURSES[0].chapters[0]?.lessons[0] || null,

  setSelectedGrade: (grade) => set({ selectedGrade: grade }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCourse: (course) => set({ activeCourse: course }),
  setActiveLesson: (lesson) => set({ activeLesson: lesson }),
}));

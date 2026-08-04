import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  ArrowLeft,
  FileText,
  Star,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SUBJECT_BRANCHES, GRADE_LEVELS } from '../utils/constants';
import { useCourseStore } from '../store/useCourseStore';
import { formatCurrency } from '../utils/formatters';
import { HeroSlider } from '../components/home/HeroSlider';

export const HomePage: React.FC = () => {
  const { courses } = useCourseStore();

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SLIDER CAROUSEL */}
      <HeroSlider />

      {/* MATH SUBJECT BRANCHES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="cyan">التخصص والدقة</Badge>
          <h2 className="text-3xl font-extrabold text-white">فروع مادة الرياضيات بالشرح المبسط</h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            تغطي منصتنا جميع فروع الرياضيات للثانوية العامة والإعدادية مقسمة ومبسطة بشكل علمي مدروس.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECT_BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-blue-900/40 relative group overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/30">
                <Zap className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {branch.label}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                شرح المفاهيم النظرية، استنتاج القوانين، وتطبيق مئات التمارين مع الاختبارات الشهرية.
              </p>

              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300"
              >
                <span>استكشف كورسات الفرع</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="primary">الكورسات المتاحة</Badge>
            <h2 className="text-3xl font-extrabold text-white mt-2">الكورسات الأكثر طلباً هذا الفصل</h2>
          </div>
          <Link to="/courses">
            <Button variant="outline" size="sm" icon={ArrowLeft} iconPosition="left">
              عرض كل الكورسات
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-blue-900/40 flex flex-col justify-between"
            >
              <div>
                {/* Course Thumbnail */}
                <div className="relative aspect-video overflow-hidden border-b border-blue-900/30">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="primary">{GRADE_LEVELS.find((g) => g.id === course.gradeLevel)?.label}</Badge>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {course.rating} ({course.reviewCount} تقييم)
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-blue-300">
                      <Users className="w-4 h-4 text-blue-400" />
                      {course.totalStudents} طالب
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-2">{course.title}</h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      {course.chapters.length} فصول مقسمة
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      امتحانات تفاعلية
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-blue-900/30 mt-4">
                <div>
                  {course.discountPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-white">{formatCurrency(course.discountPrice)}</span>
                      <span className="text-xs text-slate-500 line-through">{formatCurrency(course.price)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-black text-white">{formatCurrency(course.price)}</span>
                  )}
                </div>

                <Link to="/lesson/les_calc_101">
                  <Button variant="primary" size="sm" icon={ArrowLeft} iconPosition="left">
                    ابدأ التعلم
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

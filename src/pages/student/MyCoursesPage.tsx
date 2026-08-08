import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, CheckCircle2, Filter, Search, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import { SEOHead } from '../../seo/SEOHead';
import { CoursesService } from '../../services/courses.service';
import { useAuthStore } from '../../store/useAuthStore';
import type { Course } from '../../types';

export const MyCoursesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CoursesService.getAllCourses().then((res) => {
      if (res.data && user) {
        const userCourses = res.data.filter((c) => user.enrolledCourseIds.includes(c.id));
        setEnrolledCourses(userCourses.length > 0 ? userCourses : res.data.slice(0, 2));
      }
      setLoading(false);
    });
  }, [user]);

  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <SEOHead title="كورساتي المسجلة" description="استعرض الكورسات المسجل بها وتابع تقدمك في مادة الرياضيات." noindex />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-900/30">
          <div>
            <h1 className="text-2xl font-black text-white">كورساتي التعليمية</h1>
            <p className="text-xs text-slate-400 mt-1">تابع تقدمك الدراسي وأكمل المشاهدة من حيث توقفت</p>
          </div>
        </div>

        {/* 2-Column Layout (Side Filter + My Courses Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* SIDEBAR FILTER */}
          <aside className="glass-panel p-5 rounded-3xl border border-blue-900/40 space-y-6 shadow-xl lg:sticky lg:top-24">
            <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-3">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>تصفية كورساتي</span>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">بحث في كورساتي:</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اسم الكورس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 text-xs rounded-xl pl-3 pr-9 py-2 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">حالة الدراسة:</label>
              <div className="space-y-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>جميع الكورسات</span>
                  {statusFilter === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setStatusFilter('in_progress')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'in_progress'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>قيد التعلم والتقدم</span>
                  {statusFilter === 'in_progress' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'completed'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>الكورسات المكتملة</span>
                  {statusFilter === 'completed' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center text-slate-400 py-12">جاري تحميل الكورسات...</div>
            ) : filteredCourses.length === 0 ? (
              <EmptyState
                title="لم يتم العثور على نتائج"
                description="جرب البحث بكلمة أخرى أو تصفح مكتبة الكورسات المتاحة."
                actionText="استعرض جميع الكورسات"
                onAction={() => window.location.assign('/courses')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => {
                  const totalLessons = course.chapters.reduce((acc, chap) => acc + chap.lessons.length, 0) || 12;
                  const completedLessons = 5;
                  const progressPct = Math.round((completedLessons / totalLessons) * 100);

                  return (
                    <div
                      key={course.id}
                      className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-blue-900/40 p-5 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-blue-900/30">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3">
                            <Badge variant="cyan">ثانوية عامة</Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                        </div>

                        {/* Progress Breakdown */}
                        <div className="space-y-2 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                            <span>نسبة الإنجاز:</span>
                            <span className="text-cyan-400 font-bold">{progressPct}%</span>
                          </div>
                          <ProgressBar progress={progressPct} />
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                              {completedLessons} / {totalLessons} درس مكتمل
                            </span>
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> قيد المتابعة
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link to={`/my-courses/${course.slug}`}>
                        <Button variant="primary" fullWidth size="md" icon={ArrowLeft} iconPosition="left">
                          متابعة الكورس
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

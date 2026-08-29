import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Filter,
  Search,
  Check,
  Star,
  Sparkles,
  Trophy,
  PlayCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import { SEOHead } from '../../seo/SEOHead';
import { CoursesService } from '../../services/courses.service';
import { ProgressService } from '../../services/progress.service';
import { useAuthStore } from '../../store/useAuthStore';
import type { Course } from '../../types';

const BOOKMARKS_KEY = 'math_instructor_bookmarked_courses';

export const MyCoursesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (courseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    CoursesService.getMyCourses()
      .then(async (res) => {
        const withProgress = await Promise.all(
          res.data.map(async (course) => {
            try {
              const progress = await ProgressService.getCourseProgress(course.id);
              return {
                ...course,
                progressPercentage: progress.data.overallPercentage,
                completedLessons: progress.data.completedCount,
                totalLessons: progress.data.totalCount || course.lessonsCount,
              };
            } catch {
              return course;
            }
          }),
        );
        setEnrolledCourses(withProgress);
      })
      .catch(() => setEnrolledCourses([]))
      .finally(() => setLoading(false));
  }, [user]);

  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const progress = course.progressPercentage || 0;
    const isBookmarked = bookmarkedIds.includes(String(course.id));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && progress >= 100) ||
      (statusFilter === 'in_progress' && progress < 100) ||
      (statusFilter === 'bookmarked' && isBookmarked);

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <SEOHead title="كورساتي المسجلة" description="استعرض الكورسات المسجل بها وتابع تقدمك في مادة الرياضيات." noindex />

      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-900/30">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              كورساتي ومقرراتي المتاحة
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              تابع نسبة إنجازك في كل كورس واستكمل المشاهدة من حيث توقفت
            </p>
          </div>
        </div>

        {/* 2-Column Layout (Side Filter + My Courses Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* SIDEBAR FILTER */}
          <aside className="glass-panel p-5 rounded-3xl border border-blue-900/40 space-y-6 shadow-xl lg:sticky lg:top-24 bg-slate-950/70">
            <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-3">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>تصفية الكورسات</span>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">بحث بالاسم:</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن كورس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 text-xs rounded-xl pl-3 pr-9 py-2.5 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">حالة الدراسة:</label>
              <div className="space-y-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>جميع المقررات</span>
                  {statusFilter === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setStatusFilter('in_progress')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'in_progress'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>قيد التعلم (مستمر)</span>
                  {statusFilter === 'in_progress' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'completed'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    المكتملة (100%)
                  </span>
                  {statusFilter === 'completed' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setStatusFilter('bookmarked')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'bookmarked'
                      ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    المميزة بنجمة
                  </span>
                  {statusFilter === 'bookmarked' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center text-slate-400 py-16 text-sm">جاري تحميل الكورسات ونسب التقدم...</div>
            ) : filteredCourses.length === 0 ? (
              <EmptyState
                title="لم يتم العثور على مقررات"
                description="جرب تغيير معايير البحث أو تصفح باقي الكورسات المتاحة."
                actionText="استعرض جميع الكورسات"
                onAction={() => window.location.assign('/courses')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => {
                  const totalLessons = course.totalLessons || course.lessonsCount || 1;
                  const completedLessons = course.completedLessons || 0;
                  const progressPct = course.progressPercentage ?? (totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0);
                  const isBookmarked = bookmarkedIds.includes(String(course.id));
                  const isFinished = progressPct >= 100;

                  return (
                    <div
                      key={course.id}
                      className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-blue-900/40 p-5 flex flex-col justify-between space-y-5 bg-slate-950/60 transition-all hover:border-blue-500/50 shadow-2xl relative group"
                    >
                      <div className="space-y-4">
                        {/* Course Thumbnail + Badges */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-blue-900/30 bg-slate-900">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          
                          {/* Percentage Badge */}
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-black text-xs shadow-lg flex items-center gap-1">
                            {progressPct}%
                          </div>

                          {/* Bookmark Star Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(String(course.id), e)}
                            className={`absolute bottom-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                              isBookmarked
                                ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                                : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300'
                            }`}
                            title={isBookmarked ? 'إزالة من المميزة' : 'تمييز بنجمة'}
                          >
                            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-slate-950' : ''}`} />
                          </button>

                          <div className="absolute top-3 right-3">
                            <Badge variant="cyan">مقرر دراسي</Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-black text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        {/* Progress Breakdown */}
                        <div className="space-y-2 pt-3 border-t border-slate-800/80">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-300">نسبة الإنجاز:</span>
                            <span className={`font-black text-xs ${isFinished ? 'text-emerald-400' : 'text-cyan-400'}`}>
                              {progressPct}% {isFinished ? '🏆 مكتمل' : ''}
                            </span>
                          </div>
                          
                          <ProgressBar progress={progressPct} />

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span className="flex items-center gap-1 font-semibold text-slate-300">
                              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                              {completedLessons} من {totalLessons} درس
                            </span>
                            {isFinished ? (
                              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> أتممت الكورس
                              </span>
                            ) : (
                              <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                                <PlayCircle className="w-3.5 h-3.5" /> مستمر بالدراسة
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link to={`/my-courses/${course.slug}`}>
                        <Button
                          variant={isFinished ? 'outline' : 'primary'}
                          fullWidth
                          size="md"
                          icon={ArrowLeft}
                          iconPosition="left"
                          className="font-bold shadow-lg"
                        >
                          {isFinished ? 'مراجعة الكورس' : 'متابعة الكورس الآن'}
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

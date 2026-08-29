import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
  Sparkles,
  Award,
  FileCheck,
  GraduationCap,
  Flame,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { StudentService } from '../services/student.service';
import { CoursesService } from '../services/courses.service';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import type { StudentDashboard } from '../types';

const DASHBOARD_STORAGE_KEY = 'app_student_dashboard_cache';
const COURSE_SLUGS_KEY = 'app_student_course_slugs_cache';

function getStoredDashboard(): StudentDashboard | null {
  try {
    const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentDashboard) : null;
  } catch {
    return null;
  }
}

function getStoredCourseSlugs(): Record<string, string> {
  try {
    const raw = localStorage.getItem(COURSE_SLUGS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function setStoredDashboardData(dashboard: StudentDashboard, slugs: Record<string, string>): void {
  try {
    localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(dashboard));
    localStorage.setItem(COURSE_SLUGS_KEY, JSON.stringify(slugs));
  } catch {
    // Ignore
  }
}

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(getStoredDashboard);
  const [courseSlugs, setCourseSlugs] = useState<Record<string, string>>(getStoredCourseSlugs);
  const [loading, setLoading] = useState(() => !getStoredDashboard());

  useEffect(() => {
    let mounted = true;
    Promise.all([StudentService.getDashboard(), CoursesService.getMyCourses()])
      .then(([dashRes, coursesRes]) => {
        if (!mounted) return;
        setDashboard(dashRes.data);
        const slugs: Record<string, string> = {};
        coursesRes.data.forEach((course) => {
          slugs[course.id] = course.slug;
        });
        setCourseSlugs(slugs);
        setStoredDashboardData(dashRes.data, slugs);
      })
      .catch(() => {
        // Keep cached state
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!user) return null;

  if (loading && !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400">جاري تجهيز لوحة التحكم الخاصة بك...</p>
      </div>
    );
  }

  const continueItems = dashboard?.continueLearning || [];
  const latest = continueItems[0];
  const recentResults = dashboard?.recentResults || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 🌟 LUXURY HERO WELCOME BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden border border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 shadow-2xl">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>لوحة المتابعة والتفوق الدراسي</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                أهلاً بك مجدداً، <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">{user.name}</span> 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                استكمل مسيرة تميزك في الرياضيات. استمرارك اليومي هو سر حصولك على الدرجة النهائية بتفوق.
              </p>
            </div>

            {/* Motivation Quote Mini Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>«مَن سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إِلَى الجَنَّةِ»</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="shrink-0 w-full sm:w-auto">
            <Link
              to={latest ? `/my-courses/${courseSlugs[latest.courseId] || latest.courseId}` : '/my-courses'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-cyan-400/30 group"
            >
              <PlayCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>استكمال آخر حصة مذاكرة</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 📊 4 STAT CARDS WITH VIBRANT NEON GLOWS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Enrolled Courses */}
        <div className="relative rounded-2xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 shadow-lg group overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {dashboard?.enrolledCourses ?? 0}
              </div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">الكورسات المشترك بها</div>
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className="relative rounded-2xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-lg group overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {dashboard?.activeCourses ?? 0}
              </div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">كورسات قيد المذاكرة</div>
            </div>
          </div>
        </div>

        {/* Completed Courses */}
        <div className="relative rounded-2xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-lg group overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all" />
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {dashboard?.completedCourses ?? 0}
              </div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">كورسات مكتملة</div>
            </div>
          </div>
        </div>

        {/* Recent / Average Score */}
        <div className="relative rounded-2xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-lg group overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition-all" />
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">
                {dashboard?.recentResults?.[0]?.percentage ?? 0}%
              </div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">آخر نتيجة اختبار</div>
            </div>
          </div>
        </div>
      </div>

      {/* 📚 MAIN CONTENT GRID: COURSES & RECENT RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Active Courses & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-6 rounded-full bg-blue-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-white">كورساتي ومستويات الإنجاز</h2>
            </div>
            <Link
              to="/my-courses"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>عرض جميع الكورسات</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {continueItems.length === 0 ? (
            <div className="rounded-3xl p-8 sm:p-12 bg-slate-900/60 border border-slate-800/80 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">لا توجد كورسات مسجلة حتى الآن</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  تصفح قائمة الكورسات والمقررات المتاحة للمرحلة الإعدادية والثانوية لتفعيل اشتراكك.
                </p>
              </div>
              <Link to="/courses" className="inline-block pt-2">
                <Button variant="primary" size="sm">
                  تصفح الكورسات المتاحة
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {continueItems.map((item) => {
                const courseSlug = courseSlugs[item.courseId] || item.courseId;
                return (
                  <div
                    key={item.courseId}
                    className="rounded-3xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-4">
                      {/* Badge and Status */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-extrabold">
                          مقرر دراسي
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>نشط الآن</span>
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                        {item.courseTitle}
                      </h3>

                      {/* Progress Bar with Glow */}
                      <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-400">نسبة التقدم:</span>
                          <span className="text-cyan-400 font-mono font-black">{item.progressPercentage}%</span>
                        </div>
                        <ProgressBar progress={item.progressPercentage} size="md" />
                      </div>
                    </div>

                    {/* Footer Info & Action */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        {item.completedLessons} من {item.totalLessons} حصة مكتملة
                      </span>
                      <Link
                        to={`/my-courses/${courseSlug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-extrabold transition-all"
                      >
                        <span>متابعة الدرس</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Actions & Recent Results */}
        <div className="space-y-6">
          
          {/* Quick Tools Box */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 rounded-full bg-indigo-500" />
              <h3 className="text-base font-bold text-white">الوصول السريع</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/my-courses"
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 block">كورساتي</span>
              </Link>

              <Link
                to="/results"
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 block">سجل النتائج</span>
              </Link>

              <Link
                to="/certificates"
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 block">شهاداتي</span>
              </Link>

              <Link
                to="/profile"
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 block">بياناتي</span>
              </Link>
            </div>
          </div>

          {/* Recent Quiz / Exam Results Card */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white">آخر الاختبارات</h3>
              </div>
              <Link to="/results" className="text-[11px] font-bold text-blue-400 hover:text-blue-300">
                السجل كامل
              </Link>
            </div>

            {recentResults.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                <p>لم تقم بإجراء أي اختبارات مؤخراً.</p>
                <span className="text-[10px] text-slate-500 block">ستظهر درجاتك هنا فور الانتهاء من الاختبار.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentResults.slice(0, 3).map((res, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="truncate space-y-0.5 max-w-[150px]">
                      <h4 className="text-xs font-bold text-white truncate">{res.title}</h4>
                      <p className="text-[10px] text-slate-400">{res.type === 'exam' ? 'امتحان شامل' : 'كويز تدريبي'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono ${
                        res.percentage >= 85
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : res.percentage >= 60
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {res.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Need Help Box */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 text-center space-y-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">هل تواجه صعوبة في مسألة؟</h4>
              <p className="text-[11px] text-slate-400">
                يمكنك كتابة استفسارك أسفل كل فيديو أو مراجعة الأسئلة الشائعة.
              </p>
            </div>
            <Link
              to="/faq"
              className="inline-block w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
            >
              الأسئلة الشائعة
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

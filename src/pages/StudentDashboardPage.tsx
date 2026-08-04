import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCourseStore } from '../store/useCourseStore';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { courses } = useCourseStore();

  if (!user) return null;

  const enrolledCourses = courses.filter((c) => user.enrolledCourseIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Student Welcome Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 text-center md:text-right">
          <Badge variant="purple">لوحة التحكم والمتابعة</Badge>
          <h1 className="text-3xl font-extrabold text-white">
            مرحباً بعودتك، <span className="text-gradient">{user.name}</span> 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            استكمل مسيرة تفوقك في مادة الرياضيات. لديك دروس بانتظارك اليوم لتحقيق الدرجة النهائية.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Link to="/lesson/les_calc_101">
            <Button variant="gradient" size="md" icon={PlayCircle}>
              متابعة آخر حصة مشاهدة
            </Button>
          </Link>
        </div>

        {/* Glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{enrolledCourses.length}</div>
            <div className="text-xs text-slate-400 font-medium">الكورسات المشترك بها</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">12</div>
            <div className="text-xs text-slate-400 font-medium">حصة مكتملة</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">20/20</div>
            <div className="text-xs text-slate-400 font-medium">أعلى درجة امتحان</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">18.5</div>
            <div className="text-xs text-slate-400 font-medium">ساعة مشاهدة تعليمية</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Progress */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">كورساتي ومستويات الإنجاز:</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="cyan">{course.branch}</Badge>
                  <span className="text-xs font-bold text-emerald-400">نشط الآن</span>
                </div>

                <h3 className="text-base font-bold text-white">{course.title}</h3>

                <ProgressBar progress={35} showLabel size="md" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">آخر حلقة: الدرس الأول</span>
                <Link to="/lesson/les_calc_101">
                  <Button variant="outline" size="sm" icon={ArrowLeft} iconPosition="left">
                    متابعة الدرس
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, FileText, ArrowLeft, Award, HelpCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Accordion } from '../../components/common/Accordion';
import { SEOHead } from '../../seo/SEOHead';
import { CoursesService } from '../../services/courses.service';
import { ProgressService } from '../../services/progress.service';
import type { Course } from '../../types';

export const CourseLearningPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseSlug) return;
    setLoading(true);
    CoursesService.getStudentCourseBySlug(courseSlug)
      .then(async (res) => {
        if (res.data) {
          setCourse(res.data);
          try {
            const progress = await ProgressService.getCourseProgress(res.data.id);
            setProgressPct(progress.data.overallPercentage);
            setCompletedLessons(progress.data.completedCount || progress.data.completedLessonIds.length);
            setTotalLessons(progress.data.totalCount || res.data.lessonsCount || res.data.chapters.reduce((sum, chap) => sum + chap.lessons.length, 0));
          } catch {
            setTotalLessons(res.data.lessonsCount || 0);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [courseSlug]);

  if (loading) return <div className="text-center py-12 text-slate-400">جاري تحميل محتوى الكورس...</div>;
  if (!course) return <div className="text-center py-12 text-slate-400">الكورس غير موجود</div>;

  const firstLesson = course.chapters[0]?.lessons[0];

  const chapterAccordionItems = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: (
      <div className="flex items-center justify-between w-full text-right">
        <span className="font-bold text-white text-sm sm:text-base">{chapter.title}</span>
        <span className="text-xs text-slate-400 font-normal">{chapter.lessons.length} دروس</span>
      </div>
    ),
    defaultOpen: true,
    content: (
      <div className="space-y-3 pt-2">
        <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-950/40 border border-blue-900/20 overflow-hidden">
          {chapter.lessons.map((lesson) => (
            <div key={lesson.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
              <div className="flex items-center gap-3">
                {lesson.isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <PlayCircle className="w-5 h-5 text-blue-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200">{lesson.title}</h4>
                  <span className="text-[11px] text-slate-400">{lesson.durationMinutes} دقيقة</span>
                </div>
              </div>

              <Link to={`/my-courses/${course.slug}/lesson/${lesson.id}`}>
                <Button variant={lesson.isCompleted ? 'outline' : 'primary'} size="sm">
                  {lesson.isCompleted ? 'مراجعة الدرس' : 'مشاهدة الدرس'}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {(chapter.quizIds?.length ? chapter.quizIds : chapter.quizId ? [chapter.quizId] : []).map((quizId, quizIndex) => (
          <div key={quizId} className="p-4 rounded-xl glass-panel border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-xs font-bold text-white">
                  {quizIndex === 0 ? 'كويز تفاعلي على الوحدة' : `كويز إضافي ${quizIndex + 1}`}
                </h4>
                <p className="text-[11px] text-slate-400">اختبر معلوماتك وفهمك لدروس الوحدة</p>
              </div>
            </div>
            <Link to={`/my-courses/${course.slug}/quiz/${quizId}`}>
              <Button variant="cyan" size="sm">
                ابدأ الكويز
              </Button>
            </Link>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <>
      <SEOHead title={`${course.title} — متابعة الدراسة`} description={course.description} noindex />

      <div className="space-y-8">
        {/* Course Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <Badge variant="cyan">كورس فعال</Badge>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{course.title}</h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{course.description}</p>
            </div>

            {firstLesson && (
              <Link to={`/my-courses/${course.slug}/lesson/${firstLesson.id}`}>
                <Button variant="primary" size="lg" icon={ArrowLeft} iconPosition="left">
                  متابعة التعلم (الدرس الأول)
                </Button>
              </Link>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>تقدمك العام في الكورس: {Math.round(progressPct)}%</span>
              <span className="text-cyan-400 font-bold">{completedLessons} / {totalLessons} دروس مكتملة</span>
            </div>
            <ProgressBar progress={progressPct} />
          </div>
        </div>

        {/* Course Curriculum & Final Exam Callouts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-extrabold text-white">وحدات ودروس الكورس</h2>
            <Accordion items={chapterAccordionItems} allowMultiple />
          </div>

          <div className="space-y-6">
            {/* Final Exam Box */}
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 glow-cyan">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">الامتحان النهائي الشامل</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                امتحان محاكاة كامل لمواصفات الثانوية العامة (بابل شيت وتصحيح إلكتروني).
              </p>
              {course.chapters.find((chapter) => chapter.examId)?.examId ? (
                <Link to={`/my-courses/${course.slug}/exam/${course.chapters.find((chapter) => chapter.examId)?.examId}`}>
                  <Button variant="primary" fullWidth size="md">
                    دخول الامتحان النهائي
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" fullWidth size="md" disabled>
                  لا يوجد امتحان نهائي بعد
                </Button>
              )}
            </div>

            {/* Certificate Box */}
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">شهادة إتمام الكورس</h3>
              <p className="text-xs text-slate-300">تُمنح الشهادة عند إكمال 80% من الدروس واجتياز الامتحان النهائي.</p>
              <Link to="/certificates">
                <Button variant="outline" fullWidth size="sm">
                  عرض الشهادات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

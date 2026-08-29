import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Download,
  HelpCircle,
  BookOpen,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { SEOHead } from '../../seo/SEOHead';
import { CoursesService } from '../../services/courses.service';
import { ProgressService } from '../../services/progress.service';
import { MathText } from '../../components/common/MathText';
import type { Course, VideoLesson } from '../../types';

export const LessonPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<VideoLesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug || !lessonId) {
      setLoading(false);
      return;
    }
    CoursesService.getLessonDetails(courseSlug, lessonId)
      .then((res) => {
        if (res.data) {
          setCourse(res.data.course);
          setCurrentLesson(res.data.lesson);
          setIsCompleted(!!res.data.lesson.isCompleted);
          if (res.data.lesson.isCompleted) {
            setWatchPercentage(100);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [courseSlug, lessonId]);

  if (loading) return <div className="text-center py-12 text-slate-400">جاري تحميل الدرس...</div>;
  if (!course || !currentLesson) return <div className="text-center py-12 text-slate-400">الدرس غير موجود</div>;

  // Flatten all lessons in order to find Next/Prev
  const allLessons: VideoLesson[] = [];
  course.chapters.forEach((chap) => {
    chap.lessons.forEach((les) => allLessons.push(les));
  });

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const canMarkComplete = isCompleted || watchPercentage >= 80;

  const handleMarkComplete = async () => {
    if (!canMarkComplete) {
      setErrorMessage(`يجب مشاهدة 80% على الأقل من الحصة لإمكانية تحديدها كمكتملة (نسبة المشاهدة حالياً: ${watchPercentage}%).`);
      return;
    }
    setErrorMessage(null);
    setIsCompleted(true);
    try {
      await ProgressService.markLessonCompleted(course.id, currentLesson.id);
    } catch (err: any) {
      if (err?.message) setErrorMessage(err.message);
    }
  };

  const handleProgress = (watchedSeconds: number, duration: number) => {
    const totalDuration = duration || (currentLesson as any)?.duration_seconds || (currentLesson as any)?.durationSeconds || 1;
    if (totalDuration > 0) {
      const pct = Math.min(100, Math.round((watchedSeconds / totalDuration) * 100));
      setWatchPercentage((prev) => Math.max(prev, pct));

      // Auto mark complete when crossing 80%
      if (pct >= 80 && !isCompleted) {
        setIsCompleted(true);
        void ProgressService.markLessonCompleted(course.id, currentLesson.id);
      }
    }

    if (watchedSeconds > 0 && watchedSeconds % 10 === 0) {
      void ProgressService.updateLessonProgress(course.id, currentLesson.id, watchedSeconds, watchedSeconds);
    }
  };

  return (
    <>
      <SEOHead title={`${currentLesson.title} — ${course.title}`} description={currentLesson.description} noindex />

      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-900/30">
          <div className="space-y-1">
            <Link
              to={`/my-courses/${course.slug}`}
              className="text-xs text-blue-400 font-bold hover:underline flex items-center gap-1 mb-1"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              العودة لمنهج الكورس ({course.title})
            </Link>
            <h1 className="text-xl font-extrabold text-white">{currentLesson.title}</h1>
          </div>

          {/* Udemy-Style Header Complete Button */}
          <div className="flex flex-wrap items-center gap-3">
            {isCompleted ? (
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black shadow-lg shadow-emerald-950/40 transition-all cursor-default"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <CheckCircle className="w-4 h-4 fill-emerald-500 text-slate-950" />
                </div>
                <span>مكتمل ✓</span>
              </button>
            ) : canMarkComplete ? (
              <button
                type="button"
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 border border-blue-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <div className="w-4 h-4 rounded border-2 border-white/80 group-hover:bg-white/20 transition-colors flex items-center justify-center" />
                <span>تحديد كـ مكتمل</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs font-bold shadow-inner">
                <div className="w-4 h-4 rounded border border-slate-700 flex items-center justify-center text-[9px] font-mono text-slate-500">
                  <Lock className="w-2.5 h-2.5 text-slate-500" />
                </div>
                <span>شاهد 80% للإكمال</span>
                <span className="font-mono text-amber-400 font-extrabold dir-ltr">({watchPercentage}%)</span>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stage (Player + Details) */}
          <div className="lg:col-span-2 space-y-6">
            {currentLesson.videoUrl ? (
              <VideoPlayer
                source={currentLesson.videoUrl}
                title={currentLesson.title}
                onProgress={handleProgress}
                onComplete={handleMarkComplete}
              />
            ) : (
              <div className="aspect-video rounded-3xl border border-blue-900/30 bg-slate-950/70 flex items-center justify-center text-slate-400 text-sm px-6 text-center">
                {currentLesson.videoError || 'لا يتوفر فيديو لهذا الدرس حالياً'}
              </div>
            )}

            {/* 🎓 UDEMY-STYLE ACTION & NAVIGATION BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl">
              
              {/* Previous Lesson Button */}
              <div>
                {prevLesson ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/my-courses/${course.slug}/lesson/${prevLesson.id}`)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-extrabold transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>الدرس السابق</span>
                  </button>
                ) : (
                  <div />
                )}
              </div>

              {/* Center Udemy Completion Checkbox */}
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black shadow-inner">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>تم إكمال هذا الدرس بنجاح ✓</span>
                  </div>
                ) : canMarkComplete ? (
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 border border-blue-400/40 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <div className="w-4 h-4 rounded border-2 border-white/80 group-hover:bg-white/30 transition-colors" />
                    <span>تحديد الحصة كمكتملة</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>شاهد 80% لإتاحة الإكمال</span>
                    <span className="font-mono text-amber-400 font-extrabold">({watchPercentage}% / 80%)</span>
                  </div>
                )}
              </div>

              {/* Next Lesson Button */}
              <div>
                {nextLesson ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/my-courses/${course.slug}/lesson/${nextLesson.id}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all hover:scale-105"
                  >
                    <span>الدرس التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to={`/my-courses/${course.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>إنهاء المنهج</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Lesson Info Tabs / Details */}
            <div className="glass-panel p-6 rounded-3xl border border-blue-900/30 space-y-4">
              <h3 className="text-base font-bold text-white">تفاصيل وملحوظات الدرس</h3>
              <MathText as="p" text={currentLesson.description} className="text-xs text-slate-300 leading-relaxed" />

              {/* PDF Resources */}
              {currentLesson.pdfResources && currentLesson.pdfResources.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    الملفات والمذكرات المرفقة:
                  </h4>
                  <div className="space-y-2">
                    {currentLesson.pdfResources.map((pdf) => (
                      <div
                        key={pdf.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 text-slate-200">
                          <FileText className="w-4 h-4 text-red-400" />
                          <span>{pdf.title}</span>
                          <span className="text-[10px] text-slate-500">({pdf.fileSize})</span>
                        </div>
                        <a
                          href={pdf.fileUrl}
                          download
                          className="flex items-center gap-1 text-cyan-400 font-bold hover:underline text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          تحميل
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 📋 UDEMY-STYLE PLAYLIST / CURRICULUM SIDEBAR */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-3xl border border-blue-900/30 space-y-4 max-h-[750px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  محتوى الكورس
                </h3>
                <span className="text-[11px] font-bold text-slate-400">{allLessons.length} دروس</span>
              </div>

              <div className="space-y-4">
                {course.chapters.map((chap) => (
                  <div key={chap.id} className="space-y-2">
                    <h4 className="text-xs font-black text-blue-300 tracking-wide">{chap.title}</h4>
                    <div className="space-y-1.5">
                      {chap.lessons.map((les) => {
                        const isActive = les.id === currentLesson.id;
                        const isLesCompleted = !!les.isCompleted || (isActive && isCompleted);
                        return (
                          <Link
                            key={les.id}
                            to={`/my-courses/${course.slug}/lesson/${les.id}`}
                            className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-all border group ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold border-blue-400/40 shadow-lg shadow-blue-600/30'
                                : isLesCompleted
                                ? 'bg-slate-900/60 hover:bg-slate-900 text-slate-200 border-emerald-500/20'
                                : 'bg-slate-950/60 hover:bg-slate-900 text-slate-400 border-slate-800/80 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate max-w-[200px]">
                              {/* Udemy-Style Checkbox indicator */}
                              <div className="shrink-0">
                                {isLesCompleted ? (
                                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-slate-950 fill-emerald-500" />
                                  </div>
                                ) : isActive ? (
                                  <div className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-[9px]">
                                    ▶
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-slate-400 transition-colors" />
                                )}
                              </div>
                              <span className="truncate">{les.title}</span>
                            </div>
                            <span className="text-[10px] opacity-75 shrink-0 dir-ltr">{les.durationMinutes || 15} د</span>
                          </Link>
                        );
                      })}
                    </div>

                    {chap.quizId && (
                      <Link
                        to={`/my-courses/${course.slug}/quiz/${chap.quizId}`}
                        className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-2 text-[11px] font-bold text-cyan-300 hover:bg-cyan-900/60 transition-colors mt-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>اختبار الوحدة ({chap.title})</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

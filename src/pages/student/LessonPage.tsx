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
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { SEOHead } from '../../seo/SEOHead';
import { CoursesService } from '../../services/courses.service';
import { ProgressService } from '../../services/progress.service';
import type { Course, VideoLesson } from '../../types';

export const LessonPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<VideoLesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CoursesService.getLessonDetails(
      courseSlug || 'calculus-third-secondary',
      lessonId || 'les_calc_101'
    ).then((res) => {
      if (res.data) {
        setCourse(res.data.course);
        setCurrentLesson(res.data.lesson);
        setIsCompleted(!!res.data.lesson.isCompleted);
      }
      setLoading(false);
    });
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

  const handleMarkComplete = () => {
    setIsCompleted(true);
    ProgressService.markLessonCompleted(course.id, currentLesson.id);
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

          <Button
            variant={isCompleted ? 'outline' : 'primary'}
            size="sm"
            icon={CheckCircle}
            onClick={handleMarkComplete}
          >
            {isCompleted ? 'تم إكمال الدرس ✓' : 'تحديد كـ مكتمل'}
          </Button>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stage (Player + Details) */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              source={currentLesson.videoUrl}
              title={currentLesson.title}
              onComplete={handleMarkComplete}
            />

            {/* Previous & Next Navigation */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-blue-900/30">
              {prevLesson ? (
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronRight}
                  onClick={() => navigate(`/my-courses/${course.slug}/lesson/${prevLesson.id}`)}
                >
                  الدرس السابق
                </Button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={ChevronLeft}
                  iconPosition="left"
                  onClick={() => navigate(`/my-courses/${course.slug}/lesson/${nextLesson.id}`)}
                >
                  الدرس التالي
                </Button>
              ) : (
                <Link to={`/my-courses/${course.slug}`}>
                  <Button variant="cyan" size="sm">
                    إنهاء الوحدة الدراسية
                  </Button>
                </Link>
              )}
            </div>

            {/* Lesson Info Tabs / Details */}
            <div className="glass-panel p-6 rounded-3xl border border-blue-900/30 space-y-4">
              <h3 className="text-base font-bold text-white">تفاصيل وملحوظات الدرس</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{currentLesson.description}</p>

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

          {/* Curriculum Sidebar */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-3xl border border-blue-900/30 space-y-4 max-h-[750px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  قائمة دروس الكورس
                </h3>
                <span className="text-[11px] text-slate-400">{allLessons.length} درس</span>
              </div>

              <div className="space-y-4">
                {course.chapters.map((chap) => (
                  <div key={chap.id} className="space-y-2">
                    <h4 className="text-xs font-bold text-blue-300">{chap.title}</h4>
                    <div className="space-y-1">
                      {chap.lessons.map((les) => {
                        const isActive = les.id === currentLesson.id;
                        return (
                          <Link
                            key={les.id}
                            to={`/my-courses/${course.slug}/lesson/${les.id}`}
                            className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                              isActive
                                ? 'bg-blue-600/90 text-white font-bold shadow-lg shadow-blue-600/30'
                                : 'text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="truncate max-w-[180px]">{les.title}</span>
                            <span className="text-[10px] opacity-75">{les.durationMinutes} د</span>
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

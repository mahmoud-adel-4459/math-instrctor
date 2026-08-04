import React, { useState } from 'react';
import {
  FileDown,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Sparkles,
  Download,
  Clock,
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { useCourseStore } from '../store/useCourseStore';
import { Button } from '../components/common/Button';
import { formatDuration } from '../utils/formatters';

export const LessonViewPage: React.FC = () => {
  const { activeCourse, activeLesson, setActiveLesson } = useCourseStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'discussion'>('overview');
  const [isCompletedState, setIsCompletedState] = useState(false);

  const lesson = activeLesson || activeCourse?.chapters[0]?.lessons[0];

  if (!lesson || !activeCourse) {
    return (
      <div className="p-12 text-center text-slate-400">
        لم يتم العثور على الدرس المطلوب.
      </div>
    );
  }

  // Find all lessons array to compute prev & next lesson navigation
  const allLessons = activeCourse.chapters.flatMap((c) => c.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
      
      {/* Right Collapsible Sidebar (Chapters & Lessons) */}
      <Sidebar
        course={activeCourse}
        currentLessonId={lesson.id}
        onSelectLesson={(les) => setActiveLesson(les)}
      />

      {/* Main Main Content: Video Player & Tabs */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Video Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold">
              <span>{activeCourse.title}</span>
              <span>•</span>
              <span className="text-slate-400">الفصل الأول</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">{lesson.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isCompletedState ? 'secondary' : 'primary'}
              size="sm"
              icon={CheckCircle}
              onClick={() => setIsCompletedState(!isCompletedState)}
            >
              {isCompletedState ? 'تم إكمال الدرس' : 'تعليم كـ مكتمل'}
            </Button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl bg-black">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Lesson Controls Bar (Prev / Next) */}
        <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            disabled={!prevLesson}
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => prevLesson && setActiveLesson(prevLesson)}
          >
            الدرس السابق
          </Button>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>مدة الحصة: {formatDuration(lesson.durationMinutes)}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            disabled={!nextLesson}
            icon={ArrowLeft}
            iconPosition="left"
            onClick={() => nextLesson && setActiveLesson(nextLesson)}
          >
            الدرس التالي
          </Button>
        </div>

        {/* Information & Downloads Tabs */}
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-6">
          
          {/* Tab Headers */}
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>تفاصيل الدرس والنقاط المفتاحية</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'resources'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileDown className="w-4 h-4" />
              <span>المذكرات وملفات الـ PDF ({lesson.pdfResources?.length || 1})</span>
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'discussion'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>أسئلة الطلاب واستفساراتهم</span>
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <p>{lesson.description}</p>
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                <h4 className="font-bold mb-1 flex items-center gap-2 text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                  ملاحظة الأستاذ قابيل:
                </h4>
                <p>
                  احرص على كتابة خطوات حل المسألة بيديك بعد الانتهاء من مشاهدة الفيديو، ولا تكتفِ بالمشاهدة النظرية فقط.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: PDF Resources & Homework Downloads */}
          {activeTab === 'resources' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">حمل مذكرات الشرح والتمارين الخاصة بهذا الدرس:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">مذكرة شرح الدرس الأول - تفاضل.pdf</h4>
                      <span className="text-[10px] text-slate-400">4.2 MB • ملف PDF شامل</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" icon={Download}>
                    تحميل
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">واجب وتدريبات البابل شيت.pdf</h4>
                      <span className="text-[10px] text-slate-400">1.8 MB • أسئلة المحافظات</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" icon={Download}>
                    تحميل
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Discussion Form */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="اكتب سؤالك أو استفسارك لأستاذ المادة..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm">إرسال السؤال</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

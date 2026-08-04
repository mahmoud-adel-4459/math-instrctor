import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Trophy,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import type { Course, VideoLesson } from '../../types';
import { useCourseStore } from '../../store/useCourseStore';
import { formatDuration } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';

export interface SidebarProps {
  course?: Course | null;
  onSelectLesson?: (lesson: VideoLesson) => void;
  currentLessonId?: string;
  isCollapsedDefault?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  course: propCourse,
  onSelectLesson,
  currentLessonId,
  isCollapsedDefault = false,
}) => {
  const { activeCourse, setActiveLesson } = useCourseStore();
  const course = propCourse || activeCourse;

  const [collapsed, setCollapsed] = useState(isCollapsedDefault);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    chap_calc_1: true,
    chap_calc_2: true,
  });

  if (!course) {
    return null;
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleLessonClick = (lesson: VideoLesson) => {
    if (onSelectLesson) {
      onSelectLesson(lesson);
    } else {
      setActiveLesson(lesson);
    }
  };

  const allLessons = course.chapters.flatMap((c) => c.lessons);
  const completedCount = allLessons.filter((l) => l.isCompleted).length;
  const progressPercentage = allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0;

  return (
    <aside
      className={`glass-panel border-l border-blue-900/40 transition-all duration-300 flex flex-col h-[calc(100vh-5rem)] sticky top-20 ${
        collapsed ? 'w-20' : 'w-80 lg:w-96'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-900/40 flex items-center justify-between">
        {!collapsed && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                محتوى المادة الدراسية
              </span>
            </div>
            <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5" title={course.title}>
              {course.title}
            </h3>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={collapsed ? 'توسيع القائمة' : 'طَي القائمة'}
        >
          {collapsed ? <PanelRightOpen className="w-5 h-5 text-blue-400" /> : <PanelRightClose className="w-5 h-5 text-blue-400" />}
        </button>
      </div>

      {/* Course Chapters Accordion List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {course.chapters.map((chapter, chapterIdx) => {
          const isExpanded = expandedChapters[chapter.id] ?? true;

          return (
            <div
              key={chapter.id}
              className="bg-slate-900/80 border border-blue-900/30 rounded-2xl overflow-hidden transition-all"
            >
              {/* Chapter Header Accordion */}
              {!collapsed ? (
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full p-3.5 flex items-center justify-between text-right hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                      {chapterIdx + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-100">{chapter.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {chapter.lessons.length} دروس • {formatDuration(chapter.totalDurationMinutes)}
                      </span>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ) : (
                <div
                  className="p-3 flex justify-center text-blue-400 font-bold text-xs cursor-pointer"
                  onClick={() => toggleChapter(chapter.id)}
                  title={chapter.title}
                >
                  ف{chapterIdx + 1}
                </div>
              )}

              {/* Lessons List */}
              {(isExpanded || collapsed) && (
                <div className="border-t border-blue-900/30 divide-y divide-slate-800/60">
                  {chapter.lessons.map((lesson) => {
                    const isSelected = lesson.id === currentLessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full p-3 flex items-center justify-between text-right transition-all group ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-200 border-r-4 border-blue-500 font-bold'
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {lesson.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isSelected ? (
                            <PlayCircle className="w-4 h-4 text-blue-400 animate-pulse shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-500 group-hover:text-blue-300 shrink-0" />
                          )}

                          {!collapsed && (
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-medium truncate group-hover:text-white">
                                {lesson.title}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {formatDuration(lesson.durationMinutes)}
                              </span>
                            </div>
                          )}
                        </div>

                        {!collapsed && lesson.isFreePreview && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30 shrink-0">
                            معاينة
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Chapter Exam Link */}
                  {chapter.examId && !collapsed && (
                    <a
                      href="/exams"
                      className="p-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 flex items-center justify-between transition-colors border-t border-blue-500/20"
                    >
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">امتحان التقييم على الفصل</span>
                      </div>
                      <span className="text-[10px] bg-blue-500 text-white font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                        تحدي
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Progress Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-blue-900/40 bg-slate-950/80">
          <ProgressBar progress={progressPercentage} showLabel size="sm" color="blue" />
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            أنجزت <span className="text-blue-400 font-bold">{completedCount}</span> من أصل{' '}
            <span className="text-slate-200 font-bold">{allLessons.length}</span> درس بالمادة
          </p>
        </div>
      )}
    </aside>
  );
};

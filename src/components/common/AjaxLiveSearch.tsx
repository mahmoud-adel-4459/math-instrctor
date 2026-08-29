import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  BookOpen,
  ChevronRight,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { useCourseStore } from '../../store/useCourseStore';
import { CoursesService } from '../../services/courses.service';
import type { Course } from '../../types';

interface AjaxLiveSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AjaxLiveSearch: React.FC<AjaxLiveSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { courses } = useCourseStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults(courses.slice(0, 5)); // Show initial recommendations
      setSelectedIndex(0);
    }
  }, [isOpen, courses]);

  // Handle Escape and keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live Ajax Debounce Search
  useEffect(() => {
    if (!query.trim()) {
      setResults(courses.slice(0, 5));
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const cleanQuery = query.toLowerCase().trim();

    // 1. Instant local in-memory filter (0ms)
    const localMatches = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(cleanQuery) ||
        c.description.toLowerCase().includes(cleanQuery) ||
        (c.gradeLevel && c.gradeLevel.toLowerCase().includes(cleanQuery)) ||
        (c.branch && c.branch.toLowerCase().includes(cleanQuery))
    );
    setResults(localMatches);
    setSelectedIndex(0);

    // 2. Async backend query with debounce (150ms)
    const timer = setTimeout(async () => {
      try {
        const res = await CoursesService.getAllCourses({ search: query, per_page: 10 });
        if (res.data && Array.isArray(res.data)) {
          // Merge unique results
          const merged = [...localMatches];
          res.data.forEach((serverCourse) => {
            if (!merged.some((m) => m.id === serverCourse.id)) {
              merged.push(serverCourse);
            }
          });
          setResults(merged);
        }
      } catch (err) {
        // keep local results
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, courses]);

  // Keyboard Arrow Navigation
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectCourse(results[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/courses?search=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  const handleSelectCourse = (course: Course) => {
    navigate(`/courses/${course.slug || course.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-slate-900 border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] animate-scaleUp"
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="ابحث عن كورس، فرع (جبر، تفاضل...)، أو موضوع..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none font-bold"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-[10px] text-slate-400 font-mono">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-slate-800/40">
          {results.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-300">لا توجد نتائج مطابقة لـ «{query}»</p>
                <p className="text-xs text-slate-500">جرب البحث بكلمات أخرى أو تصفح كل المقررات</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-bold text-slate-400">
                <span>{query ? `نتائج البحث (${results.length})` : 'مقترحات مميزة للبدء'}</span>
                <span className="text-[10px] text-slate-500">استخدم الأسهم ⇅ للتنقل و Enter للاختيار</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {results.map((course, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleSelectCourse(course)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20 border border-blue-400/40 translate-x-1'
                          : 'bg-slate-950/40 hover:bg-slate-800/60 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-cyan-400'
                        }`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="truncate space-y-0.5">
                          <h4 className="text-xs sm:text-sm font-extrabold truncate">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] opacity-80">
                            {course.gradeLevel && <span>الصف: {course.gradeLevel}</span>}
                            {course.branch && <span>• الفرع: {course.branch}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <ArrowUpRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Quick Links */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-4">
          <button
            onClick={() => {
              navigate('/courses');
              onClose();
            }}
            className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>عرض كل مكتبة الكورسات</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-slate-500">بحث AJAX فوري فائق السرعة</span>
        </div>
      </div>
    </div>
  );
};

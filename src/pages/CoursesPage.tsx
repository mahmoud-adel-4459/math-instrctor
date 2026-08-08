import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Users,
  ArrowLeft,
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  Check,
} from 'lucide-react';
import { useCourseStore } from '../store/useCourseStore';
import { GRADE_LEVELS, SUBJECT_BRANCHES } from '../utils/constants';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { SEOHead } from '../seo/SEOHead';
import { getBreadcrumbSchema } from '../seo/structuredData';

export const CoursesPage: React.FC = () => {
  const {
    courses,
    selectedGrade,
    setSelectedGrade,
    selectedBranch,
    setSelectedBranch,
    searchQuery,
    setSearchQuery,
  } = useCourseStore();

  const [priceSort, setPriceSort] = useState<'all' | 'low' | 'high'>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const resetFilters = () => {
    setSelectedGrade('all');
    setSelectedBranch('all');
    setSearchQuery('');
    setPriceSort('all');
  };

  let filteredCourses = courses.filter((c) => {
    const matchesGrade = selectedGrade === 'all' || c.gradeLevel === selectedGrade;
    const matchesBranch = selectedBranch === 'all' || c.branch === selectedBranch;
    const matchesQuery =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesBranch && matchesQuery;
  });

  if (priceSort === 'low') {
    filteredCourses = [...filteredCourses].sort(
      (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
    );
  } else if (priceSort === 'high') {
    filteredCourses = [...filteredCourses].sort(
      (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
    );
  }

  const activeFiltersCount =
    (selectedGrade !== 'all' ? 1 : 0) +
    (selectedBranch !== 'all' ? 1 : 0) +
    (searchQuery !== '' ? 1 : 0) +
    (priceSort !== 'all' ? 1 : 0);

  return (
    <>
      <SEOHead
        title="جميع الكورسات والمنهج"
        description="استعرض كورسات الرياضيات للصفوف الثانوية والإعدادية واصل التميز والتفوق الدراسي مع أفضل المناهج والشرح المبسط."
        canonical="https://math-instrctor.vercel.app/courses"
        jsonLd={getBreadcrumbSchema([{ label: 'الكورسات', path: '/courses' }])}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-blue-900/30">
          <div className="space-y-2">
            <Badge variant="cyan">مكتبة الكورسات والمنهج</Badge>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              مكتبة كورسات الرياضيات 2026
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              تصفح الكورسات حسب الصف الدراسي وفرع المادة واستمتع بشرح مبسط واختبارات تفاعلية.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel border border-blue-500/40 text-xs font-bold text-white w-fit"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>تصفية الكورسات {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </div>

        {/* Layout Container (Side Filter + Main Course Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* SIDEBAR FILTER (Desktop Sticky + Mobile Drawer) */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? 'block' : 'hidden'
            } lg:sticky lg:top-24 space-y-6 glass-panel p-6 rounded-3xl border border-blue-900/40 shadow-2xl z-20`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Filter className="w-4 h-4 text-blue-400" />
                <span>تصفية البحث</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> إعادة الضبط
                </button>
              )}
            </div>

            {/* Search Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">بحث بالاسم:</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اسم الكورس أو الدرس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 text-xs rounded-xl pl-3 pr-9 py-2.5 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Grade Level Filter */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">الصف الدراسي:</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedGrade('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedGrade === 'all'
                      ? 'bg-blue-600/90 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-900/80'
                  }`}
                >
                  <span>جميع الصفوف</span>
                  {selectedGrade === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                {GRADE_LEVELS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGrade(g.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedGrade === g.id
                        ? 'bg-blue-600/90 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-900/80'
                    }`}
                  >
                    <span>{g.label}</span>
                    {selectedGrade === g.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Branch Filter */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">فرع الرياضيات:</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedBranch('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedBranch === 'all'
                      ? 'bg-cyan-600/90 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-900/80'
                  }`}
                >
                  <span>جميع الفروع</span>
                  {selectedBranch === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                {SUBJECT_BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranch(b.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedBranch === b.id
                        ? 'bg-cyan-600/90 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-900/80'
                    }`}
                  >
                    <span>{b.label}</span>
                    {selectedBranch === b.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Sort Filter */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">ترتيب حسب السعر:</label>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as 'all' | 'low' | 'high')}
                className="w-full bg-slate-950/90 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">التلقائي</option>
                <option value="low">السعر: من الأقل للأعلى</option>
                <option value="high">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </aside>

          {/* MAIN COURSES GRID */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>تم إيجاد {filteredCourses.length} كورس</span>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-blue-900/30">
                <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">لا توجد كورسات مطابقة لخيارات التصفية</h3>
                <p className="text-xs text-slate-400">جرب تقليل الفلاتر أو تغيير كلمة البحث.</p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  إعادة ضبط الفلاتر
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-blue-900/40 flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden border-b border-blue-900/30">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="primary">
                            {GRADE_LEVELS.find((g) => g.id === course.gradeLevel)?.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-bold text-amber-400">
                            <Star className="w-4 h-4 fill-amber-400" />
                            {course.rating} ({course.reviewCount})
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-blue-300">
                            <Users className="w-4 h-4 text-blue-400" />
                            {course.totalStudents} طالب
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Price / CTA */}
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-blue-900/30 mt-4">
                      <div>
                        {course.discountPrice ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-white">
                              {formatCurrency(course.discountPrice)}
                            </span>
                            <span className="text-xs text-slate-500 line-through">
                              {formatCurrency(course.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-black text-white">{formatCurrency(course.price)}</span>
                        )}
                      </div>

                      <Link to={`/courses/${course.slug}`}>
                        <Button variant="primary" size="sm" icon={ArrowLeft} iconPosition="left">
                          عرض الكورس
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, ArrowLeft, Search } from 'lucide-react';
import { useCourseStore } from '../store/useCourseStore';
import { GRADE_LEVELS, SUBJECT_BRANCHES } from '../utils/constants';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';

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

  const filteredCourses = courses.filter((c) => {
    const matchesGrade = selectedGrade === 'all' || c.gradeLevel === selectedGrade;
    const matchesBranch = selectedBranch === 'all' || c.branch === selectedBranch;
    const matchesQuery =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesBranch && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="space-y-4 text-center">
        <Badge variant="purple">مكتبة الكورسات والمنهج</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          اختر الكورس والصف الدراسي للبدء في الشرح
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          جميع الكورسات مصممة لتغطي كامل أفكار الرياضيات بالخطوات والشرح التفاعلي واختبارات البابل شيت.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن اسم الكورس أو الفصل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-sm rounded-2xl pl-4 pr-11 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
        </div>

        {/* Grade Filters */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 block">تصفية حسب الصف الدراسي:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedGrade === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              الكل
            </button>
            {GRADE_LEVELS.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGrade(g.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGrade === g.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Branch Filters */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 block">تصفية حسب فرع الرياضيات:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBranch('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBranch === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              جميع الفروع
            </button>
            {SUBJECT_BRANCHES.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedBranch === b.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="primary">{GRADE_LEVELS.find((g) => g.id === course.gradeLevel)?.label}</Badge>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {course.rating} ({course.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-indigo-400" />
                    {course.totalStudents} طالب
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-2">{course.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
              <div>
                {course.discountPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white">{formatCurrency(course.discountPrice)}</span>
                    <span className="text-xs text-slate-500 line-through">{formatCurrency(course.price)}</span>
                  </div>
                ) : (
                  <span className="text-lg font-black text-white">{formatCurrency(course.price)}</span>
                )}
              </div>

              <Link to="/lesson/les_calc_101">
                <Button variant="primary" size="sm" icon={ArrowLeft} iconPosition="left">
                  دخول الكورس
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

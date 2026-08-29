import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Star,
  Clock,
  CheckCircle,
  PlayCircle,
  Lock,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Accordion } from '../../components/common/Accordion';
import { CourseCardSkeleton } from '../../components/common/Skeletons';
import { SEOHead } from '../../seo/SEOHead';
import { getCourseSchema, getBreadcrumbSchema } from '../../seo/structuredData';
import { CoursesService } from '../../services/courses.service';
import { useAuthStore } from '../../store/useAuthStore';
import { GRADE_LEVELS } from '../../utils/constants';
import type { Course } from '../../types';

export const CourseDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    CoursesService.getCourseBySlug(slug || '')
      .then((res) => {
        if (isMounted && res.data) {
          setCourse(res.data);
          CoursesService.getRelatedCourses(res.data.id).then((relRes) => {
            if (isMounted) setRelatedCourses(relRes.data);
          });
        }
      })
      .catch(() => {
        if (isMounted) setCourse(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <CourseCardSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">الكورس غير موجود</h2>
        <Link to="/courses">
          <Button variant="primary">استعرض الكورسات</Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourseIds.includes(course.id);
  const gradeLabel = GRADE_LEVELS.find((g) => g.id === course.gradeLevel)?.label || 'الثانوية العامة';

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${course.slug}` } } });
      return;
    }
    if (isEnrolled) {
      navigate(`/my-courses/${course.slug}`);
      return;
    }
    navigate('/my-courses');
  };

  const breadcrumbItems = [
    { label: 'الكورسات', path: '/courses' },
    { label: gradeLabel },
    { label: course.title },
  ];

  const curriculumAccordionItems = course.chapters.map((chapter) => ({
    id: chapter.id,
    title: (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 text-right">
        <span className="font-bold text-white text-base">{chapter.title}</span>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-normal">
          <span>{chapter.lessons.length} دروس</span>
          <span>•</span>
          <span>{chapter.totalDurationMinutes} دقيقة</span>
        </div>
      </div>
    ),
    defaultOpen: true,
    content: (
      <div className="space-y-3 pt-2">
        <p className="text-xs text-slate-400 mb-3">{chapter.description}</p>
        <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-950/40 border border-blue-900/20 overflow-hidden">
          {chapter.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-3.5 flex items-center justify-between hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                {lesson.isFreePreview ? (
                  <PlayCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200">{lesson.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{lesson.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.durationMinutes} د
                </span>
                {lesson.isFreePreview && (
                  <Badge variant="cyan">معاينة مجانية</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <>
      <SEOHead
        title={course.title}
        description={course.description}
        canonical={`https://math-instrctor.vercel.app/courses/${course.slug}`}
        ogImage={course.thumbnail}
        jsonLd={[
          getCourseSchema(course),
          getBreadcrumbSchema(breadcrumbItems),
        ]}
      />

      <div className="space-y-12 pb-20">
        {/* Top Hero Banner */}
        <section className="bg-gradient-to-b from-blue-950/60 via-slate-950 to-slate-950 border-b border-blue-900/30 pt-8 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main Course Info Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">{gradeLabel}</Badge>
                  <Badge variant="cyan">كورس تفاعلي 2026</Badge>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {course.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {course.description}
                </p>

                {/* Rating & Stats */}
                <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{course.rating}</span>
                    <span className="text-slate-400 font-normal">({course.reviewCount} تقييم)</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{course.totalStudents} طالب مسجل</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>{course.chapters.length} وحدات دراسية</span>
                  </div>
                </div>

                {/* Instructor Brief */}
                <div className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-blue-900/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg">
                    م
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{course.instructorName}</h3>
                    <p className="text-xs text-slate-400">{course.instructorTitle}</p>
                  </div>
                </div>
              </div>

              {/* Course Purchase Card Sticky Column */}
              <div className="glass-panel glass-panel-hover rounded-3xl p-6 border border-blue-600/30 space-y-6 shadow-2xl lg:sticky lg:top-24">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-blue-900/40">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-white">التسجيل في الكورس يتم بواسطة الإدارة</p>
                  <p className="text-xs text-slate-400">
                    هذه منصة تعليمية خاصة. بعد تفعيل اشتراكك ستظهر المادة في صفحة كورساتي.
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    وصول دائم للدروس والاختبارات بعد التسجيل
                  </p>
                </div>

                {isEnrolled ? (
                  <Link to={`/my-courses/${course.slug}`}>
                    <Button variant="primary" fullWidth size="lg" icon={ArrowLeft} iconPosition="left">
                      متابعة التعلم في الكورس
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" fullWidth size="lg" onClick={handleEnrollClick}>
                    {isAuthenticated ? 'الانتقال إلى كورساتي' : 'تسجيل الدخول للمتابعة'}
                  </Button>
                )}

                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <h4 className="font-bold text-white">يتضمن هذا الكورس:</h4>
                  {course.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* What You Will Learn */}
          {course.whatYouWillLearn && (
            <section className="glass-panel p-8 rounded-3xl border border-blue-900/30 space-y-6">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                ماذا ستتعلم في هذا الكورس؟
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curriculum */}
          <section className="space-y-6">
            <div>
              <Badge variant="cyan">منهج الرياضيات</Badge>
              <h2 className="text-2xl font-extrabold text-white mt-2">محتوى الوحدات والدروس</h2>
            </div>
            <Accordion items={curriculumAccordionItems} allowMultiple />
          </section>

          {/* Requirements */}
          {course.requirements && (
            <section className="glass-panel p-8 rounded-3xl border border-blue-900/30 space-y-4">
              <h2 className="text-xl font-bold text-white">متطلبات البدء في الكورس</h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                {course.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Related Courses */}
          {relatedCourses.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white">كورسات قد تهمك أيضاً</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedCourses.map((rel) => (
                  <div key={rel.id} className="glass-panel p-5 rounded-2xl border border-blue-900/30 flex gap-4">
                    <img src={rel.thumbnail} alt={rel.title} className="w-24 h-20 rounded-xl object-cover" />
                    <div className="space-y-2 flex-1">
                      <h3 className="text-sm font-bold text-white">{rel.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{rel.description}</p>
                      <Link to={`/courses/${rel.slug}`} className="text-xs text-blue-400 font-bold hover:underline">
                        عرض التفاصيل ←
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Target,
  Compass,
  Quote,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SEOHead } from '../seo/SEOHead';
import {
  INSTRUCTOR_NAME,
  INSTRUCTOR_TITLE,
  PLATFORM_MOTTO,
  PLATFORM_VISION,
  PLATFORM_MISSION,
  PLATFORM_VALUES,
  QURAN_VERSES,
  HADITH,
} from '../utils/constants';
import { cmsService, type CmsPagePayload } from '../services/cms.service';

export const AboutUsPage: React.FC = () => {
  const [cmsAbout, setCmsAbout] = React.useState<CmsPagePayload | null>(() => cmsService.getCachedPage('about'));

  React.useEffect(() => {
    cmsService.getPage('about', true).then((payload) => {
      if (payload) setCmsAbout(payload);
    });
  }, []);

  const heroData = cmsService.getSection<{
    title?: string;
    subtitle?: string;
    tagline?: string;
  }>(cmsAbout, 'hero');

  const instructorData = cmsService.getSection<{
    name?: string;
    title?: string;
    experience_years?: string;
    avatar?: string;
    bio?: string;
  }>(cmsAbout, 'instructor');

  const visionMissionData = cmsService.getSection<{
    vision?: string;
    mission?: string;
  }>(cmsAbout, 'vision_mission');

  const displayedTitle = heroData?.title || 'عن منصة Math with Kabil';
  const displayedSubtitle = heroData?.subtitle || 'مرحبًا بكم في Math with Kabil… منصة تعليمية أُنشئت لتكون رفيقًا لكل طالب يسعى إلى التفوق، وإتقان الرياضيات.';
  const displayedMotto = heroData?.tagline || PLATFORM_MOTTO;
  const displayedInstructorName = instructorData?.name || INSTRUCTOR_NAME;
  const displayedInstructorTitle = instructorData?.title || INSTRUCTOR_TITLE;
  const displayedVision = visionMissionData?.vision || PLATFORM_VISION;
  const displayedMission = visionMissionData?.mission || PLATFORM_MISSION;

  return (
    <>
      <SEOHead
        title={cmsAbout?.seo?.title || `عن المنصة والأستاذ — ${displayedInstructorName}`}
        description={cmsAbout?.seo?.description || `${displayedInstructorName} - ${displayedInstructorTitle}. رؤيتنا ورسالتنا وقيمنا في تعليم الرياضيات.`}
        canonical="https://math-instrctor.vercel.app/about"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Top Hero Banner */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-blue-900/40 relative overflow-hidden text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>الخبرة والإتقان في تعليم الرياضيات</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {displayedTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {displayedSubtitle}
          </p>

          <div className="p-4 max-w-2xl mx-auto rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs sm:text-sm font-semibold text-blue-300">
            «{displayedMotto}»
          </div>

          {/* Glow backdrop */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Instructor Profile & Opening Speech */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Instructor Image & Stats Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-blue-900/50 space-y-6 shadow-2xl">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 relative border border-blue-900/40">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80"
                  alt={INSTRUCTOR_NAME}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 right-6 left-6 space-y-1">
                  <h3 className="text-xl font-black text-white">{INSTRUCTOR_NAME}</h3>
                  <p className="text-xs text-cyan-300 font-bold">{INSTRUCTOR_TITLE}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-cyan-400 text-2xl font-black font-outfit">+27 عاماً</div>
                  <div className="text-slate-400 text-xs font-semibold">خبرة في التدريس</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-blue-400 text-2xl font-black font-outfit">آلاف الطلاب</div>
                  <div className="text-slate-400 text-xs font-semibold">تأهيل للدرجة النهائية</div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Speech */}
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="cyan">رسالة معلم البشرية</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              مبسط الرياضيات ومرافقك نحو التفوق والتميز
            </h2>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/30 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p className="font-bold text-cyan-300 text-sm">
                الحمد لله الذي علَّم بالقلم، علَّم الإنسان ما لم يعلم، والصلاة والسلام على سيدنا محمد ﷺ، معلم البشرية الأول.
              </p>

              <p>
                على مدار أكثر من 27 عامًا من الخبرة في تدريس الرياضيات، كان هدفي دائمًا أن أجعل الرياضيات سهلة الفهم، ممتعة التعلم، وأن أساعد كل طالب على اكتشاف قدراته الحقيقية.
              </p>

              <p>
                فأنا أؤمن أن التفوق ليس حكرًا على الموهوبين، بل هو ثمرة الإخلاص، والاجتهاد، والفهم الصحيح، والتدريب المستمر.
              </p>

              <p>
                في هذه المنصة ستجد شرحًا مبسطًا، وخططًا دراسية واضحة، وتدريبات متنوعة، ومراجعات شاملة، واختبارات دورية، مع متابعة مستمرة تساعدك على بناء الثقة بنفسك وتحقيق أعلى النتائج بإذن الله.
              </p>

              <div className="pt-4 border-t border-slate-800 font-bold text-white flex items-center justify-between">
                <span>محدثكم / {INSTRUCTOR_NAME}</span>
                <span className="text-xs text-cyan-400 font-semibold">{INSTRUCTOR_TITLE}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quranic Verses & Prophetic Hadith Section */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-blue-900/40 space-y-8 bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-blue-950/40 glow-blue">
          <div className="text-center space-y-2">
            <Badge variant="primary">من نور القران والسنة</Badge>
            <h2 className="text-2xl font-black text-white">العلم عبادة ورفعة في الدنيا والآخرة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QURAN_VERSES.map((verse, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950/60 border border-blue-900/30 space-y-3 relative overflow-hidden">
                <Quote className="w-8 h-8 text-blue-500/20 absolute top-3 left-3" />
                <p className="text-base sm:text-lg font-black text-amber-300 leading-relaxed font-serif">
                  ﴿{verse.text}﴾
                </p>
                <span className="text-xs text-slate-400 font-semibold block text-left">({verse.surah})</span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/30 text-center space-y-2">
            <p className="text-sm sm:text-base font-bold text-cyan-300">
              وقال رسول الله ﷺ: «{HADITH}»
            </p>
          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="glass-panel p-8 rounded-3xl border border-blue-600/30 space-y-4 glow-cyan">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">رؤيتنا</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{displayedVision}</p>
          </div>

          {/* Mission */}
          <div className="glass-panel p-8 rounded-3xl border border-cyan-600/30 space-y-4 glow-cyan">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">رسالتنا</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{displayedMission}</p>
          </div>
        </div>

        {/* Our 7 Core Values */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="cyan">مبادؤنا الحاكمة</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white">قيمنا الأساسية</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORM_VALUES.map((val, i) => (
              <div
                key={i}
                className="glass-panel p-5 rounded-2xl border border-blue-900/30 flex items-center gap-3 hover:border-blue-500/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs">
                  {i + 1}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-200">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 text-center space-y-4 border border-blue-900/50 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-blue-950/60">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            وفقكم الله لما يحب ويرضى، وجعل العلم نورًا لكم في الدنيا، ورفعةً لكم في الآخرة.
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            محدثكم / {INSTRUCTOR_NAME} ({INSTRUCTOR_TITLE})
          </p>
          <div className="pt-4">
            <Link to="/courses">
              <Button variant="primary" size="lg" icon={ArrowLeft} iconPosition="left">
                استعرض الكورسات المتاحة وابدأ التعلم
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

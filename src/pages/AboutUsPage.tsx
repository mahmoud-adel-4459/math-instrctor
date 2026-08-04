import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Target,
  HeartHandshake,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { INSTRUCTOR_NAME, INSTRUCTOR_TITLE } from '../utils/constants';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header Section */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-blue-900/40 relative overflow-hidden text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>منصة التفوق في الرياضيات 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          عن منصة <span className="text-gradient">Math with Kabil</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          المنصة التعليمية الرائدة والمتخصصة في شرح وتبسيط علوم الرياضيات للثانوية العامة والإعدادية، بهدف تحويل مادة الرياضيات من مادة صعبة إلى شغف وتفوق أكاديمي مضمون.
        </p>

        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Instructor Biography Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative glass-panel p-6 rounded-3xl border border-blue-900/50 space-y-4 shadow-2xl">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 relative border border-blue-900/40">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80"
                alt={INSTRUCTOR_NAME}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 right-4 left-4">
                <h3 className="text-lg font-black text-white">{INSTRUCTOR_NAME}</h3>
                <p className="text-xs text-cyan-300 font-semibold">{INSTRUCTOR_TITLE}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-blue-400 text-lg font-outfit font-black">+20 عاماً</div>
                <div className="text-slate-400 text-[11px]">خبرة في تدريس المناهج</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-cyan-400 text-lg font-outfit font-black">+10,000</div>
                <div className="text-slate-400 text-[11px]">طالب تقفيل ورشة أمثلة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Text */}
        <div className="lg:col-span-7 space-y-6 text-right">
          <Badge variant="cyan">سيرة المحاضر والخبرة</Badge>
          <h2 className="text-3xl font-extrabold text-white">
            رحلة من العطاء والتطوير المستمر لطلاب الثانوية العامة
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            بدأت رحلة الأستاذ قابيل بخبرة امتدت لأكثر من عشرين عاماً في إعداد المذكرات الرسمية وبنوك أسئلة الوزارة. نؤمن بأن فهم الرياضيات يعتمد على تبسيط المفاهيم المعقدة، وربط القوانين النظريّة بالتطبيقات الفيزيائية والهندسية المباشرة.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/80 border border-blue-900/30">
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">طريقة الشرح بنظام البابل شيت 2026</h4>
                <p className="text-xs text-slate-400 mt-0.5">حل المسائل بالطرق التقليدية وطرق الاستبعاد والتفكير السريع للوقت.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/80 border border-blue-900/30">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">دعم وتواصل مباشر مع الطالب</h4>
                <p className="text-xs text-slate-400 mt-0.5">فريق من المعاونين للإجابة على جميع الأسئلة الصعبة على مدار اليوم.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Values Grid */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="primary">قيمنا وأهدافنا</Badge>
          <h2 className="text-3xl font-extrabold text-white">لماذا يفضل الطلاب منصة Math with Kabil؟</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-blue-900/40 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">التركيز على الفهم العميق</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              نبتعد تماماً عن الحفظ التلقيني للقوانين، ونقوم باستنتاج كل قانون هندسياً وفيروزياً لترسيخ المعلومة في ذهنه.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-blue-900/40 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">امتحانات الدورية والتقييم</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              اختبارات ذاتية التصحيح مع إظهار الشرح والتفسير التفصيلي لكل سؤال بعد التسليم مباشرة.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-blue-900/40 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">متابعة أولياء الأمور</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تقارير دورية تظهر نسبة مشاهدة الحصص ودرجات الاختبارات لإبقاء ولي الأمر على اطلاع دائم.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-blue-900/50 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-blue-950/60">
        <h2 className="text-2xl font-black text-white">ابدأ رحلتك نحو التفوق في الرياضيات الآن</h2>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          انضم إلى آلاف الطلاب واشترك في كورسات الفصل الدراسي للوصول للدرجة النهائية.
        </p>
        <div className="pt-2">
          <Link to="/courses">
            <Button variant="gradient" size="lg" icon={ArrowLeft} iconPosition="left">
              استكشف الكورسات والمنهج
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

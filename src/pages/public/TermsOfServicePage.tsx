import React from 'react';
import { Scale, ShieldAlert, BookOpen, UserCheck, AlertTriangle } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { INSTRUCTOR_NAME, PLATFORM_MOTTO } from '../../utils/constants';

export const TermsOfServicePage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'الرئيسية', path: '/' },
    { label: 'شروط الاستخدام' },
  ];

  return (
    <>
      <SEOHead
        title="شروط الاستخدام والأحكام"
        description={`شروط وأحكام استخدام منصة Math with Kabil تحت إشراف ${INSTRUCTOR_NAME}.`}
        canonical="https://math-instrctor.vercel.app/terms"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto glow-cyan">
            <Scale className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">شروط وأحكام الاستخدام</h1>
          <p className="text-xs text-slate-400">«{PLATFORM_MOTTO}»</p>
        </div>

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-blue-900/40 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              1. الحسابات والاشتراكات الشخصية
            </h2>
            <p>
              حساب الطالب على منصة <strong>Math with Kabil</strong> شخصي ومخصص لطالب واحد فقط. يُحظر تماماً مشاركة بيانات تسجيل الدخول (اسم المستخدم وكلمة السر) مع أي شخص آخر، ويحتفظ النظام بالحق في تعليق الحساب في حال رصد دخول متعدد غير مصرح به.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              2. الملكية الفكرية وحقوق النشر
            </h2>
            <p>
              جميع المحتويات المرئية والمكتوبة (الفيديوهات الشارحة، المذكرات والملفات المرفقة، بنوك الأسئلة والامتحانات التفاعلية) ملكية فكرية حصرية لـ <strong>{INSTRUCTOR_NAME}</strong> ومنصة Math with Kabil.
            </p>
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                تنبيه هام بشأن النشر والنسخ:
              </div>
              <p className="opacity-90">
                يُمنع منعاً باتاً تصوير أو تسريب أو بيع أو إعادة إعادة إنتاج أجزاء من الشرح أو المذكرات بدون إذن كتابي مسبق من الأستاذ أحمد قابيل.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              3. ضوابط الكويزات والامتحانات
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>يُشترط التزام الطالب بأوقات الامتحانات والزمن المحدد لكل اختبار تفاعلي.</li>
              <li>الهدف من الاختبارات هو التقييم الذاتي الحقيقي لترسيخ المفاهيم وبناء الثقة بالنفس.</li>
              <li>تُصدر الشهادات الرسمية فور تحقيق النسبة المطلوبة في الامتحانات الشاملة.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              4. السياسات المالية والاشتراك
            </h2>
            <p>
              يتم تفعيل الكورسات المسجلة فور تأكيد عملية الدفع. وتتيح المنصة وصولاً مستمراً للمحتوى طوال السنة الدراسية المعلن عنها في تفاصيل الكورس.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              5. التحديثات والتعديلات
            </h2>
            <p>
              تحتفظ إدارة المنصة بالحق في تحديث وتطوير شروط الاستخدام لضمان أعلى جودة تعليمية وحماية الحقوق، وتكون التعديلات نافذة فور نشرها على هذه الصفحة.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

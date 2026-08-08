import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { INSTRUCTOR_NAME } from '../../utils/constants';

export const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'الرئيسية', path: '/' },
    { label: 'سياسة الخصوصية' },
  ];

  return (
    <>
      <SEOHead
        title="سياسة الخصوصية"
        description={`سياسة الخصوصية وحماية بيانات الطلاب والزوار في منصة Math with Kabil تحت إشراف ${INSTRUCTOR_NAME}.`}
        canonical="https://math-instrctor.vercel.app/privacy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto glow-cyan">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">سياسة الخصوصية وحماية البيانات</h1>
          <p className="text-xs text-slate-400">آخر تحديث: فبراير 2026</p>
        </div>

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-blue-900/40 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              1. مقدمة وتعهد الحماية
            </h2>
            <p>
              نحن في منصة <strong>Math with Kabil</strong> تحت إشراف {INSTRUCTOR_NAME} نلتزم بأعلى معايير الأمان والحفاظ على خصوصية بيانات الطلاب وأولياء الأمور. تهدف هذه السياسة إلى توضيح كيفية جمع واستخدام وحماية البيانات الشخصية الخاصة بك عند استخدام منصتنا التعليمية.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-blue-400" />
              2. البيانات التي نقوم بجمعها
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong>البيانات الشخصية:</strong> الاسم بالكامل، البريد الإلكتروني، رقم الهاتف، والسنة الدراسية.</li>
              <li><strong>البيانات الأكاديمية:</strong> سجل متابعة الحصص والدروس، ودرجات نتائج الكويزات والامتحانات.</li>
              <li><strong>بيانات المعاملات:</strong> سجل طلبات الاشتراك واختيار طرق الدفع المتاحة.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lock className="w-4 h-4 text-purple-400" />
              3. كيف نستخدم بياناتك؟
            </h2>
            <p>نقوم بجمع واستخدام البيانات فقط للأغراض التعليمية والتنظيمية التالية:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>إتاحة الوصول للكورسات والدروس والامتحانات المشتراة.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>إرسال تنبيهات وتذكيرات بالامتحانات والدروس الجديدة.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>تقديم تقارير دورية تظهر نسبة التقدم ومستوى الطالب.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>إصدار وتوثيق شهادات الإتمام الرسمية.</span>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              4. سرية البيانات وعدم المشاركة
            </h2>
            <p>
              تتعهد منصة Math with Kabil بعدم بيع أو تأجير أو مشاركة أي من بيانات الطلاب الشخصية مع أي طرف ثالث خارج النطاق التعليمي، إلا وفقاً للالتزامات القانونية الرسمية.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              5. التواصل والاستفسارات
            </h2>
            <p>
              إذا كان لديك أي استفسار أو رغبة في تحديث بياناتك الشخصية، يمكنك التواصل المباشر مع فريق الدعم الفني عبر صفحة{' '}
              <a href="/contact" className="text-cyan-400 font-bold hover:underline">
                تواصل معنا
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

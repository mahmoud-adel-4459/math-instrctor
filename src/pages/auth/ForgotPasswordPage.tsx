import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { SEOHead } from '../../seo/SEOHead';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="استعادة كلمة المرور"
        description="استعادة كلمة المرور الخاصة بحساب الطالب في منصة Math Instructor."
        noindex
      />

      <div className="min-h-[75vh] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-blue-900/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">استعادة كلمة المرور</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              إعادة ضبط كلمة المرور تتم حالياً من خلال الإدارة. تواصل مع المنصة لإعادة تفعيل حسابك، ثم سجّل الدخول بالبيانات الجديدة.
            </p>
          </div>

          <Link to="/login" className="block">
            <Button variant="primary" size="sm" icon={ArrowRight} className="w-full">
              العودة لتسجيل الدخول
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

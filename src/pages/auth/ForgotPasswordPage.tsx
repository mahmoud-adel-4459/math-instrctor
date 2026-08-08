import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { SEOHead } from '../../seo/SEOHead';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <h1 className="text-2xl font-black text-white">نسيت كلمة المرور؟</h1>
            <p className="text-xs text-slate-400">
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة ضبط كلمة المرور.
            </p>
          </div>

          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-sm text-slate-300">
                تم إرسال رابط استعادة كلمة المرور إلى البريد: <br />
                <span className="font-bold text-blue-400 dir-ltr inline-block mt-1">{email}</span>
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm" icon={ArrowRight} className="mt-2">
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmed@example.com"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
              </div>

              <Button variant="primary" fullWidth size="lg">
                إرسال رابط الاستعادة
              </Button>
            </form>
          )}

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            تذكرت كلمة المرور؟{' '}
            <Link to="/login" className="text-blue-400 font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

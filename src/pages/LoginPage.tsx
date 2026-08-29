import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Smartphone, RotateCcw, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { isStudentAccount } from '../lib/auth';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/common/Button';
import { SEOHead } from '../seo/SEOHead';
import { AuthService } from '../services/auth.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Device Reset Request Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetReason, setResetReason] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';
  const isDeviceBlocked = error && (error.toLowerCase().includes('device') || error.includes('جهاز'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      const current = useAuthStore.getState().user;
      navigate(isStudentAccount(current) ? from : '/', { replace: true });
    } catch {
      /* error is shown from the store */
    }
  };

  const handleDeviceResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResetSubmitting(true);
    try {
      await AuthService.requestDeviceReset({
        email: resetEmail || email,
        reason: resetReason,
      });
      setResetSuccess('تم إرسال طلب فك ربط الجهاز للإدارة بنجاح! سيتم مراجعته والتواصل معك.');
      setResetReason('');
    } catch (err: any) {
      setResetError(err?.message || 'تعذر إرسال الطلب، يرجى المحاولة لاحقاً');
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="تسجيل الدخول"
        description="تسجيل الدخول إلى حساب الطالب في منصة Math Instructor."
        noindex
      />

      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-blue-900/40 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <img
              src="/logo.png"
              alt="ARTMEL Math with Kabil"
              className="h-16 w-auto mx-auto object-contain rounded-xl mb-2"
            />
            <h2 className="text-2xl font-black text-white">تسجيل الدخول لطالب Math Instructor</h2>
            <p className="text-xs text-slate-400">ادخل بيانات حسابك لمتابعة دراسة المادة والامتحانات</p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-xs text-red-200 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="font-semibold leading-relaxed">{error}</div>
              </div>
              {isDeviceBlocked && (
                <div className="pt-2 border-t border-red-500/20 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setResetModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition-colors text-[11px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    طلب تغيير أو فك ربط الجهاز 🔄
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@mathinstructor.test"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">كلمة السر</label>
                <Link to="/forgot-password" className="text-[11px] text-blue-400 font-semibold hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <Button type="submit" variant="gradient" size="md" fullWidth icon={LogIn} disabled={loading}>
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <p className="text-[11px] text-slate-500 text-center">
            حساب التجربة: student@mathinstructor.test / Password1!
          </p>

          <div className="text-center pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              ليس لديك حساب بعد؟{' '}
              <Link to="/register" className="text-blue-400 font-bold hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Device Reset Request Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Smartphone className="w-5 h-5 text-amber-400" />
                طلب فك ربط أو تغيير الجهاز 🔄
              </div>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="font-bold">{resetSuccess}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setResetModalOpen(false);
                    setResetSuccess('');
                  }}
                  className="w-full"
                >
                  إغلاق
                </Button>
              </div>
            ) : (
              <form onSubmit={handleDeviceResetSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  إذا قمت بتغيير هاتفك أو جهازك، يرجى إرسال سبب التبديل وسيتم فك ربط الجهاز السابق من لوحة الإدارة فوراً.
                </p>

                {resetError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                    {resetError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">البريد الإلكتروني لحسابك</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="student@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">سبب طلب تغيير الجهاز</label>
                  <textarea
                    value={resetReason}
                    onChange={(e) => setResetReason(e.target.value)}
                    required
                    rows={3}
                    placeholder="مثال: قمت بشراء هاتف جديد وأحتاج لتسجيل الدخول منه..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    disabled={resetSubmitting}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {resetSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب للإدارة'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

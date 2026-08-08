import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { SEOHead } from '../../seo/SEOHead';
import { AuthService } from '../../services/auth.service';
import { useAuthStore } from '../../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gradeLevel: 'sec_3',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await AuthService.register(formData);
      if (res.data) {
        loginStore(res.data.user.email);
        navigate('/dashboard');
      }
    } catch {
      setError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="إنشاء حساب جديد"
        description="انضم إلى منصة Math Instructor واستمتع بتجربة تعلم رياضيات فريدة ومبسطة."
        noindex
      />

      <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-blue-900/40 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/logo.png"
              alt="ARTMEL Math with Kabil"
              className="h-16 w-auto mx-auto object-contain rounded-xl mb-2"
            />
            <h1 className="text-2xl font-black text-white">إنشاء حساب طالب جديد</h1>
            <p className="text-xs text-slate-400">سجل بياناتك للبدء في متابعة الكورسات والامتحانات</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">الاسم بالكامل</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أحمد محمود علي"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ahmed@example.com"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">رقم الهاتف</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01012345678"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">السنة الدراسية</label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="sec_3">الصف الثالث الثانوي (علمي رياضة)</option>
                <option value="sec_2">الصف الثاني الثانوي</option>
                <option value="sec_1">الصف الأول الثانوي</option>
                <option value="prep_3">الصف الثالث الإعدادي</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              icon={UserPlus}
              iconPosition="left"
              disabled={loading}
              className="mt-4"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-blue-400 font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

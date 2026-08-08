import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { SEOHead } from '../../seo/SEOHead';
import { useAuthStore } from '../../store/useAuthStore';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || 'أحمد محمود',
    email: user?.email || 'ahmed@example.com',
    phone: user?.phone || '01012345678',
    gradeLevel: user?.gradeLevel || 'sec_3',
    currentPassword: '',
    newPassword: '',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <SEOHead title="الملف الشخصي والبيانات" description="إدارة البيانات الشخصية وإعدادات الحساب." noindex />

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">الملف الشخصي</h1>
          <p className="text-xs text-slate-400 mt-1">تحديث بيانات الحساب وتغيير كلمة المرور</p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            تم حفظ التعديلات بنجاح!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              البيانات الشخصية
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">الاسم بالكامل</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Password Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              الأمان وكلمة المرور
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">كلمة المرور الحالية</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth icon={Save} iconPosition="left">
            حفظ التغييرات
          </Button>
        </form>
      </div>
    </>
  );
};

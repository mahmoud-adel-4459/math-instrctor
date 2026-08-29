import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  CheckCircle2,
  Smartphone,
  Laptop,
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { SEOHead } from '../../seo/SEOHead';
import { useAuthStore } from '../../store/useAuthStore';
import { useDevice } from '../../context/DeviceProvider';
import { StudentService } from '../../services/student.service';
import { ApiClientError } from '../../services/apiClient';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { deviceInfo, isLoading: deviceLoading } = useDevice();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const updated = await StudentService.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      setUser({
        ...updated.data,
        enrolledCourseIds: user?.enrolledCourseIds || [],
      });
      if (formData.currentPassword && formData.newPassword) {
        await StudentService.changePassword(formData.currentPassword, formData.newPassword);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'تعذر حفظ التعديلات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEOHead title="الملف الشخصي والبيانات" description="إدارة البيانات الشخصية وإعدادات الحساب." noindex />

      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Header & Stats Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-right flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-white">{user?.name || 'طالب المنصة'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> حساب طالب نشط
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono dir-ltr sm:text-right">{user?.email}</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto">
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-blue-400 text-sm font-black">
                  <BookOpen className="w-4 h-4" />
                  {user?.enrolledCourseIds?.length || 0}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">المقررات المتاحة</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-black">
                  <Award className="w-4 h-4" />
                  مفعل
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">حالة الحساب</span>
              </div>
            </div>
          </div>
        </div>

        {/* Authorized Device Card */}
        <div className="glass-panel p-6 rounded-3xl border border-blue-900/30 bg-slate-950/60 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-teal-400" />
              الجهاز المعتمد لحسابك (Device Binding)
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> نشط ومقترن
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                {deviceInfo?.platform?.toLowerCase().includes('windows') || deviceInfo?.platform?.toLowerCase().includes('mac') ? (
                  <Laptop className="w-5 h-5" />
                ) : (
                  <Smartphone className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {deviceLoading ? 'جاري قراءة بيانات الجهاز...' : deviceInfo?.device_name || 'هذا الجهاز'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  المتصفح: <span className="text-slate-300">{deviceInfo?.browser || 'Chrome'}</span> • النظام: <span className="text-slate-300">{deviceInfo?.platform || 'Windows'}</span>
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
              حسابك محمي بجهاز واحد. في حال تغيير هاتفك أو جهازك يمكنك طلب فك الربط من شاشة الدخول.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-bold">
            {error}
          </div>
        )}

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            تم حفظ التعديلات بنجاح!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              البيانات الشخصية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">الاسم بالكامل</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                    disabled
                    className="w-full bg-slate-950 border border-slate-800/60 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">رقم الهاتف</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Password Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-900/40 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              الأمان وتغيير كلمة المرور
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">كلمة المرور الحالية</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" size="md" icon={Save} iconPosition="left" disabled={saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

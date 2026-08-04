import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('ahmed@example.com');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'student');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="Math with Kabil"
            className="w-24 h-auto mx-auto object-contain rounded-2xl shadow-xl shadow-blue-600/30 mb-2"
          />
          <h2 className="text-2xl font-black text-white">تسجيل الدخول لطالب Math with Kabil</h2>
          <p className="text-xs text-slate-400">ادخل بيانات حسابك لمتابعة دراسة المادة والامتحانات</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">البريد الإلكتروني أو رقم الهاتف</label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">كلمة السر</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <Button type="submit" variant="gradient" size="md" className="w-full" icon={LogIn}>
            تسجيل الدخول
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            ليس لديك حساب بعد؟{' '}
            <Link to="/courses" className="text-indigo-400 font-bold hover:underline">
              انشئ حساباً جديداً
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

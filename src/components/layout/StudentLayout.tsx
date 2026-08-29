import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  FileCheck,
  User as UserIcon,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { NotificationsService } from '../../services/notifications.service';
import { ThemeToggle } from '../common/ThemeToggle';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    NotificationsService.getNotifications()
      .then((res) => setUnreadCount(res.data.filter((item) => !item.isRead).length))
      .catch(() => setUnreadCount(0));
  }, []);

  const navItems = [
    { label: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
    { label: 'كورساتي', path: '/my-courses', icon: BookOpen },
    { label: 'سجل النتائج', path: '/results', icon: FileCheck },
    { label: 'الشهادات', path: '/certificates', icon: Award },
    { label: 'الملف الشخصي', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-cairo dir-rtl selection:bg-blue-600 selection:text-white relative overflow-x-hidden" dir="rtl">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-950/70 border-l border-slate-800/80 backdrop-blur-2xl shrink-0 sticky top-0 h-screen overflow-y-auto shadow-2xl z-30">
        {/* Brand Logo & Title */}
        <div className="p-6 border-b border-slate-800/60">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-sm font-black text-white block leading-tight tracking-wide">
                Math with Kabil
              </span>
              <span className="text-[11px] font-semibold text-blue-400 block">
                بوابة الطالب الذكية
              </span>
            </div>
          </Link>
        </div>

        {/* Student Profile Snapshot Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                alt={user?.name || 'طالب'}
                className="w-11 h-11 rounded-xl object-cover border-2 border-blue-500/40 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="متصل الآن" />
            </div>
            <div className="truncate flex-1">
              <h4 className="text-xs font-extrabold text-white truncate">{user?.name || 'طالب المنصة'}</h4>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'حساب مفعل'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-extrabold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive ? (
                  <ChevronLeft className="w-3.5 h-3.5 text-white/80" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions & Logout */}
        <div className="p-4 border-t border-slate-800/60 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span>الموقع الرئيسي</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/40 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/60 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للموقع</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle (Dark / Light) */}
            <ThemeToggle />

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-950 animate-pulse" />
              )}
            </Link>

            {/* Profile Header Button */}
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all group"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                alt={user?.name || 'طالب'}
                className="w-7 h-7 rounded-lg object-cover border border-blue-500/40"
              />
              <span className="text-xs font-extrabold text-white group-hover:text-blue-400 transition-colors hidden sm:block">
                {user?.name}
              </span>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex" dir="rtl">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 max-w-xs bg-slate-950 h-full p-6 space-y-6 flex flex-col justify-between border-l border-slate-800 shadow-2xl z-50">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="font-black text-white text-sm">Math with Kabil</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-colors ${
                          isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-xs font-bold text-red-400 hover:text-red-300 p-2"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

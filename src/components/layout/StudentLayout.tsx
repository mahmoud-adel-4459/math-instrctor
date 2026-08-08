import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  FileCheck,
  CreditCard,
  User as UserIcon,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { mockNotifications } from '../../mocks/data';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  const navItems = [
    { label: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
    { label: 'كورساتي', path: '/my-courses', icon: BookOpen },
    { label: 'سجل النتائج', path: '/results', icon: FileCheck },
    { label: 'الشهادات', path: '/certificates', icon: Award },
    { label: 'طلبات الشراء', path: '/orders', icon: CreditCard },
    { label: 'الملف الشخصي', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-cairo dir-rtl selection:bg-blue-600 selection:text-white">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900/80 border-l border-white/5 backdrop-blur-xl shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ARTMEL Math with Kabil" className="h-14 w-auto object-contain" />
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
            alt={user?.name || 'طالب'}
            className="w-10 h-10 rounded-full object-cover border border-blue-500/40"
          />
          <div className="truncate">
            <h4 className="text-xs font-bold text-white truncate">{user?.name || 'أحمد محمود'}</h4>
            <p className="text-[10px] text-slate-400">الصف الثالث الثانوي</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 space-y-1.5 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 glow-blue'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronLeft className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-blue-900/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-blue-900/30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-xs font-bold text-slate-400 hover:text-white transition-colors hidden sm:block">
              ← التوجه إلى الموقع العام
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <Link to="/notifications" className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              )}
            </Link>

            {/* Profile Avatar Header */}
            <Link to="/profile" className="flex items-center gap-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                alt={user?.name || 'طالب'}
                className="w-8 h-8 rounded-full border border-blue-500/40"
              />
              <span className="text-xs font-bold text-white hidden sm:block">{user?.name}</span>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 max-w-xs bg-slate-900 h-full p-6 space-y-6 flex flex-col justify-between border-l border-blue-900/30">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-base">Math Instructor</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                          location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-3 text-xs font-bold text-red-400 p-2">
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  FileCheck2,
  LayoutDashboard,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCourseStore } from '../../store/useCourseStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { searchQuery, setSearchQuery } = useCourseStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'الرئيسية', path: '/', icon: GraduationCap },
    { label: 'الكورسات', path: '/courses', icon: BookOpen },
    { label: 'من نحن', path: '/about', icon: Info },
    { label: 'الأسئلة الشائعة', path: '/faq', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all">
      {/* Floating Capsule Header Container */}
      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-slate-950/80 rounded-3xl sm:rounded-full px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link to="/" className="group flex items-center">
            <img
              src="/logo.png"
              alt="ARTMEL Math with Kabil"
              className="h-11 sm:h-13 lg:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Center Floating Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/40 p-1 rounded-full border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Left Actions: Search & Profile Capsule */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative hidden xl:block w-44">
            <input
              type="text"
              placeholder="بحث سريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/90 border border-blue-900/40 text-slate-200 text-xs rounded-full pl-3 pr-8 py-1.5 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
            <Search className="w-3.5 h-3.5 text-blue-400 absolute right-3 top-2 pointer-events-none" />
          </div>

          {/* Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-slate-950/80 border border-blue-900/50 hover:border-blue-500/50 transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/40"
                />
                <span className="text-xs font-bold text-slate-200 hidden sm:inline">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-blue-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Overlay with all learning links */}
              {isProfileOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-slate-950/95 backdrop-blur-3xl rounded-2xl p-2.5 border border-blue-500/30 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-extrabold text-white">{user.name}</p>
                    <p className="text-[10px] text-blue-400 font-semibold">{user.email}</p>
                  </div>

                  {/* Section 1: Curriculum Links */}
                  <div className="py-1.5 space-y-0.5 border-b border-slate-800/80">
                    <div className="px-3 py-1 text-[9px] font-black text-cyan-400 uppercase tracking-wider">
                      محتوى التعلم والمنهج:
                    </div>

                    <Link
                      to="/courses"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>الكورسات المتاحة</span>
                    </Link>

                    <Link
                      to="/lesson/les_calc_101"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>الدروس والفصول</span>
                      </div>
                      <span className="px-1.5 py-0.2 text-[8px] font-black bg-cyan-400 text-slate-950 rounded-full">
                        مجاني
                      </span>
                    </Link>

                    <Link
                      to="/exams"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4 text-purple-400" />
                      <span>بنك الامتحانات</span>
                    </Link>
                  </div>

                  {/* Section 2: Dashboard & Info */}
                  <div className="py-1.5 space-y-0.5">
                    <div className="px-3 py-1 text-[9px] font-black text-blue-400 uppercase tracking-wider">
                      معلومات والتحكم:
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      <span>لوحة التحكم والمتابعة</span>
                    </Link>

                    <Link
                      to="/about"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span>عن المنصة والأستاذ</span>
                    </Link>

                    <Link
                      to="/faq"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span>الأسئلة الشائعة</span>
                    </Link>
                  </div>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/15 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
            >
              تسجيل الدخول
            </Link>
          )}

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-slate-950 border border-blue-900/40 text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Container */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 bg-slate-950/95 backdrop-blur-3xl border border-blue-500/30 rounded-3xl p-4 space-y-3 animate-in fade-in slide-in-from-top-4 shadow-2xl">
          
          {/* Search Box on Mobile */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="بحث سريع في المنهج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-blue-900/50 text-slate-200 text-xs rounded-xl pl-3 pr-9 py-2 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-blue-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          <div className="space-y-1 pt-1">
            <div className="px-3 py-1 text-[10px] font-black text-cyan-400 uppercase tracking-wider">
              القائمة الرئيسية:
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}

            <div className="pt-2 px-3 py-1 text-[10px] font-black text-blue-400 uppercase tracking-wider border-t border-slate-800">
              أقسام التعلم السريع:
            </div>

            <Link
              to="/lesson/les_calc_101"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>الدروس والفصول</span>
              </div>
              <span className="px-1.5 py-0.2 text-[8px] font-black bg-cyan-400 text-slate-950 rounded-full">
                مجاني
              </span>
            </Link>

            <Link
              to="/exams"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              <FileCheck2 className="w-4 h-4 text-purple-400" />
              <span>بنك الامتحانات والتصحيح</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>لوحة المتابعة للطالب</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

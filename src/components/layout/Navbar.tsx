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
import { isStudentAccount } from '../../lib/auth';

import { AjaxLiveSearch } from '../common/AjaxLiveSearch';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'الرئيسية', path: '/', icon: GraduationCap },
    { label: 'الكورسات', path: '/courses', icon: BookOpen },
    { label: 'من نحن', path: '/about', icon: Info },
    { label: 'الأسئلة الشائعة', path: '/faq', icon: HelpCircle },
  ];

  return (
    <>
      <AjaxLiveSearch isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />

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

          {/* Left Actions: Search, Theme Toggle & Profile Capsule */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle (Dark/Light) */}
            <ThemeToggle />

            {/* Live Ajax Search Button Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-blue-900/40 hover:border-blue-500 text-slate-400 hover:text-white transition-all text-xs"
              title="بحث فوري (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline font-bold">بحث سريع...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

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
                      to="/my-courses"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>كورساتي والدروس</span>
                    </Link>

                    <Link
                      to="/results"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4 text-purple-400" />
                      <span>سجل النتائج</span>
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
                      void logout();
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
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-full text-slate-200 text-xs font-bold hover:bg-slate-800/80 transition-all"
              >
                إنشاء حساب
              </Link>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
              >
                تسجيل الدخول
              </Link>
            </div>
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
          
          {/* Search Box on Mobile -> Opens Live Ajax Search */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchModalOpen(true);
            }}
            className="w-full bg-slate-900 border border-blue-900/50 hover:border-blue-500 text-slate-400 hover:text-white text-xs rounded-xl px-4 py-2.5 flex items-center justify-between transition-colors font-bold"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>بحث فوري في المنهج...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
              AJAX
            </kbd>
          </button>

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

            {(isAuthenticated && isStudentAccount(user)) && (
              <>
            <div className="pt-2 px-3 py-1 text-[10px] font-black text-blue-400 uppercase tracking-wider border-t border-slate-800">
              أقسام التعلم السريع:
            </div>

            <Link
              to="/my-courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>كورساتي والدروس</span>
            </Link>

            <Link
              to="/results"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              <FileCheck2 className="w-4 h-4 text-purple-400" />
              <span>سجل النتائج</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>لوحة المتابعة للطالب</span>
            </Link>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-2 space-y-1 border-t border-slate-800">
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
                >
                  <span>إنشاء حساب</span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-white bg-blue-600"
                >
                  <span>تسجيل الدخول</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

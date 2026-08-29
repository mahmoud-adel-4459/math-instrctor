import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-full transition-all duration-300 ${
        isLight
          ? 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-600 border border-amber-300/60 shadow-sm'
          : 'bg-slate-950/80 hover:bg-slate-900 text-blue-400 border border-blue-900/50 shadow-inner'
      } ${className}`}
      title={isLight ? 'تفعيل الوضع الليلي (Dark Mode)' : 'تفعيل الوضع النهاري (Light Mode)'}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-500 animate-in zoom-in-50 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-cyan-400 animate-in zoom-in-50 duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold transition-colors">
          {isLight ? 'الوضع النهاري' : 'الوضع الليلي'}
        </span>
      )}
    </button>
  );
};

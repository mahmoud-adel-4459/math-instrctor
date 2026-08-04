import React, { useState, useEffect } from 'react';

export const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 1.2 seconds for a fast, light feel
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1200);

    // Completely remove preloader after fade out animation completes (1.6s)
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-3xl transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center space-y-6 z-10 px-4 text-center">
        
        {/* Logo Container with Spinner Ring */}
        <div className="relative flex items-center justify-center">
          
          {/* Spinning Cyan/Blue Neon Ring */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-blue-900/40 border-t-cyan-400 border-r-blue-500 animate-spin" />

          {/* Logo Image inside Center */}
          <div className="absolute p-3 bg-slate-900/90 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-600/40 backdrop-blur-md">
            <img
              src="/logo.png"
              alt="مستر قابيل"
              className="h-10 sm:h-12 w-auto object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Loading Text & Pulsing Indicator */}
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
            منصة <span className="text-gradient">مستر قابيل</span> للرياضيات
          </h3>
          
          <div className="flex items-center justify-center gap-1.5 text-xs text-blue-400 font-bold">
            <span>جاري تجهيز المنهج والدروس</span>
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-300" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

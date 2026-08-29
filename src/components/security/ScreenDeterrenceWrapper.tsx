import React from 'react';
import { useScreenSecurity } from '../../hooks/useScreenSecurity';

interface ScreenDeterrenceWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
  blurOnHidden?: boolean;
  className?: string;
}

export const ScreenDeterrenceWrapper: React.FC<ScreenDeterrenceWrapperProps> = ({
  children,
  enabled = true,
  blurOnHidden = true,
  className = '',
}) => {
  const { isScreenHidden } = useScreenSecurity({ enabled, blurOnHidden });

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}

      {/* Screen blur overlay when tab is inactive or hidden */}
      {isScreenHidden && blurOnHidden && (
        <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
          <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-6 max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-base mb-1">المحتوى محمي</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              تم إيقاف تشغيل الفيديو مؤقتاً بسبب مغادرة النافذة للحفاظ على أمان المحتوى التعليمي.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

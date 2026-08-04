import React from 'react';

export interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'cyan' | 'gradient';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  label,
  size = 'md',
  color = 'gradient',
  className = '',
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorStyles = {
    blue: 'bg-blue-600',
    cyan: 'bg-cyan-500',
    gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-slate-300 font-semibold">
          <span>{label || 'نسبة الإنجاز'}</span>
          <span className="font-bold text-blue-400 font-outfit">{Math.round(normalizedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-blue-900/40 ${heightStyles[size]}`}>
        <div
          className={`${heightStyles[size]} ${colorStyles[color]} rounded-full transition-all duration-500 ease-out shadow-sm shadow-blue-500/50`}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
};

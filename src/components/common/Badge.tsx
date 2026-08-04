import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'blue' | 'success' | 'warning' | 'cyan' | 'sky' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-bold',
  };

  const variantStyles = {
    primary: 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10',
    blue: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    sky: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    purple: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center rounded-xl font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

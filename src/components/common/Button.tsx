import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none ${
    fullWidth ? 'w-full' : ''
  }`;

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 shadow-md',
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-950/40 focus:ring-blue-500 active:scale-[0.99]',
    cyan: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40 focus:ring-cyan-500 active:scale-[0.99]',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md focus:ring-blue-500 active:scale-[0.99]',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 focus:ring-slate-700',
    outline: 'bg-transparent hover:bg-slate-900 text-slate-200 border border-slate-700 hover:border-slate-500 focus:ring-slate-600',
    ghost: 'bg-transparent hover:bg-slate-800/70 text-slate-300 hover:text-white focus:ring-blue-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md focus:ring-rose-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />
      ) : Icon && iconPosition === 'right' ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      
      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
    </button>
  );
};

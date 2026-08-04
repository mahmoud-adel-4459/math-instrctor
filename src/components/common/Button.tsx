import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 shadow-lg',
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 shadow-md focus:ring-blue-500 hover:shadow-blue-500/50 hover:scale-[1.01]',
    gradient: 'bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-500 hover:to-cyan-400 text-white shadow-blue-600/35 shadow-lg hover:shadow-blue-500/60 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-blue-500/20 hover:border-blue-500/40 focus:ring-blue-500',
    outline: 'bg-transparent hover:bg-blue-600/15 text-blue-400 border border-blue-500/40 hover:border-blue-400 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white focus:ring-blue-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 focus:ring-rose-500',
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

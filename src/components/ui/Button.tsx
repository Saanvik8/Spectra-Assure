import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'success' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 shadow-xs',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs',
  outline:
    'bg-transparent hover:bg-slate-50 text-slate-700 border border-slate-300',
  ghost:
    'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  danger:
    'bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 shadow-xs',
  warning:
    'bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 shadow-xs',
  success:
    'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-[11px] gap-1 rounded-md',
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
  md: 'px-4 py-2 text-sm gap-2 rounded-lg',
  lg: 'px-5 py-2.5 text-sm gap-2.5 rounded-lg',
};

export function Button({
  variant = 'secondary',
  size = 'sm',
  children,
  loading,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

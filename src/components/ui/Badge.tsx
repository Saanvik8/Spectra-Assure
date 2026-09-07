import React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant =
  | 'cleared' | 'approved'
  | 'flagged'  | 'pending'
  | 'rejected' | 'quarantined'
  | 'neutral'  | 'info';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  cleared:     'bg-emerald-50 text-emerald-800 border border-emerald-200',
  approved:    'bg-emerald-50 text-emerald-800 border border-emerald-200',
  flagged:     'bg-amber-50  text-amber-800  border border-amber-200',
  pending:     'bg-amber-50  text-amber-800  border border-amber-200',
  rejected:    'bg-rose-50   text-rose-800   border border-rose-200',
  quarantined: 'bg-rose-50   text-rose-800   border border-rose-200',
  neutral:     'bg-slate-100 text-slate-700  border border-slate-200',
  info:        'bg-slate-100 text-slate-700  border border-slate-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  cleared:     'bg-emerald-600',
  approved:    'bg-emerald-600',
  flagged:     'bg-amber-600',
  pending:     'bg-amber-600',
  rejected:    'bg-rose-600',
  quarantined: 'bg-rose-600',
  neutral:     'bg-slate-500',
  info:        'bg-slate-500',
};

export function Badge({ variant, children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-normal',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[variant])} />}
      {children}
    </span>
  );
}

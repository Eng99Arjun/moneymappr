import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' | 'warning';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-900 text-slate-50 border-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:border-slate-50',
      outline: 'border-slate-200 bg-transparent text-slate-900 dark:border-slate-800 dark:text-slate-50',
      secondary: 'bg-slate-100 text-slate-900 border-slate-100 dark:bg-slate-800 dark:text-slate-50 dark:border-slate-800',
      destructive: 'bg-red-500 text-white border-red-500 dark:bg-red-600 dark:border-red-600',
      success: 'bg-green-500 text-white border-green-500 dark:bg-green-600 dark:border-green-600',
      warning: 'bg-yellow-500 text-yellow-900 border-yellow-500 dark:bg-yellow-600 dark:text-yellow-50 dark:border-yellow-600',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };

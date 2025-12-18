'use client';

import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-xl border-2 border-slate-200 p-4 transition-all';
    const hoverStyles = hover ? 'hover:shadow-lg hover:border-sky-300 hover:-translate-y-0.5' : '';

    return (
      <div ref={ref} className={cn(baseStyles, hoverStyles, className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';








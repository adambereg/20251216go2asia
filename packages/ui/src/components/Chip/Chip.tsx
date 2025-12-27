'use client';

import React from 'react';
import { cn } from '../../utils/cn';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  /** Optional helper used in app code for active state */
  selected?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  className,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-sky-100 text-sky-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        selected ? 'bg-sky-100 text-slate-900 ring-1 ring-sky-200' : variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

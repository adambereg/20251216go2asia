'use client';

import React from 'react';
import { Lock, Crown, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type BadgeType = 'lock' | 'pro' | 'rf' | 'rf-full';
export type BadgeVariant =
  | 'default'
  | 'info'
  | 'new'
  | 'verified'
  | 'ugc'
  | 'editor'
  | 'popular'
  | 'russian-friendly'
  | 'warning'
  | 'success';

type LegacyBadgeProps = {
  type: BadgeType;
  className?: string;
};

type PillBadgeProps = {
  /** UI pill-style badge (used across app). */
  variant?: BadgeVariant;
  /** Optional sizing used in some screens */
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
};

export type BadgeProps = LegacyBadgeProps | PillBadgeProps;

export const Badge: React.FC<BadgeProps> = (props) => {
  // Pill variant usage: <Badge variant="info">Text</Badge>
  if ('children' in props) {
    const variant: BadgeVariant = props.variant ?? 'default';
    const size = props.size ?? 'md';
    const styles: Record<BadgeVariant, string> = {
      default: 'bg-slate-100 text-slate-700',
      info: 'bg-sky-100 text-sky-800',
      new: 'bg-sky-100 text-sky-800',
      verified: 'bg-emerald-100 text-emerald-800',
      ugc: 'bg-violet-100 text-violet-800',
      editor: 'bg-amber-100 text-amber-900',
      popular: 'bg-rose-100 text-rose-800',
      'russian-friendly': 'bg-emerald-100 text-emerald-900',
      warning: 'bg-amber-100 text-amber-900',
      success: 'bg-emerald-100 text-emerald-900',
    };
    const sizeStyles: Record<'sm' | 'md', string> = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-semibold',
          styles[variant],
          sizeStyles[size],
          props.className
        )}
      >
        {props.children}
      </span>
    );
  }

  // Legacy usage: <Badge type="rf" />
  const { type, className } = props;

  if (type === 'lock') {
    return (
      <div className={cn('absolute top-2 right-2 bg-white/20 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium', className)}>
        <Lock size={12} />
        <span className="hidden sm:inline">После входа</span>
      </div>
    );
  }

  if (type === 'pro') {
    return (
      <div className={cn('absolute top-2 right-2 bg-purple-500 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold', className)}>
        <Crown size={12} />
        PRO
      </div>
    );
  }

  if (type === 'rf') {
    return (
      <span className={cn('px-1.5 py-0.5 bg-green-600 text-white rounded text-xs font-bold shadow-lg', className)}>
        RF
      </span>
    );
  }

  if (type === 'rf-full') {
    return (
      <div className={cn('px-3 py-1.5 bg-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center gap-1.5', className)}>
        <CheckCircle size={16} />
        Russian Friendly
      </div>
    );
  }

  return null;
};








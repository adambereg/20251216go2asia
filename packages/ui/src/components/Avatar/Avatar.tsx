'use client';

import React from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  initials: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ size = 'md', initials, className = '' }) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  };

  const combinedClassName = cn(
    sizeStyles[size],
    'rounded-full bg-sky-600 text-white flex items-center justify-center font-semibold',
    className
  );

  return (
    <div className={combinedClassName}>
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
};

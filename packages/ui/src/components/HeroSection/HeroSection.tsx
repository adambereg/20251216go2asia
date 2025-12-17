'use client';

import React from 'react';

export interface HeroSectionProps {
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  primaryAction,
  secondaryAction,
  title = 'Экосистема путешествий в Юго-Восточной Азии',
  description = 'Цифровая платформа для жизни, путешествий и бизнеса в регионе',
  className = '',
}) => {
  return (
    <div className={`bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-white ${className}`}>
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-sky-100 mb-6 md:mb-8">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {primaryAction && <div>{primaryAction}</div>}
          {secondaryAction && <div>{secondaryAction}</div>}
        </div>
      </div>
    </div>
  );
};

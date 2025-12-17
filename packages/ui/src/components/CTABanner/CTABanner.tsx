'use client';

import React from 'react';

export interface CTABannerProps {
  title: string;
  description: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <div className={`bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-6 md:p-8 lg:p-10 ${className}`}>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">
          {title}
        </h2>
        <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && <div>{primaryAction}</div>}
          {secondaryAction && <div>{secondaryAction}</div>}
        </div>
      </div>
    </div>
  );
};

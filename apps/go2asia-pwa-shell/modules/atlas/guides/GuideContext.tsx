'use client';

import React, { createContext, useContext } from 'react';
import type { GuideDetail } from './types';

type GuideContextValue = {
  guide: GuideDetail | null;
  isLoading: boolean;
  isAdminView: boolean;
  error?: Error | null;
};

const GuideContext = createContext<GuideContextValue | null>(null);

export function GuideProvider({
  value,
  children,
}: {
  value: GuideContextValue;
  children: React.ReactNode;
}) {
  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuideContext(): GuideContextValue {
  const ctx = useContext(GuideContext);
  if (!ctx) {
    return { guide: null, isLoading: false, isAdminView: false, error: null };
  }
  return ctx;
}


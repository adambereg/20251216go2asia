'use client';

import { getDataSource } from '@/mocks/dto';
import { DashboardView } from '@/components/connect/Dashboard';
import { DashboardMockView } from '@/components/connect/Dashboard/DashboardMockView';

export function ConnectPageClientWrapper() {
  const dataSource = getDataSource();
  const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  // Если Clerk не настроен (local dev), принудительно включаем mock,
  // иначе компоненты с useUser/useAuth упадут без <ClerkProvider />.
  if (!isClerkConfigured || dataSource === 'mock') {
    return <DashboardMockView />;
  }

  return <DashboardView />;
}


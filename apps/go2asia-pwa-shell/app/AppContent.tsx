'use client';

/**
 * Клиентский компонент для провайдеров и оболочки приложения
 * Должен использоваться внутри RootLayout
 */

import { AuthModeProvider } from '../contexts/AuthModeContext';
import { TopAppBar } from '../components/app-shell/TopAppBar';
import { BottomNav } from '../components/app-shell/BottomNav';
import { SideDrawer } from '../components/app-shell/SideDrawer';
import { AuthModeToggle } from '../components/dev/AuthModeToggle';
import { AppShellProvider } from '../components/app-shell/AppShellProvider';
import { ClerkAuthSetup } from '../components/auth/ClerkAuthSetup';
import { Providers } from './providers';

// Проверяем, настроен ли Clerk (есть ли publishableKey)
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AuthModeProvider>
        <AppShellProvider>
          {isClerkConfigured && <ClerkAuthSetup />}
          <TopAppBar />
          <SideDrawer />
          <main className="min-h-screen pb-20 pt-16">
            {children}
          </main>
          <BottomNav />
          <AuthModeToggle />
        </AppShellProvider>
      </AuthModeProvider>
    </Providers>
  );
}

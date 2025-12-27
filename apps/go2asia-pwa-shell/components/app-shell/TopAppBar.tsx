'use client';

import { useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { useAuthMode } from '../../contexts/AuthModeContext';
import { useAppShell } from './AppShellProvider';
import { TopAppBar as UITopAppBar } from '@go2asia/ui';

// В Next.js NEXT_PUBLIC_* переменные доступны и на сервере, и на клиенте
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Компонент-обертка для условного использования Clerk
function ClerkUserWrapper({ children }: { children: (user: ReturnType<typeof useUser>) => React.ReactNode }) {
  if (!isClerkConfigured) {
    return <>{children({ isLoaded: true, isSignedIn: false, user: null })}</>;
  }
  // Если Clerk настроен, используем отдельный компонент, который всегда вызывает хук
  return <ClerkUserWrapperInner>{children}</ClerkUserWrapperInner>;
}

function ClerkUserWrapperInner({ children }: { children: (user: ReturnType<typeof useUser>) => React.ReactNode }) {
  const user = useUser();
  return <>{children(user)}</>;
}

function ClerkActionsWrapper({
  children,
}: {
  children: (actions: { signOut: () => Promise<void> }) => React.ReactNode;
}) {
  if (!isClerkConfigured) {
    return <>{children({ signOut: async () => {} })}</>;
  }
  return <ClerkActionsWrapperInner>{children}</ClerkActionsWrapperInner>;
}

function ClerkActionsWrapperInner({
  children,
}: {
  children: (actions: { signOut: () => Promise<void> }) => React.ReactNode;
}) {
  const { signOut } = useClerk();
  return <>{children({ signOut })}</>;
}

export function TopAppBar() {
  const router = useRouter();
  const { isAuthenticated: devModeAuthenticated, toggleAuthMode } = useAuthMode();
  const { openSideDrawer } = useAppShell();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Mock данные пользователя для development режима
  const mockUser = {
    initials: 'ИП',
    name: 'Иван Петров',
    email: 'ivan@example.com',
  };

  return (
    <ClerkActionsWrapper>
      {({ signOut }) => (
        <ClerkUserWrapper>
          {({ isLoaded, isSignedIn, user }) => {
            // Если Clerk настроен — опираемся на него. Иначе используем dev-mode переключатель.
            const isAuthenticated = isClerkConfigured ? isSignedIn : devModeAuthenticated;

            if (isClerkConfigured && !isLoaded) {
              return null;
            }

            const userData = isClerkConfigured && isSignedIn && user
              ? {
                  initials: getInitials(user.fullName || user.firstName),
                  name: user.fullName || user.firstName || 'Пользователь',
                  email: user.primaryEmailAddress?.emailAddress || '',
                }
              : isAuthenticated
                ? mockUser
                : undefined;

            return (
              <UITopAppBar
                onMenuClick={openSideDrawer}
                onHomeClick={() => router.push('/')}
                onSearchClick={() => {
                  // TODO: открыть поиск
                }}
                onAuthClick={() => {
                  // Если Clerk настроен — ведём на его форму входа/регистрации
                  if (isClerkConfigured) {
                    router.push('/sign-in');
                    return;
                  }

                  // DX: локальный dev без Clerk — переключаем режим
                  toggleAuthMode();
                }}
                onProfileClick={() => {
                  // User Cabinet (в текущем PWA Shell это /profile)
                  router.push('/profile');
                }}
                onSignOutClick={
                  isAuthenticated
                    ? async () => {
                        if (isClerkConfigured) {
                          await signOut();
                          router.push('/');
                          return;
                        }

                        // DX: локальный dev без Clerk
                        toggleAuthMode();
                        router.push('/');
                      }
                    : undefined
                }
                user={userData}
              />
            );
          }}
        </ClerkUserWrapper>
      )}
    </ClerkActionsWrapper>
  );
}

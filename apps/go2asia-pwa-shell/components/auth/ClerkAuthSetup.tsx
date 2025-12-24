'use client';

/**
 * Компонент для настройки интеграции Clerk с SDK
 * Вызывает setupClerkAuth() для передачи функции получения токена в SDK mutator
 * 
 * ВАЖНО: Этот компонент должен использоваться ТОЛЬКО внутри ClerkProvider
 */

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { setupClerkAuth } from '@go2asia/sdk/clerk-integration';
import { customInstance } from '@go2asia/sdk/mutator';
import { referralStorageKey } from './ReferralCapture';

export function ClerkAuthSetup() {
  const { getToken, isLoaded } = useAuth();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    // Настраиваем SDK для использования Clerk токена только после загрузки Clerk
    if (isLoaded && getToken) {
      try {
        setupClerkAuth(getToken);
      } catch (error) {
        // Игнорируем ошибки настройки SDK в production
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to setup Clerk auth:', error);
        }
      }
    }
  }, [getToken, isLoaded]);

  useEffect(() => {
    // After successful auth: ensure user exists in Neon and claim referral code if present.
    if (!isLoaded || !isSignedIn || !user?.id) return;

    const key = `go2asia_users_ensure_done:${user.id}`;
    try {
      if (sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1');
    } catch {
      // ignore sessionStorage errors
    }

    const run = async () => {
      const email =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        '';

      // 1) Ensure user in DB (required for users table; email is NOT NULL)
      try {
        await customInstance(
          {
            method: 'POST',
            body: JSON.stringify({
              email,
            }),
          },
          '/v1/users/ensure'
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('users/ensure failed', error);
        }
      }

      // 2) Claim referral code (if we captured ?ref=CODE earlier)
      let code: string | null = null;
      try {
        code = localStorage.getItem(referralStorageKey);
      } catch {
        code = null;
      }
      if (!code) return;

      try {
        await customInstance(
          {
            method: 'POST',
            body: JSON.stringify({ code }),
          },
          '/v1/referral/claim'
        );
        try {
          localStorage.removeItem(referralStorageKey);
        } catch {
          // ignore
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('referral/claim failed', error);
        }
      }
    };

    void run();
  }, [isLoaded, isSignedIn, user?.id]);

  // Компонент не рендерит ничего
  return null;
}



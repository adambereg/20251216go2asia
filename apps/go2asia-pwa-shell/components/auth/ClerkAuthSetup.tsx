'use client';

/**
 * Компонент для настройки интеграции Clerk с SDK
 * Вызывает setupClerkAuth() для передачи функции получения токена в SDK mutator
 * 
 * ВАЖНО: Этот компонент должен использоваться ТОЛЬКО внутри ClerkProvider
 */

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { setupClerkAuth } from '@go2asia/sdk/clerk-integration';

export function ClerkAuthSetup() {
  const { getToken, isLoaded } = useAuth();

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

  // Компонент не рендерит ничего
  return null;
}



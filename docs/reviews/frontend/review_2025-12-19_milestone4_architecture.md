# Gate Review: Milestone 4 Frontend Architecture (C)

**Дата:** 2025-12-19  
**Ревьюер:** Frontend Architect  
**Статус:** APPROVED_WITH_COMMENTS

---

## C. Frontend Architect — Architecture Review

### C.1. Архитектура фронта: Auth State

#### Текущее состояние

**Clerk Integration:**
- ✅ Clerk настроен через `@clerk/nextjs`
- ✅ Middleware проверяет авторизацию (`middleware.ts`)
- ✅ `ClerkAuthSetup` компонент настраивает интеграцию с SDK
- ✅ Токены получаются через `useAuth().getToken()` из Clerk

**Где хранится auth state:**
- ✅ **Clerk Provider** — управляет сессией пользователя
- ✅ **Middleware** — проверяет авторизацию на уровне роутинга
- ✅ **SDK Integration** — токены передаются в API запросы через `setupClerkAuth()`

**Рекомендации:**
- ✅ Использовать существующую интеграцию Clerk
- ✅ Не создавать дополнительный auth state store (Zustand/Redux не нужен для M4)
- ✅ Использовать `useAuth()` из Clerk для проверки авторизации в компонентах

#### Архитектура Auth State для M4

```
┌─────────────────────────────────────────┐
│         Clerk Provider                 │
│  (управляет сессией пользователя)      │
└──────────────┬──────────────────────────┘
               │
               ├─── useAuth() ───> userId, isSignedIn, getToken()
               │
               └─── ClerkAuthSetup ───> setupClerkAuth(getToken)
                                        │
                                        └──> SDK mutator использует токен
```

**Компоненты:**
- `app/layout.tsx` — оборачивает приложение в `ClerkProvider`
- `components/auth/ClerkAuthSetup.tsx` — настраивает SDK для использования Clerk токенов
- `middleware.ts` — проверяет авторизацию и редиректит на `/sign-in`

---

### C.2. Архитектура API Client

#### Текущее состояние

**SDK Package:**
- ✅ SDK генерируется из OpenAPI через Orval (`packages/sdk`)
- ✅ Используется `fetch` клиент (не axios)
- ✅ Custom mutator (`packages/sdk/src/mutator.ts`) для конфигурации запросов

**Проблемы текущей реализации:**
- ❌ Mutator не использует `NEXT_PUBLIC_API_URL` для base URL
- ❌ Mutator не добавляет `X-Request-Id` header
- ❌ Mutator не интегрирован с Clerk токенами
- ❌ Clerk integration placeholder (`setupClerkAuth` не реализован)

#### Рекомендуемая архитектура API Client

**Структура:**
```
packages/sdk/
├── src/
│   ├── mutator.ts          # Custom fetch instance с base URL, headers
│   ├── clerk-integration.ts # Интеграция с Clerk (получение токенов)
│   ├── api-client.ts        # Единый API client (если нужен)
│   └── generated/          # Автогенерируемый SDK из OpenAPI
```

**Обновлённый mutator.ts:**
```typescript
// packages/sdk/src/mutator.ts

interface FetchConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  [key: string]: unknown;
}

// Глобальная переменная для хранения функции получения токена
let getTokenFn: (() => Promise<string | null>) | null = null;

export const setupClerkAuth = (getToken: () => Promise<string | null>) => {
  getTokenFn = getToken;
};

export const customInstance = async <T>(
  config: FetchConfig,
  url: string
): Promise<T> => {
  // Получаем base URL из env
  const baseUrl = typeof window !== 'undefined' 
    ? (window as any).__NEXT_PUBLIC_API_URL__ || process.env.NEXT_PUBLIC_API_URL || 'https://staging.api.go2asia.space'
    : process.env.NEXT_PUBLIC_API_URL || 'https://staging.api.go2asia.space';

  // Полный URL (если url уже содержит домен, используем его, иначе добавляем baseUrl)
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  // Генерируем request ID
  const requestId = crypto.randomUUID();

  // Подготавливаем headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-Id': requestId,
    ...config.headers,
  };

  // Добавляем Authorization header, если есть токен
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Выполняем запрос
  const response = await globalThis.fetch(fullUrl, {
    ...config,
    headers,
  });

  // Обрабатываем ошибки
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: {
        code: 'UNKNOWN_ERROR',
        message: response.statusText,
      },
    }));
    throw error;
  }

  return response.json();
};
```

**Обновлённый clerk-integration.ts:**
```typescript
// packages/sdk/src/clerk-integration.ts

let getTokenFn: (() => Promise<string | null>) | null = null;

export const setupClerkAuth = (getToken: () => Promise<string | null>) => {
  getTokenFn = getToken;
};

export const getAuthToken = async (): Promise<string | null> => {
  if (!getTokenFn) {
    return null;
  }
  return getTokenFn();
};
```

**Использование в компонентах:**
```typescript
// components/auth/ClerkAuthSetup.tsx
import { useAuth } from '@clerk/nextjs';
import { setupClerkAuth } from '@go2asia/sdk/clerk-integration';

export function ClerkAuthSetup() {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && getToken) {
      setupClerkAuth(getToken);
    }
  }, [getToken, isLoaded]);

  return null;
}
```

---

### C.3. Типизация OpenAPI

#### Текущее состояние

**Типы:**
- ✅ Типы генерируются из OpenAPI через Orval (`packages/types`)
- ✅ SDK использует типы из `@go2asia/types`
- ✅ Типы экспортируются через `packages/sdk/src/generated/`

**Структура:**
```
packages/
├── types/
│   └── src/
│       └── generated/     # Автогенерируемые типы из OpenAPI
└── sdk/
    └── src/
        └── generated/     # Автогенерируемый SDK с типизацией
```

**Рекомендации:**
- ✅ Использовать типы из `@go2asia/types` для всех API ответов
- ✅ Не создавать дублирующие типы вручную
- ✅ После генерации SDK использовать типы из `@go2asia/sdk`

**Пример использования:**
```typescript
import { useGetBalance } from '@go2asia/sdk/balance';
import type { UserBalance } from '@go2asia/types';

function BalanceComponent() {
  const { data, isLoading } = useGetBalance();
  // data имеет тип UserBalance | undefined
}
```

---

### C.4. Стратегия env-конфига для staging

#### Текущее состояние

**Environment Variables:**
- ✅ `NEXT_PUBLIC_API_URL` — URL API Gateway (default: `https://api.go2asia.space`)
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- ✅ `CLERK_SECRET_KEY` — Clerk secret key (server-side)

**Проблемы:**
- ❌ Нет `.env.example` файла
- ❌ Default URL указывает на production вместо staging
- ❌ Нет документации по настройке env для staging

#### Рекомендуемая стратегия

**Создать `.env.example`:**
```env
# API Gateway URL (staging)
NEXT_PUBLIC_API_URL=https://go2asia-api-gateway-staging.fred89059599296.workers.dev

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Обновить `next.config.js`:**
```javascript
env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://go2asia-api-gateway-staging.fred89059599296.workers.dev',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
},
```

**Создать `docs/ops/frontend_staging_overview.md`:**
- Инструкции по настройке `.env.local`
- Описание переменных окружения
- Как запустить локально с staging API

---

### C.5. Границы: Gateway URL, Paths, Типизация

#### Gateway URL

**Где хранится:**
- ✅ `NEXT_PUBLIC_API_URL` — environment variable
- ✅ Используется в mutator для формирования полного URL

**Рекомендации:**
- ✅ Все API запросы идут через gateway (не напрямую к сервисам)
- ✅ Gateway URL: `https://go2asia-api-gateway-staging.fred89059599296.workers.dev` (staging)
- ✅ Gateway URL: `https://api.go2asia.space` (production, в будущем)

#### Paths (API Endpoints)

**Структура paths через Gateway:**
```
/v1/auth/*          → Auth Service
/v1/content/*       → Content Service
/v1/points/*        → Points Service
/v1/referral/*      → Referral Service
```

**Рекомендации:**
- ✅ Использовать paths из OpenAPI спецификаций
- ✅ Не хардкодить paths в компонентах
- ✅ Использовать автогенерируемые функции из SDK

**Пример:**
```typescript
// ✅ Правильно: использовать SDK
import { getPointsBalance } from '@go2asia/sdk/balance';
const balance = await getPointsBalance();

// ❌ Неправильно: хардкодить path
const response = await fetch(`${apiUrl}/v1/points/balance`);
```

#### Типизация

**Где типы:**
- ✅ `@go2asia/types` — типы из OpenAPI
- ✅ `@go2asia/sdk` — типизированные функции SDK

**Рекомендации:**
- ✅ Использовать типы из `@go2asia/types` для всех API ответов
- ✅ Не создавать дублирующие типы
- ✅ После генерации SDK использовать типы из SDK

---

### C.6. Архитектурные решения

#### Решение 1: Единый API Client

**Подход:** Использовать автогенерируемый SDK из OpenAPI через Orval

**Преимущества:**
- ✅ Типобезопасность (типы из OpenAPI)
- ✅ Автоматическая генерация при изменении OpenAPI
- ✅ Единая точка конфигурации (mutator)

**Недостатки:**
- ⚠️ Требует настройки mutator для base URL и headers
- ⚠️ Требует интеграции с Clerk

**Вердикт:** ✅ **APPROVED** — использовать существующий подход с SDK

#### Решение 2: Auth State Management

**Подход:** Использовать Clerk Provider без дополнительного state store

**Преимущества:**
- ✅ Не нужен дополнительный state management
- ✅ Clerk управляет сессией
- ✅ Простота реализации

**Недостатки:**
- ⚠️ Если в будущем понадобится кастомный auth, придётся рефакторить

**Вердикт:** ✅ **APPROVED** — использовать Clerk Provider для M4

#### Решение 3: Error Handling

**Подход:** Обрабатывать ошибки на уровне компонентов + toast notifications

**Преимущества:**
- ✅ Гибкость (разные ошибки для разных компонентов)
- ✅ Простота реализации

**Недостатки:**
- ⚠️ Дублирование кода обработки ошибок

**Вердикт:** ✅ **APPROVED** — для M4 достаточно обработки на уровне компонентов

**Рекомендация:** В будущем создать утилиту `lib/api-error-handler.ts` для централизованной обработки ошибок

---

### C.7. Зависимости и интеграции

#### Зависимости от Backend

**Требования:**
- ✅ API Gateway развёрнут и доступен
- ✅ Points Service развёрнут (`GET /v1/points/balance`, `GET /v1/points/transactions`)
- ✅ Referral Service развёрнут (`GET /v1/referral/code`)
- ✅ Content Service развёрнут (`POST /v1/content/events/{id}/register`)

#### Интеграции

**Clerk:**
- ✅ Интеграция с Clerk для аутентификации
- ✅ Токены передаются в API запросы через SDK

**React Query:**
- ✅ Используется для кэширования данных
- ✅ Настроен в `app/providers.tsx`

---

### C.8. Комментарии и рекомендации

#### Комментарии

1. **SDK Generation:**
   - ⚠️ SDK ещё не полностью сгенерирован (есть placeholder функции)
   - ✅ Нужно запустить `pnpm gen:sdk` перед началом реализации

2. **Mutator Configuration:**
   - ⚠️ Mutator не настроен для base URL и headers
   - ✅ Нужно обновить `mutator.ts` согласно рекомендациям выше

3. **Clerk Integration:**
   - ⚠️ `setupClerkAuth` не реализован
   - ✅ Нужно реализовать интеграцию согласно рекомендациям выше

4. **Environment Variables:**
   - ⚠️ Нет `.env.example` файла
   - ✅ Нужно создать `.env.example` с staging значениями

#### Рекомендации

1. **Перед началом реализации:**
   - ✅ Запустить `pnpm gen:sdk` для генерации SDK из OpenAPI
   - ✅ Обновить `mutator.ts` для поддержки base URL и headers
   - ✅ Реализовать `setupClerkAuth` в `clerk-integration.ts`
   - ✅ Создать `.env.example` файл

2. **Во время реализации:**
   - ✅ Использовать типы из `@go2asia/types` и `@go2asia/sdk`
   - ✅ Все API запросы через SDK (не напрямую через fetch)
   - ✅ Обрабатывать ошибки на уровне компонентов

3. **После реализации:**
   - ✅ Проверить, что все запросы идут через gateway
   - ✅ Проверить, что токены передаются корректно
   - ✅ Проверить обработку ошибок (401, 409, 5xx)

---

## Итоговый вердикт Gate C

**Статус:** ✅ **APPROVED_WITH_COMMENTS**

**Условия для перехода к Gate D:**
1. ✅ Архитектура определена
2. ✅ Стратегия env-конфига описана
3. ⚠️ Обновить `mutator.ts` для поддержки base URL и headers
4. ⚠️ Реализовать `setupClerkAuth` в `clerk-integration.ts`
5. ⚠️ Создать `.env.example` файл
6. ⚠️ Запустить `pnpm gen:sdk` для генерации SDK

**Следующий этап:** Gate D (Frontend Dev) — реализация экранов

---

**Дата создания:** 2025-12-19  
**Последнее обновление:** 2025-12-19


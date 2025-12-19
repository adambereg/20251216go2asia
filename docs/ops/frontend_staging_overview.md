# Frontend Staging Overview

**Версия:** 1.0  
**Дата:** 2025-12-19  
**Статус:** Draft

---

## Как запустить локально с staging API

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта `apps/go2asia-pwa-shell/`:

```env
# API Gateway URL (staging)
NEXT_PUBLIC_API_URL=https://go2asia-api-gateway-staging.fred89059599296.workers.dev

# Clerk Authentication (получите из Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Примечание:** 
- `NEXT_PUBLIC_API_URL` должен указывать на staging gateway
- Clerk ключи можно получить из [Clerk Dashboard](https://dashboard.clerk.com)

### 3. Генерация SDK из OpenAPI

Перед запуском приложения сгенерируйте SDK из OpenAPI спецификаций:

```bash
# Из корня репозитория
pnpm gen:sdk
```

Это создаст типизированные функции SDK в `packages/sdk/src/generated/`.

### 4. Запуск приложения

```bash
# Из корня репозитория
pnpm --dir apps/go2asia-pwa-shell dev

# Или из директории приложения
cd apps/go2asia-pwa-shell
pnpm dev
```

Приложение будет доступно на `http://localhost:3000`.

---

## Переменные окружения

### Обязательные переменные

| Переменная | Описание | Пример значения |
|------------|----------|-----------------|
| `NEXT_PUBLIC_API_URL` | URL API Gateway (staging) | `https://go2asia-api-gateway-staging.fred89059599296.workers.dev` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side) | `sk_test_...` |

### Опциональные переменные

| Переменная | Описание | Значение по умолчанию |
|------------|----------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | URL фронтенда (для sitemap) | `https://go2asia.space` |

---

## API Endpoints (через Gateway)

Все API запросы идут через API Gateway. Используйте следующие paths:

### Auth Service
- `GET /v1/auth/profile` — получить профиль пользователя
- `GET /v1/auth/roles` — получить роли пользователя

### Points Service
- `GET /v1/points/balance` — получить баланс Points
- `GET /v1/points/transactions` — получить историю транзакций

### Referral Service
- `GET /v1/referral/code` — получить referral code
- `GET /v1/referral/stats` — получить статистику рефералов

### Content Service
- `POST /v1/content/events/{id}/register` — зарегистрироваться на событие

**Примечание:** Не используйте эти endpoints напрямую. Используйте автогенерируемый SDK из `@go2asia/sdk`.

---

## Использование SDK

### Пример: Получение баланса Points

```typescript
import { useGetBalance } from '@go2asia/sdk/balance';

function BalanceComponent() {
  const { data, isLoading, error } = useGetBalance();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return <div>Баланс: {data?.balance} Points</div>;
}
```

### Пример: Регистрация на событие

```typescript
import { useRegisterEvent } from '@go2asia/sdk/pulse';

function EventRegisterButton({ eventId }: { eventId: string }) {
  const { mutate: register, isPending } = useRegisterEvent();

  const handleRegister = () => {
    register({ id: eventId });
  };

  return (
    <button onClick={handleRegister} disabled={isPending}>
      {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
    </button>
  );
}
```

---

## Проверка подключения к staging

### 1. Проверка Gateway Health

```bash
curl https://go2asia-api-gateway-staging.fred89059599296.workers.dev/health
```

Ожидаемый ответ:
```json
{
  "service": "api-gateway",
  "env": "staging",
  "status": "ok",
  "version": "<sha>"
}
```

### 2. Проверка Points Service

```bash
# Требует авторизации (JWT токен)
curl -H "Authorization: Bearer <token>" \
     https://go2asia-api-gateway-staging.fred89059599296.workers.dev/v1/points/balance
```

---

## Troubleshooting

### Проблема: SDK не генерируется

**Решение:**
```bash
# Проверьте, что OpenAPI файлы существуют
ls docs/openapi/*.yaml

# Запустите генерацию SDK
pnpm gen:sdk
```

### Проблема: API запросы не проходят (401 Unauthorized)

**Решение:**
1. Проверьте, что Clerk настроен корректно
2. Проверьте, что токен передаётся в headers (через `setupClerkAuth`)
3. Проверьте, что пользователь авторизован через Clerk

### Проблема: API запросы идут не на staging

**Решение:**
1. Проверьте `NEXT_PUBLIC_API_URL` в `.env.local`
2. Перезапустите dev server после изменения `.env.local`
3. Проверьте, что переменная доступна в браузере (через `console.log(process.env.NEXT_PUBLIC_API_URL)`)

---

## Связанные документы

- `docs/ops/staging_services_overview.md` — обзор staging сервисов
- `docs/ops/milestone2_backend_source_of_truth.md` — информация о backend сервисах
- `docs/reviews/frontend/review_2025-12-19_milestone4_architecture.md` — архитектура фронтенда

---

**Дата создания:** 2025-12-19  
**Последнее обновление:** 2025-12-19


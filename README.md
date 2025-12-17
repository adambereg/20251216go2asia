# Go2Asia MVP

Цифровая экосистема путешествий, жизни и бизнеса в Юго-Восточной Азии.

## Структура проекта

Монорепозиторий на базе pnpm workspaces и Turborepo.

```
go2asia-monorepo/
├── apps/
│   ├── go2asia-pwa-shell/     # Frontend (Next.js 15 App Router)
│   └── api-gateway/           # API Gateway (Cloudflare Worker)
├── services/
│   ├── auth-service/          # Auth Service (Cloudflare Worker)
│   ├── content-service/       # Content Service (Cloudflare Worker)
│   ├── points-service/         # Points Service (Cloudflare Worker)
│   └── referral-service/      # Referral Service (Cloudflare Worker)
├── packages/
│   ├── ui/                    # Дизайн-система (React/Tailwind/shadcn)
│   ├── types/                 # Общие TS-типы (генерятся из OpenAPI)
│   ├── sdk/                   # Автогенерируемый клиент по OpenAPI
│   ├── config/                # eslint, tsconfig, prettier, lint-staged
│   ├── logger/                # Единый логгер + requestId
│   └── schemas/               # Zod-схемы (дубли/гварды для рантайма)
└── docs/
    ├── openapi/               # Спецификации сервисов
    ├── ops/                   # Runbooks, SLO/SLA, кэш-матрица, миграции
    └── architecture/          # Диаграммы, решения
```

## Быстрый старт

### Требования

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Установка

```bash
pnpm install
```

### Разработка

```bash
# Запуск всех dev серверов
pnpm dev

# Запуск конкретного приложения/сервиса
pnpm --filter go2asia-pwa-shell dev
pnpm --filter api-gateway dev
```

### Сборка

```bash
# Сборка всех пакетов
pnpm build

# Сборка конкретного пакета
pnpm --filter @go2asia/ui build
```

### Генерация типов и SDK из OpenAPI

```bash
# Генерация типов
pnpm gen:types

# Генерация SDK
pnpm gen:sdk
```

### Линтинг и форматирование

```bash
# Линтинг
pnpm lint

# Проверка типов
pnpm typecheck

# Форматирование кода
pnpm format
```

## Документация

- [Engineering Playbook](docs/playbooks/ENGINEERING_PLAYBOOK.md)
- [Frontend Playbook](docs/playbooks/FRONTEND_PLAYBOOK.md)
- [MVP Architecture](docs/architecture/mvp_architecture.md)
- [MVP Technical Specification](docs/plans/mvp_tz_draft.md)
- [MVP Implementation Plan](docs/plans/mvp_implementation_plan.md)

## Статус разработки

**Milestone 1: Foundation & Infrastructure** (в процессе)

- ✅ Настройка монорепозитория
- ⏳ Создание базовых пакетов
- ⏳ Настройка OpenAPI-first процесса
- ⏳ Создание API Gateway
- ⏳ Настройка Neon PostgreSQL и миграций
- ⏳ Создание PWA Shell
- ⏳ Создание базовых UI компонентов
- ⏳ Настройка CI/CD Pipeline

## Лицензия

Private

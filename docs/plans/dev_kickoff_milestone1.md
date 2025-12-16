# Dev Kickoff — Milestone 1: Foundation & Infrastructure

**Дата:** 2025-01-16  
**Статус:** Ready for Implementation  
**Основа:** 
- План реализации MVP v1.0 (APPROVED)
- Ревью плана реализации MVP (APPROVED)

---

## Критические правила для Dev

### Rule 1: Работа ТОЛЬКО внутри Milestone 1

**Запрещено начинать работу над:**
- ❌ Points Service (Milestone 3)
- ❌ Referral Service (Milestone 3)
- ❌ UI Connect (Milestone 4)
- ❌ Feature Capsules (Atlas, Pulse, Blog, Connect) (Milestone 4)

**Разрешено работать только над:**
- ✅ Milestone 1: Foundation & Infrastructure
- ✅ Все задачи из Milestone 1 (M1-BE-001 до M1-DEVOPS-001)

**Критерий завершения Milestone 1:**
- Все критерии готовности Milestone 1 выполнены
- Milestone 1 принят (reviewed и approved)
- Только после этого можно переходить к Milestone 2

---

### Rule 2: OpenAPI → SDK → Код (строгий порядок)

**Запрещено:**
- ❌ Ручные `fetch()` вызовы к API
- ❌ Временные решения типа "сделаем так пока"
- ❌ Изменения API без обновления OpenAPI спецификации
- ❌ Прямые HTTP запросы без использования автогенерируемого SDK

**Обязательный порядок работы:**
1. **OpenAPI:** Сначала описываем API в `docs/openapi/*.yaml`
2. **SDK:** Генерируем типы и SDK через `pnpm gen:types` и `pnpm gen:sdk`
3. **Код:** Используем только автогенерируемый SDK в коде

**Пример правильного подхода:**
```typescript
// ✅ ПРАВИЛЬНО: Используем автогенерируемый SDK
import { getAuthProfile } from '@go2asia/sdk';

const profile = await getAuthProfile({ headers: { Authorization: `Bearer ${token}` } });

// ❌ НЕПРАВИЛЬНО: Ручной fetch
const response = await fetch('/v1/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
```

**Если нужно изменить API:**
1. Обновить OpenAPI спецификацию
2. Регенерировать типы и SDK
3. Обновить код, использующий SDK

---

### Rule 3: Никакой самодеятельности в UI

**Frontend разработка:**
- ✅ Строго по `docs/playbooks/FRONTEND_PLAYBOOK.md`
- ✅ Строго через Design System (`design-system/` или `packages/ui/`)
- ✅ Использовать только существующие компоненты из Design System
- ✅ Следовать Feature Capsules архитектуре

**Запрещено:**
- ❌ "Я тут чуть улучшил" без согласования
- ❌ Создание новых компонентов без добавления в Design System
- ❌ Изменение существующих компонентов Design System без обсуждения
- ❌ Отклонение от Frontend Playbook

**Если нужен новый компонент:**
1. Проверить, есть ли он в Design System
2. Если нет — добавить в Design System (`packages/ui/`)
3. Использовать новый компонент в коде

---

## Milestone 1: Задачи для реализации

### Backend Infrastructure

**M1-BE-001: Настройка монорепозитория**
- Роль: DevOps
- Приоритет: P0 (критично)
- Зависимости: Нет
- Критерии готовности:
  - `pnpm install` работает без ошибок
  - `pnpm build` собирает все пакеты
  - Структура директорий соответствует архитектуре

**M1-BE-002: Создание базовых пакетов**
- Роль: Backend Dev
- Приоритет: P0 (критично)
- Зависимости: M1-BE-001
- Критерии готовности:
  - Все пакеты собираются без ошибок
  - Logger поддерживает requestId
  - Zod схемы готовы к использованию

**M1-BE-003: Настройка OpenAPI-first процесса**
- Роль: Backend Dev
- Приоритет: P0 (критично)
- Зависимости: M1-BE-002
- Критерии готовности:
  - `pnpm gen:types` генерирует типы из OpenAPI
  - `pnpm gen:sdk` генерирует SDK клиент
  - CI валидирует OpenAPI спецификации

**M1-BE-004: Создание API Gateway (базовая версия)**
- Роль: Backend Dev
- Приоритет: P0 (критично)
- Зависимости: M1-BE-002, M1-BE-003
- Критерии готовности:
  - Gateway развёрнут на Cloudflare Workers
  - Health checks возвращают 200 OK
  - Логирование работает с requestId
  - Маршрутизация настроена (пока без реальных сервисов)

**M1-BE-005: Настройка Neon PostgreSQL и миграций**
- Роль: DevOps / Backend Dev
- Приоритет: P0 (критично)
- Зависимости: M1-BE-001
- Критерии готовности:
  - Подключение к Neon работает
  - Миграции можно запускать через `pnpm migrate`
  - Структура миграций соответствует схемам из архитектуры

### Frontend Infrastructure

**M1-FE-001: Создание PWA Shell (базовая версия)**
- Роль: Frontend Dev
- Приоритет: P0 (критично)
- Зависимости: M1-BE-001
- Критерии готовности:
  - PWA Shell развёрнут на Netlify
  - Clerk SSO работает (базовая авторизация)
  - Базовый layout отображается
  - Роутинг настроен

**M1-FE-002: Создание базовых UI компонентов**
- Роль: Frontend Dev
- Приоритет: P1 (важно)
- Зависимости: M1-BE-001, M1-FE-001
- Критерии готовности:
  - UI компоненты собираются без ошибок
  - Компоненты соответствуют design-system
  - Tailwind CSS настроен

### DevOps & CI/CD

**M1-DEVOPS-001: Настройка CI/CD Pipeline**
- Роль: DevOps
- Приоритет: P0 (критично)
- Зависимости: M1-BE-001, M1-FE-001
- Критерии готовности:
  - PR checks работают (lint, typecheck, build)
  - Preview deployments создаются для каждого PR
  - Staging деплой работает автоматически

---

## Критерии готовности Milestone 1

- ✅ Монорепозиторий настроен и работает
- ✅ Базовые пакеты созданы и собираются
- ✅ OpenAPI-first процесс настроен
- ✅ API Gateway развёрнут и отвечает на health checks
- ✅ Neon PostgreSQL настроен, миграции работают
- ✅ PWA Shell развёрнут на Netlify
- ✅ Базовые UI компоненты созданы
- ✅ CI/CD pipeline работает

---

## Авторитетные источники

1. **ENGINEERING_PLAYBOOK.md** (`docs/playbooks/ENGINEERING_PLAYBOOK.md`)
   - Процесс, архитектура, стек, CI/CD
   - OpenAPI-first процесс
   - Observability, Security, Caching Policy

2. **FRONTEND_PLAYBOOK.md** (`docs/playbooks/FRONTEND_PLAYBOOK.md`)
   - UI/UX правила
   - Feature Capsules архитектура
   - Design System использование

3. **Design System** (`design-system/` или `packages/ui/`)
   - Визуальные токены и компоненты
   - READ-ONLY reference для дизайн-системы

4. **Архитектура MVP** (`docs/architecture/mvp_architecture.md`)
   - Сервисная декомпозиция
   - API boundaries
   - Data ownership

5. **ТЗ MVP** (`docs/plans/mvp_tz_draft.md`)
   - Требования к функциональности
   - Ограничения MVP

**Любое противоречие решается в пользу источника с меньшим номером.**

---

## Процесс работы

### Порядок выполнения задач

1. **Начать с независимых задач:**
   - M1-BE-001 (монорепозиторий)
   - M1-FE-001 (PWA Shell) — может выполняться параллельно

2. **После M1-BE-001:**
   - M1-BE-002 (базовые пакеты)
   - M1-BE-005 (Neon PostgreSQL)

3. **После M1-BE-002:**
   - M1-BE-003 (OpenAPI-first процесс)
   - M1-FE-002 (UI компоненты)

4. **После M1-BE-003:**
   - M1-BE-004 (API Gateway)

5. **После M1-BE-001 и M1-FE-001:**
   - M1-DEVOPS-001 (CI/CD Pipeline)

### OpenAPI-first процесс (Rule 2)

**Для каждой задачи, связанной с API:**

1. **Создать/обновить OpenAPI спецификацию:**
   - Файл: `docs/openapi/{service}.yaml`
   - Описать все endpoints, схемы данных
   - Валидировать через `spectral` или аналогичный инструмент

2. **Сгенерировать типы и SDK:**
   ```bash
   pnpm gen:types
   pnpm gen:sdk
   ```

3. **Использовать SDK в коде:**
   - Импортировать из `@go2asia/sdk`
   - Использовать типы из `@go2asia/types`
   - Никаких ручных `fetch()` вызовов

### Frontend разработка (Rule 3)

**Для каждой задачи, связанной с UI:**

1. **Проверить Design System:**
   - Есть ли нужный компонент в `packages/ui/`?
   - Если нет — добавить в Design System

2. **Следовать Frontend Playbook:**
   - Feature Capsules архитектура
   - Mobile-first подход
   - PWA офлайн-режим

3. **Использовать только Design System компоненты:**
   - Не создавать новые компоненты без добавления в Design System
   - Не изменять существующие компоненты без обсуждения

---

## Чек-лист перед завершением Milestone 1

- [ ] Все задачи Milestone 1 выполнены
- [ ] Все критерии готовности Milestone 1 выполнены
- [ ] OpenAPI-first процесс работает (Rule 2)
- [ ] Никаких ручных `fetch()` вызовов (Rule 2)
- [ ] Все UI компоненты из Design System (Rule 3)
- [ ] Никакой самодеятельности в UI (Rule 3)
- [ ] CI/CD pipeline работает
- [ ] Все сервисы развёрнуты и доступны
- [ ] Health checks возвращают 200 OK

---

## Deliverables

- ✅ Документ с правилами для Dev создан
- ✅ Milestone 1 задачи определены
- ✅ Критерии готовности определены
- ✅ Процесс работы описан

## Open Questions

Нет открытых вопросов. Все правила и задачи определены.

## Next

Передача управления агенту **Dev** для начала реализации Milestone 1: Foundation & Infrastructure.


# ADR-0019: Offline support (SW + IndexedDB) is deferred for MVP

**Статус:** Accepted / Implemented  
**Дата:** 2025-12-24  

## Контекст

В плане MVP упоминалась поддержка offline (Service Worker + IndexedDB) для “полевых” сценариев (например, Quest runner).

Фактическое состояние репозитория на момент Milestone 4:
- В PWA Shell есть `manifest.webmanifest`, но **нет** зарегистрированного Service Worker (нет `navigator.serviceWorker.register(...)`, нет `sw.js`, нет Workbox/next-pwa).
- В Quest-модуле есть утилиты для offline-индикации (например, `components/quest/utils/offline.ts`), но это **не** полноценная offline-архитектура (не обеспечивает кэширование ассетов/страниц и не предоставляет очередь синхронизации через IndexedDB).
- В `apps/go2asia-pwa-shell/next.config.js` включено `typescript.ignoreBuildErrors: true` (ускорение деплоя), что исторически позволяло “протаскивать” изменения без строгой валидации.

## Решение

Для MVP **не внедряем** полноценный offline (SW + IndexedDB) сейчас и фиксируем это как осознанное ограничение.

Вместо этого:
- Оставляем текущий уровень “offline” как best-effort:
  - browser HTTP cache
  - `navigator.onLine`/online events для UI-индикации в Quest
- Делаем typecheck в CI блокирующим (см. Step E), чтобы стабилизировать качество без расширения функционала.

## Последствия

**Плюсы**
- Не расширяем surface area (SW, caching стратегии, фоновые sync, конфликт-резолюция) до момента, когда это реально нужно.
- Снижаем риск нестабильности в staging/prod из-за неверных caching стратегий.
- Сохраняем фокус на Milestone 4/5 (API-first + E2E сценарии).

**Минусы**
- Нет гарантированного offline UX (особенно для квестов).
- Для пользователей “в поле” возможны обрывы сценариев без восстановлений.

## Реализация

- Документация решения: этот ADR.
- Валидация качества: CI typecheck теперь blocking (`.github/workflows/ci.yml`).


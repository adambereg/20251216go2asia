# Atlas Asia Hardening Plan (PH first)

Цель: привести Atlas Asia в “честное состояние” — в `api`‑режиме показывать только реальные данные из Neon через content‑service/SDK. Никаких demo/mocks/pexels‑fallback. Если данных нет — честный EmptyState.

Anchor: **Philippines (PH)** как эталонный пайплайн.

## Матрица: раздел → текущий источник → целевой источник → действие

| Раздел/страница | Текущий источник | Целевой источник | Действие |
|---|---|---|---|
| `/atlas` (home) | API + mock fallback | Neon → content-service → SDK | Убрать fallback на mock; empty state при пустом API |
| `/atlas/countries` | API + mock fallback | Neon → content-service → SDK | Убрать fallback; empty state |
| `/atlas/cities` | API + mock fallback | Neon → content-service → SDK | Убрать fallback; empty state |
| `/atlas/countries/{id}` | API + mock fallback | Neon → content-service → SDK | Убрать fallback; empty state |
| `/atlas/cities/{id}` | API + mock fallback | Neon → content-service → SDK | Убрать fallback; empty state |
| `/atlas/countries/{id}/*` вкладки | Neon (tabs) | Neon (tabs) | Оставить; показывать empty state если нет блока |
| `/atlas/cities/{id}/*` вкладки | Neon (tabs) | Neon (tabs) | Оставить; показывать empty state если нет блока |
| `/atlas/places` | API (без mock) + UI demo фото | Neon → content-service → SDK | Убрать pexels fallback; empty state |
| `/atlas/cities/{id}/places` | API (без mock) | Neon → content-service → SDK | Оставить; empty state |
| `/atlas/places/{slug}` | API (без mock) + UI demo фото | Neon → content-service → SDK | Убрать pexels fallback; empty state для секций |
| `/atlas/countries/{id}/places` | API + mock fallback | Neon → content-service → SDK | Убрать fallback; корректная фильтрация по countryId |
| `/atlas/guides` | API + mock fallback | Neon (articles) → SDK | Убрать fallback; empty state |
| `/atlas/guides/{id}` | API + mock fallback | Neon (articles) → SDK | Убрать fallback; empty state |
| `/atlas/themes` | Mock only | Neon → content-service → SDK | Пока закрыть EmptyState (P2) |
| `/atlas/themes/{id}` | Fetch + mock fallback | Neon → content-service → SDK | Пока закрыть EmptyState (P2) |
| `/atlas/hubs/{slug}` | Mock only | Neon → content-service → SDK | Пока закрыть EmptyState (P2) |
| `/atlas/tools/*` | Static | Static | Без изменений |

## Что уже “живое” (Neon‑based)

- Tabs для стран и городов через `content-service` (`/v1/content/countries/{id}/tabs`, `/v1/content/cities/{id}/tabs`).
- Places API `/v1/content/places` (list + detail) — при наличии данных в Neon.

## Что требуется очистить / заполнить

### Очистить от demo/mocks (P0)
- Убрать `mockRepo` fallback в `api`‑режиме для Atlas страниц.
- Убрать pexels fallback‑фото в place detail (UI).
- Везде показывать EmptyState, если данных нет.

### Заполнить реальным контентом (P0)
- **Places PH** из `content/atlas/philippines/Philippines-places.md`:
  - showplace и business
  - country_id = `ph`
  - city_id через alias‑резолвинг

### Временно закрыть EmptyState (P1/P2)
- Themes, Hubs — пока без контента и без mock.

## План работ по приоритетам

### P0 — “честность” для PH
1. **Ingest PH Places** из `Philippines-places.md` в Neon (UPSERT, idempotent).
2. **Очистка демо‑places** в staging (скрипт удаления/изоляции).
3. **Отключение mock fallback** для Atlas в `api`‑режиме.
4. **Отключение pexels fallback** в place detail.
5. **EmptyState** вместо демо‑контента.

### P1 — Расширение на другие страны
1. Масштабирование ingest‑пайплайна на другие страны.
2. Нормализация вкладок (tabs) для новых стран/городов.

### P2 — Темы и хабы
1. Моделирование в content‑service (schema/API).
2. Перевод `/atlas/themes` и `/atlas/hubs` на Neon.

## Что делаем ТОЛЬКО для PH сейчас

- Реальные места PH (ingest из `Philippines-places.md`).
- Фильтрация/очистка демо‑контента в staging по `countryId=ph`.

## Что оставляем на потом

- Темы/хабы как контентные сущности (P2).
- Полный coverage всех стран и городов.


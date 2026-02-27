---
title: "Atlas Place: legacy hardcoded media origin"
status: "accepted"
date: "2026-02-27"
owners:
  - "platform"
---

## Контекст

В проекте принят канон для новых модулей (Pulse/Quest/Rielt и далее):

- в данных хранится **`media_key`** (object key / relative path),
- на клиенте URL строится строго через **`resolveMediaUrl(mediaKey)`** и **`NEXT_PUBLIC_MEDIA_URL`**,
- никаких hardcoded доменов/URL в UI.

Однако модуль Atlas (детальная/карточки Places) исторически использует утилиту `placeMedia.ts`, которая генерирует абсолютные URL вида:

`https://media.go2asia.space/place/{place_id}/{NN}.jpg`

## Решение

До отдельного этапа унификации Atlas Places остаются **LEGACY-исключением** и продолжают использовать hardcoded origin `https://media.go2asia.space` в:

- `apps/go2asia-pwa-shell/modules/atlas/utils/placeMedia.ts`

Новые модули и новые интеграции **не должны** копировать этот подход.

## Почему так (ограничение текущего этапа)

- Atlas Places уже завязаны на детерминированные публичные URL (см. `docs/modules/atlas/places_media_pipeline.md`).
- Унификация потребует отдельной миграции/рефакторинга, чтобы Atlas тоже использовал `media_key` + `resolveMediaUrl`.

## Последствия

### Плюсы

- Atlas Places продолжает работать без дополнительных клиентских env и без рисков регрессий в текущем этапе.

### Минусы / Риски

- Несогласованность с каноном (Atlas Place ≠ Pulse/Quest/Rielt).
- Смена public origin потребует правок в коде Atlas Places и документации.

## План унификации (не в рамках этого ADR)

Перевести Atlas Places на канон:

1) Генерировать **key** `place/{place_id}/{NN}.jpg` (без домена)  
2) Строить URL через `resolveMediaUrl()` и `NEXT_PUBLIC_MEDIA_URL`  
3) Обновить документацию и прогнать smoke-тесты (Places list + Place detail)


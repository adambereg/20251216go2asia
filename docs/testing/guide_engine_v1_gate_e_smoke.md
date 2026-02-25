# Guide Engine v1 — Gate E smoke (md-import + mini-admin)

Дата: 2026-02-15

## E1) md-import

### Dry-run (Windows PowerShell)

```powershell
pnpm -C packages/db db:import:guides-md -- --dry-run
```

Ожидаемо:
- выводит количество файлов в canonical/legacy
- выводит план upsert: guides/sections/blocks
- **не** пишет в БД

### Apply (staging)

```powershell
$env:STAGING_DATABASE_URL="postgresql://..."
pnpm -C packages/db db:ddl:apply:staging
pnpm -C packages/db db:import:guides-md -- --apply
```

Idempotency:
- `guides` upsert по `slug`
- `guide_sections` upsert по `(guide_id, tab_key)`
- `guide_blocks` upsert по стабильному `id = uuid(sha1("md-import:<slug>:<tab_key>:rich_text:0"))`

Проверка:
- повторный запуск `--apply` не создаёт дублей

## Политика правок (v1)

- Импортные `rich_text` блоки (`payload.source="md-import"` или `payload.mdPath`) считаются **read-only**:
  - правки делаются **только в Markdown** + повторный импорт
  - admin endpoints запрещают `PUT/DELETE /v1/admin/blocks/:id` для таких блоков (403)

## Детерминированный UUID

- `uuidFromSha1()` генерирует **детерминированный uuid-like** идентификатор (практично для идемпотентности).
- Это не криптографическая гарантия отсутствия коллизий; поэтому `md-import` делает collision-check (set blockIds) и фейлит, если найдены дубликаты.

## E2) mini-admin (v1)

Требование v1: все write endpoints требуют заголовок `X-User-ID`.

Проверки (ручные):
- изменить `order_index` секции через admin endpoint → порядок вкладок меняется в PWA
- выключить секцию (`is_enabled=false`) → вкладка исчезает в public
- создать/обновить блок → `is_empty` пересчитан сервером


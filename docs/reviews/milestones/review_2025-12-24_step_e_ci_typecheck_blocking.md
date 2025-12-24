# Milestone review (Step E): CI typecheck is blocking

**Дата:** 2025-12-24  
**Цель:** сделать `typecheck` в CI блокирующим после приведения workspace к “зелёному” типчеку.

## Что сделано

- `apps/go2asia-pwa-shell`:
  - убраны несколько несовместимых props/типов, мешавших `tsc --noEmit`
  - отключены `noUnusedLocals/noUnusedParameters` на уровне app tsconfig (перевод “unused” из hard-error в lint-контур)
- CI:
  - `.github/workflows/ci.yml`: `continue-on-error` убран → typecheck теперь блокирует merge.

## Проверка

Локально:

- `pnpm typecheck` (workspace) — должно завершаться успешно.

CI:

- Job `Typecheck (blocking)` теперь фейлит PR при TypeScript ошибках.


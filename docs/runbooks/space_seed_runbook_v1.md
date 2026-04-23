# Space Seed Runbook (v1)

Цель: безопасно materialize `Space-Asia-Full-Seed-Content-Pack-v1.md` без догадки о runtime `user_id`.

По умолчанию importer читает `Space-Asia-Full-Seed-Content-Pack-v1.md`, но для bounded review/materialization passes можно передать альтернативный markdown source через `--source`, если этот файл уже приведён к каноническим YAML sections (`users`, `profile_projections`, `groups`, `group_membership_matrix`, `posts`, `media_registry`).

## Каноническое правило identity

- Для applied seed source-of-truth по user identity: `auth.users.id`.
- Mapping делается по email только как lookup key в `auth.users`.
- Importer не должен придумывать applied `user_id` из email local-part.
- Если один email отсутствует в `auth.users` или маппится неоднозначно, import должен завершиться ошибкой.

## Что означает dry-run

- `dry-run` нужен только для preview структуры seed-пакета.
- В `dry-run` importer может показать email-derived preview ids, но это не canonical runtime identity.
- Эти preview ids нельзя считать допустимыми для applied materialization, тестовых assertions или downstream contract truth.

## Preconditions перед `--apply`

1. Seed users уже materialized в identity/auth contour.
2. Для каждого seed email существует ровно одна строка в `auth.users`.
3. Запуск идёт не с `ENVIRONMENT=production`.

## Recommended flow

1. Создать/подготовить seed users в identity/auth contour.
2. Убедиться, что `auth.users.id` уже соответствует canonical auth-linked identity.
3. Запустить importer в `dry-run` для preview объёма данных.
4. Запустить importer с `--apply`.

Примеры:

- Full seed по умолчанию:
  `pnpm -C packages/db db:import:space-md`
- Альтернативный bounded source:
  `pnpm -C packages/db db:import:space-md -- --source "../../content/space/Space-Asia-Feed-Content-Pack-Slice-1-v1.md"`
- Apply для альтернативного bounded source:
  `pnpm -C packages/db db:import:space-md -- --apply --source "../../content/space/Space-Asia-Feed-Content-Pack-Slice-1-v1.md"`

## Failure semantics

- Missing email in `auth.users`: bounded blocker, сначала materialize user identity.
- Ambiguous email in `auth.users`: bounded blocker, сначала устранить неоднозначность в auth contour.
- Нельзя обходить эти ошибки возвратом к email-derived applied ids.

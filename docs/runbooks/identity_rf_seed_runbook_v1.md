# Identity + RF Seed Runbook (v1)

Цель: быстро и безопасно подготовить первую живую seed-партию пользователей и RF-сущностей в текущем baseline.

## 1) Prerequisites

- Настроены `CLERK_SECRET_KEY`, `SERVICE_JWT_SECRET`, `AUTH_SERVICE_URL`, `RF_SERVICE_URL` в `api-gateway`.
- Настроены `DATABASE_URL`, `SERVICE_JWT_SECRET` в `auth-service` и `rf-service`.
- Базовые geo-справочники уже есть (валидные `country_id`, `city_id` для RF).
- Рабочий gateway URL (пример: `https://api.go2asia.local`).
- Доступ в Clerk Dashboard (создание пользователей + правка metadata).

## 2) Каноническая модель (что считать истиной)

- Identity source-of-truth: `sub` из gateway-validated JWT.
- Platform role source-of-truth в backend: `users.role`.
- Канонические роли: `spacer`, `vip_spacer`, `pro`, `admin`.
- `space_profile_projection.role_label` = display-only.
- RF domain relationship (`rf_pro_link`, owner partner) != platform role.

### RF owner account rule

- RF owner обязан иметь platform account в Go2Asia.
- RF ownership связывается с platform identity (`ownerUserId`) через auth/user contour.
- Участие в Space Asia для RF owner optional:
  - не требуется публикация постов;
  - не требуется social graph участие;
  - не требуется Space-oriented social onboarding.
- `pro` может совпадать с RF owner, но это не обязательное условие RF ownership.

## 3) Создание seed user (практический шаг)

1. Создайте пользователя в Clerk (email/password или magic link).
2. В Clerk задайте `publicMetadata.role` одним из:
   - `spacer`
   - `vip_spacer`
   - `pro`
   - `admin`
3. Выполните sign-in этим пользователем (через PWA или API-клиент с Clerk session token).

## 4) Materialization через `users/ensure`

Вызов (с Bearer токеном этого пользователя):

```bash
curl -X POST "$API_BASE/v1/users/ensure" \
  -H "Authorization: Bearer $CLERK_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Ожидаемо:
- `200 OK`
- `user.id` совпадает с Clerk `sub`
- `user.clerk_id` совпадает с `user.id`
- `user.role` соответствует `publicMetadata.role` (после нормализации)

## 5) Проверка role прохождения end-to-end

### A. Проверка в БД (обязательная)

```sql
SELECT id, clerk_id, email, role, created_at, updated_at
FROM users
WHERE id = '<clerk_sub>';
```

Ожидание: `role` в каноническом наборе.

### B. Проверка gateway->downstream поведения (обязательная)

- Для RF owner-flow:
  - `POST /v1/rf/business/partners` под нужным пользователем создаёт партнёра с `ownerUserId = <clerk_sub>`.
- Для non-auth:
  - Публичные `GET /v1/rf/partners`, `GET /v1/rf/offers` доступны без bearer.

### C. Проверка display-only слоя (опционально)

- Через Space write flow (если включён `SPACE_SERVICE_URL`) убедиться, что `roleLabel` отображается как UI-подпись.
- Не использовать `roleLabel` для auth-решений.

## 6) Назначение ролей/tier (в текущем baseline)

- Делается через Clerk `publicMetadata.role`.
- Поддерживаемые значения: `spacer`, `vip_spacer`, `pro`, `admin`.
- После изменения роли нужно:
  1) заново получить session token (перелогиниться),
  2) повторно вызвать `POST /v1/users/ensure`,
  3) перепроверить `users.role` в БД.

## 7) Подготовка RF first seed pack

Рекомендуемый порядок:

1. Seed users (из шаблона `identity_seed_users_template_v1.csv`).
2. Materialize users через `users/ensure`.
3. Создать partners под owner users.
4. Создать offers для partners.
5. Для PRO users создать `pro links`.
6. (Опционально) проверить claim/redeem сценарии на ограниченном наборе.

## 8) Частые ловушки

- Роль в Clerk изменили, но не перелогинились -> старый token, старый `users.role`.
- `users/ensure` не вызывался -> user не materialized в backend таблице.
- Путают platform role и RF relationship:
  - `pro` (platform) != `rf_pro_link` (domain link).
- Путают RF owner и Space social participant:
  - RF owner requires platform account, but Space participation is optional.
- Путают `role_label` и auth:
  - `role_label` только display.
- Невалидные `countryId/cityId` при создании partner.

## 9) Минимальный smoke после seed

1. `POST /v1/users/ensure` для каждого seed user -> 200.
2. SQL: все seed users присутствуют в `users` с ожидаемым `role`.
3. Owner user создаёт partner -> 201.
4. Owner user создаёт offer -> 201.
5. Offer активируется -> 200.
6. PRO user создаёт `pro link` -> 201.
7. Owner принимает `pro link` -> 200.


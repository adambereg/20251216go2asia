# Identity/RF Seed Templates Guide (v1)

Основной формат шаблонов: **CSV**.

Почему CSV:
- проще ручное заполнение в Excel/Google Sheets;
- удобно для небольших батчей и peer-review;
- легко конвертировать в JSON/SQL при необходимости;
- не требует отдельного seed-пайплайна.

## Identity templates

### `identity_seed_users_template_v1.csv`

- Runtime-critical:
  - `seed_key`
  - `email`
  - `platform_role`
  - `clerk_external_id_hint`
  - `must_materialize_via_users_ensure`
- Display-only / optional:
  - `display_name`
  - `space_role_label_hint`
  - `notes`
- Domain markers (не role source):
  - `rf_owner_candidate`
  - `rf_pro_candidate`

## RF templates

### `rf_partners_template_v1.csv`

- Runtime-critical:
  - `partner_seed_key`
  - `owner_seed_key`
  - `display_name`
  - `country_id`
  - `city_id`
- Optional:
  - `atlas_place_id`
  - `host_atlas_place_id`
  - `notes`

### `rf_offers_template_v1.csv`

- Runtime-critical:
  - `offer_seed_key`
  - `partner_seed_key`
  - `created_by_seed_key`
  - `title`
  - `offer_type`
  - `visibility`
  - `activate_after_create`
- Optional:
  - `notes`

### `rf_pro_links_template_v1.csv`

- Runtime-critical:
  - `pro_link_seed_key`
  - `partner_seed_key`
  - `pro_user_seed_key`
  - `role_scope`
  - `accept_by_owner`
- Optional:
  - `notes`

### `rf_voucher_seed_cases_template_v1.csv` (optional)

Это не импорт ваучеров напрямую, а сценарии для генерации runtime данных:
- claim case (кто клеймит какой offer),
- redeem case (кто редимит voucher как owner).

- Runtime-critical:
  - `case_key`
  - `offer_seed_key`
  - `claim_user_seed_key`
  - `idempotency_key`
  - `expect_claim_status`
  - `redeem_by_owner`
- Optional:
  - `notes`

## Важное разделение

- Platform role/tier: только канонические `spacer|vip_spacer|pro|admin`.
- Display label: только UI-подпись, не auth.
- RF relationship: owner/pro-link — доменная связь, не глобальная роль.


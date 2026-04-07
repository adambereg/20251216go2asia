# RF Asset Pack Note (v1)

## Назначение

Этот документ фиксирует расширенный RF asset pack для практической работы над frontend/UI модуля **RF Asia** после прохождения first-batch validation milestone.

Цель пакета: дать Cursor и команде не только минимальный runtime dataset, но и достаточный набор **content / taxonomy / media / UX state assets** для сборки более убедительного и product-like UI.

Документ не заменяет runtime truth по `partners`, `offers`, `pro_links`, `voucher_seed_cases`, а расширяет его слоями, необходимыми для richer UX.

---

## Базовый статус, на который опирается asset pack

На момент этого документа:

- staging RF path работает end-to-end;
- `rf-service` staging отвечает `/health` и `/ready` кодом `200`;
- gateway RF path работает;
- first batch validation зафиксирован как пройденный по dataset truth;
- `partners`, `offers`, `pro_links`, `voucher_seed_cases` не показали data-blocking issues на уровне текущего execution slice;
- наблюдался transient execution noise (`terminated`, `fetch failed`), но он был классифицирован как reliability noise, а не как data truth blocker.

Следовательно, расширенный asset pack строится **поверх уже подтверждённого first live RF slice**.

---

## Зачем нужен расширенный asset pack

First batch подтверждает, что backend/runtime slice жив и данные проходят по основному pipeline.

Но для frontend/UI этого недостаточно, если нужен не только "живой контур", а более убедительный интерфейс:

- richer partner cards;
- richer offer cards;
- featured / category / trust / hero sections;
- empty / guard / restricted / retry states;
- auth-aware surfaces;
- more consistent media-driven layouts;
- сценарные UI states для public / merchant / PRO / vouchers.

Asset pack нужен, чтобы Cursor не достраивал важные UX слои догадками.

---

## Общая структура RF asset pack

Рекомендуемая файловая структура:

### `docs/templates/rf/`

- `rf_categories_v1.csv`
- `rf_subcategories_v1.csv`
- `rf_verification_statuses_v1.csv`
- `rf_offer_badges_v1.csv`
- `rf_partners_extended_v1.csv`
- `rf_partner_highlights_v1.csv`
- `rf_partner_branding_v1.csv`
- `rf_offers_extended_v1.csv`
- `rf_voucher_statuses_v1.csv`
- `rf_pro_links_extended_v1.csv`
- `rf_voucher_cases_extended_v1.csv`
- `rf_featured_collections_v1.csv`
- `rf_featured_collection_items_v1.csv`
- `rf_reviews_showcase_v1.csv`
- `rf_search_aliases_v1.csv`
- `rf_partner_schedule_v1.csv`
- `rf_offer_schedule_rules_v1.csv`
- `rf_faq_v1.csv`
- `rf_ui_scenarios_matrix_v1.csv`
- `rf_media_manifest_v1.csv`

### `docs/content/rf/`

- `rf_ui_microcopy_v1.md`
- `rf_empty_states_v1.md`
- `rf_landing_copy_v1.md`
- `rf_toasts_and_notifications_v1.md`

---

## Tiering

### Tier 1 — must-have for first polished RF frontend

1. `rf_categories_v1.csv`
2. `rf_verification_statuses_v1.csv`
3. `rf_offer_badges_v1.csv`
4. `rf_partners_extended_v1.csv`
5. `rf_offers_extended_v1.csv`
6. `rf_media_manifest_v1.csv`
7. `rf_ui_microcopy_v1.md`
8. `rf_empty_states_v1.md`

### Tier 2 — strongly recommended

9. `rf_partner_highlights_v1.csv`
10. `rf_partner_branding_v1.csv`
11. `rf_voucher_statuses_v1.csv`
12. `rf_pro_links_extended_v1.csv`
13. `rf_voucher_cases_extended_v1.csv`
14. `rf_landing_copy_v1.md`
15. `rf_ui_scenarios_matrix_v1.csv`

### Tier 3 — polish / expansion

16. `rf_subcategories_v1.csv`
17. `rf_featured_collections_v1.csv`
18. `rf_featured_collection_items_v1.csv`
19. `rf_reviews_showcase_v1.csv`
20. `rf_search_aliases_v1.csv`
21. `rf_partner_schedule_v1.csv`
22. `rf_offer_schedule_rules_v1.csv`
23. `rf_faq_v1.csv`
24. `rf_toasts_and_notifications_v1.md`

---

## Batch 1 — taxonomy / badges / verification

### `rf_categories_v1.csv`
Словарь основных бизнес-категорий для каталога, фильтров, featured sections и category chips.

Ключевая задача:
- дать стабильные `business_category_key`;
- дать label / icon / color hints для UI.

### `rf_verification_statuses_v1.csv`
Словарь verification/trust states.

Ключевая задача:
- не заставлять UI придумывать trust badges;
- развести `not_verified`, `pending`, `verified_basic`, `verified_plus`, `featured_partner`.

### `rf_offer_badges_v1.csv`
Словарь offer ribbons / badges.

Ключевая задача:
- стандартизировать `discount`, `gift`, `bundle`, `access`, `invite_only`, `pro_only`, `featured`, `new`, `limited`, `hot`.

---

## Batch 2 — richer partner content

### `rf_partners_extended_v1.csv`
Расширенный dataset по партнёрам для cards / detail / featured / trust / CTA.

Покрывает:
- brand-safe titles;
- description hierarchy;
- contacts;
- hours;
- flags like kids-friendly / booking-required;
- featured ordering;
- verification status.

### `rf_partner_highlights_v1.csv`
Короткие highlight strings для partner cards и detail hero.

### `rf_partner_branding_v1.csv`
UI hints для цветов, visual tone и card themes.

Важно: branding-поля — это не backend truth, а **design hints**.

---

## Batch 3 — richer offer content

### `rf_offers_extended_v1.csv`
Расширенный dataset по offers.

Покрывает:
- short/full titles;
- short/full descriptions;
- badge binding;
- terms and fine print;
- redemption instructions;
- validity windows;
- weekday/time restrictions;
- featured ranking;
- CTA labels;
- `public` / `pro_only` / `invite_only` visibility UX.

### `rf_voucher_statuses_v1.csv`
Словарь voucher statuses для UI.

Рекомендуемые статусы:
- `available`
- `claimed`
- `redeemed`
- `expired`
- `cancelled`
- `replayed`
- `pending`
- `temporarily_unavailable`

---

## Batch 4 — UX copy / empty states / landing content

### `rf_ui_microcopy_v1.md`
Микрокопирайт для:
- loading;
- empty states;
- auth guards;
- not found;
- claim/redeem success;
- replay states;
- temporary failures;
- merchant/pro informational copy.

### `rf_empty_states_v1.md`
Dedicated UX state pack для:
- empty partners;
- empty offers;
- empty vouchers;
- empty pro links;
- missing media;
- temporary unavailable;
- maintenance;
- invite-only guard;
- pro-only guard.

### `rf_landing_copy_v1.md`
Контент для RF hub / landing page:
- hero;
- feature bullets;
- featured sections;
- how it works;
- user / PRO / merchant explainers;
- trust block;
- short FAQ.

---

## Batch 5 — media + UI scenario matrix

### `rf_media_manifest_v1.csv`
Манифест медиа-ассетов.

Назначение:
- привязать asset к entity и UI role (`logo`, `cover`, `gallery`, `card`, `hero`, `icon`, `illustration`);
- не смешивать runtime entities и визуальные файлы хаотично;
- дать Cursor ясную карту визуального слоя.

### `rf_ui_scenarios_matrix_v1.csv`
Один из самых полезных файлов для Cursor.

Назначение:
- зафиксировать, какие **UI states** и **surface states** должны быть поддержаны;
- не ограничиваться happy path;
- покрыть public / merchant / PRO / voucher surfaces.

Рекомендуемые surfaces:
- `public_catalog`
- `partner_detail`
- `offers_catalog`
- `offer_detail`
- `vouchers_page`
- `merchant_dashboard`
- `merchant_offers`
- `merchant_vouchers`
- `pro_dashboard`
- `landing`

Рекомендуемые state types:
- `default`
- `empty`
- `no_results`
- `featured_partner`
- `pending_verification`
- `restricted_pro_only`
- `restricted_invite_only`
- `claim_success`
- `replay_claim`
- `temporary_failure`
- `redeemed_voucher`
- `not_found`
- `missing_media`
- `temporary_error`

---

## Что уже подготовлено в starter pack

На текущем этапе starter content уже определён для:

### Tier 1 / Batch 1
- `rf_categories_v1.csv`
- `rf_verification_statuses_v1.csv`
- `rf_offer_badges_v1.csv`

### Tier 1 / Batch 2
- `rf_partners_extended_v1.csv`
- `rf_partner_highlights_v1.csv`
- `rf_partner_branding_v1.csv`

### Tier 1 / Batch 3
- `rf_offers_extended_v1.csv`
- `rf_voucher_statuses_v1.csv`

### Tier 1 / Batch 4
- `rf_ui_microcopy_v1.md`
- `rf_empty_states_v1.md`
- `rf_landing_copy_v1.md`

### Tier 1 / Batch 5
- `rf_media_manifest_v1.csv`
- `rf_ui_scenarios_matrix_v1.csv`

Это уже даёт достаточно сильный baseline для проектирования **first polished RF frontend slice**.

---

## Как Cursor должен использовать этот asset pack

### 1. Не путать runtime truth и design/content hints

- runtime truth: `partners`, `offers`, `pro_links`, `voucher_seed_cases`, реальные IDs и state;
- asset pack: richer copy / media / categorization / state coverage / UI intent.

### 2. Не использовать `branding` и `microcopy` как backend contract

- `rf_partner_branding_v1.csv`, `rf_ui_microcopy_v1.md`, `rf_empty_states_v1.md`, `rf_landing_copy_v1.md` — это frontend/design layer.

### 3. Считать `rf_ui_scenarios_matrix_v1.csv` рабочим чеклистом UI coverage

Если surface не покрывает указанные state types, slice ещё не завершён product-wise.

### 4. Не переоценивать готовность за пределами Tier 1

Если реализован только Tier 1, это хороший polished baseline, но не full RF UX universe.

---

## Что этот asset pack НЕ доказывает

- Не доказывает, что все surface routes уже live в PWA.
- Не доказывает, что все merchant/PRO surfaces уже переведены с mock на live API.
- Не доказывает reliability/SLO для retry-sensitive flows.
- Не заменяет RF OpenAPI/runtime truth.
- Не заменяет реальную media pipeline/hosting policy.

---

## Minimal recommended next step

1. Положить Tier 1 и Batch 2–5 файлы в репозиторий в указанные директории.
2. Зафиксировать их как **frontend-supporting asset pack**, а не как backend seed source of truth.
3. Дать Cursor отдельную задачу на **first polished RF frontend slice**, явно ссылаясь:
   - на runtime RF baseline;
   - на `rf_first_batch_validation_milestone_note_v1.md`;
   - на этот `rf_asset_pack_note_v1.md`;
   - на Tier 1 + scenario matrix.

---

## Короткий итог

RF asset pack v1 — это bridge между:

- подтверждённым first-batch runtime truth,
- и более зрелым frontend/UI контуром RF Asia.

Он нужен не для расширения backend scope, а для того, чтобы Cursor строил RF frontend на более полном и честном наборе контекстов: **entity content + UX copy + media + state coverage**.


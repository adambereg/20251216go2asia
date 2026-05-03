# RF Asia Voucher Repeatability Policy Decision v1

Статус: architecture decision note, markdown-only.  
Ограничения: без runtime-кода, schema/db изменений, миграций, SQL, OpenAPI/SDK/frontend правок.

## Executive summary

RF Asia должен поддерживать оба бизнес-режима:
- **one-time vouchers/offers**: повторный claim после `redeemed` запрещён в том же scope.
- **repeatable vouchers/offers**: повторный claim после `redeemed` разрешён, если политика offer/campaign это допускает.

Главное решение:
- repeatability не является глобальным правилом `RFVoucher`;
- repeatability должна быть **policy на уровне offer**, с будущими override/extension через `VoucherCampaign` и `VoucherPolicy`;
- Stage 1+2 сохраняет текущую безопасную one-time модель по умолчанию;
- repeatable режим должен быть подготовлен как near-term policy, но не внедряться в runtime в текущем slice.

## Product decision: one-time and repeatable vouchers both exist

### One-time voucher / offer

Примеры:
- welcome bonus;
- first-time discount;
- бонус за первое действие;
- уникальное спецпредложение;
- premium-ваучер, который нельзя получать бесконечно.

Правило:
- после `redeemed` повторный claim того же offer/scope запрещён.

### Repeatable voucher / offer

Примеры:
- бесплатный кофе;
- регулярная скидка в кафе;
- повторяемая услуга;
- партнёрская акция, доступная несколько раз.

Правило:
- после `redeemed` пользователь может получить новый ваучер по тому же offer/scope, если `repeatPolicy` это разрешает.

## Current runtime behavior

Текущая реализация фактически one-time:

- `rf_voucher.status`: `claimed`, `redeemed`, `cancelled`.
- Partial unique indexes включают `status IN ('claimed', 'redeemed')`.
- Это блокирует повторный claim после `redeemed` в том же scope.
- `cancelled` не входит в индекс и не блокирует повторный claim.

Partner-scope:
- уникальность по `(offer_id, issued_to_user_id)` при `claim_scope = 'partner'`.

Listing-scope:
- уникальность по `(rielt_listing_id, offer_id, issued_to_user_id)` при `claim_scope = 'listing'`.

Следствие:
- на другом listing тот же offer может иметь отдельный listing-scoped voucher;
- в том же listing повтор после `redeemed` сейчас запрещён.

## Domain placement options

## Option A — field on `rf_offer`

Суть:
- хранить базовую repeatability на offer.

Плюсы:
- claim уже привязан к `offerId`;
- бизнес-партнёр/PRO управляет предложением;
- простой MVP-контракт;
- удобно для RF/Rielt listing offers UI.

Минусы:
- campaign-specific overrides требуют отдельного слоя позже.

## Option B — field on `VoucherCampaign`

Суть:
- repeatability зависит от кампании.

Плюсы:
- хорошо для временных акций, бюджетов, периодов.

Минусы:
- `VoucherCampaign` ещё не baseline runtime;
- усложняет MVP;
- не все repeatable offers являются campaign-driven.

## Option C — `VoucherRule` / `VoucherPolicy`

Суть:
- repeatability как policy/rule layer.

Плюсы:
- расширяемо;
- подходит для VIP/PRO/Points/NFT gates.

Минусы:
- слишком тяжело для Stage 1+2;
- простой once/repeat рискованно прятать в generic rule engine.

## Option D — combined model

Суть:
- простой default на `rf_offer`;
- campaign/policy overrides позже.

Плюсы:
- MVP остаётся простым;
- не блокирует сложные правила;
- соответствует будущей domain readiness модели.

Минусы:
- нужен явный resolver правил позже.

Recommendation:
- **Option D**.

## Recommended policy model

Stage 1+2:
- не ломать текущую one-time модель;
- зафиксировать `repeatPolicy` как future/near-term policy на `PartnerOffer`;
- не внедрять runtime enforcement сейчас.

Near-term domain model:

```text
PartnerOffer.repeatPolicy = once_per_scope | repeat_after_redeem
```

Future resolver:

```text
effectiveRepeatPolicy = resolve(offerDefault, campaignOverride, voucherPolicyRules)
```

Placement:
- базовое правило: `rf_offer`;
- временные акции/бюджеты: `VoucherCampaign`;
- сложные eligibility/gates: `VoucherPolicy`.

## Minimal v1 repeat policy set

Рекомендуемый минимальный набор:

- `once_per_scope`
- `repeat_after_redeem`

Default:
- `once_per_scope`

Semantics:
- `once_per_scope`: текущая модель; `redeemed` блокирует новый claim в том же scope.
- `repeat_after_redeem`: новый claim разрешён после terminal `redeemed`, если нет активного non-terminal voucher.

Отложить:
- `once_per_period`
- `cooldown_based`
- `limited_count`
- `unlimited`
- `max_redemptions_per_user`
- campaign windows

Причина:
- эти варианты требуют отдельного policy/campaign layer и UI/QA больше, чем Stage 1+2.

## Partial unique index impact

Текущий индексный смысл:

```sql
status IN ('claimed', 'redeemed')
```

Contract draft для canonical status предложил:

```sql
canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
```

Это сохраняет one-time default, потому что `redeemed` продолжает блокировать новый claim.

Repeatable проблема:
- если просто убрать `redeemed` из индекса, repeatable станет возможным;
- но one-time offers потеряют DB-level защиту;
- application-level check без DB guard создаёт race-condition риск.

Важное ограничение PostgreSQL:
- partial unique index на `rf_voucher` не может делать join к `rf_offer.repeat_policy`;
- если policy живёт на offer, DB constraint не сможет напрямую проверить её в partial predicate.

Следствие:
- для policy-aware uniqueness нужна либо денормализация policy snapshot на `rf_voucher`, либо отдельная guard/ledger таблица.

## Recommended index/guard strategy

Рекомендованная стратегия для Go2Asia:

### Stage 1+2

Оставить one-time default:

```sql
canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
```

Причина:
- сохраняет текущую безопасность;
- не ломает Rielt voucher flow;
- не меняет Connect summary semantics внезапно;
- не вводит repeatability без policy enforcement.

### Near-term repeatable support

Добавить policy-aware слой:

1. `rf_offer.repeat_policy` как SSOT базового правила.
2. `rf_voucher.repeat_policy_snapshot` или `claim_mode_snapshot` при выдаче.
3. Индекс/guard использует только колонки `rf_voucher`.
4. Runtime claim проверяет:
   - нет активного non-terminal voucher;
   - если `once_per_scope`, успешный historical `redeemed` блокирует новый claim;
   - если `repeat_after_redeem`, historical `redeemed` не блокирует новый claim.

### Possible DB shape later

Вариант 1: snapshot field on `rf_voucher`

```text
rf_voucher.repeat_policy_snapshot
```

Плюс:
- понятно, какая политика действовала при claim.

Минус:
- уникальный индекс всё ещё сложен, если одна и та же key-комбинация должна вести себя по-разному в зависимости от snapshot.

Вариант 2: separate claim guard / ledger

```text
rf_voucher_claim_guard
```

Possible key:
- `user_id`
- `offer_id`
- `claim_scope`
- `rielt_listing_id`
- `repeat_policy`
- `claim_cycle`
- `terminal_consumed_at`

Плюс:
- можно хранить one-time consumption отдельно от voucher instances.
- проще обеспечить race-safe DB-level guard для one-time.

Минус:
- дополнительная таблица и lifecycle coordination.

Recommended later:
- начать с `repeat_policy` на offer + active-only uniqueness для repeatable;
- для one-time сохранить race-safe guard через existing redeemed-in-index или отдельный guard table, когда repeatable реально внедряется.

## Migration draft impact

Текущий document:
- `docs/architecture/domain/rf-asia-stage-1-2-contract-diff-and-migration-draft-v1.md`

Текущая recommendation:

```sql
canonical_status IN ('available', 'locked', 'unlocked', 'redeemed')
```

Decision:
- **не менять текущий migration draft сейчас**.

Почему:
- Stage 1+2 должен сохранить текущую безопасную one-time модель;
- repeatability требует отдельного policy-aware implementation;
- простое исключение `redeemed` из индекса сейчас изменило бы бизнес-поведение для всех offers.

Нужно зафиксировать как warning для future implementation:
- включение `redeemed` в canonical partial index означает one-time default;
- repeatable support потребует отдельного diff по indexes/guards;
- нельзя полагаться только на application-level check для one-time.

## OpenAPI/SDK future diff

Не менять OpenAPI/SDK сейчас.

Future `RfOffer` additions:

```yaml
repeatPolicy:
  type: string
  enum:
    - once_per_scope
    - repeat_after_redeem
```

Future optional fields:
- `repeatLimit`
- `repeatPeriod`
- `repeatCooldownSeconds`
- `maxRedemptionsPerUser`

Но для Stage 1+2:
- только `repeatPolicy` как minimal future field.

Future `RfVoucher` additions:
- `repeatPolicySnapshot`
- `claimCycle` or `issueSequence` (if repeatable instances need ordering)

Future read-model / eligibility fields:
- `canClaimAgain`
- `nextClaimAvailableAt`
- `remainingClaims`
- `repeatabilityLabel`

Future `RfRieltListingOffer`:
- include offer repeat policy;
- optionally include user-specific eligibility if endpoint becomes authenticated.

Important compatibility:
- old clients can ignore repeat fields;
- generated SDK gets additive optional fields;
- manual wrapper `packages/sdk/src/rf.ts` must not hard-code one-time assumptions forever.

## Backend runtime future diff

Do not change runtime in this pass.

Future impacted areas in `apps/rf-service`:

### Claim logic

Need:
- resolve effective repeat policy from offer/campaign/policy;
- check existing vouchers by scope and canonical status;
- block repeat for `once_per_scope`;
- allow new claim after `redeemed` for `repeat_after_redeem`;
- preserve idempotency by request key.

### `getClaimableVoucher`

Current behavior:
- treats `claimed/redeemed` as blocking.

Future behavior:
- for `once_per_scope`: blocking statuses include historical `redeemed`;
- for `repeat_after_redeem`: only active non-terminal statuses block a new claim.

### Listing-scope claim

Must preserve:
- Rielt mapping validation;
- `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- uniqueness granularity `(listing, offer, user)`.

Repeat behavior:
- repeat applies within listing scope, not across all listings unless policy says otherwise.

### Redeem

Redeem should:
- create redemption record;
- transition voucher to `redeemed`;
- open eligibility for repeatable offers only after successful redeem.

### Summary

Current summary counts voucher rows.

Future impact:
- repeatable offers create multiple voucher rows over time;
- `totalVouchers` and `usedVouchers` can increase for same offer;
- if product needs unique-offer summary, add separate fields later.

### Idempotency

Claim idempotency remains about network/retry replay.

Do not confuse:
- idempotency key replay;
- repeatability policy;
- one-time business guard.

## Frontend/product impact

No frontend changes now.

Future minimal UX:

### RF listing voucher page

Current:
- used voucher can still disable button because UI treats `claimed || redeemed` as already obtained.

Future:
- use backend eligibility (`canClaimAgain`) instead of local guess.
- show "Можно получить снова после использования" for repeatable offers.

### RF my-vouchers

Future:
- allow multiple voucher cards for same offer/scope over time;
- show dates and status clearly;
- avoid presenting repeats as duplicate bug.

### Rielt listing CTA

Keep route unchanged.

Future:
- listing voucher page owns repeat eligibility;
- Rielt CTA does not need to understand repeat rules deeply.

### Connect summary

Future:
- counts may reflect multiple voucher instances;
- add unique-offer metrics only if product needs it.

### Merchant/PRO UI

Future:
- business/merchant UI should allow selecting repeat policy.

Not for Stage 1+2:
- full partner console;
- complex campaign editor;
- reward engine.

## Tests/QA implications

Future tests:

- one-time: claim -> redeem -> second claim blocked.
- repeatable: claim -> redeem -> second claim allowed.
- repeatable: claim while active voucher exists blocked.
- cancelled: repeat claim allowed according to existing behavior.
- listing-scope: repeat applies per `(listing, offer, user)`.
- partner-scope: repeat applies per `(offer, user)`.
- concurrent claim race for one-time offers.
- concurrent claim race for repeatable offers.
- idempotency replay with same key returns same voucher.
- different keys after redeem follow repeat policy.
- summary counts repeatable voucher instances correctly.
- Rielt listing voucher regression.
- Connect summary regression.

QA notes:
- verify UI does not call repeatable vouchers "duplicates";
- verify redeemed one-time still blocks claim;
- verify repeat policy defaults to one-time for all existing data.

## Non-goals

Not in this pass:
- runtime implementation.
- schema/db changes.
- migrations.
- SQL execution.
- OpenAPI/SDK updates.
- frontend changes.
- full cooldown/period/limited-count engine.
- premium unlock.
- Points + NFT/totem.
- PRO rewards.
- Blockchain Gateway/on-chain.
- DAO.
- full merchant console.

## Final recommendation

Recommended repeat policy placement:
- **basic repeat policy on `rf_offer`**;
- campaign overrides later via `VoucherCampaign`;
- complex gates later via `VoucherPolicy`.

Recommended default:
- `once_per_scope`.

Recommended minimal v1 policy set:
- `once_per_scope`
- `repeat_after_redeem`

What to do with `redeemed` in canonical partial index:
- keep `redeemed` included for Stage 1+2;
- this preserves current one-time default.

Does current migration draft need to change now?
- **No**.
- Keep the draft as-is, but treat redeemed-in-index as an explicit one-time default.
- Add repeatability as a separate future policy/index/guard implementation, not as a silent change to Stage 1+2.

Recommended next implementation task:
- before implementing repeatable offers, create a focused **repeatability schema RFC** covering:
  - `rf_offer.repeat_policy`;
  - `rf_voucher.repeat_policy_snapshot`;
  - active-only uniqueness vs one-time guard;
  - race-safe DB constraint strategy;
  - eligibility response fields for UI.

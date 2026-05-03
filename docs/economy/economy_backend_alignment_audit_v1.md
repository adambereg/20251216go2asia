# Economy Backend Alignment Audit v1

Status: audit / discovery / planning pass  
Scope: backend services, OpenAPI/SDK contracts, database schema/migrations, and backend assumptions that affect the Go2Asia Economy SSOT.  
Date: 2026-05-02

## Executive Summary

Текущий backend частично соответствует новому Economy SSOT. В системе уже есть полезный фундамент: off-chain Points ledger, idempotent points transactions, RF voucher claim/redeem records, referral tree, quest reward outbox, RF partner / PRO attribution and listing-scoped voucher claims. Также в backend не найдено реализации платформенной комиссии с ваучеров, квестов, аренды, услуг партнёров или RF-товаров, что соответствует SSOT.

Главный разрыв: backend пока реализует points/rewards как один общий баланс и набор M2/M3/Phase 2 actions, а Economy SSOT требует экономический кошелёк с bucket-моделью `available / locked / network-generated`, VIP activation layer, premium voucher как `Points + NFT`, NFT used/burn semantics, PRO reward triggers and G2A ledger boundary.

Главные риски:

- Wallet и Connect не смогут честно показать VIP Value System: нет locked/network buckets, estimated unlock value, VIP spend unlock и network yield.
- Referral flow противоречит SSOT: бонус рефереру начисляется на first login реферала, сразу в обычный Points balance и по default `100`, а SSOT требует `+5000 locked` до первой покупки VIP приглашённым рефералом.
- RF premium voucher сейчас является только `basic | premium` label на listing-offer mapping; backend не проверяет `Points + NFT`, не списывает Points и не помечает NFT as used/burned.
- OpenAPI/SDK не содержит контрактов для VIP/PRO activation, wallet buckets, NFT inventory, G2A reward ledger, premium voucher requirements и quest purchase economy.
- `points-service` допускает actions `rf_voucher_claimed` / `rf_voucher_redeemed`, но `rf-service` не производит points события при claim/redeem.

Главный следующий implementation slice: **Slice 1 - Wallet / Points buckets baseline**. До premium voucher, G2A и gateway нужно стабилизировать внутренний ledger и wallet summary: `available`, `locked`, `networkGenerated`, VIP status, spend eligibility and unlock estimates.

## Economy SSOT Baseline

Audit опирался на следующие SSOT-файлы:

- `docs/economy/README.md`
- `docs/economy/tokenomics/go2asia_tokenomiks_v1.md`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`
- `docs/economy/vip/vip_value_system_v1.md`
- `docs/economy/points/points_sink_design_v1.md`

Примечание: `README.md` ссылается на `docs/economy/tokenomics/go2asia_tokenomics_v1.md`, но фактический файл в репозитории называется `go2asia_tokenomiks_v1.md`. Это naming hygiene issue, не экономический конфликт.

Каноничные правила, использованные в audit:

- Go2Asia - двухконтурная экономика: внутренний off-chain контур Points, внешний контур G2A/on-chain NFT через Blockchain Gateway boundary.
- Платформа зарабатывает только на VIP `1000 руб / 30 дней` и PRO `30000 руб / год`.
- Платформа не берёт комиссию с ваучеров, premium vouchers, квестов, товаров, услуг, аренды, массажа, завтраков, экскурсий и других офлайн-услуг.
- Оплата товаров/услуг партнёров происходит напрямую бизнес-партнёру или PRO, вне платежной экономики Go2Asia.
- Через Go2Asia оплачиваются VIP, PRO, ваучеры за Points, premium vouchers за `Points + рядовой NFT`, квесты за Points или частично Points; денежная часть квеста идёт напрямую PRO.
- Voucher не является источником прямой выручки платформы. Это sink для Points, контакт с бизнесом, маркетинговый инструмент партнёра, G2A trigger and VIP value driver.
- VIP - Economic Activation Layer: unlock spend, unlock accumulated locked referral Points, unlock network economy `10% / 2%`.
- Базовые earn-механики: publication `+1000 Points`, like чужой публикации `+1`, like на свою публикацию `+1`, referral invite `+5000 locked`.
- Points buckets: `available`, `locked`, `network-generated`.
- Points sinks: ordinary vouchers, premium vouchers, PRO quests, Points to ordinary NFT, NFT upgrade/burn/used-flag.
- Premium voucher requires `Points + ordinary NFT` and must consume/burn/mark the NFT as used.
- PRO can receive G2A rewards after defined conditions, e.g. third purchase of voucher / premium voucher / quest.
- Business partner does not pay platform commission; partner can receive G2A compensation for premium vouchers.
- MVP communication model is voucher-first signal/repost in Space, not mandatory chat-first inquiry.

## Current Backend Map

### Services checked

Existing backend/workers under `apps/`:

- `apps/api-gateway`
- `apps/auth-service`
- `apps/content-service`
- `apps/feed-service`
- `apps/guru-service`
- `apps/media-service`
- `apps/organizer-service`
- `apps/points-service`
- `apps/quest-service`
- `apps/reactions-service`
- `apps/referral-service`
- `apps/rf-service`
- `apps/rielt-service`
- `apps/space-service`
- `apps/token-service`

Not found as separate backend services:

- `apps/wallet-service`
- `apps/connect-service`
- `apps/payment-service`
- `apps/voucher-service`
- `apps/blockchain-gateway`

### Backend endpoints and modules found

- `apps/points-service/src/index.ts`
  - `GET /v1/points/balance`
  - `GET /v1/points/transactions`
  - `GET /v1/points/connect-dashboard`
  - `GET /v1/points/badges`
  - `GET /v1/points/badges/mine`
  - `POST /internal/points/add`
  - `POST /internal/points/badges/award`
  - Current balance model reads/writes one `user_balances.balance`.

- `apps/referral-service/src/index.ts`
  - `GET /v1/referral/code`
  - `GET /v1/referral/stats`
  - `GET /v1/referral/tree`
  - `GET /v1/referral/earnings`
  - `POST /v1/referral/claim`
  - `POST /internal/referral/generate-code`
  - `POST /internal/referral/mark-first-login`
  - `POST /internal/referral/link`
  - Current first-login referral bonus calls `points-service` with action `referral_bonus_referrer`.

- `apps/rf-service/src/routes/rf.ts` and `apps/rf-service/src/store.ts`
  - Public RF partners/offers.
  - Partner-scoped voucher claim: `POST /v1/rf/offers/:id/claim`.
  - Listing-scoped voucher claim: `POST /v1/rf/rielt/listings/:listingId/offers/:offerId/claim`.
  - My vouchers and summary.
  - Partner voucher redeem.
  - PRO links.
  - Listing offer kind exists as `basic | premium`, but without Points/NFT requirements.

- `apps/quest-service`
  - Quest lifecycle, submissions, progress and reward delivery.
  - `quest_reward_outbox` delivers positive Points on `quest_completed`.
  - No quest purchase / Points spend / direct PRO monetary boundary found.

- `apps/token-service/src/index.ts`
  - Health/readiness/version only.
  - No G2A, NFT, wallet, bridge, mint, burn, transfer, or gateway behavior found.

- `apps/api-gateway/src/index.ts`
  - Proxies `/v1/points/*`, `/v1/referral/*`, `/v1/quest/*`, `/v1/rf/*`, `/v1/rielt/*`, `/v1/space/*` and other service prefixes when configured.
  - No `TOKEN_SERVICE_URL` routing found.

- `apps/space-service`
  - Space posts/reposts/activity projection exist.
  - No points producer found for `space_post_created` / `space_repost_created`.

- `apps/rielt-service`
  - Rielt listings/inquiries and optional RF refs exist.
  - No points producer found for `rielt_listing_created`.

### OpenAPI / SDK map

Expected path `packages/api-contract/openapi.yaml` was not found.

Actual OpenAPI source files:

- `docs/openapi/openapi.yaml`
- `docs/openapi/auth.yaml`
- `docs/openapi/content.yaml`
- `docs/openapi/feed.yaml`
- `docs/openapi/guru.yaml`
- `docs/openapi/points.yaml`
- `docs/openapi/quest.yaml`
- `docs/openapi/referral.yaml`
- `docs/openapi/reactions.yaml`
- `docs/openapi/rf.yaml`
- `docs/openapi/rielt.yaml`
- `docs/openapi/space.yaml`

Generated/bundled artifacts:

- `docs/openapi/openapi.bundle.yaml`
- `packages/types/src/generated/`
- `packages/sdk/src/generated/`

Generation config:

- `orval.config.ts`
- `scripts/openapi_bundle.mjs`

Key contract facts:

- `docs/openapi/points.yaml` defines `UserBalance` as one `balance`, not wallet buckets.
- `docs/openapi/points.yaml` has `PointsAction` described as Phase 2 Points-only and explicitly excludes Phase 3 tokenomics `G2A/NFT/on-chain`.
- `docs/openapi/referral.yaml` exposes referral earnings with `pointsAction: referral_bonus_referrer` only.
- `docs/openapi/rf.yaml` exposes RF vouchers and listing offers; `RfRieltListingOffer.type` has `basic | premium`, but no Points/NFT requirement.
- No OpenAPI contracts found for VIP activation, PRO yearly activation, NFT inventory, NFT burn/used, G2A ledger, Blockchain Gateway boundary, or quest purchase economy.

### Database schema / migrations map

Key schema files:

- `packages/db/src/schema/auth.ts`
- `packages/db/src/schema/points.ts`
- `packages/db/src/schema/referral.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/rielt.ts`
- `packages/db/src/schema/quest.ts`

Key migrations:

- `packages/db/migrations/0000_dapper_hercules.sql`
  - `users`
  - `points_transactions`
  - `user_balances`
  - `referral_links`
  - `referral_relations`
  - base badges.

- `packages/db/migrations/0018_quest_core_v1.sql`
  - Quest core tables.

- `packages/db/migrations/0019_rielt_core_v1.sql`
  - Rielt listing core.

- `packages/db/migrations/0020_rf_core_v1.sql`
  - RF partners, offers, vouchers, claim idempotency, PRO links.

- `packages/db/migrations/0038_rielt_rf_refs_optional_v1.sql`
  - Optional RF refs on `rielt_listing`.

- `packages/db/migrations/0043_quest_reward_outbox_v1.sql`
  - Quest reward outbox for points delivery.

- `packages/db/migrations/0044_badge_baseline_foundation_v1.sql`
  - Badge/user badge baseline extensions.

- `packages/db/migrations/0045_rf_rielt_listing_offer_mapping_v1.sql`
  - `rielt_listing_rf_offer` with `offer_kind = basic | premium`.

- `packages/db/migrations/0046_rf_voucher_listing_claim_scope_v1.sql`
  - Listing-scoped voucher claim fields.

- `packages/db/migrations/0047_rf_voucher_scope_aware_unique_indexes_v1.sql`
  - Scoped active voucher uniqueness by partner/listing.

Important DB facts:

- `points_transactions.external_id` is unique.
- `user_balances` has a single `balance`.
- `referral_relations` supports tree and `first_login_at`, but no first-VIP-purchase unlock.
- `rf_voucher` supports claim/redeem/cancel and listing scope.
- `rielt_listing_rf_offer.offer_kind` supports `basic | premium`, but has no Points/NFT requirement fields.
- `user_badges` exists, but no NFT inventory, on-chain status, consumed, burned, or used flag.
- No G2A reward ledger tables found.
- No external/on-chain bridge records found.
- No platform commission schema found.

## Alignment Matrix

| Area | Current state | Economy SSOT requirement | Status | Risk | Suggested action |
|---|---|---|---|---|---|
| VIP status | Role vocabulary includes `vip_spacer` in auth/gateway domain, but no VIP entitlement/subscription lifecycle, price, expiry, or spend unlock contract. | VIP costs `1000 руб / 30 дней` and unlocks spend, locked value and network economy. | partial | VIP can become a UI label, not an enforceable economic state. | Add explicit VIP entitlement model, expiry, wallet summary exposure and spending gate. |
| PRO status | `pro` role and RF PRO links exist; quest management checks PRO/admin. No yearly PRO activation/payment lifecycle. | PRO costs `30000 руб / год`, curates partners/vouchers/quests and can receive conditional G2A rewards. | partial | Partner operator role may exist without economic activation and reward accounting. | Add PRO entitlement/payment boundary and separate it from RF partner links. |
| Points ledger | `points_transactions` with idempotent `external_id`; `POST /internal/points/add`; signed deltas supported. | Off-chain Points ledger is internal SSOT for accrual and spending. | aligned | Baseline is useful, but currently earn-heavy and not bucket-aware. | Keep ledger as foundation; extend with bucket/category semantics before new sinks. |
| Locked Points | No locked balance table/field; referral first login bonus is immediately added to normal balance. | Referral invite gives `+5000 locked`, unlocked after invited user's first VIP purchase. | conflict | Core VIP pressure and unlock value cannot work. | Introduce locked ledger/balance and unlock event keyed to referred user's first VIP purchase. |
| Network-generated Points | No network bucket; referral earnings endpoint only shows first-login referrer bonus. | VIP receives `10%` from direct referrals and `2%` from subreferrals. | missing | VIP network layer is not measurable or enforceable. | Add network accrual records, VIP eligibility checks and wallet bucket exposure. |
| Referral accrual | Referral tree exists; `mark-first-login` awards default `100` Points to referrer via `referral_bonus_referrer`. | `+5000 locked` referral Points; unlock after first VIP purchase; VIP network `10% / 2%`. | conflict | Current reward moment, amount and bucket contradict SSOT. | Replace first-login spendable bonus with locked referral grant and add VIP purchase unlock. |
| Wallet summary | `GET /v1/points/balance` and `GET /v1/points/connect-dashboard` exist, but expose one balance and dashboard aggregates. | Wallet must show available Points, locked Points, network-generated Points, estimated unlock value, VIP/PRO status, NFT inventory and spend options. | partial | Frontend cannot sell VIP using SSOT pressure mechanics. | Create `wallet summary` contract or evolve connect dashboard with buckets and status. |
| Voucher claim | RF partner/listing voucher claim exists with idempotency and scoped uniqueness. No points debit in `rf-service`. | Ordinary voucher is claimed for Points by VIP; no money goes through platform. | partial | Voucher can be claimed without actual Points sink; VIP spend value is weak. | Add Points debit/authorization flow for ordinary voucher claim after wallet baseline. |
| Premium voucher | `basic | premium` offer kind exists in RF listing mapping. No NFT or points requirement. | Premium voucher requires Points + ordinary NFT and gives stronger preference. | partial | Premium label can be used without economic scarcity. | Add premium requirement model, NFT check, Points debit and premium claim record. |
| NFT inventory | Badges and `user_badges` exist. No NFT inventory/on-chain/local distinction. | Ordinary NFTs can be earned or exchanged for Points and used for premium voucher access. | partial | Badges may be mistaken for consumable NFTs without lifecycle guarantees. | Define local NFT inventory separate from badges or extend badges with NFT lifecycle fields. |
| NFT burn/used | No consumed/burned/used flag found. | NFT used for premium voucher must be consumed/burned/marked as used. | missing | Premium voucher can become non-sink and inflate value. | Add irreversible used/burn state and transactional claim + NFT consume flow. |
| Quest purchase | Quest core and reward outbox exist; quest completion grants Points. No purchase/unlock for Points or partial direct PRO payment boundary. | PRO quests are Points sinks; any monetary part is paid directly to PRO, not platform. | partial | Quest module currently rewards but does not function as an economy sink. | Add quest access/purchase records with Points debit and explicit direct-PRO-money boundary. |
| RF partner flow | RF partners, offers, vouchers, PRO links and listing-scoped claim exist. No platform payment flow found. | Business partner gets clients and direct payment; no platform commission; premium can trigger G2A compensation. | aligned / partial | Partner flow is structurally close, but premium/G2A economics are absent. | Keep no-commission boundary; add premium/G2A trigger records later. |
| Business payment boundary | No backend payment service or partner-service checkout found; only frontend/mock payment method labels. | Goods/services are paid directly to partner or PRO outside Go2Asia. | aligned | Boundary is aligned but not explicitly documented in contracts. | Add contract/documentation fields that clarify `paymentOutsidePlatform` where needed. |
| Platform monetization boundary | No commission/take-rate implementation found. No VIP/PRO payment implementation either. | Platform monetizes only VIP and PRO. | partial | No conflict, but monetization product is missing. | Add VIP/PRO entitlement and payment webhooks without adding marketplace commissions. |
| G2A reward triggers | No G2A ledger, trigger records or gateway behavior. | PRO/business can receive G2A rewards after defined trigger conditions, e.g. third purchase. | missing | External contour cannot be reconciled or delayed safely. | Add pending G2A reward ledger before any on-chain transfer. |
| Blockchain Gateway boundary | `token-service` is health-only; no gateway route, bridge records or OpenAPI. | Blockchain Gateway handles G2A/on-chain NFT after internal ledger is stable. | missing | Future chain work has no bounded interface or reconciliation model. | Define boundary only after internal wallet/voucher ledgers are stable. |
| Analytics / metrics | Some dashboard aggregates exist; no Spend Rate, locked share, premium share, first redeem in 24h, G2A reconciliation metrics. | Economy requires Spend Rate and VIP/Points health metrics. | missing | Product cannot detect inflation, weak sinks or VIP value failure. | Add metrics queries/events after wallet and voucher debit baseline. |

## Conflict List

Hard conflicts with Economy SSOT:

1. `apps/referral-service/src/index.ts` awards referrer bonus on referee first login, not on first VIP purchase. SSOT says referral bonus is `+5000 locked` and unlocks after invited referral's first VIP purchase.

2. `apps/referral-service/src/index.ts` defaults `REFERRAL_FIRST_LOGIN_BONUS` to `100`. SSOT baseline says invite referral reward is `+5000 Points`, locked.

3. `apps/points-service/src/index.ts` and `packages/db/src/schema/points.ts` maintain one `user_balances.balance`. SSOT requires `available`, `locked` and `network-generated` buckets.

4. `docs/openapi/points.yaml` exposes `UserBalance.balance` only. This conflicts with VIP Value System wallet requirements and prevents a contract-level wallet summary.

5. `docs/openapi/referral.yaml` exposes referral earnings as `referral_bonus_referrer` only. SSOT requires locked referral value plus `10% / 2%` network-generated VIP accrual.

6. `apps/rf-service/src/store.ts` supports claiming RF vouchers without observed Points debit. SSOT says ordinary vouchers are claimed for Points, with VIP spend unlock.

7. `apps/rf-service/src/store.ts`, `docs/openapi/rf.yaml` and `packages/db/migrations/0045_rf_rielt_listing_offer_mapping_v1.sql` represent premium as `basic | premium` offer kind only. SSOT says premium voucher requires `Points + ordinary NFT`.

8. No NFT used/burn/consume flag or transactional premium claim consumption exists. SSOT says NFT used for premium voucher must be consumed/burned/marked used.

9. `points-service` allows actions `rf_voucher_claimed` and `rf_voucher_redeemed`, but `rf-service` does not emit them. This creates a contract/runtime mismatch for voucher economy events.

10. `docs/openapi/points.yaml` says Phase 3 tokenomics actions `G2A/NFT/on-chain` are intentionally excluded from `PointsAction`. This is not wrong if kept as Points-only taxonomy, but it conflicts with using `PointsAction` as the only economy event surface.

No hard conflict found for platform commission: no backend implementation of platform commission / take rate on vouchers, quests or partner services was found.

## Missing Backend Capabilities

Required for Economy SSOT to work:

- Wallet buckets: `available`, `locked`, `networkGenerated`.
- Wallet summary endpoint/contract with VIP status, PRO status, estimated unlock value, NFT inventory and spend options.
- VIP entitlement lifecycle: price, start, expiry, renewal, active/inactive status.
- PRO entitlement lifecycle: yearly activation, expiry and operator eligibility.
- Locked referral grant: `+5000 locked` per invited referral.
- Unlock trigger after referred user's first VIP purchase.
- Network accrual engine: direct referral `10%`, subreferral `2%`, gated by active VIP.
- Voucher Points debit flow with idempotency.
- Voucher claim event/signal/repost integration boundary with Space.
- Premium voucher requirement model: Points cost + ordinary NFT.
- Local NFT inventory or consumable badge/NFT model.
- NFT used/burn flag and transactional premium voucher consumption.
- Quest purchase/access records for Points sink.
- Explicit boundary for any direct PRO monetary part of quest purchase.
- PRO / partner G2A reward trigger ledger.
- Pending G2A reward state before any on-chain transfer.
- Blockchain Gateway boundary records: events, tx hash, chain id, status, reconciliation.
- Economy analytics: Points earned/spent, Spend Rate, locked share, premium voucher share, first redeem in 24h, VIP conversion/retention, G2A reconciliation error.

## Recommended Sequencing

### Slice 1 - Wallet / Points buckets baseline

Goal: make internal economy visible and enforceable before adding new sinks.

Scope:

- Extend points model with `available`, `locked`, `networkGenerated` buckets or equivalent ledger categories.
- Add/extend wallet summary response.
- Expose VIP status and spend eligibility.
- Expose locked total and estimated unlock value.
- Keep existing `points_transactions` idempotency.

Avoid:

- No G2A/on-chain implementation.
- No premium voucher mechanics yet.
- No mass frontend rewrite.

### Slice 2 - Referral accrual baseline

Goal: align referral economics with VIP activation.

Scope:

- Replace first-login spendable referrer bonus with `+5000 locked` referral grant.
- Add unlock after invited user's first VIP purchase.
- Add VIP-gated network accrual: `10%` direct, `2%` second line.
- Preserve idempotency via stable external ids.

Avoid:

- No deep anti-fraud platform in this slice beyond data hooks and idempotency.
- No generic multi-level MLM abstraction beyond SSOT depth 2.

### Slice 3 - Voucher claim economy baseline

Goal: turn ordinary RF voucher claim into a real Points sink without adding money through Go2Asia.

Scope:

- Add ordinary voucher Points cost model.
- Enforce VIP spend eligibility if required by SSOT.
- Debit Points idempotently on claim.
- Record claim as voucher economy event.
- Emit/create system signal/repost boundary for Space with user, partner and PRO tags.
- Keep partner payment outside platform.

Avoid:

- No platform commission.
- No checkout for partner services.
- No chat-first mandatory inquiry.

### Slice 4 - Premium voucher baseline

Goal: implement premium voucher as scarce high-value sink.

Scope:

- Add premium voucher requirement: Points + ordinary NFT.
- Add NFT inventory lookup.
- Add transactional Points debit + NFT used/burn flag.
- Record premium claim separately enough for future G2A trigger.

Avoid:

- No immediate on-chain transfer.
- No direct Points to G2A user exchange.

### Slice 5 - PRO / Partner reward trigger baseline

Goal: create reliable off-chain trigger ledger before G2A distribution.

Scope:

- Count third purchase trigger for ordinary voucher, premium voucher and quest where applicable.
- Attribute reward to PRO and/or business partner.
- Create `pending` G2A reward ledger entries.
- Include reason, source claim/purchase ids and idempotency keys.

Avoid:

- No on-chain mint/transfer yet.
- No treasury coefficients hardcoded into unrelated service logic.

### Slice 6 - Blockchain Gateway boundary

Goal: connect external contour only after internal ledger and reward triggers are stable.

Scope:

- Define Gateway API/event contract.
- Define outbox/reconciliation table.
- Include chain id, tx hash, wallet, status, retry, failure reason and daily reconciliation.
- Define limits, manual review and treasury controls.

Avoid:

- No DAO.
- No broad marketplace tokenization.
- No on-chain writes from high-frequency Points events.

## Proposed Files To Change Later

Do not change these without separate implementation approval:

- `apps/points-service/src/index.ts`
- `apps/referral-service/src/index.ts`
- `apps/referral-service/src/bonus.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `apps/quest-service/src/routes/quests.ts`
- `apps/quest-service/src/services/questService.ts`
- `apps/api-gateway/src/index.ts`
- `apps/token-service/src/index.ts`
- `apps/space-service/src/services/spaceService.ts`
- `apps/rielt-service/src/services/rieltService.ts`
- `docs/openapi/points.yaml`
- `docs/openapi/referral.yaml`
- `docs/openapi/rf.yaml`
- `docs/openapi/quest.yaml`
- `docs/openapi/openapi.yaml`
- `docs/openapi/openapi.bundle.yaml`
- `packages/types/src/generated/`
- `packages/sdk/src/generated/`
- `packages/db/src/schema/points.ts`
- `packages/db/src/schema/referral.ts`
- `packages/db/src/schema/rf.ts`
- `packages/db/src/schema/quest.ts`
- New migration(s) under `packages/db/migrations/`
- Potential new schema modules for wallet, VIP/PRO entitlement, NFT inventory, G2A ledger and bridge records.

Potential DB hygiene files:

- `packages/db/migrations/0038_rielt_rf_refs_optional_v1.sql`
- `packages/db/migrations/0045_rf_rielt_listing_offer_mapping_v1.sql`
- `packages/db/migrations/meta/*`

Reason:

- `0038` has less idempotent `ALTER TABLE ... ADD COLUMN` style than later migrations.
- RF listing offer mapping and legacy `rielt_listing.rf_partner_id / rf_offer_id` create two representations that can drift.
- `rielt_listing_rf_offer.listing_id` is text without DB-level FK to `rielt_listing`.
- Drizzle meta snapshots may lag later SQL migrations if team relies on drizzle tooling.

These DB hygiene items are real risks, but they are not the first Economy SSOT implementation slice unless they block wallet/voucher work.

## Open Questions

1. Should `registration` and `first_login` Points remain part of the new Economy SSOT, or are they legacy onboarding rewards outside the canonical baseline?

2. Should ordinary voucher claim require active VIP in every case, including `0 Points` acquisition vouchers, or can non-VIP users claim a limited zero-cost teaser?

3. What exact wallet bucket model should be used: physical balance columns, ledger categories with projections, or separate wallet bucket table?

4. Is `network-generated` spendable immediately for active VIP, or should it have its own lock/unlock policy?

5. Should locked referral Points move into available balance on the invited user's first VIP purchase, or remain separately visible as unlocked referral value?

6. What is the canonical source of VIP/PRO status: auth role, entitlement table, payment webhook state, or a dedicated membership service?

7. Are `vip_spacer` and `pro` roles enough for authorization, or should roles be separated from paid entitlements?

8. Is a badge the same thing as a local ordinary NFT, or should local NFTs be a separate inventory domain with optional badge linkage?

9. Should NFT burn mean hard deletion, immutable consumed flag, or transfer to a system sink account?

10. What are the first production point prices for ordinary vouchers, premium vouchers, quest access and Points to NFT exchange?

11. Should PRO third-purchase triggers count `claimed`, `redeemed`, or only confirmed fulfilled purchases/services?

12. For premium voucher G2A compensation, what is the treasury-controlled coefficient and should it be product-configurable?

13. What exact event should Space receive after voucher claim: post, repost, system event, activity projection, or all through a shared outbox?

14. Should `token-service` become the future Blockchain Gateway boundary, or should a separate `blockchain-gateway` worker be introduced?

15. Should `packages/api-contract/openapi.yaml` be created as a compatibility alias, or should documentation/tasks be updated to `docs/openapi/openapi.bundle.yaml` as the current contract source?

## Final Recommendation

Recommended next implementation prompt:

```text
Implement Slice 1 - Wallet / Points buckets baseline for Go2Asia Economy SSOT.

Scope:
- Do not change RF voucher business logic yet.
- Do not add G2A/on-chain behavior.
- Extend backend data model and contracts so wallet can expose:
  available Points,
  locked Points,
  network-generated Points,
  total Points,
  estimated unlock value,
  VIP status,
  PRO status,
  spend eligibility.
- Preserve existing points_transactions idempotency.
- Keep backward compatibility for current /v1/points/balance or introduce a clearly versioned wallet summary endpoint.
- Update OpenAPI and generated SDK/types only for the wallet/points contract.
- Add focused tests for bucket projection and summary response.

Use Economy SSOT files in docs/economy/* as canonical source.
Do not add marketplace commission or partner-service payments.
```

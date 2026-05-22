# Stage 12 — UI / Copy / Mock / Product Reality Alignment

Документ: `stage_12_ui_copy_mock_product_reality_alignment_v1.md`  
Статус: bounded UI/copy/mock alignment after Stage 11 governance closure  
Дата: 2026-05-22  
Scope: пользовательские UI-поверхности, тексты, mock/demo data, wallet-like элементы, badges, Points, RF/Rielt/Quest/Space/Home/Connect surfaces  
Mode: docs-first audit + bounded UI/copy alignment; no runtime/schema/API/OpenAPI/SDK expansion; no Path B activation

## 0. Orchestrator Classification

Task type: mixed docs-first product reality audit + bounded frontend copy/mock implementation.

Risk level: `MEDIUM`.

Reason:

- UI/copy может создать ложное впечатление public launch, production economy, NFT/token ownership, financial wallet, reward receipt, cashback/payout/payment/booking или proof-by-dashboard.
- Изменения ограничены текстами, mock labels, empty/deferred states and documentation.
- Runtime, schema, API, OpenAPI, SDK, producers and economy rules are out of scope.

Context capsule requested:

| Capsule | Status |
|---|---|
| `docs/ai/context/core/` | missing |
| `docs/ai/context/ui/` | missing |
| `docs/ai/context/economy/` | missing |
| `docs/ai/context/security/` | missing |
| `docs/ai/context/staging/` | missing |

Fallback context used:

- `docs/ai/roles/orchestrator.md`
- `docs/ai/roles/frontend_dev.md`
- `docs/ai/roles/qa.md`
- `docs/ai/roles/tech_writer.md`
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/economy_architect.md`
- `docs/ai/roles/security.md`
- `docs/architecture/domain/stage_11_9_closure_review_v1.md`
- `docs/architecture/domain/stage_11_8_runtime_smoke_proof_v1.md`
- `docs/architecture/domain/stage_11_7_mvp_cutline_enforcement_flags_v1.md`
- `apps/go2asia-pwa-shell/**`
- `packages/ui/**`
- `frontend-shell/packages/design-system/**`
- `design-system/ui-components/**`

Required agents:

| Role | Status |
|---|---|
| Frontend Developer | used |
| Runtime Governance Architect | used |
| Economy Architect | used |
| Security / Fraud & Abuse Reviewer | used |
| QA Agent | used |
| Technical Canon Writer | used |

Review gates:

- Product Reality Review
- Runtime Governance Review
- Economy Review
- Security / Fraud & Abuse Review
- Frontend Review
- QA Review
- Canon Review

## 1. Stage 11 Doctrine Carried Forward

Stage 12 starts from the accepted Stage 11 verdict:

```text
Stage 11 = GOVERNANCE COMPLETE FOR INTERNAL BOUNDED SMOKE
Stage 11 != public launch ready
Stage 11 != production rollout ready
```

Canonical boundaries preserved:

```text
activity_event != economic_fact
activity_event != reward_grant
contribution_record != reward_grant
badge != NFT
badge != token
badge != reward_receipt
projection != authority
Dashboard != receipt
Wallet != financial_wallet
ActivityFeed != audit_trail
diagnostic_snapshot != customer_proof
flag != proof
flag_enabled != product_readiness
smoke_proof != public_launch
Points_row = economic_fact
user_badges_row = badge_award_fact
Quest_outbox = delivery_intent_only
RF_voucher = lifecycle_fact_only
Rielt_inquiry = inquiry_fact_only
mock_data != proof
screenshot != proof
Path_B = excluded_from_Stage_11
```

## 2. Audit Scope

Primary UI/copy/mock areas checked:

| Area | Representative files |
|---|---|
| Connect dashboard and activity | `components/connect/Dashboard/*`, `components/connect/Wallet/*`, `components/connect/copy.ts` |
| Connect referrals/missions/levels | `components/connect/Referrals/*`, `components/connect/Missions/*`, `components/connect/Levels/*` |
| Connect mock/demo data | `components/connect/mockData.ts`, `components/connect/types.ts` |
| Quest cards, local completion, badge previews | `components/quest/*`, `app/(public)/quest/*` |
| Space dashboard/activity/badges mocks | `components/space/*`, `app/(public)/space/*` |
| Home logged-in preview and rewards list | `app/HomePageClient.tsx`, `components/landing/*` |
| Shared user summary components | `packages/ui`, `frontend-shell/packages/design-system`, `design-system/ui-components` |
| RF/Rielt voucher vocabulary | `components/rf/*`, `components/rielt/*`, `lib/rf*` |

Targeted vocabulary checked:

```text
NFT, G2A, bridge, wallet, cashback, payout, redeem, claim, reward, earn,
balance, proof, receipt, launch, production, booking, payment
```

These words are not all absolutely forbidden. Each usage must be classified by surface, user visibility and doctrine compatibility.

## 3. Findings

| ID | Surface | Finding | Classification | Stage 12 decision |
|---|---|---|---|---|
| F-01 | Connect `wallet` route and `/v1/wallet/summary` naming | Runtime/API names still use wallet vocabulary, but current UI labels route as Activity and read-only Points history | Allowed with strict UI relabeling | Do not rename runtime/API in Stage 12; UI must say read-only activity/Points, not financial wallet |
| F-02 | Connect Points dashboard | "Ваши Points", "balance" fallback and earned labels could look like user-facing balance/receipt | Must be relabeled | Copy changed to internal/read-only backend event summary |
| F-03 | Connect referrals | "начисления Points", `+Points`, `earned_rewards` can imply automatic reward grant | Must be relabeled | Copy changed to backend summary / confirmation language |
| F-04 | Connect missions legacy card | `+ Points` and reward metadata can imply active reward grant | Must be relabeled / internal mock only | Copy changed to "Points после подтверждения"; component remains legacy/deprecated |
| F-05 | Connect mock data | G2A amount, NFT counts, debit purchase and reward multiplier were shaped like active economy | Allowed only as internal mock | Mock values quarantined: G2A/NFT set to zero, purchase/payment row rewritten as deferred |
| F-06 | Quest card previews | "Points preview" was softer than grant, but still not explicit enough for Stage 12 | Must be relabeled | Copy changed to "Points после подтверждения" |
| F-07 | Quest legacy NFT type names | `NFTBadge` remains in TypeScript names and local mock files | Must be documented as blocked / deferred | Runtime/type rename deferred due blast radius; comments and doc state legacy name must not imply NFT ownership |
| F-08 | Space NFT route | `/space/nft` exists as deferred stub; route name itself is Path B vocabulary | Must be deferred to Path B / documented blocked | Page copy/metadata changed to deferred badges and explicit no NFT/on-chain ownership |
| F-09 | Space Balance route | `/space/balance` exists as deferred stub and could imply wallet/balance | Must be relabeled | Page copy/metadata changed to deferred activity and no wallet/payment/proof semantics |
| F-10 | Space mock NFT/Balance components | Mock badge dates, Space Points and G2A future layer may look like active facts if wired | Allowed only as internal mock | Added internal demo note and reference-only labels; no active nav wiring added |
| F-11 | Home authenticated preview | Fake rewards, level and Points examples can look like facts in dev/auth state | Must be relabeled | Copy changed from reward/grant/level claims to activity review / backend confirmation / planned surface |
| F-12 | Shared `UserSummary` stats | `nfts` prop in shared UI conflicts with off-chain badge doctrine | Must be relabeled | Active shared components now use `badges` prop; app callers updated |
| F-13 | RF/Rielt claim/redeem vocabulary | Claim/redeem terms exist in RF lifecycle code and tests | Allowed where lifecycle fact only | Keep as RF voucher lifecycle language; must not become payment, payout or reward receipt |
| F-14 | Existing tests for unsafe RF vocabulary | Several tests already assert no payout/commission/wallet/reward leakage | Allowed / supporting control | Preserve and include in validation scope |
| F-15 | Quest leaderboard | Mock leaderboard, ranks, top players and competitive score could imply active XP/social score economy | Must be removed from MVP surface | Replaced leaderboard UI with deferred non-economic page |
| F-16 | Rielt reviews | Mock reviews with `verifiedBooking` badge looked like booking/payment proof | Must be removed from MVP surface | Mock reviews removed; reviews area now waits for backend-backed UGC and rejects booking proof copy |
| F-17 | Rielt availability/house rules | Dates, deposit and prepayment could read as booking/payment flow | Must be relabeled | Added inquiry-only/payment-notice copy |
| F-18 | RF future markers | `Rewards later` / `Totem/NFT later` leaked reward/Path B vocabulary | Must be deferred to Path B | Reworded to neutral deferred markers |
| F-19 | RF/Space module barrels | Public barrels exported `mockData`, making accidental mock-as-runtime imports easier | Must be hidden behind internal/dev intent | Removed `mockData` from RF and Space public barrels; direct explicit imports remain for legacy/demo components |

## 4. Stage 12 Alignment Rules

### Points

Allowed:

- `internal Points`
- `Points по backend-событиям`
- `read-only summary`
- `Points после подтверждения`
- `Points row is economic fact` when referencing backend authority in docs

Forbidden in Path A UI:

- Points as financial balance
- Points as payout/cashback/payment/cash equivalent
- Points as customer receipt
- `earn` / `earned` unless clearly backend-confirmed and non-financial
- `spend` unless a backend spendability contract explicitly supports it

### Badges

Allowed:

- `off-chain бейдж`
- `бейдж после backend-подтверждения`
- `badge metadata`
- `user_badges_row = badge_award_fact` in docs

Forbidden in Path A UI:

- badge as NFT
- badge as token
- badge as reward receipt
- badge as on-chain proof
- badge as premium spend/pass unless Path B contract exists

### Projections and Dashboards

Allowed:

- `read-only сводка`
- `projection`
- `preview`
- `reference-only`
- `summary`

Forbidden:

- dashboard as proof
- dashboard as receipt
- projection as authority
- screenshot/mock/demo as evidence
- flag-enabled state as readiness proof

### Wallet-like Surfaces

Allowed:

- route/API names may remain temporarily if already shipped or high-blast-radius
- UI labels must say `Активность`, `История Points`, `read-only summary`

Forbidden:

- financial wallet
- top-up / withdraw / bridge / transfer
- token balance
- payout/cashback/payment semantics

### Mock and Demo Data

Allowed:

- internal mock/demo/reference data for development
- explicit `internal mock`, `reference-only`, `deferred`, `not proof`

Forbidden:

- fake rewards as real facts
- fake balances as active economy
- fake achievements as backend-awarded badges
- mock data used as customer proof or launch evidence

### Path B Vocabulary

Path B terms (`G2A`, `NFT`, `bridge`, on-chain, token wallet) may appear only as:

- deferred/future-only notes;
- legacy type/component comments;
- tests asserting forbidden vocabulary;
- docs describing blocked scope.

They must not appear as active CTA, active route promise, active metric, active ownership, active wallet, active transfer or active reward claim in Path A UI.

## 5. Bounded Implementation Summary

Changed copy/mock labels only:

- Connect Points copy now says internal/read-only/backend-event summary.
- Connect "earned" labels changed toward backend-confirmed Points.
- Connect mission/referral text no longer shows `+ Points` as automatic grant.
- Connect mock G2A/NFT/payment-like values are quarantined or zeroed.
- Quest preview copy now says Points after confirmation.
- Space deferred NFT/balance pages explicitly reject NFT/on-chain/wallet/payment/proof semantics.
- Space mock activity/badge components are labeled internal demo/reference-only.
- Home fake rewards/level/Points examples are relabeled as review/confirmation/planned surfaces.
- Shared `UserSummary` prop changed from `nfts` to `badges` for active shared UI.
- Quest leaderboard now shows a deferred surface instead of mock rankings.
- Rielt mock booking reviews were removed; Rielt copy now frames dates/deposit/prepayment as inquiry metadata, not booking/payment proof.
- RF/Space public barrels no longer export module mock data.

No changes made to:

- backend runtime;
- database schema;
- migrations;
- OpenAPI;
- SDK generation;
- Points producers;
- reward grant rules;
- Path B;
- financial wallet;
- NFT/token/bridge implementation;
- booking/payment/payout/cashback semantics.

## 6. Deferred Path B Surfaces

| Surface | Status | Reason |
|---|---|---|
| G2A token flows | Deferred / blocked for Path A | Path B/token economy not active |
| Bridge modal | Deferred / inert legacy component | No token bridge or transfer runtime |
| NFT/on-chain badge surfaces | Deferred / blocked for Path A | Badges are off-chain recognition only |
| Financial wallet semantics | Blocked | Wallet != financial wallet |
| Cashback/payout/payment/booking | Blocked | No Stage 11 approval and no Stage 12 expansion |
| XP/leaderboard/social score | Blocked | Would create extractive gamification / public economy drift |
| Creator economy | Blocked | Out of Stage 12 scope |

## 7. MVP-Safe Terminology

Use:

- `Активность`
- `История Points`
- `Внутренние Points`
- `Read-only сводка`
- `Backend-подтверждение`
- `Off-chain бейдж`
- `Reference-only`
- `Deferred`
- `Internal demo`
- `Не является proof/receipt`

Avoid or quarantine:

- `wallet` as UI label;
- `balance` as financial state;
- `reward` as grant;
- `earn` as automatic grant;
- `claim/redeem` outside RF voucher lifecycle;
- `NFT`, `G2A`, `bridge` outside deferred/blocked notes;
- `launch`, `production-ready`, `public MVP` claims.

## 8. Review Gates

| Gate | Result |
|---|---|
| Product Reality Review | UI/copy no longer claims public launch or production-ready economy |
| Runtime Governance Review | Dashboard/projection/mock copy remains non-authoritative |
| Economy Review | No new spendability, rewards, producers, payout, cashback, NFT/token or G2A runtime added |
| Security / Fraud & Abuse Review | Fake reward/balance/ownership surfaces reduced; remaining legacy names documented |
| Frontend Review | Changes limited to copy/mock labels and low-blast shared prop rename |
| QA Review | Targeted vocabulary search required after edits |
| Canon Review | This document is the Stage 12 SSOT for UI/copy/mock alignment |

## 9. Remaining Risks

| Risk | Severity | Follow-up |
|---|---|---|
| Legacy route names `/space/nft`, `/space/balance`, `/connect/wallet` still exist | Medium | Stage 12.x route vocabulary cleanup or redirects if product owner approves |
| Legacy TypeScript names `NFTBadge`, `G2A`, `WalletData`, `Reward` remain in types/tests | Medium | Stage 12.x type/model vocabulary cleanup; not done here to avoid broad refactor |
| Some mocks still contain large fake social stats and Points-like numbers | Medium | Stage 12.x mock inventory can replace with empty states where surfaces become active |
| PWA typecheck currently fails on existing Next 15 async route/page params in unrelated generated `.next/types` files | Medium | Separate Next 15 route signature cleanup; not part of Stage 12 copy/mock scope |
| RF claim/redeem vocabulary remains | Low | Allowed as RF voucher lifecycle facts; must stay away from payment/payout copy |
| Context capsule directories are missing | Low | Create `docs/ai/context/*` later if AI Ops wants structured reusable context |

## 10. Validation Notes

Validation performed after bounded changes:

| Check | Result |
|---|---|
| IDE lints on edited files | passed |
| `pnpm -C apps/go2asia-pwa-shell test` | passed: 16 files / 98 tests |
| `pnpm -C packages/ui typecheck` | passed |
| `pnpm -C apps/go2asia-pwa-shell build` | passed; Next build skips type validation/linting by project config |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | failed on unrelated Next 15 generated route/page params: quest PRO page, Space group/profile pages, `api/rielt-seed/listings/[id]` route |
| Targeted forbidden vocabulary search | completed; remaining hits are legacy/deferred docs, type names, tests, RF lifecycle, or explicitly quarantined copy |

## 11. Stage 12 Verdict

```text
stage_12_status: COMPLETE_AS_BOUNDED_UI_COPY_MOCK_ALIGNMENT
runtime_changes: false
schema_changes: false
api_openapi_changes: false
sdk_regeneration: false
new_points_producers: false
economy_expansion: false
Path_B_activation: false
public_launch_claims: false
production_ready_claims: false
```

Stage 12 aligns current UI/copy/mock surfaces with Stage 11 governance reality. It does not make Path A public-launch-ready. It reduces product-reality mismatch and creates the canon for future UI vocabulary cleanup.

Recommended next step:

```text
Stage 12.x = legacy route/type vocabulary cleanup
or
Stage 13 = readiness planning only after Stage 12 acceptance
```

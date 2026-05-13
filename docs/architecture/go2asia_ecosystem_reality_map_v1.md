# Go2Asia Ecosystem Reality Map & Next Milestone Audit v1

Дата среза: 2026-05-13  
Режим: read-only engineering audit + documentation artifact  
Статус: reality map / audit synthesis, не ADR и не runtime contract

## 0. Audit Method

Этот документ фиксирует текущее состояние Go2Asia по репозиторию, документации, конфигурации, runtime-коду и staging/evidence-документам. Он не меняет runtime, API, schema, migrations или business logic.

Использованные AI-роли по `docs/ai/roles/`:

| Роль | Зона аудита |
|---|---|
| AI Program Director / Orchestrator | Routing, scope, risk level, final synthesis |
| Software Architect | Bounded contexts, topology, canonical/runtime boundaries |
| Backend Developer | `apps/*`, `packages/*`, API/runtime/schema reality |
| Requirements Analyst | Milestone mapping, roadmap consistency, docs drift |
| Economy Architect | RF, Points, VIP, referral, spendability, tokenomics readiness |
| Runtime Governance Architect | Projections, lifecycle, shadow compare, reconciliation |
| Runtime Validation Agent / QA | Tests, staging evidence, observability, validation maturity |
| Security / Fraud & Abuse | Authority, authz, double spend/redeem/claim, abuse risks |
| Technical Canon Writer | Source hierarchy, drift table, facts vs interpretation discipline |

Epistemic tags used below:

- **FACT (repo/runtime)**: directly visible in repo code, config, schema, OpenAPI, or service inventory.
- **FACT (docs/staging)**: explicitly stated in a runbook, evidence bundle, closure note, or staging validation document.
- **INTERPRETATION**: engineering synthesis from multiple sources.
- **DOCS-ONLY / TARGET**: documented target, policy, or vision without confirmed runtime authority.
- **UNCERTAINTY**: conflict, missing evidence, or insufficient audit depth.

Primary source hierarchy for conflicts:

1. ADR in `docs/decisions/` and `docs/ai/decisions/`.
2. Platform canon v2 in `docs/architecture/platform/`.
3. Runtime inventory in `docs/ops/service_inventory.md`.
4. Current repo reality in `apps/*`, `packages/*`, `docs/openapi/*`, `packages/db/migrations/*`.
5. Runtime-aligned economy policy in `docs/economy/points/points_policy_v1.md` and `docs/economy/referral_network_rewards_policy_v1.md`.
6. Domain slice docs in `docs/architecture/domain/*` and evidence/runbooks in `docs/ops/*`.
7. Legacy overview/backend docs only with explicit canon caveats.

## 1. Executive Summary

**FACT (repo/runtime):** Go2Asia is no longer a pure concept repo. It contains a real Cloudflare Workers-based backend topology under `apps/*`, a Next.js PWA shell, shared packages, OpenAPI workflow, Drizzle/Neon DB package, 59 SQL migrations, and active domain services for auth, content, media, points, referral, RF, Rielt, Quest, Space, Reactions, Feed, Guru, Organizer, and a skeleton Token Service.

**INTERPRETATION:** The ecosystem is in a **runtime-transition / platform-hardening stage**. The strongest areas are service inventory, Platform Canon v2, OpenAPI-first workflow, RF/Points/referral implementation depth, shadow diagnostics, and AI Ops governance. The weakest areas are canonical VIP entitlement authority, available-only spend enforcement, durable/repeatable runtime evidence, legacy documentation drift, and future-tokenomics/on-chain readiness.

Critical transition point:

- The project has validated **RF paid voucher spend in staging** using legacy VIP role authority and Points spend.
- The next unsafe jump would be treating this as production-grade economy authority.
- The correct next step is **VIP Entitlement Runtime Authority**, followed by controlled available-only spend enforcement after shadow evidence.

Maturity summary:

| Area | Reality |
|---|---|
| Platform architecture | Strong canon, still has legacy-doc drift |
| Backend runtime | Broad MVP/partial platform runtime exists |
| RF/Points economy | Staging-validated for paid spend, not full economy authority |
| VIP entitlement | Target contract + shadow prep, not authoritative runtime |
| Spendability | Shadow/diagnostic ready, enforcement not active |
| Tokenomics/G2A/NFT | Future / skeleton / docs-only |
| Observability | Good targeted slices, not unified governance dashboard |
| Production readiness | Not established by this audit |

## 2. Ecosystem Timeline

| Phase | Reality |
|---|---|
| Concept Phase | Broad product vision: Guru, Atlas, Pulse, Blog, Space, RF, Rielt, Quest, Connect, Missions, Points, G2A/NFT. Some early docs over-described future layers as if runtime. |
| Architecture Phase | Platform Canon v2 introduced stricter boundaries: Connect is UI hub, Missions future orchestration, Quest uses Tasks, off-chain first, RF/Rielt/Quest/Space boundaries separated. |
| Identity Phase | Clerk/Auth/Gateway integration exists. `identity-core` normalizes role/capability semantics. Current VIP access still relies on role compatibility. |
| Backend Runtime Phase | Workers under `apps/*` became actual runtime baseline; `docs/ops/service_inventory.md` is the source of truth for current apps. |
| RF Foundation | RF partners/offers/vouchers/claim/redeem, repeatability, PRO attribution, partner item catalog, paid voucher schema and recovery tables exist. |
| Economy Layer | Points ledger, balances, referral locked grants, RF paid spend bridge, wallet buckets, shadow spendability compare exist. Available-only enforcement remains target. |
| Projection Governance | Connect CP-2 closed; CP-3 completed as read-only audit; dashboard tuning deferred. Points/VIP/Gateway shadow compare patterns exist. |
| Runtime Transition | RF paid spend staging milestone closed; next transition is VIP entitlement authority and stronger spendability enforcement. |
| Future Tokenomics | Token Service exists as skeleton; G2A, Blockchain Gateway, on-chain NFT remain future layer. |

## 3. Current Ecosystem State

| Module / Component | Status | Runtime readiness | Docs readiness | Risk | Notes |
|---|---|---:|---:|---|---|
| API Gateway | Implemented | High | Medium | Medium | Edge routing, Clerk JWT to internal gateway token, route reservation semantics. Shadow identity compare exists. |
| Auth Service | Implemented | High | Medium | Medium | Clerk webhook, user materialization, first-login/referral integrations. |
| Content Service | Implemented | High | Medium | Medium | Current runtime owner for Atlas/Pulse/Blog surfaces. Legacy separate service docs remain. |
| Media Service | Implemented | High | Medium | Low | R2/signing/media pipeline utility. |
| Points Service | Implemented with active transition | Medium | High | High | Ledger/balance/spend exists; wallet buckets and shadow compare exist; spend authority still uses materialized balance. |
| Referral Service | Implemented with partial future unlock | Medium | Medium | Medium | Codes/relations/locked grant implemented; VIP unlock/network rewards not fully authoritative. |
| RF Service | Implemented / advanced partial | Medium-High | High | High | Claim/redeem/paid spend/PRO attribution/repeatability exist; entitlement authority remains target. |
| Rielt Service | Baseline implemented | Medium | Medium | Medium | Listings/inquiries, RF refs; v1 excludes booking/payments/chat. |
| Quest Service | Baseline implemented | Medium | Medium | Medium | Quest routes/progress/reward outbox; Missions must remain separate. |
| Space Service | Implemented partial | Medium | Medium | Medium | UGC/social, activity projection; projection reconciliation maturity unclear. |
| Reactions Service | Implemented | Medium | Medium | Low-Medium | Structured interactions with tests. |
| Feed Service | Implemented composition | Medium | Medium | Medium | BFF/read-model over Space/Reactions, degraded reactions mode. |
| Guru Service | Implemented composition / partial | Medium | Medium | Medium | Nearby aggregator; some adapters are stub-like; not Geo truth. |
| Organizer Service | Runtime exists / canon unclear | Medium | Low | Medium | Trips/organizer contour needs architecture classification. |
| Token Service | Skeleton | Low | Medium | Low now / High future | Health/version/ready only; not mature tokenomics. |
| PWA Shell | Implemented frontend | Medium | Medium | Medium | Product UI across modules; not audited deeply in this pass. |
| Packages DB | Implemented | High | Medium | Medium | Drizzle schemas and 59 SQL migrations. Duplicate migration number prefixes need operational caution. |
| SDK / Types / Schemas | Implemented support | Medium | Medium | Medium | OpenAPI scripts exist; full endpoint-vs-handler drift not audited. |
| AI Ops roles/workflows | Implemented docs governance | High as process | High | Low-Medium | 15-role AI Ops v1 model, review gates, context capsules. |

## 4. Architecture Reality Map

### 4.1 Monorepo and Runtime Topology

**FACT (repo/runtime):**

- Root package is `go2asia-monorepo`, managed with `pnpm@8.15.0` and Turborepo.
- Current deployable backend apps live under `apps/*`.
- `docs/ops/service_inventory.md` explicitly states it is the source of truth for runtime implementation in `apps/*`.
- Top-level `services/` does not exist, but `pnpm-workspace.yaml` still includes `services/*`.
- Shared packages include `db`, `identity-core`, `logger`, `schemas`, `sdk`, `types`, `ui`, `config`, `atlas-taxonomy`.

**INTERPRETATION:** The architecture is a Workers monorepo, not the older `services/*` topology. The workspace entry for `services/*` is low-level config drift and onboarding risk, not current runtime evidence.

### 4.2 Bounded Contexts

| Context | Canonical owner now | Runtime notes |
|---|---|---|
| Identity/Auth | `auth-service`, `api-gateway`, Clerk, `identity-core` helpers | Role/capability normalization exists; entitlement lifecycle not yet canonical. |
| Content / Atlas / Pulse / Blog | `content-service` | Legacy `atlas_service` / `pulse_service` docs superseded for MVP runtime planning. |
| RF / Partner / Voucher | `rf-service` | Strongest business/economy runtime contour. |
| Points / Ledger / Wallet | `points-service` | Ledger owner; also contains Connect dashboard read-model. |
| Referral graph | `referral-service` | Locked grant producer; unlock/network future partial. |
| Quest | `quest-service` | Quest tasks/progress/proof/reward handoff, not Missions owner. |
| Space | `space-service` | Social UGC and activity projection. |
| Feed/Guru | `feed-service`, `guru-service` | Composition/read-model, not domain truth. |
| Rielt | `rielt-service` | Housing/listing/inquiry v1, no booking/payments/chat. |
| Connect | PWA/UI + Points read-model | Product/UI hub, not backend domain owner. |
| Token/G2A/NFT | `token-service` skeleton + docs | Future layer. |

### 4.3 Canonical vs Projection Authority

**FACT (docs/runtime):**

- Connect must remain read-only UI/product hub.
- Points owns ledger and spend accounting.
- RF owns voucher lifecycle.
- Referral owns referral graph.
- Feed/Guru are composition/read-model services.

**INTERPRETATION:** The project has adopted canonical-first language, but several runtime surfaces are still projections or compatibility shortcuts:

- Connect dashboard is allowed as read-model but must not become hidden economy owner.
- Wallet buckets describe target spendability better than the current spend predicate.
- VIP status in Connect is display/projection, not spend authority.
- Gateway/identity-core role normalization is compatibility/support, not subscription engine.

### 4.4 Legacy / Runtime Overlap

Legacy zones still useful but dangerous without caveats:

- `docs/overview/go2asia_architecture.md`
- `docs/overview/go2asia_modules_map.md`
- older `docs/backend/*` service folders for `connect_service`, `atlas_service`, `pulse_service`, `voucher_service`, `nft_service`, Blockchain Gateway
- older RF Slice 4 planning docs that predate paid-spend closure

## 5. Economy Reality Map

### 5.1 RF / Voucher Economy

**FACT (repo/runtime):**

- RF service implements partners/offers/vouchers/claim/redeem/business flows.
- RF schema includes partner item catalog, voucher canonical lifecycle, redemption table, PRO attribution, repeatability, paid economy fields and claim spend recovery.
- RF paid claim can call Points internal spend when `RF_ENABLE_PAID_VOUCHER_SPEND` is enabled.
- Staging closure validates a successful paid claim and Points spend for a 100 Points offer.

**INTERPRETATION:** RF is one of the most concrete runtime domains. It is not merely docs-only. The risky part is not RF existence; it is economy authority around VIP and spendability.

### 5.2 Points / Available / Conditional / Network

**FACT (repo/runtime):**

- Points actions include `referral_locked`, `referral_unlock`, `network_accrual_level_1`, `network_accrual_level_2`, `rf_voucher_claim_spend`.
- Wallet summary computes `availablePoints`, `lockedPoints`, and `networkPoints`.
- Internal spend checks `user_balances.balance >= spendAmount`.
- Shadow compare evaluates legacy balance against target available spendability and can export diagnostics.

**INTERPRETATION:** Points has two overlapping semantics:

- legacy/materialized spendable balance for actual spend;
- target bucket semantics for wallet, policy, and shadow diagnostics.

This is the highest economy drift area because locked/referral/network value can be represented in total balance while target policy says valuable spend should be available-only.

### 5.3 VIP / Entitlement / Unlock

**FACT (docs/runtime):**

- Current RF paid claim authority is `vip_spacer` compatible role path.
- `vip_entitlement_lifecycle_contract_v1.md` explicitly says it does not implement runtime behavior.
- RF has entitlement mock/preview/shadow flags and VIP entitlement shadow diagnostics.

**DOCS-ONLY / TARGET:** VIP Entitlement as time-bounded, auditable `vip_spend_access` with lifecycle events is a target contract.

**INTERPRETATION:** VIP is the critical monetization gate, but the runtime still uses a role shortcut. This is acceptable as documented current behavior, not acceptable as final economy authority.

### 5.4 Referral / Network Rewards

**FACT (repo/runtime):**

- Referral Service awards `referral_locked` Points with deterministic external id.
- Points wallet bucket logic recognizes `referral_unlock` and network accrual actions.

**DOCS-ONLY / TARGET:** VIP-triggered referral unlock and network accrual producers are not established as complete runtime authority in this audit.

### 5.5 PRO Attribution

**FACT (repo/runtime):**

- RF voucher model includes attribution fields and shareCode-based PRO attribution checks.
- Partner matching and active link checks are present.

**INTERPRETATION:** Attribution foundations exist, but full PRO rewards/payout/G2A partner settlement is not mature runtime.

### 5.6 Blockchain / Tokenomics

**FACT (repo/runtime):**

- `apps/token-service` is a skeleton Worker.
- No mature Blockchain Gateway runtime app was confirmed in `apps/*`.

**DOCS-ONLY / TARGET:** G2A, on-chain NFT, mint/burn/transfer, wallet/on-chain bridge are future layers.

## 6. Runtime Governance & Observability

### 6.1 CP-1 / CP-2 / CP-3

| Checkpoint | Status | Notes |
|---|---|---|
| CP-1 | UNCERTAINTY / missing artifact | Mentioned historically, separate closure not found in this audit. |
| CP-2 | Closed | Connect projection guardrails: RF source of truth, Connect read-only, summary/list precedence. |
| CP-3 | Completed as read-only audit | Dashboard accepted as operational baseline; CP-3A tuning deferred. No implementation change. |

### 6.2 Diagnostics and Shadow Compare

Implemented or partially implemented:

- Points spendability shadow compare and aggregate diagnostics.
- Points durable export via structured Cloudflare logs.
- RF VIP entitlement shadow compare.
- Gateway identity-core shadow compare.
- RF voucher diagnostics/anomaly detection.
- Quest reward outbox replay/requeue/stats.
- Referral locked points repair.

Gaps:

- No unified runtime governance dashboard.
- Points diagnostics are per Worker isolate and log-pipeline based.
- Durable export evidence has conflicting status across closure vs blocked evidence doc.
- Space activity projection has schema/runtime support but no explicit discovered reconciliation SLA.
- RF economy recovery has schema support; operator reconciliation maturity remains unclear.

### 6.3 Staging Validation Maturity

**FACT (docs/staging):**

- `economy_runtime_milestone_closure_rf_paid_spend_validation_v1.md` closes RF paid spend staging milestone.
- `points_spendability_staging_export_validation_evidence_v1.md` has `blocked_manual_execution_required`.

**INTERPRETATION:** There is a difference between a specific operator-confirmed closure and a repeatable automated evidence pipeline. The project has strong targeted evidence, but not enough for broad production-ready claims.

## 7. Docs vs Runtime Drift

| Area | Drift / Problem | Canonical reading | Risk |
|---|---|---|---|
| `apps/*` vs `services/*` | Workspace includes `services/*`, directory absent. | Runtime apps are under `apps/*`. | Low-Medium |
| Connect Service | Legacy docs describe Connect as backend/economy orchestrator. | Connect is UI/product hub; no `apps/connect-service`. | High |
| Atlas/Pulse/Blog services | Legacy backend docs imply separate services. | Current runtime owner is `content-service`. | Medium |
| Voucher Service | Legacy separate voucher service docs. | RF owns voucher lifecycle. | High |
| Token/NFT/Gateway | Future docs can look runtime-like. | Token service skeleton; NFT/Gateway future. | High |
| `go2asia_overview.md` | Broad concept may overstate future layers. | Use Platform Canon v2 + service inventory for runtime. | Medium |
| RF Slice 4.0 | Planning-only blocker language predates paid-spend closure. | Closure doc supersedes for staging paid spend. | High |
| Spendability evidence | Closure says export observed; evidence doc says blocked. | Treat as evidence-status drift requiring reconciliation. | High |
| VIP | Policy wants entitlement; runtime uses `vip_spacer`. | Current role gate documented; entitlement target not active. | High |
| Points spendability | Wallet buckets imply available/locked; spend checks balance. | Available-only enforcement is target, not active. | Critical |
| CP-1 | CP-2/CP-3 exist; CP-1 closure missing. | Mark missing artifact, do not infer. | Low-Medium |
| Organizer | Runtime exists but platform role unclear. | Needs architecture classification. | Medium |

## 8. Top Risks

1. **Spendability authority mismatch (Critical):** Actual spend uses total balance while target policy requires available-only semantics.
2. **VIP entitlement not authoritative (High):** Paid RF access depends on legacy role compatibility, not time-bounded entitlement lifecycle.
3. **Docs/runtime drift in economy milestones (High):** Closure and evidence docs can be read as conflicting without a single evidence index.
4. **Legacy docs can misroute future work (High):** Connect Service, Voucher Service, NFT/Gateway docs can lead agents to build wrong owners.
5. **S2S blast radius (High):** Shared `SERVICE_JWT_SECRET` pattern increases impact of secret leakage or overly broad internal trust.
6. **RF paid spend partial failure/recovery visibility (High):** Recovery schema exists; operational reconciliation needs stronger runbook/metrics.
7. **Projection-as-truth creep (Medium-High):** Connect dashboard, feed/guru, wallet summary and Space projections must remain derived state.
8. **Network/referral future value ambiguity (Medium):** `referral_locked`, `referral_unlock`, network accrual policy are not fully runtime-authoritative.
9. **Tokenomics overreach (Medium):** G2A/NFT/Blockchain are strategic but not runtime-ready.
10. **Testing/evidence unevenness (Medium):** RF/Points/Gateway have strong targeted tests; many services have only request-level tests; production-like validation remains manual/partial.

## 9. Recommended Next Milestones

### Immediate

1. **Evidence Reconciliation Index**
   - Reconcile RF paid spend closure vs spendability blocked evidence.
   - Produce one status table: what was proven in staging, what remains manual, what is not production-approved.

2. **VIP Entitlement Runtime Authority - Contract Lock**
   - Decide canonical owner: membership/entitlement service vs auth/identity-owned entitlement table.
   - Confirm entity, lifecycle, failure semantics, cache TTL, audit and reconciliation requirements.

3. **Stale Docs Marking**
   - Add explicit superseded/updated status to RF Slice 4.0 and high-risk legacy overview/backend docs.
   - Preserve legacy docs, but stop treating them as runtime planning truth.

4. **Available-only Spend Observation Window**
   - Run shadow/diagnostic/export under staging with aggregate evidence.
   - Define go/no-go thresholds for drift classes before enforcement.

### Near-Term

1. **VIP Entitlement Shadow to Enforcement**
   - Implement/read canonical entitlement decision behind flags.
   - Compare with role gate on RF paid claims.
   - Resolve `role_granted_entitlement_denied` and `role_denied_entitlement_granted`.
   - Switch RF paid claim to entitlement decision only after evidence.

2. **RF Economy Recovery Reconciliation**
   - Define operator runbook for `rf_voucher_economy_recovery`.
   - Track pending/resolved counts and max age.

3. **Referral Unlock Runtime**
   - Define first VIP activation event.
   - Implement idempotent `referral_unlock` producer/consumer path.
   - Prevent display of conditional value as spendable.

4. **Projection Reconciliation Map**
   - Inventory Connect RF, wallet buckets, Space activity projection, Feed enrichment, Quest outbox, Referral repair.
   - For each: owner, source, refresh, invalidation, acceptable lag, audit method.

5. **Gateway Identity Shadow Staging Window**
   - Complete real staging shadow validation with aggregate-safe evidence.

### Later

1. **Available-only Spend Enforcement**
   - Activate only after observation window shows understood/acceptable drift.

2. **Network Rewards Runtime**
   - Implement only after referral unlock and entitlement lifecycle are stable.

3. **Unified Runtime Governance Dashboard**
   - Cover Points drift/export, VIP entitlement drift, RF anomalies/recovery, Quest outbox, Referral repair, Space projection freshness.

4. **Blockchain Gateway / G2A / NFT**
   - Keep as future until legal, security, tokenomics, custody/key, audit and off-chain/on-chain boundary decisions are complete.

## 10. Final Strategic Assessment

### What Go2Asia Is Now

**FACT / INTERPRETATION:** Go2Asia is a real MVP-to-platform monorepo with meaningful backend runtime, domain boundaries, OpenAPI workflow, shared schema/package layer, RF/Points/referral economy foundation, and strong documentation governance.

It is especially strong in:

- canonical boundary thinking;
- service inventory and Platform Canon v2;
- RF voucher lifecycle and paid spend staging validation;
- Points/referral ledger foundations;
- shadow compare and diagnostic-first migration patterns;
- AI Ops process maturity.

### What Go2Asia Is Not Yet

Go2Asia is not yet:

- production-proven full economy authority;
- canonical VIP entitlement runtime;
- available-only spend enforced runtime;
- mature network rewards runtime;
- mature G2A/token/on-chain system;
- unified runtime observability platform;
- fully drift-free documentation set.

### Growth Readiness

The architecture is **promising and unusually well-documented for an MVP-stage ecosystem**, but growth depends on not skipping the authority transition. The platform can scale if it keeps canonical ownership strict and refuses projection-as-truth shortcuts.

Most dangerous transition points:

1. VIP role shortcut -> entitlement authority.
2. legacy balance spend -> available-only spend.
3. referral locked value -> unlock/network runtime.
4. RF paid spend staging -> production rollout.
5. off-chain Points -> G2A/NFT/on-chain gateway.

Enterprise-grade zones:

- AI Ops governance and review model.
- Platform Canon v2 and service inventory.
- API Gateway + service boundary direction.
- RF/Points targeted shadow diagnostics and staging closure discipline.

Prototype-grade or transition-grade zones:

- VIP entitlement source of truth.
- Available-only enforcement.
- Network rewards.
- Token/G2A/NFT/Blockchain Gateway.
- Unified runtime reconciliation dashboard.
- Some legacy docs and future-layer narratives.

## 11. Open Questions

1. Which domain owns canonical VIP entitlement?
2. What exact event unlocks `referral_locked`: purchase accepted, entitlement started, or payment settled?
3. What is the production go/no-go threshold for spendability drift classes?
4. What is the formal role of `organizer-service`?
5. Which evidence document is canonical for Points durable export status after the closure note?
6. What operational dashboard is required before economy enforcement rollout?
7. Are duplicate migration number prefixes accepted by the current DB apply tooling, or should migration ordering be made explicit in ops docs?

## 12. Final Status

`reality_audit_status: completed`

`runtime_readiness_status: partial_runtime_ready`

`economy_authority_status: active_transition`

`vip_entitlement_status: target_contract_not_authority`

`available_only_spend_status: shadow_ready_not_enforced`

`blockchain_gateway_status: future_not_ready`

Recommended next milestone:

**VIP Entitlement Runtime Authority**, preceded by evidence reconciliation and followed by controlled available-only spend enforcement.

# RF Runtime Readiness & Evidence Pack v1

Date: 2026-05-18
Status: `DRAFT_STAGE_7_1_RUNTIME_READINESS_EVIDENCE_PACK_SPEC`
Stage: `Stage 7.1 / RF Runtime Readiness & Evidence Pack`
Mode: docs-only evidence planning, read-only runtime readiness specification, no implementation, no tests added, no API changes, no schema changes, no migrations, no config changes, no feature flag changes, no deployment changes, no runtime activation, no spend enforcement activation, no reward producer activation, no referral unlock activation, no network accrual activation, no VIP entitlement authority activation, no wallet/token/G2A/NFT/on-chain activation, no payout/settlement/cashback activation, no Slice 16 movement

## 1. Purpose

This document defines the minimum evidence pack required before any Stage 7.2 runtime-adjacent RF slice can be considered.

It converts the Stage 7.0 Runtime Truth Map into concrete evidence requirements:

- which RF runtime claims must be proven;
- which staging validations and test classes must exist later;
- which pass/block criteria govern claim, paid spend, compensation, redeem, projection, attribution and service trust;
- which artifacts reviewers must collect before runtime movement;
- which blockers prevent Stage 7.2;
- which surfaces remain future-only or explicitly excluded.

This document is not runtime authority, not an implementation plan, not a test implementation, not a rollout approval, not an evidence execution report and not a Slice 16 readiness artifact.

## 2. Scope

In scope:

- RF claim and listing-scoped claim evidence planning;
- RF paid voucher spend evidence planning behind `RF_ENABLE_PAID_VOUCHER_SPEND`;
- RF spend compensation and recovery marker evidence planning;
- RF redeem lifecycle evidence planning;
- RF to Points reconciliation evidence planning;
- RF to Connect projection boundary evidence planning;
- RF to Rielt listing-scope evidence planning;
- RF to PRO attribution evidence planning;
- Quest mock/localStorage blocker registration;
- gateway and service trust evidence planning;
- observability, diagnostics and staging artifact requirements;
- pass/block criteria and blocker register for Stage 7.2 readiness.

Allowed output is docs-only planning. This document may require future tests or staging validation, but it does not add or execute them.

## 3. Non-Goals

Out of scope:

- backend implementation;
- frontend implementation;
- test implementation;
- runtime execution;
- migrations;
- schema changes;
- OpenAPI changes;
- SDK changes;
- config or feature flag changes;
- deployment or rollout;
- bug fixing;
- RF redesign;
- Connect redesign;
- Quest redesign;
- Points logic rewrite;
- spend enforcement activation;
- available-only enforcement activation;
- reward producer activation;
- `referral_unlock` activation;
- network accrual activation;
- VIP entitlement authority activation;
- wallet, token, G2A, NFT or on-chain activation;
- payout, settlement, cashback, commission or financial obligation activation;
- Slice 16 movement.

## 4. Runtime Authority Map

Current authority interpretation must follow:

- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

Runtime ownership boundaries:

| Surface | Authority owner | Evidence rule |
|---|---|---|
| RF partners, offers, vouchers, claim/redeem lifecycle | RF Service | Evidence must come from RF API responses, RF DB rows and RF diagnostics, not UI projection. |
| Points ledger, internal spend, balance and transactions | Points Service | Evidence must come from Points API responses and `points_transactions` / `user_balances`, not RF or Connect display. |
| RF paid voucher spend coupling | RF initiates, Points owns debit | Evidence must prove deterministic `externalId`, one debit per voucher and reconciliation with RF voucher. |
| RF spend compensation | RF initiates correction, Points owns compensation ledger row | Evidence must prove compensation external id and recovery marker state. |
| Connect RF/Points display | Read-only projection | Evidence must prove Connect does not claim, redeem, spend, decide spendability or become ledger truth. |
| Rielt listing context for RF offers | Rielt owns listing; RF owns voucher claim | Evidence must prove no RF/Rielt double truth. |
| PRO attribution on voucher claim | RF-owned durable attribution fact | Evidence must prove server-side shareCode resolution and immutability after first successful durable claim. |
| Quest completion local page | Non-authoritative local/mock surface | Evidence must not treat browser localStorage as Points, badge or reward authority. |
| Gateway / service trust | Gateway routes/authenticates; services own domain logic | Evidence must prove auth/trust boundaries without moving domain logic into the gateway. |

Guardrail:

```text
readiness != implementation
projection != ledger truth
visible != spendable
available != payout
RF/voucher != cashback/settlement
attribution != commission/payout entitlement
diagnostics != authority
shadow_graph != enforcement
slice_16_status: blocked_not_triggered
```

## 5. Runtime Claims Under Review

Stage 7.1 does not assert these claims as fully proven. It defines evidence required to prove or block them.

| Claim ID | Runtime claim under review | Current classification |
|---|---|---|
| `RF-CLAIM-001` | RF can create or return a partner-scoped voucher safely. | Runtime-backed, needs complete evidence bundle before Stage 7.2. |
| `RF-CLAIM-002` | RF can create or return a listing-scoped voucher safely. | Runtime-backed, needs listing/Rielt evidence. |
| `RF-CLAIM-003` | RF claim idempotency prevents unsafe replay and context mismatch. | Runtime-backed, needs replay/race artifacts. |
| `RF-SPEND-001` | Paid claim spend debits Points exactly once per voucher when enabled. | Runtime-backed behind flag, high-risk evidence required. |
| `RF-SPEND-002` | RF compensation repairs or marks spend-success/finalization-failure cases. | Runtime-backed, recovery evidence required. |
| `RF-REDEEM-001` | Merchant redeem transitions voucher once and records redemption fact. | Runtime-backed, idempotency/concurrency evidence required. |
| `RF-POINTS-001` | Points Service remains the only ledger owner for debit/compensation. | Runtime-backed, reconciliation evidence required. |
| `RF-CONNECT-001` | Connect remains read-only RF/Points projection. | Runtime-backed projection, needs stale/error/mock boundary evidence. |
| `RF-RIELT-001` | Listing-scoped offers do not create RF/Rielt double truth. | Runtime-backed mapping surface, needs listing context evidence. |
| `RF-PRO-001` | PRO attribution is durable provenance only, not payout/commission entitlement. | Runtime-backed attribution surface, needs forged/expired/replay evidence. |
| `QUEST-BLOCKER-001` | Quest completion localStorage page must not be used as reward proof. | Blocker for Quest reward runtime claims. |
| `TRUST-001` | Gateway/service JWT trust boundaries protect mutable RF/Points paths. | Runtime-backed trust surface, needs negative auth evidence. |
| `OBS-001` | Diagnostics and logs expose enough evidence without becoming authority. | Runtime-backed observability, needs artifact standard. |

## 6. RF Claim Evidence Matrix

| Evidence area | Required evidence | Pass criteria | Block criteria |
|---|---|---|---|
| Partner offer claim | API response for active public offer; RF DB row; `rf_claim_idempotency` row when `Idempotency-Key` is used; RF diagnostics snapshot. | First claim creates or returns one voucher with expected `claimScope=partner`, stable `voucher.id`, correct offer and partner. | Claim succeeds for inactive/non-public/non-existing offer, or creates unrelated voucher. |
| Idempotent replay | Two calls with same actor, same key and same context. | Replay returns same voucher, `idempotentReplay=true`, no second voucher. | Replay creates another voucher or mutates attribution/economy fields unexpectedly. |
| Context mismatch | Same key with different offer/listing/scope. | Deterministic conflict such as `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`; no mutation. | Different context is silently accepted or creates another voucher. |
| Repeat policy | `once_per_scope` and `repeat_after_redeem` evidence. | `once_per_scope` blocks or returns existing consumed barrier; `repeat_after_redeem` creates new instance only after terminal redeem where allowed. | Multiple active once-per-scope vouchers for the same user/offer/scope. |
| Existing active voucher barrier | Claim with existing active voucher. | Returns existing voucher or clear `claimBlockReason=existing_active_voucher`; no duplicate benefit. | New active duplicate is created. |
| Wrong user / unauthenticated | Missing/invalid gateway auth and cross-user attempts. | 401/403/404 without mutation, with safe error code and request id. | Mutable claim path accepts missing or forged user context. |
| Race/concurrency | Parallel same user/offer/scope requests in future staging. | At most one active voucher or policy-valid result; idempotency and DB constraints align. | Two active vouchers or inconsistent idempotency binding. |

Required artifacts:

- API request/response captures with `X-Request-Id`, `Idempotency-Key`, actor, offer and voucher ids;
- sanitized RF logs;
- RF DB snapshots for `rf_voucher` and `rf_claim_idempotency`;
- diagnostics JSON for claimed voucher;
- test run reference when future tests are executed.

## 7. RF Paid Spend Evidence Matrix

| Evidence area | Required evidence | Pass criteria | Block criteria |
|---|---|---|---|
| Feature flag state | Staging config snapshot for `RF_ENABLE_PAID_VOUCHER_SPEND`, `POINTS_SERVICE_URL`, masked `SERVICE_JWT_SECRET` presence and environment/version. | Evidence is clearly labeled flag-on or flag-off. | Reviewer cannot tell whether paid spend was enabled. |
| Points spend call | Captured RF to Points request and response for paid claim. | `externalId=rf:voucher-claim-spend:<voucherId>`, action `rf_voucher_claim_spend`, one negative ledger transaction. | Paid claim succeeds without Points spend when flag is enabled, or uses non-deterministic external id. |
| Duplicate prevention | Same spend external id replay. | Points returns idempotent replay or equivalent no-op; no second debit. | More than one debit for same voucher. |
| Replay payload mismatch | Same external id, changed amount/user/action/metadata. | 409 deterministic mismatch such as `REPLAY_PAYLOAD_MISMATCH`; RF maps to stable RF error. | Mismatch is accepted or silently mutates ledger. |
| Insufficient balance | Paid claim with insufficient Points. | 409 from Points mapped to RF insufficient Points error; no voucher insert and no ledger mutation. | Voucher is created despite failed debit. |
| Points service unavailable | Network/5xx/misconfig evidence. | RF returns safe unavailable/misconfigured error; no voucher success. | User-visible success without confirmed debit. |
| Voucher insert failure after spend | Controlled failure or staging simulation. | Compensation succeeds or `rf_voucher_economy_recovery` marker persists with pending state. | Debit succeeds, voucher finalization fails and no compensation/recovery artifact exists. |
| Compensation success | Points add compensation evidence. | `externalId=rf:voucher-claim-spend-compensation:<voucherId>`, action `rf_voucher_claim_spend_compensation`, recovery marker resolved. | Compensation duplicates value or cannot be tied to original spend. |
| Compensation failure | Recovery marker evidence. | API surfaces `RF_ECONOMY_RECOVERY_PENDING`; diagnostics show recovery state and anomaly until resolved. | Pending recovery is hidden or treated as success. |

Required artifacts:

- RF API capture for paid claim;
- RF to Points request/response capture;
- Points `points_transactions` and `user_balances` snapshots;
- RF `rf_voucher` and `rf_voucher_economy_recovery` snapshots;
- diagnostics output with `economyRecovery`;
- logs tying `requestId`, `voucherId`, `pointsDebitExternalId`, `transactionId` and recovery marker.

## 8. RF Redeem Evidence Matrix

| Evidence area | Required evidence | Pass criteria | Block criteria |
|---|---|---|---|
| Merchant redeem | API response for partner-owner redeem. | Voucher transitions to redeemed and one succeeded `rf_voucher_redemption` row exists. | Status says redeemed without redemption row, or row exists without canonical status. |
| Wrong partner / wrong actor | Negative auth/ownership attempts. | 401/403/404 without mutation. | Non-owner or wrong partner can redeem. |
| Already redeemed replay | Second redeem attempt. | Returns idempotent/duplicate terminal state without second succeeded redemption. | Multiple succeeded redemptions for one voucher. |
| Optional redeem idempotency | Same `Idempotency-Key` with same voucher context and then mismatched voucher context. | Same context replays; mismatched context conflicts deterministically. | Same key can redeem different voucher/partner. |
| Invalid statuses | Cancelled, expired, locked or otherwise invalid status evidence. | Rejects with stable code and no mutation. | Invalid lifecycle status can redeem. |
| Concurrent redeem | Future staging race evidence. | One success, other duplicate/conflict path; scope consumption guard is consistent. | Duplicate offline benefit or duplicate succeeded redemption. |
| Scope consumption guard | `once_per_scope` guard evidence. | Consumption guard exists when required and aligns with voucher lifecycle. | Guard missing or inconsistent for consumed once-per-scope voucher. |

Required artifacts:

- API captures for success, replay, wrong partner, invalid status and concurrent attempts;
- RF DB snapshots for `rf_voucher`, `rf_voucher_redemption`, `rf_voucher_scope_consumption_guard`;
- internal diagnostics output with `redemption` and `consumptionGuard`;
- sanitized merchant/user identity evidence.

## 9. RF to Points Evidence Matrix

| Evidence area | Required evidence | Pass criteria | Block criteria |
|---|---|---|---|
| Ledger ownership | OpenAPI/Points service evidence for `/internal/points/spend` and `/internal/points/add`. | Only Points Service writes ledger rows; RF stores references and lifecycle state only. | RF directly mutates Points ledger or Connect/Quest becomes ledger writer. |
| Service auth | Missing/invalid/wrong audience/expired JWT cases. | Internal Points spend/add reject invalid service auth; `source_service` is derived from service JWT, not body. | Caller can spoof `sourceService` or mutate without service JWT. |
| External id determinism | Spend and compensation external ids. | Spend key uses `rf:voucher-claim-spend:<voucherId>`; compensation key uses `rf:voucher-claim-spend-compensation:<voucherId>`. | Random or non-recomputable external id. |
| Reconciliation | Join evidence between `rf_voucher.points_debit_external_id` and `points_transactions.external_id`. | Every paid debited voucher has one matching ledger row, or explicit recovery marker if missing. | Orphaned debit, duplicate debit or voucher missing without recovery. |
| Available vs projected caveat | Evidence of current `user_balances.balance` spend path vs wallet bucket projection. | Evidence pack explicitly records that hard available-only/locked spend enforcement is not fully active. | Stage 7.2 assumes `lockedPoints` are hard spend lock without separate enforcement evidence. |
| Referral locked caveat | `referral_locked` display and current spend limitation evidence. | Treated as current limitation/future enforcement gap, not solved by RF readiness. | RF readiness claims hard locked Points enforcement. |

Required artifacts:

- Points OpenAPI references;
- Points service logs and DB snapshots;
- RF paid spend captures;
- reconciliation sheet mapping voucher ids to transaction ids and external ids;
- explicit gap note for hard available-only spend enforcement.

## 10. RF to Connect Projection Evidence Matrix

| Evidence area | Required evidence | Pass criteria | Block criteria |
|---|---|---|---|
| Read-only composition | Source review and future UI/API evidence for Connect RF widgets. | Connect reads summary/list projection only and performs no claim, redeem, spend, attribution mutation or ledger writes. | Connect projection is used as authority for spendability, voucher lifecycle or ledger truth. |
| Stale/error states | Evidence for summary failure, list failure, partial data and stale cache states. | UI shows safe degraded/read-only state; no fallback mock economy truth. | Error fallback looks like confirmed runtime fact. |
| Summary/list mismatch | Evidence where summary exists but voucher rows are empty or stale. | UI labels partial projection clearly and does not claim full lifecycle truth. | Projection counters are treated as canonical lifecycle state. |
| Mock isolation | Import/search evidence for deprecated mock surfaces. | Mock views and mock data are not used as production truth; demo/local sections are labeled. | Mock data is exported or consumed as live runtime truth on active routes. |
| Local RF saved offers | Evidence for local-only saved offers. | Local storage entries are visually and semantically separate from server vouchers. | Local saved offer is displayed as server voucher. |

Required artifacts:

- source review references for `connectRfProjection`, `ConnectRfSection`, RF projection panels and SDK fetches;
- screenshots/API captures for stale/error/partial states in future staging;
- import search evidence for mock data;
- UI copy evidence preserving read-only projection semantics.

## 11. RF to Rielt Evidence Matrix

| Evidence area | Required evidence | Pass criteria | Block criteria |
|---|---|---|---|
| Listing offer mapping | Listing-scoped API response and RF/Rielt mapping evidence. | Claim uses validated listing+offer context; `claimScope=listing`; listing id/title snapshot matches path. | Claim succeeds for unmapped listing/offer. |
| Listing partner consistency | Evidence for mapping partner mismatch and missing listing context. | Rejects with stable 404/409 style error; no voucher mutation. | RF creates voucher against wrong partner/listing. |
| Scope separation | Same offer partner-scope vs listing-scope evidence. | Scope is explicit and does not create double truth. | Listing and partner scope collide or silently overwrite each other. |
| Rielt ownership boundary | Evidence that Rielt owns listing, RF owns voucher. | No Rielt service becomes voucher lifecycle authority. | Rielt projection is treated as RF voucher source of truth. |

Required artifacts:

- listing offer API captures;
- RF DB rows with `claim_scope=listing` and `rielt_listing_id`;
- mapping table snapshots where applicable;
- negative context mismatch evidence.

## 12. RF to PRO Attribution Evidence Matrix

| Evidence area | Required evidence | Pass criteria | Block criteria |
|---|---|---|---|
| Server-side shareCode validation | Valid active `shareCode` claim evidence. | RF resolves active PRO link for same partner and stores confirmed durable attribution. | Client can set arbitrary `proUserId` or `proLinkId`. |
| Forged sessionStorage/body | Unknown, expired, foreign, inactive or partner-mismatched `shareCode`. | Attribution becomes rejected/none with safe reason; voucher claim behavior remains controlled. | Forged browser payload confirms attribution. |
| Immutability | Replay with different attribution payload after first successful claim. | First successful durable attribution remains unchanged. | Retry rewrites confirmed attribution. |
| PRO read model | PRO attributed vouchers endpoint evidence. | Returns only confirmed PRO-attributed vouchers for current PRO scope and no payout/commission fields. | PRO view exposes settlement/commission entitlement or unrelated vouchers. |
| Semantics | Copy/API evidence. | Attribution is provenance metadata, not reward entitlement. | Attribution is framed as income, commission, payout or MLM. |

Required artifacts:

- claim requests with attribution payloads;
- `rf_voucher` and `rf_pro_link` snapshots;
- PRO attributed voucher API response;
- negative forged/expired/mismatched evidence.

## 13. Quest Mock/LocalStorage Blocker

Blocker ID: `S7.1-QUEST-LOCAL-001`

Stage 7.0 identified an active Quest completion route using mock/static quest data and browser localStorage for reward-like completion summaries:

- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/page.tsx`;
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/RewardsView.tsx`;
- `apps/go2asia-pwa-shell/components/quest/mockQuests.ts`.

Current classification:

```text
quest_completion_local_page: non_authoritative_local_summary
quest_localStorage_status: not_reward_authority
quest_mockQuests_status: mock_catalog_not_runtime_truth
stage_7_2_quest_reward_claims: blocked_unless_resolved_or_formally_excluded
```

Pass criteria before any Quest reward runtime claim:

- Quest localStorage completion is removed from evidence paths or formally excluded from the runtime claim under review;
- no evidence bundle cites browser localStorage as Points, badge, RF, Connect or reward authority;
- any Quest reward evidence uses service-owned completion/outbox and Points transaction artifacts;
- UI copy continues to state that the page is a local/preliminary summary, not ledger truth.

Block criteria:

- localStorage completion is cited as proof of Points, badge, reward or RF eligibility;
- mock quest data is treated as runtime quest catalog authority;
- Connect/RF/Points consumes local Quest state as authority;
- Stage 7.2 proposes Quest reward runtime movement while this blocker is unresolved and not formally excluded.

## 14. Gateway / Service Trust Evidence

Required evidence:

- RF protected routes reject missing/invalid gateway auth;
- RF internal diagnostics routes are admin-only and unavailable to normal frontend users;
- Points internal spend/add reject missing, invalid, expired, wrong issuer, wrong audience or missing subject service JWTs;
- gateway routes requests and normalizes auth/correlation but does not own RF/Points domain logic;
- frontend never calls internal diagnostics or Points internal spend/add directly;
- error responses include request ids without leaking raw tokens or secrets.

Protected surfaces requiring evidence:

- `POST /v1/rf/offers/{offerId}/claim`;
- `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`;
- `GET /v1/rf/me/vouchers`;
- `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`;
- `GET /v1/rf/internal/vouchers/{voucherId}/diagnostics`;
- `POST /internal/points/spend`;
- `POST /internal/points/add`.

Pass criteria:

- public catalog reads remain public only where intended;
- mutable and internal paths fail closed on missing or invalid trust;
- logs contain request/correlation ids and safe failure reason;
- no raw service JWT, raw gateway secret or voucher code is exposed in evidence.

Block criteria:

- internal diagnostics are accessible publicly;
- mutable RF or Points paths can be called without valid trust;
- wrong audience/issuer service JWT is accepted;
- gateway begins owning voucher, ledger, reward or spendability decisions.

## 15. Observability / Diagnostics Evidence

Required evidence categories:

- request and response captures;
- gateway logs;
- RF logs;
- Points logs;
- database snapshots;
- RF internal voucher diagnostics;
- feature flag/config snapshots;
- rollback evidence;
- UI screenshots for projection/local-only distinctions;
- reconciliation sheet.

Required identifiers:

- `requestId`;
- `Idempotency-Key` fingerprint or masked key;
- `voucherId`;
- `offerId`;
- `partnerId`;
- `listingId` where relevant;
- Points `externalId`;
- Points `transactionId`;
- `pointsDebitExternalId`;
- compensation external id;
- recovery marker id/state;
- `correlationIdMasked` where exposed.

Suggested artifact naming:

```text
stage-7.1_rf-runtime-readiness_<area>_<scenario>_<yyyy-mm-dd>_<requestId-or-voucherId>.<ext>
```

Examples:

```text
stage-7.1_rf-runtime-readiness_api_claim-paid-success_2026-05-18_req-abc123.json
stage-7.1_rf-runtime-readiness_db_rf-voucher_2026-05-18_vch-123.json
stage-7.1_rf-runtime-readiness_diag_voucher_2026-05-18_vch-123.json
stage-7.1_rf-runtime-readiness_flags_paid-spend-on_2026-05-18.txt
```

Pass criteria:

- Gateway -> RF -> Points can be traced for paid claim by request/correlation ids;
- diagnostics output matches DB snapshots;
- anomalies are empty for happy path or explicitly triaged for failure path;
- recovery markers are visible and stateful;
- evidence is redacted and safe for review.

Block criteria:

- no way to connect API response to RF DB and Points ledger rows;
- missing diagnostics for paid spend/recovery readiness;
- raw tokens, secrets, voucher codes or unnecessary PII are present;
- critical anomaly exists without triage note.

## 16. Required Staging Evidence Bundle

Minimum bundle before Stage 7.2:

1. Branch/commit/build/env marker for the staging artifact under review.
2. RF `/health`, `/version` and `/ready` responses.
3. Gateway/service trust negative evidence for RF mutable routes and Points internal routes.
4. Free partner claim success, replay and context mismatch evidence.
5. Listing-scoped claim success and mapping mismatch evidence.
6. Paid claim success with flag-on, deterministic Points debit and ledger reconciliation.
7. Paid claim insufficient balance and Points service failure evidence.
8. Paid claim spend-success/finalization-failure recovery evidence.
9. Redeem success, replay, wrong partner and concurrent redeem evidence.
10. RF to Points reconciliation sheet.
11. Connect read-only projection evidence with stale/error/partial states.
12. Rielt listing ownership boundary evidence.
13. PRO attribution valid, forged, expired/mismatched and immutable replay evidence.
14. Quest localStorage blocker disposition: resolved, quarantined, or formally excluded from runtime claim.
15. Internal diagnostics outputs for at least claim, paid claim, recovery and redeem cases.
16. Rollback evidence for disabling `RF_ENABLE_PAID_VOUCHER_SPEND`.
17. Semantic safety evidence: no payout, settlement, cashback, wallet, token, G2A, NFT or on-chain runtime wording in the reviewed RF/Connect surfaces.

## 17. Pass / Block Criteria

Stage 7.2 is blocked unless all of the following are true:

- RF claim idempotency evidence exists;
- RF claim replay/context mismatch/race evidence exists;
- paid spend debit/retry/compensation evidence exists;
- paid spend reconciliation between RF voucher and Points ledger exists;
- redeem idempotency/concurrency evidence exists;
- wrong actor/wrong partner negative evidence exists;
- Connect projection boundaries are validated;
- Quest mock/localStorage completion blocker is resolved or formally excluded;
- gateway/service trust evidence exists;
- observability and diagnostics evidence is complete enough to review failures;
- rollback evidence exists for paid spend flag-off;
- no token/NFT/wallet/G2A/on-chain/payout/settlement/cashback activation is included;
- no Slice 16 movement is included.

Block Stage 7.2 if any of these are true:

- any mandatory evidence class is missing;
- duplicate voucher, duplicate debit or duplicate successful redemption can occur from replay/race;
- paid claim success is not coupled to Points spend when the flag is enabled;
- spend succeeds, claim finalization fails and no compensation/recovery marker exists;
- RF or Connect projection is treated as ledger, voucher or spendability authority;
- Quest localStorage reward summary is cited as runtime proof;
- internal diagnostics are exposed publicly;
- raw secrets, service JWTs or unsafe PII are present in the evidence bundle;
- documentation or UI wording implies payout, settlement, cashback, wallet, token, NFT or on-chain activation;
- Slice 16 status changes from `blocked_not_triggered`.

## 18. Blocker Register

| Blocker ID | Area | Status | Stage 7.2 disposition required |
|---|---|---|---|
| `S7.1-RF-CLAIM-001` | RF claim replay/race evidence | Open evidence requirement | Collect replay, mismatch and concurrent claim artifacts. |
| `S7.1-RF-REDEEM-001` | RF redeem idempotency/concurrency evidence | Open evidence requirement | Prove one terminal redemption and one succeeded row under replay/race. |
| `S7.1-RF-SPEND-001` | Paid claim debit/retry/compensation evidence | Open evidence requirement | Prove one debit, deterministic external id, mismatch handling and compensation/recovery. |
| `S7.1-RF-POINTS-001` | RF to Points reconciliation | Open evidence requirement | Provide voucher-to-ledger reconciliation sheet and DB snapshots. |
| `S7.1-CONNECT-001` | Connect projection authority boundary | Open evidence requirement | Prove read-only behavior, stale/error handling and no fallback mock truth. |
| `S7.1-RIELT-001` | Listing-scoped RF/Rielt boundary | Open evidence requirement | Prove listing mapping and no double truth. |
| `S7.1-PRO-001` | PRO attribution forgery/immutability | Open evidence requirement | Prove shareCode validation, rejected forged attribution and replay immutability. |
| `S7.1-QUEST-LOCAL-001` | Quest mock/localStorage reward-like surface | Hard blocker for Quest reward runtime claims | Resolve/quarantine in a separate slice or formally exclude from Stage 7.2 RF runtime claim. |
| `S7.1-TRUST-001` | Gateway/service trust evidence | Open evidence requirement | Prove protected paths reject missing/invalid trust and logs are safe. |
| `S7.1-OBS-001` | Observability bundle completeness | Open evidence requirement | Provide logs, request ids, diagnostics, DB snapshots and rollback evidence. |
| `S7.1-SEMANTICS-001` | Payout/wallet/token/NFT semantic safety | Always-on blocker | Any activation or misleading wording blocks Stage 7.2. |
| `S7.1-SLICE16-001` | Slice 16 firewall | Always-on blocker | Slice 16 must remain `blocked_not_triggered`. |

## 19. Forbidden Runtime Areas

The following areas remain forbidden for Stage 7.1 and must not be included in Stage 7.2 without separate authorization, evidence and governance:

- token/G2A activation;
- NFT/on-chain activation;
- wallet activation;
- blockchain gateway activation;
- payout, settlement, cashback or commission activation;
- partner financial settlement;
- PRO payout or income entitlement;
- MLM/passive-income runtime semantics;
- `referral_unlock` activation;
- network accrual producer activation;
- hard available-only spend enforcement activation;
- full VIP entitlement authority activation;
- reward producer activation outside already implemented runtime-backed flows;
- fake ledger or frontend-as-ledger truth;
- diagnostics as authority;
- shadow graph as enforcement;
- Slice 16 movement.

## 20. Recommended Stage 7.2 Readiness Slice

Recommended Stage 7.2 should be an evidence-execution slice, not feature expansion:

```text
Stage 7.2 candidate:
RF Claim / Paid Spend / Redeem Staging Evidence Execution
```

Recommended scope:

- execute or implement only the minimum validation harness needed to collect the evidence listed in this document;
- collect RF claim, listing claim, paid spend, compensation, redeem and reconciliation artifacts;
- collect gateway/service trust negative evidence;
- collect Connect projection stale/error evidence;
- keep Quest localStorage blocker out of scope unless the slice explicitly resolves or formally excludes it;
- preserve all forbidden runtime areas.

Recommended Stage 7.2 entry condition:

```text
entry_status: blocked_until_evidence_execution_scope_is_approved
runtime_activation: false
feature_expansion: false
token_wallet_nft_activation: false
payout_settlement_activation: false
slice_16_status: blocked_not_triggered
```

Stage 7.2 should not activate new runtime capabilities by default. Its purpose should be to collect and review evidence for already identified runtime-backed RF/Points surfaces.

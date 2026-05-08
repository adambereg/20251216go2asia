# RF Slice 6.1 - Entitlement Contract & Policy Model v1

## 1. Purpose

Slice 6.1 defines the stable language for a future entitlement layer that can safely support:
- premium vouchers;
- NFT/totem gates;
- Connect milestones;
- PRO curated access;
- partner invitations;
- future G2A thresholds.

This is a **contract and policy model design pass**, not runtime implementation.

## 2. Non-goals

Not included:
- blockchain runtime or NFT ownership verification;
- wallet integration or G2A runtime;
- payout, rewards, or financial accounting;
- premium claim enforcement;
- DB migrations;
- RF claim path changes;
- API write operations;
- generated SDK edits.

## 3. Audit Summary

### 3.1 Current Implicit Gates

Current entitlement-like checks exist, but they are not a unified contract:
- RF offer visibility: public/non-public claimability.
- RF partner/offer lifecycle: active/inactive availability.
- Repeatability: barrier voucher and `claimBlockReason`.
- Paid ordinary voucher path: role/VIP requirement plus Points service availability.
- Rate limiting and idempotency.
- PRO attribution: share-code capture and TTL.
- Connect projection milestones: narrative signals only.

### 3.2 Missing Contract Concepts

The system needs stable neutral vocabulary for:
- subject;
- resource;
- action;
- source;
- decision;
- reason code;
- policy composition;
- cache/failure semantics;
- deterministic request window.

### 3.3 What Must Not Move Into Entitlement Yet

Do not move these into the entitlement layer in Slice 6.1:
- ordinary voucher lifecycle;
- claim idempotency;
- repeatability guard persistence;
- Points spend/compensation/recovery runtime;
- RF diagnostics internals;
- Connect wallet/rewards UX.

## 4. Contract Vocabulary

### 4.1 Entitlement Subject

The subject is the actor being checked.

Fields:
- `userId`;
- optional `roleHints`;
- optional `statusHints`;
- optional `profileHints`;
- optional `progressHints`.

Hints are not source-of-truth. They are context for policy evaluation.

### 4.2 Entitlement Resource

The resource is what access is requested for:
- RF premium voucher;
- RF offer;
- RF listing-bound offer;
- partner invite;
- future AI unlock;
- future access pass.

### 4.3 Entitlement Action

Supported action vocabulary:
- `view`;
- `claim`;
- `redeem`;
- `reserve`;
- `unlock`;
- `use`;
- `invite_accept`.

### 4.4 Entitlement Source

Supported source vocabulary:
- `role`;
- `pro_status`;
- `vip_status`;
- `pro_invite`;
- `partner_whitelist`;
- `connect_milestone`;
- `nft_totem`;
- `badge_bridge`;
- `g2a_threshold`;
- `manual_grant`;
- `event_participation`;
- `unknown`.

Source-specific details live in source-owning domains, not RF.

### 4.5 Entitlement Decision

Decision vocabulary:
- `granted`;
- `denied`;
- `pending`;
- `unknown`;
- `not_applicable`.

`not_applicable` is important for ordinary resources that have no gate.

## 5. Reason Codes

Stable reason codes:
- `entitlement_granted`;
- `requirement_missing`;
- `source_unavailable`;
- `source_timeout`;
- `insufficient_status`;
- `invite_required`;
- `nft_required`;
- `milestone_required`;
- `points_requirement_not_met`;
- `g2a_threshold_not_met`;
- `already_used`;
- `expired`;
- `temporarily_unavailable`;
- `policy_not_configured`;
- `ordinary_resource_no_gate`;
- `unknown_source`;
- `source_conflict`.

Reason codes are machine-readable. User-facing labels are mapped separately.

Safe labels:
- "Доступ открыт";
- "Требуется приглашение";
- "Нужно выполнить условие";
- "Проверка доступа временно недоступна";
- "Премиум-доступ пока недоступен".

Unsafe label vocabulary:
- tx hash;
- chain state;
- balance;
- payout;
- compensation;
- debit;
- recovery.

## 6. Policy Composition

Policy operators:
- `all_of` - all requirements must pass;
- `any_of` - at least one requirement must pass;
- `none_of` - requirements must not be present;
- `optional` - informational, not blocking.

Policy fields:
- `id`;
- `version`;
- `operator`;
- `requirements`;
- `evaluationMode`;
- `failureMode`;
- `cachePolicy`;
- optional `priority`;
- optional `fallbackPolicyId`.

## 7. Requirement Model

Requirement kinds:
- `has_role`;
- `has_pro_status`;
- `has_vip_status`;
- `has_nft_totem`;
- `has_badge_bridge`;
- `has_connect_milestone`;
- `has_partner_invite`;
- `has_partner_whitelist`;
- `meets_g2a_threshold`;
- `completed_event`;
- `manual_grant_exists`.

Each requirement points to an entitlement source and may carry non-sensitive params.

## 8. Evaluation Modes

Evaluation modes:
- `strict` - access requires authoritative grant.
- `soft_visibility` - can show limited visibility while eligibility is pending.
- `claim_enforcement` - claim path must fail unless granted.
- `advisory_only` - narrative/progress only.

RF premium claim enforcement should use `claim_enforcement`.
Connect should use `advisory_only` or entitlement-safe summaries.

## 9. Failure Semantics

Failure modes:
- `deny_closed` - deny when source cannot be checked.
- `allow_soft_visibility` - allow viewing limited copy, not claiming.
- `pending_on_timeout` - return pending for user-safe retry.
- `use_stale_cache` - use recent decision within configured stale window.
- `manual_review` - route to human/ops process later.

Guidance:
- premium claim should never spend points before entitlement grant;
- soft visibility must not imply final claim eligibility;
- unknown source must not be silently treated as granted.

## 10. Cache Semantics

Cache modes:
- `cacheable`;
- `stale_while_revalidate`;
- `never_cache`.

Suggested defaults:
- role/status sources: short TTL;
- Connect milestone summaries: medium TTL;
- NFT/totem source checks: source-owned TTL;
- manual grants/invites: cacheable with invalidation later;
- claim-enforcement decisions: deterministic within request window.

Cache is not user-facing truth. Audit trace and user-facing result are separate.

## 11. Determinism and Idempotency

Rules:
- entitlement result should be deterministic within one claim request window;
- entitlement check may carry `requestId`;
- future runtime may carry entitlement `requestId` alongside RF claim idempotency;
- premium claim path must evaluate entitlement before any paid spend action;
- ordinary claim path remains unchanged.

## 12. Boundary Responsibilities

### RF

RF:
- asks entitlement service for premium gated resources;
- receives decision;
- owns voucher lifecycle;
- may store a minimal decision snapshot later.

RF does not own:
- NFT ownership truth;
- chain verification;
- wallet balances;
- Connect milestones truth.

### Entitlement

Entitlement:
- owns policy evaluation;
- aggregates source facts;
- owns reason codes and cache policy;
- emits audit trace.

### Wallet / Blockchain Gateway

Wallet / Blockchain Gateway:
- owns NFT/G2A facts;
- does not know RF lifecycle.

### Connect

Connect:
- reads entitlement-safe summaries;
- displays narrative/progress only.

### PRO

PRO:
- can produce invite/trust signals;
- does not calculate payout/reward.

### Points Service

Points service:
- executes spend only after RF has confirmed entitlement grant for premium paid paths.

## 13. Future RF Premium Claim Interaction

Future premium claim sequence:

```text
User -> RF claim premium offer
RF -> Entitlement check (subject, resource, action=claim)
Entitlement -> source checks
Entitlement -> grant/deny/pending
RF -> if granted, continue RF claim lifecycle
RF -> if premium paid path, call Points only after grant
RF -> issue voucher or return safe reason
```

Ordinary voucher path remains unchanged.

## 14. Connect Read-model Implications

Connect may show:
- special access unlocked;
- premium access available;
- milestone reached;
- access condition pending.

Connect must not show:
- raw source proofs;
- wallet balances;
- token thresholds as financial dashboard;
- chain state;
- payout or reward mechanics.

## 15. Migration Path to Runtime

1. Keep this contract isolated and default-off.
2. Add an entitlement read API behind feature flag.
3. Add read-only premium visibility using `soft_visibility`.
4. Add premium claim guard using `claim_enforcement`.
5. Add source adapters incrementally:
   - role/VIP;
   - PRO invite;
   - Connect milestone;
   - NFT/totem;
   - future G2A threshold.
6. Add minimal entitlement decision snapshot only after runtime semantics stabilize.

## 16. Implementation Notes for Current Slice

Current Slice 6.1 implementation is limited to:
- docs;
- isolated TypeScript contracts;
- pure helper functions and tests.

No runtime behavior changes are introduced.


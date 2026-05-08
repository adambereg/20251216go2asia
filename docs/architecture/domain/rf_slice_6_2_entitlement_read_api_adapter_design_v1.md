# RF Slice 6.2 - Entitlement Read API / Adapter Design v1

## 1. Purpose

Slice 6.2 stabilizes the future entitlement **read-side boundary** before any runtime enforcement or source integration.

Goals:
- define an internal read API shape;
- define adapter abstraction and normalization;
- define timeout and degraded-mode semantics;
- define RF integration expectations;
- define Connect read semantics;
- keep Wallet, NFT, G2A, and Blockchain Gateway outside RF runtime.

This slice does not implement production adapters.

## 2. Non-goals

Not included:
- NFT ownership verification;
- blockchain or TON runtime;
- wallet sync;
- G2A runtime;
- premium claim enforcement;
- DB migrations;
- RF runtime modifications;
- write APIs;
- queue workers or background jobs;
- payout/reward logic;
- Connect wallet UX;
- generated SDK changes.

## 3. Audit Findings

### 3.1 Current Readiness

The system is ready for a read-side contract because:
- Slice 6 defines RF, Connect, Wallet/Blockchain Gateway, Entitlement, and PRO boundaries.
- Slice 6.1 defines subject/resource/action/source/decision vocabulary.
- RF already has implicit read-like gates: offer visibility, active partner/offer checks, repeatability barriers, VIP/role checks for paid ordinary vouchers, and idempotency/rate limits.
- Connect already consumes RF facts as a narrative/progress layer.
- Current UI query patterns use short `staleTime` and retry semantics that can inform future read-cache behavior.

### 3.2 Safe Read-side Direction

The entitlement read API should return:
- normalized decision;
- stable reason code;
- safe user label;
- missing requirements;
- evaluated source categories;
- cache/stale/degraded flags;
- optional audit trace id.

It must not return:
- raw wallet state;
- chain state;
- tx hashes;
- NFT contract details;
- balances;
- payout/reward status;
- adapter diagnostics in user-facing payloads.

### 3.3 Adapter Candidates

Near-term adapter candidates:
- role adapter;
- VIP status adapter;
- PRO invite adapter;
- partner whitelist adapter;
- Connect milestone adapter;
- manual grant adapter.

Future-only adapter candidates:
- NFT/totem adapter;
- badge bridge adapter;
- G2A threshold adapter.

### 3.4 Major Risks

Risks:
- mixing RF runtime errors (`RF_*`) with entitlement reason codes;
- treating stale or partial reads as claim grants;
- exposing audit traces or raw source facts to Connect;
- letting RF orchestrate adapters directly;
- using wallet placeholders or mock NFT/G2A data as eligibility truth.

## 4. Read API Contract

This is a stable internal/service boundary design, not a public production API.

### 4.1 Request Model

Request fields:
- `requestId`;
- `subject`;
- `resource`;
- `action`;
- `evaluationMode`;
- `context`;
- optional `requestedSources`;
- optional `timeoutHints`;
- optional `includeAuditTrace`;
- optional `includeSafeLabels`;
- optional `requestedAt`.

Allowed context:
- RF offer/listing metadata;
- Connect progression hints;
- client capabilities;
- environment;
- feature flags.

Disallowed context:
- raw wallet state;
- NFT proof details;
- chain details;
- balances;
- payout state.

### 4.2 Response Model

Response fields:
- `requestId`;
- `requestWindowId`;
- `decision`;
- `reasonCode`;
- `evaluationMode`;
- optional `safeLabel`;
- `evaluatedSources`;
- `missingRequirements`;
- `warnings`;
- `stale`;
- `cacheHit`;
- `degradedMode`;
- optional `partialResults`;
- `evaluatedAt`;
- optional `expiresAt`;
- optional `auditTraceId`.

The response must be:
- deterministic enough inside one request window;
- safe for RF claim-preview and soft-visibility flows;
- safe for Connect read-models;
- explicit when degraded, stale, or partial.

### 4.3 Safe Labels

Allowed read-side vocabulary:
- "Доступ открыт";
- "Проверка выполняется";
- "Требуется условие";
- "Доступ временно ограничен";
- "Премиум-доступ недоступен".

Forbidden user-facing vocabulary:
- tx hash;
- wallet sync failed;
- chain node unavailable;
- NFT contract mismatch;
- balance insufficient;
- payout pending.

## 5. Adapter Abstraction

Adapters are source-specific readers. Entitlement orchestrates them, but RF and Connect do not.

Adapter interface:
- `adapterId`;
- `sourceType`;
- `supportsActions`;
- `supportsResources`;
- `evaluate()`;
- `health()`;
- `timeoutPolicy()`;
- `cachePolicy()`.

Adapters may read source facts, but adapter raw facts are not RF or Connect response fields.

## 6. Adapter Normalization

Adapters return:
- raw source facts;
- decision hints;
- reason-code hints;
- stale/cache markers;
- evaluated-at/expires-at markers.

Entitlement normalizes to:
- `granted` / `denied` / `pending` / `unknown` / `not_applicable`;
- stable reason codes;
- source category;
- degraded mode;
- safe missing requirements;
- optional audit trace event.

Normalization rule:
- raw facts are omitted from normalized RF/Connect-safe results;
- source-specific detail stays in source-owning domains or audit trace storage;
- unknown source is never treated as granted.

## 7. Timeout and Degraded Semantics

Adapter health states:
- `healthy`;
- `degraded`;
- `unavailable`;
- `timeout`;
- `stale_cache_only`.

Read degraded modes:
- `none`;
- `partial_sources`;
- `timeout_fallback`;
- `stale_cache`;
- `source_unavailable`;
- `policy_fallback`.

Recommended behavior:
- `soft_visibility`: may show limited premium visibility on pending/stale/partial reads.
- `claim_preview`: may explain missing conditions but must avoid final grant promises.
- `claim_enforcement`: future only; must require non-degraded grant.
- `advisory_only`: safe for Connect narrative.

Timeout behavior:
- return `pending` with safe message for recoverable source timeout;
- include `degradedMode`;
- include `partialResults` only as source categories/reason codes, not diagnostics;
- never allow paid spend or claim grant from timeout fallback.

## 8. RF Integration Contract

RF must:
- send subject/resource/action/evaluationMode request;
- receive normalized result;
- use decision for UI/runtime flow;
- keep ownership of voucher lifecycle.

RF must not:
- depend on adapter internals;
- know wallet/blockchain details;
- orchestrate adapters;
- store raw source facts.

### 8.1 Soft Visibility Flow

RF may show a premium offer with disabled or pending claim state when:
- decision is `granted`; or
- decision is `pending` under `soft_visibility` with recoverable degraded mode.

Soft visibility is not claim eligibility.

### 8.2 Claim-preview Flow

RF may ask what is required before claim:
- show safe label;
- show missing requirement categories;
- show pending/degraded state;
- avoid wallet/source diagnostics.

### 8.3 Future Claim-enforcement Flow

Future premium claim enforcement:

```text
RF receives claim request
RF builds entitlement read request with action=claim and evaluationMode=claim_enforcement
Entitlement evaluates adapters and returns normalized result
RF proceeds only on non-degraded granted decision
RF calls Points only after entitlement grant if premium paid path requires spend
RF stores optional minimal decision snapshot later
```

This slice does not implement this flow.

### 8.4 Failure Behavior

RF behavior:
- timeout: show pending/temporarily limited state, no claim grant;
- stale cache: allow soft visibility only, no enforcement grant;
- partial source failure: show missing/pending categories, no source detail;
- unknown decision: fail closed for future enforcement and stay advisory for Connect.

## 9. Connect Semantics

Connect may safely read:
- premium access available;
- special access unlocked;
- milestone reached;
- invite available;
- eligibility pending.

Connect must not read or display:
- raw wallet facts;
- NFT details;
- balances;
- tx history;
- source adapter diagnostics;
- audit traces.

Connect remains narrative/progress layer. It can consume entitlement-safe summaries, not entitlement source truth.

## 10. Audit Trace Model

Audit trace is not a user-facing result.

Trace fields:
- `traceId`;
- `requestId`;
- `requestWindowId`;
- source evaluation events;
- adapter timing;
- degraded sources;
- cache usage;
- partial evaluation markers;
- created-at timestamp.

Audit trace consumers:
- internal diagnostics;
- future operations review;
- entitlement service debugging.

Audit trace must not be rendered in Connect or RF user-facing copy.

## 11. Future Enforcement Path

Future path:
1. Keep read API contract isolated and default-off.
2. Add internal read endpoint with mock/local adapters only.
3. Add claim-preview UI with safe labels.
4. Add soft visibility for premium offers.
5. Add real source adapters one by one.
6. Add claim-enforcement only after degraded-mode and cache semantics are stable.
7. Add minimal RF snapshot only after enforcement is approved.

## 12. Migration Path

Migration stages:
- Stage A: design-only contracts and docs.
- Stage B: mock read endpoint behind feature flag.
- Stage C: role/VIP/manual grant adapters.
- Stage D: PRO invite and Connect milestone adapters.
- Stage E: future NFT/totem and G2A threshold adapters.
- Stage F: premium claim enforcement guard.

Ordinary voucher runtime remains unchanged throughout.

## 13. Risks

Remaining risks:
- existing `pro_only` / `invite_only` visibility values can be mistaken for implemented entitlement policies;
- wallet summary includes status-like fields that should not become RF eligibility truth directly;
- mock G2A/NFT data can be misread as production source facts;
- degraded reads may be over-trusted if UI copy is too optimistic;
- audit trace may leak internal source details if exposed through product UI.

## 14. Current Slice Implementation Notes

Current Slice 6.2 implementation is limited to:
- docs;
- isolated TypeScript read API contracts;
- adapter abstraction contracts;
- pure helper functions and tests.

No runtime behavior changes are introduced.


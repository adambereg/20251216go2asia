# RF Slice 6.10 - Real Read Adapter Readiness / Source Migration Plan v1

## 1. Purpose

Slice 6.10 defines the readiness plan for moving RF entitlement preview from mock-backed reads toward real read adapters.

This is a design and migration-planning slice. It does not implement adapters, call production sources, or change claim behavior.

The goals are:
- classify future entitlement read sources by risk;
- define adapter readiness criteria;
- sequence production adapter migration source by source;
- define trust, timeout, cache, and degraded behavior;
- define rollout flags and rollback expectations;
- define acceptance tests required before any adapter can be enabled.

Prerequisites already exist in Slice 6.3-6.9:
- internal mock read endpoint and local adapter harness;
- PWA preview helper;
- gateway-safe preview proxy;
- tiny feature-flagged preview badge;
- batched preview fetch;
- safe bucket observability;
- flag matrix QA and hardening.

## 2. Non-goals

Not included:
- real adapter implementation;
- production entitlement source calls;
- NFT ownership verification;
- blockchain or TON runtime;
- Wallet/G2A integration;
- premium claim enforcement;
- claim blocking;
- claim/redeem runtime changes;
- Points runtime changes;
- DB migrations;
- generated SDK/OpenAPI edits;
- new UI features;
- analytics platform;
- external telemetry integration.

Not changed:
- claim payload;
- idempotency;
- repeatability;
- voucher lifecycle;
- preview safe DTO;
- current badge behavior;
- current flag matrix;
- observability buckets.

## 3. Current Readiness

The preview subsystem is ready for adapter planning because:
- preview is default-off and feature-flagged;
- single and batch preview routes are gateway protected;
- internal diagnostics remain admin-only;
- user-facing responses are filtered through the safe preview DTO;
- PWA helpers fail safely;
- degraded results map to temporary or unavailable states;
- observability uses aggregate safe buckets;
- Slice 6.9 covers flag/auth/DTO/failure consistency QA.

The subsystem is not ready for production truth because:
- entitlement decisions are still mock-backed;
- `mockScenario` is still a test/dev control;
- in-memory observability is not production analytics truth;
- UI premium detection still relies on current heuristics such as `pro_only` and listing `premium`;
- high-risk sources such as Wallet, NFT, G2A, and Blockchain Gateway do not yet have production read contracts in this preview path.

## 4. Source Classification

### Group A - Safe First Adapters

These sources are the safest candidates for first real read adapters.

Role / platformRole adapter:
- source of truth: gateway principal and/or platform user role service;
- owner domain: identity/platform;
- value: validates real adapter plumbing with low external dependency risk;
- risk: role drift between gateway session and backend role state;
- boundary: never trust client `subject.roleHints`.

VIP status adapter:
- source of truth: platform role/tier semantics;
- owner domain: identity/platform;
- value: close to existing RF VIP gating behavior;
- risk: confusing preview advisory behavior with paid ordinary voucher claim policy;
- boundary: do not expose role history or admin grant metadata.

Manual grant adapter:
- source of truth: future controlled admin grant source, if introduced;
- owner domain: entitlement/admin operations;
- value: supports deterministic grant/deny testing;
- risk: grant lifecycle does not yet exist as a stable production source;
- boundary: initially read-only; no grant creation from preview.

PRO invite / PRO link adapter:
- source of truth: RF PRO link / attribution / invitation contracts;
- owner domain: RF/PRO boundary;
- value: aligns with existing RF PRO attribution concepts;
- risk: leaking distribution mechanics, share-code internals, or commercial semantics;
- boundary: never imply payouts, rewards, compensation, or financial benefit.

### Group B - Medium-risk Adapters

Connect milestone adapter:
- source of truth: future entitlement-safe Connect milestone summary, not the narrative UI projection itself;
- owner domain: Connect projection / user progress;
- value: useful advisory signal for access readiness;
- risk: turning Connect narrative/progress into entitlement ownership;
- boundary: expose only normalized milestone state, not raw activity trails.

Partner whitelist adapter:
- source of truth: future partner-controlled eligibility list;
- owner domain: partner/RF operations;
- value: supports controlled partner-specific access;
- risk: PII, partner-private segmentation, and stale membership;
- boundary: no user lists or matching reasons in public DTO.

Event participation adapter:
- source of truth: future event attendance/registration source;
- owner domain: events/partner operations;
- value: supports event-bound vouchers;
- risk: source lifecycle, fraud handling, privacy of attendance;
- boundary: expose only normalized eligibility decision.

Partner invitation adapter:
- source of truth: future partner invitation contracts;
- owner domain: partner/RF operations;
- value: useful for invite-only offers;
- risk: revealing invite graph or partner allocation logic;
- boundary: public copy remains generic, such as `Требуется приглашение`.

### Group C - High-risk Future Adapters

These must remain future-only until their owner domains define safe read contracts.

Wallet / Points threshold adapter:
- source of truth: Points/Wallet service;
- owner domain: economy/wallet;
- risk: leaking balance, ledger, spend, payout, reward, recovery, or compensation details;
- rule: do not start here; do not expose balances in entitlement preview.

G2A threshold adapter:
- source of truth: future G2A/accounting threshold service;
- owner domain: G2A/economy boundary;
- risk: financial semantics and policy sensitivity;
- rule: future-only until a normalized threshold contract exists.

NFT / totem adapter:
- source of truth: future Wallet/Blockchain Gateway;
- owner domain: Wallet/Blockchain Gateway;
- risk: chain, tx, contract, token ownership, and privacy leakage;
- rule: RF must never call blockchain directly.

Badge bridge adapter:
- source of truth: future badge bridge service;
- owner domain: Wallet/Badge/Blockchain Gateway boundary;
- risk: mixing symbolic badge UX with entitlement truth;
- rule: future-only until badge semantics are normalized.

Blockchain Gateway adapter:
- source of truth: future gateway-owned normalized read endpoint;
- owner domain: Blockchain Gateway;
- risk: direct chain coupling, latency, source failures, raw proof exposure;
- rule: last adapter class, never direct RF chain calls.

## 5. Adapter Readiness Checklist

Every real read adapter must define the following before implementation:

- source of truth;
- owner domain;
- read API shape;
- auth model;
- timeout policy;
- cache policy;
- degraded behavior;
- failure mode mapping;
- trust level;
- freshness requirements;
- safe DTO mapping;
- observability bucket mapping;
- test fixtures;
- rollout flag;
- rollback plan.

Each adapter must also define:
- what it must never return to RF/PWA;
- what it may expose only internally to the entitlement orchestrator;
- which user-facing labels are allowed;
- whether stale data is acceptable for advisory preview;
- whether the source can ever participate in enforcement in a future phase.

Minimum acceptance criteria:
- adapter flag defaults off;
- adapter can be disabled independently;
- source timeout never grants access;
- source unavailable never maps to `available`;
- stale cache never grants enforcement;
- preview stays informational;
- public DTO remains unchanged;
- single and batch preview remain consistent;
- observability bucket matches public preview state.

## 6. Source-by-source Migration Sequence

### 1. Role / VIP Adapter

Why first:
- local or gateway-backed source;
- low external dependency risk;
- useful for validating the adapter contract, flagging, degraded behavior, and observability.

Requirements:
- subject must come from trusted principal or backend user role source;
- client role hints must be ignored for truth;
- role drift rules must be documented;
- timeout/degraded maps to temporary preview state.

Exit criteria:
- flag off/on tests;
- spoofed subject tests;
- single vs batch consistency;
- no claim behavior change.

### 2. Manual Grant Adapter

Why second:
- controlled operational source;
- useful for testing grant and deny lifecycle;
- can remain read-only initially.

Requirements:
- explicit source of truth must exist before implementation;
- grants must have stable lifecycle and audit owner;
- preview must never create or mutate grants.

Exit criteria:
- read-only tests;
- stale grant handling;
- revoked grant handling;
- internal-only audit metadata.

### 3. PRO Invite / PRO Link Adapter

Why third:
- builds on existing RF PRO link and attribution concepts;
- validates an RF-adjacent source without external finance or blockchain dependencies.

Requirements:
- distinguish attribution from entitlement truth;
- avoid payout/reward/commercial copy;
- normalize invite states to safe reason codes.

Exit criteria:
- expired link;
- missing invite;
- invite required;
- link source unavailable;
- no share-code internals in public DTO.

### 4. Connect Milestone Adapter

Why fourth:
- useful advisory source after base adapter plumbing is stable;
- Connect already has narrative/progress concepts.

Requirements:
- Connect must not become entitlement owner;
- adapter consumes only entitlement-safe milestone summaries;
- no raw activity history, narrative internals, or wallet facts.

Exit criteria:
- milestone met;
- milestone missing;
- stale milestone summary;
- source unavailable;
- public copy remains generic.

### 5. Partner Whitelist / Event Participation

Why later:
- requires explicit source-of-truth contracts;
- higher privacy and partner operational complexity.

Requirements:
- partner owner and update lifecycle;
- membership privacy rules;
- event lifecycle and expiry semantics.

Exit criteria:
- missing membership;
- stale whitelist;
- event ended;
- partner source unavailable.

### 6. Wallet / Points Threshold

Why future-only:
- economy boundary must be stable first;
- preview must not leak balances, ledger, spend, reward, payout, compensation, or recovery state.

Requirements:
- normalized threshold read contract;
- no balance exposure;
- no direct RF ledger reads for preview;
- no claim spend behavior changes.

Exit criteria:
- threshold met/missing through safe boolean or bucket only;
- stale economy summary;
- source unavailable;
- no financial vocabulary in preview copy.

### 7. NFT / Totem / Badge Bridge / G2A

Why last:
- requires Wallet/Blockchain Gateway contracts;
- highest risk for raw proof, chain, token, tx, and financial leakage.

Requirements:
- normalized gateway read API;
- no direct RF blockchain calls;
- no NFT contract or token identifiers in public DTO;
- no chain/tx/balance details;
- safe degraded behavior under gateway latency.

Exit criteria:
- gateway unavailable;
- proof stale;
- source timeout;
- normalized threshold missing;
- raw proof leak tests.

## 7. Adapter Contract Model

Real adapters should fit behind the current entitlement read orchestration model.

Adapter input:
- trusted subject from gateway principal or backend principal resolution;
- normalized resource (`rf_offer`, `rf_premium_voucher`, `rf_listing_offer`);
- action (`claim` for preview);
- evaluation mode (`claim_preview` for user-facing preview);
- safe RF context such as offer id, partner id, listing id, voucher class;
- source-specific timeout budget;
- cache policy hint.

Adapter output:
- source id;
- normalized source decision;
- reason code;
- degraded mode;
- stale flag;
- cache hit flag;
- optional missing requirement metadata;
- internal-only raw facts, if needed by the orchestrator;
- internal-only diagnostics, if needed for admin/debug paths.

Raw facts boundary:
- raw source facts may exist only inside the orchestrator boundary;
- raw facts must never enter the public preview DTO;
- raw facts must never be sent to PWA;
- raw facts must never be included in observability snapshots.

Normalization responsibility:
- each adapter maps source-specific states to normalized reason codes;
- orchestrator aggregates normalized source results;
- public proxy maps aggregate result to the unchanged safe preview DTO.

Source error mapping:
- timeout -> degraded `timeout_fallback`;
- source unavailable -> degraded `source_unavailable`;
- partial source -> degraded `partial_sources`;
- stale cache -> degraded `stale_cache`;
- malformed source response -> `source_unavailable` or `policy_fallback`, never `available`.

Observability tags:
- source class may be counted internally only if safe and aggregate;
- public snapshot should remain bucket/surface/degraded based;
- no adapter ids, user ids, raw facts, role hints, chain facts, or financial facts in snapshots.

Feature flags:
- umbrella real-adapter flag;
- per-source flags;
- existing preview proxy and client preview flags remain separate.

## 8. Feature Flags / Rollout

Proposed future flags:

```text
RF_ENABLE_ENTITLEMENT_REAL_ADAPTERS
RF_ENABLE_ENTITLEMENT_ROLE_ADAPTER
RF_ENABLE_ENTITLEMENT_VIP_ADAPTER
RF_ENABLE_ENTITLEMENT_MANUAL_GRANT_ADAPTER
RF_ENABLE_ENTITLEMENT_PRO_INVITE_ADAPTER
RF_ENABLE_ENTITLEMENT_CONNECT_MILESTONE_ADAPTER
RF_ENABLE_ENTITLEMENT_PARTNER_WHITELIST_ADAPTER
RF_ENABLE_ENTITLEMENT_EVENT_PARTICIPATION_ADAPTER
```

Future-only flags:

```text
RF_ENABLE_ENTITLEMENT_WALLET_ADAPTER
RF_ENABLE_ENTITLEMENT_NFT_ADAPTER
RF_ENABLE_ENTITLEMENT_G2A_ADAPTER
RF_ENABLE_ENTITLEMENT_BLOCKCHAIN_GATEWAY_ADAPTER
```

Rollout rules:
- every adapter flag defaults off;
- each adapter can be enabled independently;
- no adapter flag enables claim enforcement;
- mock fallback remains available for dev/test;
- production preview remains read-only;
- existing `RF_ENABLE_ENTITLEMENT_PREVIEW_PROXY` continues to gate user-facing preview routes;
- existing `NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW` continues to gate PWA network/UI preview;
- observability flag remains independent from adapter flags.

Rollout sequence per adapter:
1. Unit tests and fixtures only.
2. Staging with preview proxy disabled.
3. Staging with preview proxy enabled for internal users.
4. Limited preview with adapter flag enabled and PWA flag controlled.
5. Observe safe buckets and degraded rates.
6. Roll back by disabling the adapter flag.

## 9. Cache / Timeout / Degraded Policy

Global rules:
- degraded result never maps to `available`;
- unknown source never grants;
- stale cache never grants enforcement;
- preview may show `checking_or_temporarily_unavailable`;
- single and batch must remain consistent;
- cache keys must include trusted subject and resource identity;
- public DTO must not expose cache internals.

Role / VIP:
- source class: local or gateway-backed;
- TTL: short;
- timeout: temporary preview;
- stale: temporary preview;
- future enforcement: fail closed.

Manual grant:
- source class: controlled admin source;
- TTL: short/medium;
- timeout: temporary preview;
- stale: temporary preview unless explicit valid-until semantics exist;
- invalidation: required before enforcement use.

PRO invite / PRO link:
- source class: RF/PRO-adjacent;
- TTL: short/medium;
- timeout: temporary preview;
- stale: temporary preview;
- expired invite: `requires_condition` or `unavailable` depending on policy.

Connect milestone:
- source class: advisory projection summary;
- TTL: medium;
- timeout: temporary preview;
- stale: advisory-only allowed, not enforcement;
- missing milestone: `requires_condition`.

Partner whitelist / event participation:
- source class: partner/event operational source;
- TTL: short;
- timeout: temporary preview;
- stale: temporary preview unless source defines safe expiry;
- missing membership: `requires_condition`.

Wallet / Points / G2A / NFT:
- source class: future-only external or economy/gateway source;
- TTL: source-defined;
- timeout: temporary preview;
- stale: never enforcement;
- RF fallback: none;
- public DTO: no balance, ledger, token, chain, tx, proof, payout, reward, compensation, or recovery details.

## 10. Test Plan

Before an adapter can be enabled, it must pass tests for:
- feature flag off/on;
- source unavailable;
- timeout;
- stale cache;
- malformed source response;
- raw fact leak prevention;
- single vs batch consistency;
- observability bucket mapping;
- no claim behavior change;
- no enforcement;
- role/principal spoofing prevention;
- safe DTO unchanged;
- adapter disabled while other adapters remain enabled;
- preview proxy off while adapter flag on;
- observability off while adapter flag on;
- batch partial source failure;
- oversized batch behavior unchanged.

Required per-source fixtures:
- granted/available;
- missing requirement;
- temporary/degraded;
- unavailable;
- stale;
- malformed source payload;
- source timeout;
- source unavailable.

Regression requirements:
- claim payload unchanged;
- idempotency unchanged;
- repeatability unchanged;
- badge render behavior unchanged;
- PWA helper disabled behavior unchanged;
- public preview copy remains safe.

## 11. Boundary Rules

Stable rules:
- RF preview consumes normalized entitlement decisions, not raw source truth;
- PWA consumes only the safe preview DTO;
- subject truth comes from gateway/backend principal, not client-provided hints;
- Connect can provide entitlement-safe summaries, not ownership of access policy;
- Wallet/Blockchain Gateway owns wallet/NFT/chain truth;
- RF must not call blockchain directly;
- observability remains aggregate and non-personalized;
- adapter diagnostics remain internal-only.

Fields never allowed in public preview or PWA helper state:
- `auditTraceId`;
- `requestWindowId`;
- `evaluatedSources`;
- `partialResults`;
- `rawFacts`;
- `adapterId`;
- `healthStatus`;
- source diagnostics;
- wallet facts;
- NFT facts;
- G2A facts;
- tx / chain / balance / payout;
- reward / debit / compensation / recovery;
- role hints;
- subject payload.

Allowed user-facing copy remains generic:
- `Премиум-доступ доступен`;
- `Требуется условие`;
- `Требуется приглашение`;
- `Проверка доступа выполняется`;
- `Доступ временно ограничен`;
- `Премиум-доступ недоступен`.

## 12. What Remains Experimental

Still experimental after Slice 6.10:
- real adapter implementation;
- adapter source contracts;
- real production source fixtures;
- `mockScenario` as dev/test control;
- UI premium detection heuristics;
- in-memory observability counters;
- source-specific observability extensions;
- future chunking for large preview batches;
- future enforcement contract, if ever introduced.

## 13. Risks

Risks:
- mock-to-real semantic drift;
- role drift between gateway session and backend role state;
- Connect milestone projection being mistaken for entitlement ownership;
- PRO attribution being mistaken for entitlement grant;
- future Wallet/NFT/G2A adapters leaking financial or chain semantics;
- stale cache appearing as stronger truth than intended;
- adapter flags accidentally interpreted as enforcement flags;
- source-specific error codes leaking through public copy;
- batch and single paths diverging under real adapter latency.

Mitigations:
- keep adapter flags default-off;
- gate each source independently;
- keep public DTO unchanged;
- reuse Slice 6.9 matrix tests for every adapter;
- keep degraded results out of `available`;
- keep source diagnostics internal-only;
- require source ownership and rollback plan before implementation.

## 14. Future Migration Path

Recommended next steps:
1. Approve the adapter readiness checklist as the gate for all real sources.
2. Draft a dedicated Role/VIP adapter design with no runtime wiring.
3. Define source fixtures and QA matrix for Role/VIP.
4. Add adapter contract types only after the Role/VIP design is approved.
5. Implement Role/VIP behind independent default-off flags.
6. Repeat the same pattern for Manual Grant, then PRO Invite.
7. Keep Wallet/NFT/G2A future-only until their owner domains expose normalized read contracts.
8. Consider enforcement only in a separate future phase after preview has proven stable with real read adapters.

# RF Slice 6.3 - Entitlement Mock Read Endpoint / Local Adapter Harness v1

## 1. Purpose

Slice 6.3 introduces the first controlled runtime harness for entitlement read semantics.

It is intended to verify how the Slice 6, 6.1, and 6.2 contracts behave in a local deterministic runtime before production adapters or premium enforcement exist.

This slice includes:
- a mock internal read endpoint;
- a local adapter harness;
- deterministic orchestration;
- degraded-mode simulation;
- read-preview only behavior.

## 2. Non-goals

Not included:
- premium claim enforcement;
- NFT ownership verification;
- blockchain or TON runtime;
- Wallet API integration;
- G2A runtime;
- real entitlement DB;
- queues or background workers;
- Points spend changes;
- RF claim path changes;
- migrations;
- generated SDK edits;
- production entitlement service.

## 3. Endpoint Shape

Endpoint:

```text
POST /v1/rf/internal/entitlement/check
```

The route is internal, read-only, and not part of generated SDK contracts.

Request shape follows Slice 6.2 `EntitlementReadRequest` as closely as possible:
- `requestId`;
- `subject`;
- `resource`;
- `action`;
- `evaluationMode`;
- `context`;
- `requestedSources`;
- `includeAuditTrace`;
- `includeSafeLabels`;
- `requestedAt`.

Response shape follows Slice 6.2 `EntitlementReadResponse`:
- `requestId`;
- `requestWindowId`;
- `decision`;
- `reasonCode`;
- `safeLabel`;
- `evaluatedSources`;
- `missingRequirements`;
- `warnings`;
- `stale`;
- `cacheHit`;
- `degradedMode`;
- `partialResults`;
- `evaluatedAt`;
- `expiresAt`;
- `auditTraceId` when requested.

The response intentionally excludes raw adapter facts.

## 4. Feature Flag

Feature flag:

```text
RF_ENABLE_ENTITLEMENT_MOCK_READ_API
```

Default behavior:
- disabled by default;
- disabled endpoint returns `RF_ENTITLEMENT_MOCK_READ_API_DISABLED` with 404;
- endpoint does not require database initialization.

Enabled values follow existing RF flag semantics:
- `1`;
- `true`;
- `yes`;
- `on`.

The endpoint remains protected by gateway auth and admin/internal role checks.

## 5. Local Adapters

Implemented local deterministic adapters:
- Role/VIP adapter via `role`;
- PRO invite adapter via `pro_invite`;
- Connect milestone adapter via `connect_milestone`;
- Manual grant adapter via `manual_grant`.

Future-only placeholder source categories:
- `nft_totem`;
- `badge_bridge`;
- `g2a_threshold`.

Future-only placeholders do not call external systems. They normalize to unavailable/unknown-style source outcomes.

## 6. Mock Scenarios

Supported `context.mockScenario` values:
- `granted`;
- `invite_required`;
- `source_timeout`;
- `partial_sources`;
- `stale_cache`;
- `manual_grant`;
- `source_unavailable`;
- `ordinary_resource_no_gate`.

The mock scenario is test/dev control input only. It must not become product API semantics.

## 7. Orchestrator Behavior

The local orchestrator:
- receives a parsed read request;
- selects requested sources or a default source set;
- fans out to local deterministic adapters;
- normalizes adapter results;
- aggregates decision;
- applies evaluation-mode semantics;
- applies degraded-mode semantics;
- generates stable `requestWindowId`;
- generates `auditTraceId` only when requested.

The orchestrator never returns `rawFacts` in the response.

## 8. Degraded and Timeout Behavior

Rules:
- timeout cannot produce a granted `claim_enforcement` decision;
- stale cache can support soft visibility only;
- partial sources produce pending for `soft_visibility`, `claim_preview`, and `advisory_only`;
- partial sources produce denied for `claim_enforcement`;
- unknown/future-only source must not be granted;
- ordinary resources without a gate return `not_applicable` / `ordinary_resource_no_gate`.

Evaluation modes used by the harness:
- `soft_visibility`;
- `claim_preview`;
- `claim_enforcement`;
- `advisory_only`;
- `strict`.

`claim_preview` is introduced as a read-preview runtime harness mode. It is intentionally not enforcement.

## 9. RF Boundary

RF owns:
- voucher lifecycle;
- claim/redeem behavior;
- repeatability;
- existing paid ordinary voucher runtime.

This endpoint does not:
- call `claimVoucher`;
- call `redeemVoucher`;
- touch Points spend;
- write to DB;
- change offer visibility;
- alter ordinary voucher runtime.

Future RF integration may call an entitlement read service for soft visibility and claim-preview. Claim enforcement remains a later slice.

## 10. Connect Boundary

Connect may eventually consume entitlement-safe summaries:
- access available;
- invite required;
- condition pending;
- special access unlocked.

Connect must not receive:
- raw wallet facts;
- NFT contract details;
- balances;
- tx history;
- adapter diagnostics;
- audit trace content.

This slice does not add Connect UI or wallet behavior.

## 11. What Is Deliberately Not Production

Not production:
- local adapter decisions;
- `context.mockScenario`;
- future NFT/G2A placeholders;
- local deterministic `requestWindowId`;
- mock audit trace id;
- endpoint route as public API.

The harness exists to validate contract breathing room and tests.

## 12. Future Migration Path

Recommended migration:
1. Keep mock endpoint default-off.
2. Use harness to validate request/response semantics.
3. Add role/VIP/manual grant real read adapters behind a separate feature flag.
4. Add claim-preview UI only after response copy and failure semantics are approved.
5. Add PRO invite and Connect milestone real adapters.
6. Add NFT/totem and G2A adapters only after Wallet/Blockchain Gateway source contracts exist.
7. Add premium claim enforcement in a separate slice after degraded-mode behavior is proven.

## 13. Risks

Remaining risks:
- mock scenarios can be mistaken for product behavior;
- future-only source placeholders can be overinterpreted;
- degraded reads can be displayed too optimistically;
- audit trace IDs can invite requests for user-facing diagnostics;
- endpoint can become public by accident if SDK generation or gateway routing includes it.

Guardrail:
- keep route internal, feature-flagged, admin-only, and explicitly out of generated SDK scope.


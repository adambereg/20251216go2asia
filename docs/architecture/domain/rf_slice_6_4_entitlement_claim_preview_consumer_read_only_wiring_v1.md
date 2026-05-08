# RF Slice 6.4 - Entitlement Claim Preview Consumer / RF Read-only Preview Wiring v1

## 1. Purpose

Slice 6.4 introduces the first read-only consumer layer for entitlement preview in the PWA shell.

The goal is to validate how RF can build and interpret a claim-preview request without changing production claim behavior.

This slice includes:
- an isolated PWA preview helper;
- safe preview state mapping;
- safe user-facing copy;
- explicit boundary rules that preview is not enforcement.

## 2. Non-goals

Not included:
- premium claim enforcement;
- NFT ownership verification;
- blockchain or TON runtime;
- Wallet/G2A integration;
- Points spend changes;
- RF claim path changes;
- DB migrations;
- generated SDK edits;
- public API expansion;
- production entitlement service;
- Connect wallet UX.

## 3. Preview Consumer Boundary

The preview consumer lives in:

```text
apps/go2asia-pwa-shell/lib/rfEntitlementPreview.ts
```

Responsibilities:
- build entitlement preview requests for RF offer and listing-bound offer surfaces;
- call the internal mock read endpoint only when the PWA feature flag is enabled;
- map read response to UI-safe preview state;
- keep preview informational only;
- keep claim behavior unchanged.

The helper does not:
- call claim/redeem APIs;
- spend points;
- alter idempotency;
- alter repeatability;
- expose raw adapter facts;
- expose audit trace IDs to UI state.

## 4. Feature Flags

PWA feature flag:

```text
NEXT_PUBLIC_RF_ENABLE_ENTITLEMENT_PREVIEW
```

Default behavior:
- disabled by default;
- helper returns `not_enabled`;
- no network call is required;
- no UI behavior changes.

This flag is separate from the RF service mock endpoint flag:

```text
RF_ENABLE_ENTITLEMENT_MOCK_READ_API
```

Both must be treated as development/preview controls, not production entitlement switches.

## 5. Request / Response Mapping

Request shape:
- `action: claim`;
- `evaluationMode: claim_preview`;
- `subject` from current user context when available;
- `resource` as RF offer or listing-bound offer;
- `context.rf.offerId`;
- `context.rf.partnerId`;
- optional `context.rf.listingId`;
- `context.rf.voucherClass`;
- optional test/dev `context.mockScenario`;
- `includeAuditTrace: false`;
- `includeSafeLabels: true`.

Response mapping:
- `granted` + non-degraded -> `available`;
- `denied` + `invite_required` / `nft_required` / `milestone_required` -> `requires_condition`;
- `pending`, timeout, stale cache, partial sources, source unavailable -> `checking_or_temporarily_unavailable`;
- `not_applicable` / `ordinary_resource_no_gate` -> `ordinary_no_preview`;
- unknown or policy not configured -> `unavailable`.

## 6. Safe Copy

Allowed labels:
- "Премиум-доступ доступен";
- "Требуется условие";
- "Требуется приглашение";
- "Проверка доступа выполняется";
- "Доступ временно ограничен";
- "Обычный ваучер доступен без премиум-проверки".

Current copy explicitly says:
- this is informational;
- final claim behavior is unchanged;
- no entitlement enforcement exists in this slice.

Forbidden vocabulary:
- wallet sync;
- chain;
- tx;
- NFT contract;
- balance;
- payout;
- reward;
- debit;
- compensation;
- recovery;
- adapter;
- raw source;
- audit trace.

## 7. UI Scope

No production UI wiring is added in this slice.

Reason:
- the Slice 6.3 endpoint is internal/admin-only;
- public RF claim buttons currently execute production claim semantics;
- adding a visible badge now could imply enforcement or source truth before gateway/product rules exist;
- showing disabled-style UI could be mistaken for actual claim blocking.

The helper and tests prepare the boundary for a later feature-flagged UI slice.

## 8. Why Preview Is Not Enforcement

Preview is not enforcement because:
- it uses `evaluationMode: claim_preview`, not `claim_enforcement`;
- it maps response to informational UI state only;
- it does not modify claim payload;
- it does not disable/enable claim buttons;
- it does not write DB state;
- it does not spend points;
- it does not affect repeatability or idempotency.

Only a future dedicated enforcement slice may use entitlement as a runtime claim guard.

## 9. RF Boundary

RF runtime remains owner of:
- voucher lifecycle;
- claim/redeem behavior;
- repeatability;
- paid ordinary voucher behavior;
- compensation/recovery.

Slice 6.4 does not change RF service routes, store logic, or SDK generated APIs.

## 10. Connect Boundary

Connect remains narrative/progress layer.

The preview helper does not:
- read Connect wallet data;
- read NFT/G2A mocks;
- read wallet summary;
- surface audit traces;
- add Connect wallet UX.

Future Connect usage must consume entitlement-safe summaries only.

## 11. Future Migration Path

Recommended next steps:
1. Keep helper default-off.
2. Add gateway-safe internal proxy or server-side preview caller if UI preview is needed.
3. Add a small premium listing offer preview badge behind a separate feature flag.
4. Keep claim button behavior unchanged.
5. Add claim-preview analytics only after product copy is stable.
6. Add enforcement only in a later runtime slice.

## 12. Risks

Remaining risks:
- preview copy can be misread as claim permission;
- internal endpoint access from browser is not finalized;
- mock scenarios can be mistaken for production truth;
- future UI wiring can accidentally become enforcement-like if it disables claim actions.

Guardrail:
- preview state carries `informationalOnly: true` and `claimBehaviorUnchanged: true`.


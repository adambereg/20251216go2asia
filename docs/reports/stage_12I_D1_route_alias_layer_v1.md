# Stage 12I-D1 — Route Alias Layer Report

Документ: `stage_12I_D1_route_alias_layer_v1.md`  
Статус: implementation report / alias-first route governance layer  
Дата: 2026-05-23  
Scope: legacy route vocabulary aliases for `/connect/wallet`, `/space/balance`, `/space/nft` plus bounded navigation/metadata guardrails  
Mode: bounded implementation slice

## 1. Stage 12I-D1 Verdict

Stage 12I-D1 introduces a minimal alias-first route layer for legacy authority-shaped routes without deleting or hard-renaming existing paths.

The slice keeps legacy routes alive, adds safer aliases, updates internal navigation to prefer the aliases, and hardens route metadata/helper notices so route names do not imply financial wallet, accounting balance, NFT ownership, token/on-chain semantics, proof, receipt or runtime migration.

Required statement:

```text
Stage 12I-D1 completed as bounded route alias governance, not route rewrite wave, runtime/API/OpenAPI/SDK/schema change, DTO/type cleanup, Path B activation, hard migration or public launch approval.
```

Final verdict:

```text
stage_12I_D1_status: COMPLETE_AS_ROUTE_ALIAS_LAYER
task_type: alias_first_route_governance
risk_level: MEDIUM_HIGH
legacy_routes_preserved: true
safe_alias_routes_created: true
navigation_prefers_aliases: true
route_metadata_hardened: true
runtime_changes: false
api_openapi_sdk_changes: false
schema_changes: false
dto_type_changes: false
hard_route_renames: false
path_b_activation: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | Path A / Path B firewall, owner fact and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | wallet-like, dashboard, badge, projection and route-label UI boundaries |
| `docs/ai/context/security/capsule.md` | screenshot-as-proof, mock/projection proof rejection and abuse boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 route/type residue and cleanup routing |
| `docs/ai/context/routing_rules.md` | bounded context composition and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_12_x_2_legacy_route_type_vocabulary_cleanup_plan_v1.md`
- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_C2_connect_projection_labels_v1.md`
- `docs/reports/stage_12I_C3_rielt_seed_source_labels_v1.md`
- `docs/reports/stage_12I_C4_shared_projection_component_rules_v1.md`

## 3. Agents Used

| Agent | Role in D1 |
|---|---|
| AI Program Director / Orchestrator | classification, boundary control, route strategy and final synthesis |
| Frontend Developer | route/navigation audit and lightweight alias implementation guidance |
| Runtime Governance Architect | alias != runtime migration, projection != authority, no ownership drift review |
| Security / Fraud & Abuse Reviewer | fake wallet/NFT/balance authority and screenshot-as-proof risk review |
| QA Agent | route alias regression tests, grep guardrails and validation plan |
| Technical Canon Writer | report structure, canon wording and residual gap register |
| Slice Strategist | bounded implementation sequence and stop lines |

## 4. Orchestrator Classification

| Field | D1 decision |
|---|---|
| Task type | alias-first route governance |
| Risk level | `MEDIUM_HIGH` |
| Execution mode | bounded implementation |
| Primary domain | frontend route vocabulary / product-reality governance |
| Review gates | Frontend, Runtime Governance, Security/Fraud, QA, Canon, Slice Strategy |
| Exact boundary | alias routes + navigation aliasing + metadata/notices + tests/report |

Allowed and performed:

- alias routes;
- internal route mapping constants;
- safe navigation aliasing;
- route metadata hardening;
- lightweight legacy notices;
- tests/grep guardrails;
- report.

Forbidden and not performed:

- route deletion;
- hard route rename;
- API/OpenAPI/SDK/schema/runtime changes;
- DTO/type cleanup;
- broad navigation redesign;
- business logic or data flow changes;
- auth model changes;
- fake metadata;
- Path B activation.

## 5. Audit Scope

Targeted audit covered only route vocabulary surfaces and navigation entry points:

| Area | Files inspected / affected |
|---|---|
| Connect legacy route | `app/(authenticated)/connect/wallet/page.tsx`, `WalletPageClientWrapper.tsx` |
| Connect navigation/links | `components/connect/Shared/ConnectNav.tsx`, `Dashboard/ActivityFeed.tsx`, `Dashboard/BalanceCards.tsx`, `Analytics/AnalyticsView.tsx` |
| Space legacy routes | `app/(public)/space/balance/page.tsx`, `app/(public)/space/nft/page.tsx` |
| Space active/deferred routes | `app/(public)/space/activity/page.tsx`, `app/(public)/space/vouchers/page.tsx`, new alias routes |
| Space navigation/links | `components/space/Dashboard/AssetsBlock.tsx`, `components/space/Shared/SpaceNav.tsx` |
| Route protection mapping | `middleware.ts` |
| Tests / constants | `lib/routeAliases.ts`, `lib/routeAliasLayer.test.ts`, `components/connect/copy.test.ts` |

Out of audit scope:

- `/v1/wallet/summary` API vocabulary;
- OpenAPI/SDK/generated types;
- `WalletView`, `WalletData`, `NFTBadge`, `BalanceView`, `NFTView` type/component renames;
- dormant Connect Path B tabs and Space mock views;
- mock quarantine;
- projection metadata API fields;
- Path B, token, NFT, bridge, wallet, payout, cashback or accounting implementation.

## 6. Route Vocabulary Classification

| Legacy route | Classification | D1 action |
|---|---|---|
| `/connect/wallet` | authority-shaped, active, safe alias candidate, should remain live | added `/connect/activity`; navigation prefers alias; legacy route gets metadata/notice |
| `/space/balance` | authority-shaped, protected deferred surface, safe alias candidate | added `/space/activity-summary`; Space links prefer `/space/activity`, `/space/vouchers`, `/space/activity-summary`; legacy route gets metadata/notice |
| `/space/nft` | Path B-adjacent, dormant direct route, safe alias candidate | added `/space/badges`; legacy route gets metadata/notice; no active navigation wired |

Preserved route facts:

```text
/connect/wallet_exists: true
/space/balance_exists: true
/space/nft_exists: true
```

## 7. Alias Strategy Chosen

Chosen strategy: `alias-first / legacy-alive / navigation-prefers-safe`.

Alias mapping:

```text
/connect/wallet  -> /connect/activity
/space/balance   -> /space/activity-summary
/space/nft       -> /space/badges
```

Implementation posture:

- new alias routes are route shells/wrappers, not runtime migrations;
- old routes remain accessible for deep links;
- internal navigation prefers aliases where there were active internal links;
- old routes use legacy alias metadata/helper notices;
- no permanent redirect or 301-style assumption was introduced;
- `/v1/wallet/summary` remains frozen and unchanged.

## 8. Aliases / Navigation Changes Introduced

Created:

| File | Purpose |
|---|---|
| `apps/go2asia-pwa-shell/lib/routeAliases.ts` | bounded route alias constants and legacy notices |
| `apps/go2asia-pwa-shell/app/(authenticated)/connect/activity/page.tsx` | safe Connect activity alias over existing WalletView projection |
| `apps/go2asia-pwa-shell/app/(public)/space/activity-summary/page.tsx` | safe deferred Space activity summary alias |
| `apps/go2asia-pwa-shell/app/(public)/space/badges/page.tsx` | safe deferred Space off-chain badge alias |
| `apps/go2asia-pwa-shell/lib/routeAliasLayer.test.ts` | static guardrail for aliases, legacy preservation, navigation preference and metadata boundaries |

Updated:

| File | Change |
|---|---|
| `app/(authenticated)/connect/wallet/page.tsx` | legacy metadata and notice clarify non-wallet projection posture |
| `app/(public)/space/balance/page.tsx` | legacy metadata and notice clarify non-accounting/non-wallet posture |
| `app/(public)/space/nft/page.tsx` | legacy metadata and notice clarify off-chain/deferred badge posture |
| `components/connect/Shared/ConnectNav.tsx` | Connect navigation now links to `/connect/activity`; legacy wallet remains active-state-compatible |
| `components/connect/Dashboard/ActivityFeed.tsx` | "Показать все" now links to safe Connect activity alias |
| `components/connect/Dashboard/BalanceCards.tsx` | history CTA now uses route alias constant |
| `components/connect/Analytics/AnalyticsView.tsx` | activity CTA now uses route alias constant |
| `components/space/Dashboard/AssetsBlock.tsx` | quick actions now prefer `/space/activity`, `/space/vouchers`, `/space/activity-summary` instead of `/space/balance` |
| `middleware.ts` | adds `/space/activity-summary(.*)` to match legacy `/space/balance` protection posture |
| `components/connect/copy.test.ts` | includes `/connect/activity` in active Connect projection guardrail |

Auth posture:

```text
/space/activity-summary follows /space/balance protected posture: true
/space/badges does not change /space/nft auth posture: true
auth_model_changed: false
```

## 9. Governance Review

Runtime Governance:

- alias routes do not create new canonical state;
- alias routes do not migrate or rename API/runtime paths;
- `/v1/wallet/summary` remains unchanged;
- no lifecycle, owner fact, projection generation or DTO behavior changed;
- `wallet != financial_wallet`, `balance != accounting_balance`, `NFT != ownership_authority` preserved.

Security / Fraud:

- screenshots of active navigation are less likely to show authority-shaped route labels;
- legacy route notices reduce fake wallet/balance/NFT proof interpretation;
- no active token, bridge, payout, cashback, withdrawal or ownership surface was introduced;
- no fake receipt/proof metadata was added.

QA:

- old and alias route files are asserted by tests;
- navigation preference is asserted by tests;
- metadata hallucination terms are rejected in alias surfaces;
- full test suite passes.

Canon:

- D1 remains a bounded route alias slice;
- route/type/API cleanup remains separate;
- Path B remains inactive;
- no public launch claim is implied.

## 10. Validation Command Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Allowed baseline findings: 19 |
| `pnpm guardrails:mock-env:check` | Passed | Warnings / allowed references: 30 |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Exit code 0 |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 19 files, 112 tests |
| `pnpm -C apps/go2asia-pwa-shell test -- lib/routeAliasLayer.test.ts components/connect/copy.test.ts` | Passed | 2 files, 9 tests |
| `git diff --check` | Passed | No whitespace errors |
| IDE lints for changed files | Passed | No linter errors found |

Targeted grep:

| Scope | Result |
|---|---|
| `app/**` route metadata/surfaces | Matches are legacy alias disclaimers or negative statements: not financial wallet/accounting balance/NFT ownership/on-chain |
| `components/connect/**` active surfaces | Navigation no longer hardcodes `/connect/wallet`; remaining wallet matches are `/v1/wallet/summary`, legacy tests, dormant Path B components or negative copy |
| `components/space/**` active surfaces | `AssetsBlock` no longer links to `/space/balance`; remaining matches are legacy type/mock/dormant surfaces or auth token utility |
| `lib/**` | Route alias constants/tests intentionally contain legacy path vocabulary and negative guardrails |

## 11. Remaining Route / Type Gaps

| Gap | Status / owner |
|---|---|
| `/v1/wallet/summary` API vocabulary remains wallet-shaped | Frozen until separate runtime/API/OpenAPI/SDK cleanup slice |
| `WalletView`, `WalletData`, `BalanceCards` names remain | Future alias-first component/type cleanup, not D1 |
| `NFTBadge`, `NFTView`, `NFTTab`, `BridgeModal`, `G2ATab` residues remain | Future Path B quarantine/type cleanup slice |
| `/space/nft` remains as legacy direct route | Preserved for compatibility; safe alias `/space/badges` exists |
| `/space/balance` remains as legacy direct route | Preserved for compatibility; safe alias `/space/activity-summary` exists |
| Route aliases do not implement API metadata fields | Correct; future metadata slice only with approved runtime/API contract |
| Public launch/support-proof readiness remains blocked | Correct; D1 does not approve launch or support-proof claims |

## 12. Acceptance Checklist

| Criteria | Result |
|---|---|
| Legacy authority-shaped routes classified and bounded | Passed |
| Safe alias layer introduced where justified | Passed |
| Old routes remain functional | Passed |
| Navigation semantics improved | Passed |
| No runtime/API/OpenAPI/SDK/schema changes | Passed |
| No breaking route migration | Passed |
| No Path B activation | Passed |
| No fake wallet/NFT authority introduced | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |

Must remain true:

```text
wallet != financial_wallet
balance != accounting_balance
NFT != ownership_authority
projection != authority
mock_data != proof
Path_B_inactive = true
public_launch_implied = false
```

## 13. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-D2 — Route Alias Adoption / Legacy Link Guardrails
```

Goal:

```text
Extend route alias constants to remaining docs/tests/navigation surfaces and add a narrower guardrail that prevents new active navigation links to /connect/wallet, /space/balance and /space/nft while preserving legacy route files.
```

Alternative bounded next slice:

```text
Stage 12I-D2 — Connect/Space Component Type Vocabulary Alias Plan
```

Goal:

```text
Plan alias-first component/type cleanup for WalletView, WalletData, BalanceCards and NFTBadge without touching runtime/API/OpenAPI/SDK/schema or Path B.
```

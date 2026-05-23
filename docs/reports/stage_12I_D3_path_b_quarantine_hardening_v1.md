# Stage 12I-D3 — Path B Quarantine Hardening Report

Документ: `stage_12I_D3_path_b_quarantine_hardening_v1.md`  
Статус: implementation report / dormant Path B quarantine hardening  
Дата: 2026-05-23  
Scope: dormant Path B-adjacent component exposure, public barrels, route import guardrails and static quarantine boundaries  
Mode: bounded implementation slice

## 1. Stage 12I-D3 Verdict

Stage 12I-D3 reinforces the quarantine around dormant Path B-adjacent UI surfaces without deleting future architecture or wiring any Path B behavior into active routes.

The slice reduces accidental activation risk by trimming the broad Space public barrel, preserving explicit deferred compatibility sub-barrels, marking mock-heavy dormant views as not route-safe, and adding static guardrails that block active app route imports of Path B components.

Required statement:

```text
Stage 12I-D3 completed as bounded dormant Path B quarantine hardening, not Path B implementation, runtime/API/OpenAPI/SDK/schema change, mock replacement, route rewrite, data-flow change, token/NFT/bridge activation or public launch approval.
```

Final verdict:

```text
stage_12I_D3_status: COMPLETE_AS_PATH_B_QUARANTINE_HARDENING
task_type: dormant_path_b_quarantine_hardening
risk_level: HIGH
public_barrel_exposure_reduced: true
route_wiring_guardrails_added: true
legacy_compatibility_sub_barrels_preserved: true
dormant_components_deleted: false
runtime_changes: false
api_openapi_sdk_changes: false
schema_changes: false
data_flow_changes: false
path_b_activation: false
mock_surface_activation: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | Path A / Path B firewall, owner fact and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | wallet-like UI, badge, projection, mock and Path B UI quarantine rules |
| `docs/ai/context/security/capsule.md` | mock-as-proof, screenshot-as-proof, support-proof and fake ownership boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 route/type/mock residue and cleanup routing |
| `docs/ai/context/routing_rules.md` | bounded context composition and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_12_x_2_legacy_route_type_vocabulary_cleanup_plan_v1.md`
- `docs/architecture/domain/stage_12_x_3_mock_quarantine_inventory_v1.md`
- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_D1_route_alias_layer_v1.md`
- `docs/reports/stage_12I_D2_type_component_alias_layer_v1.md`

## 3. Agents Used

| Agent | Role in D3 |
|---|---|
| AI Program Director / Orchestrator | classification, scope boundary, review gates and final synthesis |
| Frontend Developer | dormant component exposure audit and public barrel hardening |
| Runtime Governance Architect | alias != activation, no runtime/API/schema/data-flow change review |
| Security / Fraud & Abuse Reviewer | fake NFT/wallet/token/bridge authority and screenshot-as-proof risk review |
| QA Agent | static route import, public barrel and navigation guardrails |
| Technical Canon Writer | report structure, canon wording and residual gap register |
| Slice Strategist | bounded sequence, stop lines and next-slice recommendation |

## 4. Orchestrator Classification

| Field | D3 decision |
|---|---|
| Task type | dormant Path B quarantine hardening |
| Risk level | `HIGH` |
| Execution mode | bounded implementation |
| Primary domain | frontend public export surface / product-reality governance |
| Review gates | Frontend, Runtime Governance, Security/Fraud, QA, Canon, Slice Strategy |
| Exact boundary | barrel hardening + deprecation/quarantine comments + static route import guardrails + report |

Allowed and performed:

- public barrel cleanup;
- explicit quarantine/deprecation comments;
- route import denylist tests;
- active navigation/public barrel static guardrails;
- report.

Forbidden and not performed:

- Path B activation;
- deleting major dormant components;
- route rewrites or permanent redirects;
- runtime/API/OpenAPI/SDK/schema changes;
- token, NFT, G2A, bridge, wallet, payout or cashback implementation;
- business logic or data-flow changes;
- broad folder refactor;
- mock replacement with live runtime.

## 5. Audit Scope

Targeted audit covered only dormant Path B-adjacent surfaces and public exposure points:

| Area | Files inspected / affected |
|---|---|
| Connect dormant Path B components | `components/connect/Wallet/NFTTab.tsx`, `G2ATab.tsx`, `BridgeModal.tsx`, `Wallet/index.ts` |
| Space mock-heavy dormant views | `components/space/Balance/BalanceView.tsx`, `components/space/NFT/NFTView.tsx` |
| Space public barrels | `components/space/index.ts`, `components/space/Balance/index.ts`, `components/space/NFT/index.ts` |
| Active route import scope | `app/(authenticated)/connect/**`, `app/(public)/space/**`, broader `app/**` grep |
| Active navigation scope | `components/connect/Shared/ConnectNav.tsx`, `components/space/Dashboard/AssetsBlock.tsx` |
| Tests / guardrails | `lib/pathBQuarantine.test.ts`, existing D1/D2 guardrails |

Out of audit scope:

- `/v1/wallet/summary` API vocabulary;
- OpenAPI, SDK and generated types;
- Space route rewrites;
- Connect/Space mock data movement or deletion;
- Quest reward preview vocabulary cleanup;
- Pulse/Guru/RF public barrel mock quarantine;
- projection metadata API fields;
- Path B runtime or token/bridge/NFT implementation.

## 6. Path B Classification

| Surface | Current state | Classification | D3 action |
|---|---|---|---|
| `NFTTab` | Dormant direct-path legacy component; not exported from `Wallet/index.ts`; not route-imported | dormant-but-safe, route-wiring risk if exported later, deprecation already present | Kept untouched; added barrel guardrail comment and test to prevent public export / route import |
| `G2ATab` | Dormant direct-path legacy component; not exported from `Wallet/index.ts`; inert explainer | dormant-but-safe, token semantics risk if route-wired | Kept untouched; added barrel guardrail comment and test |
| `BridgeModal` | Dormant direct-path legacy modal; props preserved but ignored by inert UI | high route-wiring risk; bridge/top-up/withdraw semantics must remain inactive | Kept untouched; added barrel guardrail comment and test |
| `BalanceView` | Space mock-heavy view importing `mockTransactionsExtended` and `mockDashboardStats` | mock-backed, public-barrel exposed before D3, internal-only candidate | Removed from broad Space barrel; kept explicit deprecated sub-barrel alias |
| `NFTView` | Space mock-heavy view importing `mockBadgesExtended` | mock-backed, public-barrel exposed before D3, Path B vocabulary risk | Removed from broad Space barrel; kept explicit deprecated sub-barrel alias |
| `SpaceActivitySummaryDeferredView` | D2 compatibility alias over `BalanceView` | compatibility export required, not route-safe | Preserved in explicit sub-barrel with `@deprecated` quarantine comment |
| `SpaceBadgesDeferredView` | D2 compatibility alias over `NFTView` | compatibility export required, not route-safe | Preserved in explicit sub-barrel with `@deprecated` quarantine comment |
| Space static alias/legacy route pages | Static deferred pages, not importing `BalanceView`/`NFTView` | dormant route-safe as static placeholders | Guarded by route import denylist test |

## 7. Quarantine Strategy Chosen

Chosen strategy: `public-barrel trim / explicit deferred compatibility / static route denylist`.

Rules applied:

- broad module barrels must not expose mock-heavy Path B-adjacent views by default;
- direct sub-barrels may preserve compatibility only with explicit deprecated/quarantine wording;
- active app routes must not import or render `NFTTab`, `G2ATab`, `BridgeModal`, `NFTView` or `BalanceView`;
- alias names remain compatibility names, not activation signals;
- static deferred route pages remain preferred over mock-backed views.

Doctrine preserved:

```text
Path_B_inactive = true
NFT != ownership_authority
wallet != financial_wallet
mock_data != proof
projection != authority
alias != activation
```

## 8. Exports / Barrels / Guardrails Changed

Updated:

| File | Change |
|---|---|
| `apps/go2asia-pwa-shell/components/space/index.ts` | Removed broad `export * from './Balance'` and `export * from './NFT'`; added D3 quarantine comment |
| `apps/go2asia-pwa-shell/components/space/Balance/index.ts` | Preserved explicit compatibility export with `@deprecated` not-route-safe comment |
| `apps/go2asia-pwa-shell/components/space/NFT/index.ts` | Preserved explicit compatibility export with `@deprecated` not-route-safe comment |
| `apps/go2asia-pwa-shell/components/space/Balance/BalanceView.tsx` | Added `@deprecated` mock-heavy / not-route-safe comment |
| `apps/go2asia-pwa-shell/components/space/NFT/NFTView.tsx` | Added `@deprecated` mock-heavy / not-route-safe comment |
| `apps/go2asia-pwa-shell/components/connect/Wallet/index.ts` | Added explicit note that `NFTTab`, `G2ATab` and `BridgeModal` remain direct-path legacy components only |

Created:

| File | Purpose |
|---|---|
| `apps/go2asia-pwa-shell/lib/pathBQuarantine.test.ts` | Static guardrail for route imports, public barrels and activation vocabulary |

The new guardrail asserts:

- active app routes do not import or render `NFTTab`, `G2ATab`, `BridgeModal`, `NFTView`, `BalanceView`;
- app routes do not import Space `Balance` / `NFT` submodules;
- broad Space barrel does not export `Balance` / `NFT`;
- Connect Wallet barrel does not export dormant Path B components;
- explicit Space deferred sub-barrels retain compatibility aliases and `@deprecated` posture;
- active route/navigation source avoids positive wallet/token/bridge/payout/cashback activation terms.

## 9. Governance Review

Runtime Governance:

- no canonical state, owner fact, projection generation, lifecycle or data flow changed;
- aliases and exports remain compile-time/public-surface controls only;
- no runtime/API/OpenAPI/SDK/schema work was introduced;
- route pages remain static/deferred where Path B-shaped surfaces exist.

Security / Fraud:

- Space mock-heavy views are less discoverable from the broad public barrel;
- direct route imports of Path B components are statically blocked;
- no NFT ownership, token wallet, bridge, top-up, withdraw, payout or cashback UI was activated;
- negative/deferred NFT/on-chain route wording remains allowed only as non-activation disclaimers.

QA:

- D3 adds a focused static test and keeps D1/D2 guardrails passing;
- full PWA test suite passes;
- required mock guardrails remain green.

Canon:

- D3 stays within bounded hardening;
- future Path B architecture remains possible through explicit direct-path/deferred imports;
- no public launch, production readiness or support-proof claim is implied.

## 10. Validation Command Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Allowed baseline findings: 19 |
| `pnpm guardrails:mock-env:check` | Passed | Warnings / allowed references: 30 |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Exit code 0; existing warnings outside D3 scope remain |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 21 files, 118 tests |
| `pnpm -C apps/go2asia-pwa-shell test -- lib/pathBQuarantine.test.ts lib/typeComponentAliasLayer.test.ts lib/routeAliasLayer.test.ts` | Passed | 3 files, 10 tests |
| IDE lints for changed files | Passed | No linter errors found |

Targeted grep:

| Scope / query | Result |
|---|---|
| `NFTTab` in `app/**` | No matches |
| `G2ATab` in `app/**` | No matches |
| `BridgeModal` in `app/**` | No matches |
| `NFTView` in `app/**` | No matches |
| `BalanceView` in `app/**` | No matches |
| `export * from './Balance'` / `export * from './NFT'` in Space public barrel | No matches |
| dormant Path B exports in `components/**/index.ts` | No route-wiring exports found; Connect comment-only occurrence is intentional |
| `wallet balance`, `NFT ownership`, `on-chain`, `bridge`, `token`, `cashback`, `payout` in active app routes | Matches are negative/deferred Space disclaimers only |
| active component `href` to `bridge/g2a/nft/wallet/balance/token/cashback/payout` | No matches |

## 11. Remaining Path B Gaps

| Gap | Status / owner |
|---|---|
| Direct-path imports of `NFTTab`, `G2ATab`, `BridgeModal` remain possible by explicit file path | Accepted compatibility residue; guarded against route/public-barrel exposure |
| `BalanceView` / `NFTView` sub-barrels still exist | Preserved for compatibility and future quarantine work, marked deprecated / not route-safe |
| Space mock data and mock-heavy internals remain | Future mock quarantine slice; D3 did not move/delete mock corpora |
| Quest `mockQuests` / `mockNFTBadges` remain route-reachable in Quest complete legacy flow | Future Quest/mock quarantine slice, not D3 |
| Pulse/Guru/RF public barrel mock exposure remains from Stage 12.x.3 inventory | Future mock/public barrel containment slice |
| API/SDK `wallet` vocabulary remains | Frozen until separate runtime/API/OpenAPI/SDK cleanup slice |
| Projection metadata fields remain unimplemented | Future runtime/API metadata slice only |

## 12. Acceptance Checklist

| Criteria | Result |
|---|---|
| Dormant Path B surfaces classified | Passed |
| Public exposure reduced where safe | Passed |
| Route wiring risks reduced | Passed |
| Guardrails/tests added | Passed |
| Compatibility exports preserved where needed | Passed |
| No major dormant components deleted | Passed |
| No runtime/API/OpenAPI/SDK/schema changes | Passed |
| No data-flow or business logic changes | Passed |
| No Path B activation | Passed |
| No mock-backed active route introduced | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |

Must remain true:

```text
Path_B_inactive = true
NFT != ownership_authority
wallet != financial_wallet
mock_data != proof
projection != authority
alias != activation
public_launch_implied = false
```

## 13. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-D4 — Mock Public Barrel / Route-Reachable Mock Quarantine
```

Goal:

```text
Contain remaining mock-heavy public exposure identified by Stage 12.x.3, especially Pulse/Guru public mock barrels and selected RF/Quest route-reachable mock surfaces, without replacing mocks with fake runtime or changing API/schema/data flow.
```

Alternative bounded next slice:

```text
Stage 12I-D4 — Quest Reward Preview Vocabulary Alias Layer
```

Goal:

```text
Classify and alias Quest rewardPoints / reward preview vocabulary in active Quest UI and PRO editor surfaces without changing Quest runtime/API/OpenAPI/SDK contracts.
```

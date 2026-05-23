# Stage 12I-D2 — Type / Component Alias Layer Report

Документ: `stage_12I_D2_type_component_alias_layer_v1.md`  
Статус: implementation report / alias-first type and component vocabulary layer  
Дата: 2026-05-23  
Scope: legacy type/component vocabulary aliases for Connect, Space and Quest surfaces adjacent to Stage 12.x route/type cleanup  
Mode: bounded implementation slice

## 1. Stage 12I-D2 Verdict

Stage 12I-D2 introduces a minimal alias-first layer for legacy authority-shaped TypeScript and component vocabulary without breaking imports or doing a mass rename.

The slice preserves legacy exports, adds safer aliases for new bounded imports, moves only the D1 canonical Connect activity route and route-adjacent Connect dashboard usage to safer aliases, and adds a static guardrail test that verifies legacy compatibility and Path B quarantine boundaries.

Required statement:

```text
Stage 12I-D2 completed as bounded type/component alias governance, not mass type rename wave, component architecture rewrite, runtime/API/OpenAPI/SDK/schema change, generated SDK change, data-flow change, Path B activation or public launch approval.
```

Final verdict:

```text
stage_12I_D2_status: COMPLETE_AS_TYPE_COMPONENT_ALIAS_LAYER
task_type: alias_first_type_component_vocabulary_governance
risk_level: MEDIUM_HIGH
legacy_exports_preserved: true
safe_alias_exports_created: true
active_route_adjacent_imports_prefer_aliases: true
runtime_changes: false
api_openapi_sdk_changes: false
schema_changes: false
generated_sdk_changes: false
mass_rename_wave: false
path_b_activation: false
mock_surface_activation: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | Path A / Path B firewall, owner fact and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | wallet-like UI, badge, projection, mock and proof-class wording boundaries |
| `docs/ai/context/security/capsule.md` | mock/projection proof rejection, screenshot-as-proof and fake ownership risks |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 route/type residue and cleanup routing |
| `docs/ai/context/routing_rules.md` | bounded context composition and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_12_x_2_legacy_route_type_vocabulary_cleanup_plan_v1.md`
- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_C2_connect_projection_labels_v1.md`
- `docs/reports/stage_12I_C4_shared_projection_component_rules_v1.md`
- `docs/reports/stage_12I_D1_route_alias_layer_v1.md`

## 3. Agents Used

| Agent | Role in D2 |
|---|---|
| AI Program Director / Orchestrator | classification, boundary control, alias strategy and final synthesis |
| Frontend Developer | targeted type/component vocabulary audit and safe alias candidates |
| Runtime Governance Architect | alias != runtime migration and component alias != behavior change review |
| Security / Fraud & Abuse Reviewer | fake wallet/NFT/ownership/reward-grant/payout/cashback risk review |
| QA Agent | alias regression tests, grep guardrails and validation plan |
| Technical Canon Writer | report structure, canon wording and residual gap register |
| Slice Strategist | bounded implementation sequence and stop lines |

## 4. Orchestrator Classification

| Field | D2 decision |
|---|---|
| Task type | alias-first type/component vocabulary governance |
| Risk level | `MEDIUM_HIGH` |
| Execution mode | bounded implementation |
| Primary domain | frontend type/component vocabulary / product-reality governance |
| Review gates | Frontend, Runtime Governance, Security/Fraud, QA, Canon, Slice Strategy |
| Exact boundary | compatibility aliases + route-adjacent import cleanup + guardrail test + report |

Allowed and performed:

- alias types;
- alias component exports;
- compatibility exports while preserving legacy names;
- safer imports in bounded route-adjacent surfaces;
- deprecation/compatibility comments on aliases;
- focused static guardrail test;
- report.

Forbidden and not performed:

- breaking type rename;
- removing legacy exports;
- broad refactor or folder rename;
- runtime/API/OpenAPI/SDK/schema changes;
- generated SDK type changes;
- data-flow or business-logic changes;
- Path B activation;
- mock surface activation;
- design-system rewrite.

## 5. Audit Scope

Targeted audit covered only Stage 12.x.2 and D1 residual vocabulary surfaces:

| Area | Files inspected / affected |
|---|---|
| Connect active activity projection | `components/connect/Wallet/WalletView.tsx`, `components/connect/Wallet/index.ts`, `app/(authenticated)/connect/activity/page.tsx` |
| Connect dashboard summary | `components/connect/Dashboard/BalanceCards.tsx`, `DashboardContent.tsx`, `Dashboard/index.ts` |
| Connect type vocabulary | `components/connect/types.ts` |
| Quest off-chain badge vocabulary | `components/quest/types.ts` |
| Space deferred mock/view vocabulary | `components/space/types.ts`, `components/space/Balance/index.ts`, `components/space/NFT/index.ts` |
| Active route guardrail scope | `app/(authenticated)/connect/activity`, Space alias/legacy route pages |
| Tests | `lib/typeComponentAliasLayer.test.ts` |

Out of audit scope:

- `/v1/wallet/summary` API vocabulary;
- OpenAPI, generated SDK and schema files;
- route deletion or permanent redirect;
- dormant Connect `G2ATab`, `NFTTab`, `BridgeModal` behavior;
- Space mock view route wiring;
- Quest reward runtime or PRO editor fields;
- mock quarantine implementation;
- projection metadata API fields.

## 6. Type / Component Vocabulary Classification

| Legacy item | Classification | D2 action |
|---|---|---|
| `WalletView` | authority-shaped but active; safe alias candidate | added `ConnectActivityView` compatibility export; D1 `/connect/activity` imports alias |
| `WalletData` | legacy wallet-shaped type; mostly mock/dormant | added `ConnectActivityProjectionData` alias; legacy type preserved |
| `BalanceCards` | authority-shaped dashboard component name; active | added `ConnectActivitySummaryCards` alias; `DashboardContent` imports alias |
| `NFTBadge` in Connect | Path B-adjacent name for off-chain badge metadata | added `OffChainBadgePreview` alias; legacy type preserved |
| `NFTWalletData` | Path B-adjacent mock/dormant collection shape | added `BadgeCollectionPreviewData` alias; legacy type preserved |
| `Reward` in Connect | generic reward-shaped preview type | added `ParticipationPreview` alias; legacy type preserved |
| `NFTBadgeRarity` / `NFTBadgeCategory` in Quest | Path B-adjacent metadata names | added `OffChainBadgeRarity` / `OffChainBadgeCategory` aliases |
| `NFTBadge` in Quest | high-blast-radius off-chain badge type | added `OffChainBadgePreview` alias; legacy type preserved |
| `NFTBadge` in Space | Path B-adjacent mock/deferred badge type | added `SpaceOffChainBadgePreview` alias; legacy type preserved |
| `BalanceView` | dormant/mock-heavy Space view | added `SpaceActivitySummaryDeferredView` export alias only; not route-wired |
| `NFTView` | dormant/mock-heavy Space view | added `SpaceBadgesDeferredView` export alias only; not route-wired |
| `NFTTab`, `G2ATab`, `BridgeModal` | dormant Path B-adjacent components | intentionally untouched; future quarantine slice |
| `rewardPoints` | active Quest/API-shaped UI field | classified as future Quest/API-specific slice; no D2 rename |
| `earned_rewards` | API-shaped referral field | classified as blocked until API/SDK or mapping slice; no D2 rename |

## 7. Alias Strategy Chosen

Chosen strategy: `alias-first / legacy-preserved / bounded adoption`.

Rules applied:

- add safer alias exports beside legacy names;
- keep legacy exports import-compatible;
- use safer imports only in D1-created or directly route-adjacent active surfaces;
- avoid file/folder moves;
- avoid mass import churn;
- do not rewrite API-shaped fields;
- keep dormant Path B components unwired.

Doctrine preserved:

```text
type_alias != runtime_migration
component_alias != behavior_change
wallet != financial_wallet
balance != accounting_balance
NFT != ownership_authority
reward_preview != reward_grant
```

## 8. Aliases / Compatibility Exports Introduced

| Legacy export | Safer alias | Location |
|---|---|---|
| `WalletView` | `ConnectActivityView` | `components/connect/Wallet/index.ts` |
| `BalanceCards` | `ConnectActivitySummaryCards` | `components/connect/Dashboard/BalanceCards.tsx`, `Dashboard/index.ts` |
| `WalletData` | `ConnectActivityProjectionData` | `components/connect/types.ts` |
| `NFTBadge` | `OffChainBadgePreview` | `components/connect/types.ts`, `components/quest/types.ts` |
| `NFTWalletData` | `BadgeCollectionPreviewData` | `components/connect/types.ts` |
| `Reward` | `ParticipationPreview` | `components/connect/types.ts` |
| `NFTBadgeRarity` | `OffChainBadgeRarity` | `components/quest/types.ts` |
| `NFTBadgeCategory` | `OffChainBadgeCategory` | `components/quest/types.ts` |
| `NFTBadge` | `SpaceOffChainBadgePreview` | `components/space/types.ts` |
| `BalanceView` | `SpaceActivitySummaryDeferredView` | `components/space/Balance/index.ts` |
| `NFTView` | `SpaceBadgesDeferredView` | `components/space/NFT/index.ts` |

## 9. Active Import Changes

Changed active/bounded imports:

- `app/(authenticated)/connect/activity/page.tsx` now imports `ConnectActivityView` from the Connect Wallet barrel.
- `components/connect/Dashboard/DashboardContent.tsx` now imports and renders `ConnectActivitySummaryCards`.

Preserved intentionally:

- `app/(authenticated)/connect/wallet/WalletPageClientWrapper.tsx` still imports `WalletView` as legacy compatibility route surface.
- Space alias routes remain static deferred pages and do not wire `BalanceView` or `NFTView`.
- `NFTTab`, `G2ATab` and `BridgeModal` are not imported by app routes.

## 10. Governance Review

Runtime Governance:

- aliases do not create new canonical state;
- aliases do not migrate runtime/API paths;
- aliases do not change component behavior;
- no lifecycle, owner fact, projection generation or DTO behavior changed;
- `/v1/wallet/summary`, OpenAPI and SDK remain unchanged.

Security / Fraud:

- no fake wallet, NFT ownership, on-chain, bridge, payout or cashback semantics were introduced;
- reward-shaped aliases are named as previews/participation, not grants;
- dormant Path B components remain unwired;
- screenshots of canonical route-adjacent code now carry safer internal vocabulary.

QA:

- legacy names are explicitly preserved in the alias guardrail;
- safer aliases are asserted by static tests;
- active app routes are checked for Path B component imports;
- full PWA test suite passes.

Canon:

- D2 remains bounded to alias/type/component vocabulary;
- no mass rename, design-system rewrite or API metadata implementation occurred;
- public launch and support-proof readiness remain not implied.

## 11. Validation Command Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Allowed baseline findings: 19 |
| `pnpm guardrails:mock-env:check` | Passed | Warnings / allowed references: 30 |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Exit code 0; existing warnings outside D2 scope remain |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 20 files, 115 tests |
| `git diff --check` | Passed | No whitespace errors |
| IDE lints for changed files | Passed | No linter errors found |

Targeted grep:

| Scope | Result |
|---|---|
| Active app routes for legacy component/type names | Remaining matches are Quest `rewardPoints` API-shaped preview fields, Guru `reward_points` mapping, and legacy `/connect/wallet` wrapper using `WalletView` |
| Public component barrels | Legacy exports remain paired with safer aliases; no Path B route wiring found |
| Active app routes for `wallet balance`, `NFT ownership`, `on-chain`, `bridge`, `payout`, `cashback` | Matches only Space badge/nft negative/deferred disclaimers for NFT/on-chain inactivity |
| Component public barrels for authority phrases | No matches |
| D2 guardrail test | Asserts legacy preservation, safer aliases, and no `G2ATab`/`NFTTab`/`BridgeModal`/`NFTView`/`BalanceView` imports in app route scope |

## 12. Remaining Type / Component Gaps

| Gap | Status / owner |
|---|---|
| `/v1/wallet/summary` and SDK wallet vocabulary | Frozen until separate runtime/API/OpenAPI/SDK cleanup slice |
| `earned_rewards` referral field | API-shaped compatibility field; future mapping/API vocabulary slice |
| Quest `rewardPoints` | Active API-shaped preview field; future Quest-specific preview vocabulary/API slice |
| Generic `Reward` outside Connect | Context-specific future slices only; avoid global rename |
| Dormant `G2ATab`, `NFTTab`, `BridgeModal` | Future Path B quarantine slice; D2 leaves unwired |
| Space mock-heavy `BalanceView` / `NFTView` internals | Future mock quarantine/type cleanup; D2 only adds compatibility aliases |
| Public Space barrel still exports mock-heavy groups | Existing Stage 12.x.3 gap; not changed by D2 |
| Projection metadata fields | Future runtime/API metadata slice only; D2 did not invent them |

## 13. Acceptance Checklist

| Criteria | Result |
|---|---|
| Key legacy type/component vocabulary classified | Passed |
| Safe aliases introduced where justified | Passed |
| Legacy exports preserved | Passed |
| Active new/route-adjacent imports prefer safer aliases where bounded | Passed |
| No runtime/API/OpenAPI/SDK/schema changes | Passed |
| No breaking import migration | Passed |
| No Path B activation | Passed |
| No mock surface activation | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |

Must remain true:

```text
type_alias != runtime_migration
component_alias != behavior_change
wallet != financial_wallet
balance != accounting_balance
NFT != ownership_authority
reward_preview != reward_grant
mock_data != proof
Path_B_inactive = true
public_launch_implied = false
```

## 14. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-D3 — Path B Dormant Component Quarantine
```

Goal:

```text
Contain dormant Connect/Space Path B-adjacent components and public barrel exposure for G2ATab, NFTTab, BridgeModal, BalanceView and NFTView without route-wiring them, deleting compatibility exports, or changing runtime/API/schema.
```

Alternative bounded next slice:

```text
Stage 12I-D3 — Quest Reward Preview Vocabulary Alias Layer
```

Goal:

```text
Classify and alias Quest rewardPoints / reward preview vocabulary in active Quest UI and PRO editor surfaces without changing Quest runtime/API/OpenAPI/SDK contracts.
```

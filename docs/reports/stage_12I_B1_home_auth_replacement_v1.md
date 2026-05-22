# Stage 12I-B1 — Home Auth Replacement Report

Документ: `stage_12I_B1_home_auth_replacement_v1.md`  
Статус: implementation report / Home authenticated truthful replacement evidence  
Дата: 2026-05-22  
Scope: authenticated Home surface truthful replacement (no runtime/API/schema changes)  
Mode: targeted audit -> bounded UI replacement -> validation -> report

## 1. Executive Summary

Stage 12I-B1 removes fake authority from authenticated Home.

The slice replaces inline fake stats/rewards in `HomePageClient` with truthful deferred/empty state messaging, preserves module navigation, and explicitly labels the Home authenticated block as non-proof and non-financial.

Required statement:

```text
Stage 12I-B1 completed as Home authenticated truthful replacement slice, not runtime economy implementation.
```

## 2. Files Changed

| Path | Change type | Purpose |
|---|---|---|
| `apps/go2asia-pwa-shell/app/HomePageClient.tsx` | bounded UI/copy replacement | Removes hardcoded authenticated fake stats/rewards and installs truthful deferred state while preserving navigation |
| `docs/reports/stage_12I_B1_home_auth_replacement_v1.md` | new report | Captures audit, implementation, validation and verdict |

No backend/runtime/API/OpenAPI/SDK/schema files were changed.

## 3. Before Risk Summary

Critical pre-B1 risks in authenticated Home:

- Inline hardcoded profile stats in `userStats`:
  - `level: 12`
  - `points: 3450`
  - `badges: 5`
  - `vouchers: 2`
- Inline mock-like activity feed in `userRewards` rendered as recent user activity entries.
- `UserSummary` block with numeric metrics could be interpreted as owner-backed facts.
- High screenshot-as-proof risk for fake Points/reward/badge/voucher authority.

Risk class: `MOCK_DEMO_WITH_PROOF_ILLUSION`.

## 4. Replacement Strategy

Bounded strategy used:

- remove numeric fake authority from authenticated Home;
- keep Home usable and navigable;
- replace metrics with truthful deferred/empty state;
- keep product boundaries explicit:
  - projection != proof;
  - dashboard != receipt;
  - wallet != financial wallet.

Out-of-scope preserved:

- no runtime economy implementation;
- no Points API wiring;
- no reward runtime wiring;
- no schema/API changes;
- no route/type cleanup;
- no redesign wave.

## 5. Home UI/Copy Changes

### 5.1 Authenticated top section

Before:

- `UserSummary` with hardcoded numeric profile and achievement stats.

After:

- truthful deferred-state `Card` with:
  - explicit statement that confirmed personal metrics are not yet available on Home;
  - explicit source rule: metrics appear only after owner-backed runtime source;
  - explicit non-proof/non-financial disclaimer;
  - safe navigation actions:
    - `/connect`
    - `/connect/levels`
    - `/connect/referrals`
    - `/rf/vouchers`

### 5.2 Activity section

Before:

- `userRewards` list rendered as recent activity timeline.

After:

- single truthful placeholder block:
  - no numeric reward/points claims;
  - no fake “last activity” events;
  - explicit note that screen is not proof/receipt and does not confirm grants.

### 5.3 Navigation preservation

Preserved:

- module tiles grid and all module entry points;
- “Рядом с вами”, “Популярно сейчас”, “События этой недели”, benefits/CTA sections;
- auth wrapper and route-level auth mode logic.

## 6. Proof-Risk Reduction

Reduced risks:

- fake Points/level/badges/vouchers authority removed from authenticated Home;
- fake reward/activity feed removed from Home;
- explicit copy now prevents interpretation as:
  - financial wallet;
  - reward receipt;
  - proof source.

Not introduced:

- no mock/localStorage proof source;
- no invented owner fact metadata;
- no runtime fallback disguised as authority.

## 7. Validation Results

Commands executed:

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-env:check` | Passed | A3 env/evidence perimeter remains green |
| `pnpm guardrails:mock-imports:check` | Passed | A1/A2 import/barrel perimeter remains green, baseline=20 |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | existing lint gate green |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 16 files / 98 tests |

Targeted grep checks (Home scope):

| Check | Result |
|---|---|
| hardcoded `userStats` in `HomePageClient` | Removed |
| hardcoded `userRewards` in `HomePageClient` | Removed |
| hardcoded Points/level/badge/voucher numbers in authenticated Home | Removed |
| mock/localStorage proof-like source in authenticated Home | Not found |

## 8. Runtime Governance Statement

Stage 12I-B1 does not change runtime behavior.

Unchanged:

- `getDataSource()` and env data-source logic;
- backend APIs and OpenAPI;
- SDK and schema/migrations;
- auth system and route contracts.

This slice is UI truthful replacement only.

## 9. Remaining Known Gaps

B1 intentionally does not solve:

| Gap | Owner / next slice |
|---|---|
| RF PRO legacy route mock operational truth | Stage 12I-B2 — RF PRO Legacy Route Quarantine |
| Quest complete route mock authority | Stage 12I-B3 — Quest Complete Cleanup |
| Other route-level mock surfaces (Atlas/Pulse/Rielt etc.) | Later quarantine/replacement slices |
| Runtime owner-fact projection metadata envelope | Future runtime/API metadata slice |
| Support-safe owner lookup runtime | Future support/runtime slice |

## 10. Recommended Next Slice

Recommended next step:

```text
Stage 12I-B2 — RF PRO Legacy Route Quarantine
```

Goal:

```text
Close or replace /rf/pro/partners and /rf/pro/verifications as mock operational truth surfaces.
```

B2 is not started in this B1 slice.

## 11. Final Verdict

Stage 12I-B1 completed as Home authenticated truthful replacement slice, not runtime economy implementation.

```text
stage_12I_B1_status: COMPLETE_AS_HOME_AUTH_TRUTHFUL_REPLACEMENT
stage_12I_B1_runtime_economy_implementation: false
stage_12I_B1_points_api_added: false
stage_12I_B1_rewards_runtime_added: false
stage_12I_B1_fake_stats_removed: true
stage_12I_B1_fake_rewards_removed: true
stage_12I_B1_home_navigation_preserved: true
stage_12I_B1_runtime_changes: false
stage_12I_B1_api_schema_changes: false
stage_12I_B1_public_launch_ready: false
home_auth_fake_authority_reduced: true
canon_status: aligned
```


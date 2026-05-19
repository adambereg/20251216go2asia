# Stage 8 localStorage Reward Screen Isolation Patch v1

Date: 2026-05-19
Status: `FRONTEND_ONLY_LOCALSTORAGE_REWARD_SCREEN_ISOLATION_PATCH_APPLIED`
Stage: `Stage 8.4 / localStorage Reward Screen Isolation Patch`
Mode: bounded frontend-only isolation patch, no backend changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no reward delivery status API, no Quest to Badge handoff, no Achievement runtime, no reward framework, no Points enforcement activation, no staging evidence, no rollout approval, no token/NFT/on-chain activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/stage_8_quest_badge_authority_boundary_contract_v1.md`
- `docs/architecture/domain/stage_8_projection_vs_reward_authority_runtime_drift_prioritization_v1.md`
- `docs/architecture/domain/stage_8_quest_completion_vs_reward_delivery_separation_contract_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/**`
- directly connected Quest, Badge and Connect frontend copy surfaces

## Purpose

This patch isolates the legacy localStorage/mock Quest completion screen so it cannot be read as:

- reward receipt;
- Points grant proof;
- badge award proof;
- achievement unlock proof;
- NFT ownership or mint proof;
- backend completion proof.

The patch applies Stage 8.3's separation rule:

```text
completed = Quest-owned activity fact
completed != reward_granted
completed != reward_receipt
completed != badge_awarded
localStorage_mock_projection != backend_proof
```

## Non-goals

This patch does not:

- redesign Quest UI;
- create a reward receipt system;
- create a reward delivery status API;
- call Points API from the local completion screen;
- infer grants from Quest completion;
- infer badges from Quest completion;
- use outbox state in frontend;
- add Quest to Badge handoff;
- create Achievement runtime;
- create a reward framework;
- activate Points enforcement;
- change backend code;
- change OpenAPI or SDK;
- change schema or migrations;
- approve staging or rollout;
- move Slice 16.

## Inputs Reviewed

| Area | Inputs | Relevance |
|---|---|---|
| Authority boundary | Stage 8.1 contract | Defines localStorage/mock as non-authoritative. |
| Drift priority | Stage 8.2 drift prioritization | Classifies `/quest/[id]/complete` localStorage/mock reward screen as dangerous. |
| Separation contract | Stage 8.3 contract | Defines completion, delivery intent, grant and receipt separation. |
| Governance freeze | Stage 7.2 closure | Preserves no staging, no rollout and Quest/localStorage non-authority. |
| Economy copy guards | Economy crosswalk and compatibility docs | Prevents payout, NFT, badge and achievement over-reading. |
| Frontend route | `app/(public)/quest/[id]/complete/page.tsx`, `RewardsView.tsx` | Primary localStorage/mock reward receipt perception surface. |
| Connected Quest copy | `CompletedQuestCard.tsx`, `QuestCard.tsx`, `NFTBadgeDisplay.tsx` | Entry points and share/copy that could imply reward or badge award. |
| Connected Connect copy | `LevelsView.tsx`, `DashboardContent.tsx` | Copy that could imply Quest completion directly awards a badge or Points. |

## Drift Addressed

Stage 8.2 classified the legacy completion screen as dangerous because it combined:

```text
localStorage completion
+ mockQuests reward metadata
+ local Points calculation
+ mock/future-compatible badge display
+ reward-shaped completion route
```

Stage 8.4 addresses that drift by removing the reward-shaped local summary from `/quest/[id]/complete`.

## Frontend Surfaces Reviewed

Reviewed and patched:

- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/RewardsView.tsx`
- `apps/go2asia-pwa-shell/components/quest/MyQuests/CompletedQuestCard.tsx`
- `apps/go2asia-pwa-shell/components/quest/QuestRewards/NFTBadgeDisplay.tsx`
- `apps/go2asia-pwa-shell/components/quest/QuestCard.tsx`
- `apps/go2asia-pwa-shell/components/connect/Levels/LevelsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx`

Reviewed but not broadly redesigned:

- `apps/go2asia-pwa-shell/components/quest/mockQuests.ts`
- `apps/go2asia-pwa-shell/components/quest/QuestRewards/**`
- `apps/go2asia-pwa-shell/components/quest/utils/rewards.ts`
- `apps/go2asia-pwa-shell/components/quest/utils/badges.ts`
- Space mock surfaces

The patch intentionally avoids broad cleanup of all mock data.

## Patch Summary

Primary route behavior changed:

```text
before:
  /quest/[id]/complete read localStorage `quest-progress-{questId}`
  rendered local Points totals
  rendered mock/future-compatible badge cards
  looked like a reward receipt surface despite disclaimers

after:
  /quest/[id]/complete does not read localStorage
  does not calculate or render local Points totals
  does not render mock badge/NFT components
  shows a legacy isolation notice
  links users to Quest, Connect / Wallet and Connect / Levels for backend-backed surfaces
```

Directly connected copy was neutralized:

- `CompletedQuestCard` no longer says `Полученные бейджи` or `Посмотреть награды`.
- `NFTBadgeDisplay` share text no longer says `Я получил бейдж`.
- `QuestCard` no longer shows `NFT` as a local/mock reward label.
- Connect hints no longer say completing the first Quest directly gets a badge or Points.

## Copy Guard Summary

Removed or neutralized from directly connected surfaces:

```text
Посмотреть награды
Полученные бейджи
Я получил бейдж
NFT as local/mock reward label
complete Quest -> get badge/Points copy
```

Safe copy now emphasizes:

```text
legacy local page
does not confirm Points
does not confirm badge issuance
backend-backed Connect surfaces
Quest status separate from reward facts
```

## Route Behavior Summary

`/quest/[id]/complete` remains reachable for known mock Quest ids, but it no longer renders reward-shaped proof.

It now renders a clear isolation notice:

- no localStorage read;
- no local Points calculation;
- no badge/NFT card display;
- no reward receipt language;
- no backend proof claim.

Unknown Quest ids still use the existing `notFound()` behavior.

This is closer to Option A from the Stage 8.4 request: the route remains present as a legacy notice rather than a reward summary.

## Tests / Validation

Added targeted frontend copy guard:

- `apps/go2asia-pwa-shell/components/quest/QuestRewards/localRewardScreenIsolation.test.ts`

The test checks that:

- `RewardsView` does not call `localStorage.getItem`;
- `RewardsView` does not call `calculateTotalPoints`;
- `RewardsView` does not render `PointsDisplay`;
- `RewardsView` does not render `NFTBadgeDisplay`;
- connected Quest surfaces no longer contain direct reward receipt phrases such as `Посмотреть награды`, `Полученные бейджи` or `Я получил бейдж`;
- local/mock `NFT` label is not shown by `QuestCard`.

Validation remains local. It is not staging evidence and not rollout approval.

## Remaining Deferred Areas

Deferred:

- broad mock Quest cleanup;
- broad Space mock cleanup;
- broad Connect copy audit beyond directly connected Quest completion expectations;
- Quest reward delivery status API;
- reward receipt UI;
- Quest to Badge handoff;
- Achievement runtime;
- proof hardening;
- backend/runtime evidence collection;
- staging or production rollout.

Deferred does not mean approved or activated.

## Acceptance Criteria

This patch is accepted if:

- `/quest/[id]/complete` no longer reads as reward receipt;
- `/quest/[id]/complete` no longer reads localStorage as completion or reward proof;
- local Points totals are not presented as grant proof;
- mock badges/NFT labels are not presented as awarded assets;
- `Я получил бейдж` or equivalent authoritative share text is removed or neutralized;
- directly connected CTA copy no longer sends users to a reward-receipt-sounding surface;
- Connect hint copy no longer implies Quest completion directly awards badge/Points;
- no backend code is changed;
- no API, OpenAPI, SDK or schema changes are made;
- no migrations are added;
- no Quest to Badge handoff is activated;
- no reward delivery API is designed;
- no Achievement runtime is introduced;
- no frontend redesign beyond narrow isolation is made;
- no rollout approval is implied;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_8_4_status: frontend_only_localStorage_reward_screen_isolation_patch_applied
stage_8_1_boundary_contract_inherited: true
stage_8_2_drift_prioritization_inherited: true
stage_8_3_completion_delivery_separation_inherited: true
stage_7_constraints_preserved: true

localStorage_reward_screen_isolated: true
quest_complete_route_reads_localStorage: false
quest_complete_route_renders_local_points_totals: false
quest_complete_route_renders_mock_badge_cards: false
quest_complete_route_reads_as_reward_receipt: false
reward_receipt_language_removed_from_target_surface: true
badge_award_language_neutralized_on_target_surface: true
NFT_ownership_language_neutralized_on_target_surface: true
connected_quest_CTA_neutralized: true
connect_quest_badge_expectation_copy_neutralized: true

frontend_only_changes: true
backend_changes: false
API_changes: false
OpenAPI_changes: false
SDK_changes: false
schema_changes: false
migrations: false
reward_delivery_status_API: false
Quest_to_Badge_handoff_activation: false
Achievement_runtime_activation: false
reward_framework_activation: false
Points_enforcement_activation: false

tests_added: targeted_frontend_copy_guard
runtime_execution_status: not_executed
staging_evidence_collection: not_opened
runtime_rollout_approval: false
production_launch_ready: false
public_rollout_ready: false
contract_acceptance_implies_rollout: false

slice_16_status: blocked_not_triggered
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
```

## Final Verdict

Stage 8.4 applies the first bounded implementation patch after Stage 8.3 by isolating the legacy localStorage/mock completion route from reward receipt semantics.

The patch does not create reward receipt authority. It removes the local/mock route's ability to look like Points grant proof, badge award proof, achievement proof, NFT ownership proof or backend completion proof.

This is frontend-only isolation. It is not reward activation, Quest to Badge implementation, delivery API design, rollout approval or Slice 16 movement.

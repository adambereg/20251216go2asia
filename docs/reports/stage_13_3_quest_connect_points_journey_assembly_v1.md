# Stage 13.3 — Quest -> Connect -> Points Journey Assembly Report

Документ: `stage_13_3_quest_connect_points_journey_assembly_v1.md`  
Статус: implementation report / bounded Quest->Connect handoff slice  
Дата: 2026-05-24  
Scope: Quest discovery/detail/run/complete handoff в Connect activity/levels и обратная continuity-связка  
Mode: bounded PWA navigation/copy assembly, без runtime expansion

## 1. Final verdict

Stage 13.3 завершен как bounded implementation slice для безопасного сквозного Quest -> Connect -> Points journey.

Итог:

```text
stage_13_3_status: COMPLETE_AS_QUEST_CONNECT_POINTS_JOURNEY_ASSEMBLY
quest_connect_progression_assembled: true
completion_review_handoff_strengthened: true
reward_preview_boundaries_preserved: true
runtime_changes: false
api_schema_sdk_db_changes: false
fake_reward_grants: false
customer_proof_urls: false
leaderboard_xp_economy_activation: false
path_b_activation: false
public_launch_implied: false
```

## 2. Files changed

Изменены только bounded Quest/Connect UI и report artifact:

- `apps/go2asia-pwa-shell/app/(public)/quest/QuestHomeClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/QuestDetailClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/run/QuestRunnerClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/RewardsView.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/questPresentation.ts`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
- `docs/reports/stage_13_3_quest_connect_points_journey_assembly_v1.md`

Не изменялись:

- `apps/quest-service/**`, `apps/points-service/**` (read-only inspection only)
- API/OpenAPI/SDK/schema/database layers
- reward producers / outbox semantics / spendability mechanics
- diagnostics/admin internals

## 3. Quest -> Connect progression improvements

Реализовано:

- В `QuestRunnerClient` добавлен явный handoff block к:
  - `/connect/activity`
  - `/connect/levels`
  - `/quest`
  - `/quest/[id]`
- Для guest-run ошибки добавлен вход через `/sign-in?redirect_url=...`, чтобы устранить auth dead-end.
- В `QuestDetailClient` добавлены:
  - возврат в каталог `/quest`
  - pointer в `/connect/activity` рядом с preview Points.
- В `QuestHomeClient` добавлен continuity hint, что post-completion visibility смотрится в Connect activity projection.
- В `WalletView` (Connect activity surface) добавлен обратный переход в `/quest`, чтобы loop был двусторонним.

Результат:

```text
quest_loop_continuity: /quest -> /quest/[id] -> /quest/[id]/run -> /connect/activity|/connect/levels -> /quest
isolated_quest_module_feeling_reduced: true
```

## 4. Completion / review handoff improvements

Сделано:

- В `QuestRunnerClient` lifecycle copy для `pending_review` и `completed` выровнен под safe semantics:
  - review state не равен reward grant;
  - completion state не равен receipt или Points owner fact.
- В `QuestRunnerClient` статус отправки `approved` заменён на step-scoped wording (`Отправка шага одобрена`).
- В `questPresentation.ts` `submission` labels обновлены:
  - `approved` -> `Шаг одобрен`
  - `pending` -> `Отправлено на проверку`
- В `RewardsView` основной handoff переключен на `/connect/activity` (вместо общего `/connect`), сохранив completion notice boundaries.

## 5. Reward-preview / projection-safe wording preserved

Сохранены и усилены границы:

- `quest_completion != reward_grant`
- `quest_submission != customer_proof`
- `reward_preview != points_transaction`
- `connect_activity != receipt`
- `points_projection != owner_fact`
- `badge_projection != badge_award_fact`

Что подтверждено в UI:

- Preview wording остаётся `Preview`/`Не Points_row` на Quest surfaces.
- Completion copy остаётся notice-only и не вводит «гарантированную награду».
- Handoff ведёт в Connect activity/levels как projection visibility layer.

## 6. Runtime boundaries preserved

Инварианты Stage 12I сохранены:

```text
mock_data != proof
projection != authority
preview != grant
dashboard != receipt
wallet != financial_wallet
listing_projection != inventory_authority
inquiry != booking
lookup != proof
diagnostic_snapshot != customer_proof
operational_trace != immutable_audit_ledger
owner_fact = authoritative
Path_B_inactive = true
public_launch_implied = false
```

Slice-specific boundary confirmation:

```text
quest_completion_ui != reward_producer
quest_submission_status != customer_proof
connect_handoff != receipt_or_grant_claim
quest_progress != leaderboard_economy
```

## 7. Validation performed

Обязательная валидация:

- `pnpm -C apps/go2asia-pwa-shell typecheck` — passed.
- `pnpm -C apps/go2asia-pwa-shell lint` — passed (existing repository warnings outside slice scope).
- Relevant tests (affected areas):
  - `pnpm -C apps/go2asia-pwa-shell test -- components/quest/QuestRewards/localRewardScreenIsolation.test.ts components/connect/copy.test.ts lib/routeAliasLayer.test.ts lib/typeComponentAliasLayer.test.ts lib/projectionMetadata.test.ts` — passed.
- Unsafe terminology scans on changed Quest/Connect files:
  - `reward granted`
  - `guaranteed reward`
  - `Points earned`
  - `receipt`
  - `proof`
  - `confirmed payout`
  - `leaderboard economy`
  - `financial wallet`
  - `ownerFactRef`
  - `proofClass`
  - `sourceOwner`
  - `isProof`
  - `isReceipt`
  - `isAuthoritative`
  - Findings: только ожидаемые guardrail/test matches и явные negative disclaimers.
- `ReadLints` на измененных файлах — no linter errors.
- `git diff --check` — passed.

## 8. Remaining gaps / deferred items

Отложено за пределы Stage 13.3:

- Stage 13.4: Rielt inquiry journey assembly.
- Stage 13.5/13.6: RF/VIP/PRO deeper continuity assembly.
- Stage 13.7: Space/profile social boundary pass.
- Stage 13.8: internal support/admin diagnostics journey.

Дополнительно:

- Quest outbox и delivery diagnostics остаются internal runtime surfaces, не customer-proof UI.
- Quest-specific transaction drill-down beyond existing Connect activity projection остаётся deferred.

## 9. Recommended next slice

```text
Stage 13.4 — Rielt Inquiry Journey Assembly
```

Причина:

- После Stage 13.1 (entry), 13.2 (Connect continuity) и 13.3 (Quest->Connect loop) следующий безопасный progression cluster — inquiry-only journey Rielt с сохранением `inquiry != booking` и `listing_projection != inventory_authority`.

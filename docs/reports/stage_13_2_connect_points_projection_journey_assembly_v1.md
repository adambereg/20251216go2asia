# Stage 13.2 — Connect / Points Projection Journey Assembly Report

Документ: `stage_13_2_connect_points_projection_journey_assembly_v1.md`  
Статус: implementation report / bounded Connect continuity slice  
Дата: 2026-05-24  
Scope: `/connect`, `/connect/activity`, `/connect/levels`, `/connect/referrals` (и legacy alias `/connect/wallet`)  
Mode: bounded PWA navigation/copy assembly, без runtime expansion

## 1. Final verdict

Stage 13.2 завершен как bounded implementation slice для сборки Connect/Points journey в coherent continuity layer.

Итог:

```text
stage_13_2_status: COMPLETE_AS_CONNECT_POINTS_PROJECTION_JOURNEY_ASSEMBLY
connect_continuity_layer_strengthened: true
connect_navigation_hub_strengthened: true
projection_safe_wording_preserved: true
runtime_changes: false
api_schema_sdk_db_changes: false
financial_wallet_semantics: false
receipt_or_accounting_semantics: false
path_b_activation: false
public_launch_implied: false
```

## 2. Files changed

Изменены только bounded Connect UI/copy файлы:

- `apps/go2asia-pwa-shell/components/connect/copy.ts`
- `apps/go2asia-pwa-shell/components/connect/copy.test.ts`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/TransactionList.tsx`
- `apps/go2asia-pwa-shell/components/connect/Levels/LevelsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsContent.tsx`
- `apps/go2asia-pwa-shell/components/connect/Analytics/AnalyticsView.tsx`
- `docs/reports/stage_13_2_connect_points_projection_journey_assembly_v1.md`

Не изменялись:

- services/runtime internals
- API/OpenAPI/SDK
- schema/database
- Points/reward producers and spendability mechanics

## 3. Connect continuity improvements

Реализовано:

- Добавлен единый owner-fact boundary copy через `CONNECT_OWNER_FACT_POINTER_TEXT` и включен на ключевых Connect surfaces (dashboard/activity/levels/referrals).
- Усилены next actions на dashboard: добавлен переход в профиль и выровнен CTA к `/connect/levels` как "Открыть бейджи".
- На странице activity добавлен continuity footer с переходами в `/connect/referrals`, `/connect/levels`, `/profile`.
- На странице referrals добавлен continuity footer с переходами в activity и levels.
- На странице levels добавлены next actions в `/quest`, `/connect/activity`, `/connect/referrals`.

Результат:

```text
connect_cluster_continuity: dashboard <-> activity <-> levels <-> referrals
isolated_dashboard_feeling_reduced: true
```

## 4. Navigation/progression improvements

Собрана безопасная progression-цепочка:

```text
/connect -> /connect/activity | /connect/levels | /connect/referrals -> /quest | /profile
```

Что улучшено:

- Прогрессия из activity/referrals/levels теперь явно продолжает journey, а не оставляет пользователя в изолированном разделе.
- Терминология в filters и CTA выровнена под "приглашения" вместо смешения с "рефералами".
- Dashboard next steps теперь покрывают both ecosystem exploration (`/quest`) и personal continuity (`/profile`).

## 5. Projection-safe wording preserved

Сохранены и усилены projection-safe boundaries:

- `dashboard != receipt`
- `wallet != financial_wallet`
- `projection != authority`
- `preview != grant`

Конкретно:

- Обновлен action label для `rf_voucher_redeemed` на projection-safe формулировку.
- В referrals статус `Points reflected` заменен на `Points отражены (projection)`.
- Убраны терминологические разрывы в activity empty/copy и analytics CTA.

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

Slice-specific confirmation:

```text
connect_activity != financial_wallet
connect_dashboard != accounting_statement
points_projection != accounting_statement
progress_visibility != reward_guarantee
projection_metadata != owner_authority
```

## 7. Validation performed

Обязательная валидация:

- `pnpm -C apps/go2asia-pwa-shell typecheck` — passed.
- `pnpm -C apps/go2asia-pwa-shell lint` — passed (существующие repository warnings вне scope слайса).
- Relevant tests:
  - `pnpm -C apps/go2asia-pwa-shell test -- components/connect/copy.test.ts lib/routeAliasLayer.test.ts lib/typeComponentAliasLayer.test.ts lib/projectionMetadata.test.ts components/connect/Dashboard/ConnectRfSection.queryContract.test.ts` — passed (5 files, 16 tests).
- Unsafe terminology scan:
  - `rg -i "payout|withdraw|cashback|receipt|accounting|guaranteed rewards|financial wallet" apps/go2asia-pwa-shell/components/connect`
  - `rg "proofClass|sourceOwner|ownerFactRef|isProof|isReceipt|isAuthoritative|asOf" apps/go2asia-pwa-shell/components/connect`
  - Findings: только ожидаемые guardrail/test строки и explicit disclaimers, без новых unsafe claims.
- `ReadLints` на измененных файлах — no linter errors.
- `git diff --check` — passed.

## 8. Remaining gaps / deferred items

Отложено за пределы Stage 13.2:

- Stage 13.3: Quest -> Connect -> Points completion/progress handoff assembly.
- Stage 13.4: Rielt inquiry journey assembly.
- Stage 13.5/13.6: RF/VIP/PRO deeper continuity assembly.
- Stage 13.7: Space/profile social boundary pass.
- Stage 13.8: internal support/admin diagnostics journey.

Дополнительно:

- Legacy alias `/connect/wallet` сохранен как safe alias surface; полный route retirement/redirect strategy отложен.

## 9. Recommended next slice

```text
Stage 13.3 — Quest -> Connect -> Points Journey Assembly
```

Причина:

- После Stage 13.2 Connect surfaces собраны в coherent continuity layer.
- Следующий безопасный шаг — связать Quest completion/progress с Connect activity/points visibility без нарушения `preview != grant` и без reward overclaim.

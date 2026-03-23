# Go2Asia Canonical Status Anchor v1

## 1. Purpose and Scope

Этот документ — канонический статусный якорь текущего цикла reconciliation.  
Он нормализует расхождения между:

- `repo reality` (структура и код),
- `docs-declared reality`,
- `runtime-declared reality` (closure/freeze/milestone/status notes).

Опора:

- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/plans/go2asia_reconciliation_conflict_index_v1.md`
- первичные файлы из раздела `Files Used` в reconciliation v1.

Документ **не** заменяет:

- ADR (`docs/decisions/*`),
- детальные backend contracts (`docs/backend/*`, `docs/openapi/*`),
- runtime monitoring evidence.

## 1.1 Current Status Truth Hierarchy (NQ-001)

Для текущего цикла status truth hierarchy фиксируется так:

1. `docs/plans/go2asia_status_anchor_v1.md` — **current canonical status anchor**.
2. `docs/architecture/system_status_2026_march_10.md` — **historical snapshot** (as-of 2026-03-10), не текущий anchor.
3. `docs/architecture/frontend_sequencing_note_v1.md` — **historical sequencing baseline artifact** для закрытой волны, не текущий anchor.
4. `docs/plans/mvp_implementation_plan.md` — **archival/reference plan**, не operational status anchor текущего цикла.
5. `docs/plans/go2asia_next_steps_plan_2026_march_10.md` — **dated execution-plan artifact**, читается через reconciliation/anchor, но не является текущим status anchor.
6. `docs/plans/go2asia_plan_reconciliation_note_v1.md` — **supporting reconciliation artifact**, который информирует anchor, но не заменяет его.

## 2. Normalization Rules

1. Прямое code evidence (наличие app/runtime/tests/routes) сильнее обычной плановой формулировки.
2. ADR и фактический workflow-файл сильнее ops-описаний, если они конфликтуют.
3. `closure/freeze note` сильнее overview/planning-note, но не отменяет явное несоответствие коду.
4. `docs/backend/modules` подтверждают intended contour, но сами по себе не доказывают runtime readiness.
5. UI integration не эквивалентна backend operational readiness.
6. Отсутствие отдельного app не означает отсутствие runtime-контура, если есть подтвержденный consolidated contour.
7. Если автонормализация невозможна, используется `mixed / unresolved` или `unclear`.
8. Статус `operational-with-debt` ставится только при наличии одновременно runtime evidence и явного зафиксированного долга.

## 3. Canonical Status Summary

| Contour | Target role | Actual app/code presence | Docs-declared status | Runtime-declared status | Actually evidenced status | Current canonical status | Confidence | Manual normalization still needed? |
|---|---|---|---|---|---|---|---|---|
| `api-gateway` | Edge perimeter + auth boundary + routing | app+runtime+tests есть | роль задокументирована, backend subtree нет | declared operational | code evidence strong | `baseline-present` | medium | yes |
| `auth-service` | Identity/auth | app+runtime+tests есть | как `user_service` + ADR | baseline/operational формулировки mixed | код+Clerk интеграция есть | `partial-live` | medium | yes |
| `content-service` | Content core (частично consolidated) | app+runtime+tests есть | strong docs | baseline/operational mixed | API/UI evidence есть | `partial-live` | medium | yes |
| `media-service` | Media contour | app+runtime+tests есть | docs есть, роль transition в части notes | baseline claims mixed | прямой UI-path слабый | `code-present` | medium | yes |
| `points-service` | Points ledger | app+runtime+tests есть | strong docs/contracts | baseline claims есть | code/test evidence strong | `baseline-present` | medium | yes |
| `referral-service` | Referral graph/claim | app+runtime+tests есть | strong docs/contracts | baseline claims есть | UI путь partial/mock risk | `partial-live` | medium | yes |
| `token-service` | Token contour / phase-split | app+runtime есть, tests не подтверждены | прямой docs contour слабый | runtime-declared weak | usage evidence limited | `mixed / unresolved` | low | yes |
| `space-service` | Social publication contour | app+runtime+tests есть | architecture/modules docs есть | freeze/closure: phase1 complete | UI `/space` + API path evidence | `operational-with-debt` | medium | yes |
| `reactions-service` | Reactions boundary | app+runtime+tests есть | backend docs есть | baseline claims есть | frontend direct path слабый | `baseline-present` | medium | yes |
| `feed-service` | Feed read model | app+runtime+tests есть | backend/modules docs слабые | runtime-declared mixed | UI ходит через `/v1/space/feed/*` | `mixed / unresolved` | low | yes |
| `quest-service` | Quest/progress | app+runtime+tests есть | strong docs/contracts | baseline with deferred surfaces | UI integration strong | `operational-with-debt` | medium | yes |
| `atlas` | Geo SSOT | отдельного app нет | strong docs | baseline/debt notes есть | frontend+SDK есть, ownership mixed | `mixed / unresolved` | medium | yes |
| `pulse` | Event truth | отдельного app нет | strong docs | baseline/debt notes есть | frontend+SDK есть, ownership mixed | `mixed / unresolved` | medium | yes |
| `rielt-service` | Listings/inquiry | app+runtime+tests есть | strong docs | baseline + wave2 deferred | UI integration есть | `operational-with-debt` | medium | yes |
| `rf-service` | Partner/business contour | app+runtime+tests есть | strong docs | baseline + deferred depth | UI integration есть | `operational-with-debt` | medium | yes |
| `guru-service` | Read aggregator | app+runtime+tests есть | strong docs | baseline + source-limits | UI integration есть | `operational-with-debt` | medium | yes |
| `packages/db` | SQL DDL SSOT | package есть + workflow usage | ADR strong | declared operational policy | evidence strong | `baseline-present` | high | no |
| `openapi/contracts discipline` | API contract governance | specs+bundle есть | ADR-0014 authoritative | declared operational policy | evidence strong | `baseline-present` | high | no |
| `staging deploy policy` | deployment governance | workflow file есть | docs конфликтуют | runtime-declared conflict | evidence split | `mixed / unresolved` | low | yes |
| `frontend shell integration` | integration shell | Next app + routes есть | sequencing/runtime notes mixed | runtime-declared mixed | модульная интеграция неоднородна | `partial-live` | medium | yes |

## 4. Detailed Status Cards

### 4.1 `api-gateway`

**A. Target role**: edge perimeter, JWT verification boundary, service routing.  
**B. Actual code/app reality**: `apps/api-gateway` есть; `src/index.ts`, `wrangler.toml`, `test/request.test.ts` подтверждены.  
**C. Docs-declared status**: в `docs/backend` отдельный gateway subtree не подтвержден; роль зафиксирована в ADR/ops.  
**D. Runtime-declared status**: declared operational (policy-level).  
**E. Actually evidenced status**: runtime code + tests подтверждены; полный route ownership map `не подтверждено`.  
**F. Canonical current status**: `baseline-present`  
**G. Why this status**: Контур явно существует и выполняет платформенную роль. Но отсутствует единый backend-doc contract-map, поэтому это не full operational certainty.  
**H. Controlled debt**: gateway contract documentation gap.  
**I. Deferred / not included**: полная route-to-service матрица.  
**J. Confidence**: `medium`  
**K. Remaining normalization need**: `material`

### 4.2 `auth-service`

**A**: identity/auth контур.  
**B**: `apps/auth-service` + runtime + tests подтверждены; frontend Clerk integration подтверждена.  
**C**: docs backend идут под именем `user_service`; ADR-0015 задает boundary.  
**D**: runtime-declared baseline/operational формулировки mixed.  
**E**: code evidence есть; full hardening closure `не подтверждено`.  
**F**: `partial-live`  
**G**: Контур работает и интегрирован с UI, но naming и hardening статус неоднозначны.  
**H**: RBAC/hardening debt в status notes.  
**I**: production-complete hardening.  
**J**: `medium`  
**K**: `material`

### 4.3 `content-service`

**A**: content core, в текущем цикле частично consolidated контур.  
**B**: app/runtime/tests есть; frontend usage подтверждена (blog/pulse/content paths).  
**C**: strong docs в `docs/backend/content_service/*` и `docs/modules/blog/*`.  
**D**: runtime declarations mixed (baseline + debt).  
**E**: фактические вызовы и runtime presence подтверждены.  
**F**: `partial-live`  
**G**: Контур реально используется, но ownership с social-контуром не до конца нормализован.  
**H**: content vs social ownership debt.  
**I**: полная де-legacy нормализация.  
**J**: `medium`  
**K**: `material`

### 4.4 `media-service`

**A**: media platform contour.  
**B**: app/runtime/tests есть.  
**C**: backend docs есть; в architecture встречается transition/legacy оттенок.  
**D**: runtime-declared baseline в notes неоднороден.  
**E**: прямой frontend media API usage `не подтверждено`.  
**F**: `code-present`  
**G**: Код и сервис есть, но подтвержденность активного потребления и operational глубины ограничена.  
**H**: active-consumer evidence debt.  
**I**: расширенный media lifecycle readiness.  
**J**: `medium`  
**K**: `material`

### 4.5 `points-service`

**A**: points ledger and idempotency.  
**B**: app/runtime/tests (включая idempotency test) подтверждены.  
**C**: backend docs/contracts strong.  
**D**: runtime-declared baseline.  
**E**: code/test evidence strong; frontend direct `/v1/points` path `не подтверждено`.  
**F**: `baseline-present`  
**G**: Техническая база присутствует, но end-user surface и часть ops evidence ограничены.  
**H**: integration visibility debt.  
**I**: full production economics envelope.  
**J**: `medium`  
**K**: `light`

### 4.6 `referral-service`

**A**: referral graph + claim flow.  
**B**: app/runtime/tests подтверждены; UI route есть.  
**C**: docs/contracts strong, ADR-0018 есть.  
**D**: runtime-declared baseline.  
**E**: mock-risk в UI пути присутствует.  
**F**: `partial-live`  
**G**: Контур есть и тестируется, но для чистого live-пути нужно доподтверждение без mock веток.  
**H**: mock/real path ambiguity.  
**I**: full non-mock validation scope.  
**J**: `medium`  
**K**: `material`

### 4.7 `token-service`

**A**: token contour, связанный с phase-split on-chain/off-chain.  
**B**: app/runtime есть; tests `не подтверждено`; frontend usage `не подтверждено`.  
**C**: симметричного `docs/backend/token_service` нет; docs split через blockchain/nft/connect.  
**D**: runtime-declared состояние weak/mixed.  
**E**: есть только частичное code evidence.  
**F**: `mixed / unresolved`  
**G**: Нельзя надежно классифицировать как live operational contour без цельного docs/runtime evidence.  
**H**: docs split + testing gap.  
**I**: phase-scope и production inclusion.  
**J**: `low`  
**K**: `high`

### 4.8 `space-service`

**A**: social publication contour.  
**B**: app/runtime/tests есть; frontend `/space` flows есть.  
**C**: architecture/modules docs есть; backend subtree в `docs/backend` отсутствует.  
**D**: freeze/closure notes заявляют phase1 complete; часть status docs спорит.  
**E**: code + UI evidence strong.  
**F**: `operational-with-debt`  
**G**: Контур функционально присутствует и интегрирован, но статусный drift между документами не снят.  
**H**: cross-module reference debt.  
**I**: wave2 social scope.  
**J**: `medium`  
**K**: `material`

### 4.9 `reactions-service`

**A**: reaction boundary service.  
**B**: app/runtime/tests есть.  
**C**: backend docs/contracts есть.  
**D**: runtime-declared baseline.  
**E**: direct frontend reactions API path weak/не подтвержден.  
**F**: `baseline-present`  
**G**: Backend presence сильная, но клиентская эксплуатация подтверждена ограниченно.  
**H**: frontend evidence debt.  
**I**: full observable reaction flow from UI.  
**J**: `medium`  
**K**: `material`

### 4.10 `feed-service`

**A**: feed read model over space/reactions.  
**B**: app/runtime/tests есть.  
**C**: backend/modules прямой docs contour слабый; сильнее в architecture notes.  
**D**: runtime declarations mixed.  
**E**: UI использует `/v1/space/feed/*`; `/v1/feed` usage не подтвержден.  
**F**: `mixed / unresolved`  
**G**: Сервис есть, но route ownership и contract boundary с Space не нормализованы.  
**H**: feed-vs-space boundary debt.  
**I**: explicit endpoint ownership closure.  
**J**: `low`  
**K**: `high`

### 4.11 `quest-service`

**A**: quests/progress/reward contour.  
**B**: app/runtime/tests есть; frontend quest routes strong.  
**C**: backend/modules docs strong.  
**D**: runtime-declared baseline + deferred surfaces.  
**E**: app+UI evidence strong, но не все surfaces live.  
**F**: `operational-with-debt`  
**G**: Основной контур рабочий, но статус «полностью live» завышать нельзя из-за deferred функций.  
**H**: deferred quest surfaces.  
**I**: расширенные my/social/leaderboard surfaces.  
**J**: `medium`  
**K**: `light`

### 4.12 `atlas` (domain contour)

**A**: geo source-of-truth.  
**B**: отдельный `apps/atlas-service` не подтвержден; frontend atlas usage strong.  
**C**: docs backend/modules/architecture strong.  
**D**: runtime-declared: maturity gate + debt notes.  
**E**: отдельный runtime service contour не подтвержден как app.  
**F**: `mixed / unresolved`  
**G**: Документная модель сильная, но runtime allocation частично consolidated; это не позволяет поставить чистый operational статус.  
**H**: geo normalization/backfill debt.  
**I**: full dedicated-service confirmation.  
**J**: `medium`  
**K**: `high`

### 4.13 `pulse` (domain contour)

**A**: events/attendance truth.  
**B**: отдельный `apps/pulse-service` не подтвержден; frontend pulse usage strong.  
**C**: docs backend/modules/architecture strong.  
**D**: runtime-declared baseline + debt notes.  
**E**: runtime boundary между dedicated и consolidated контуром не подтвержден однозначно.  
**F**: `mixed / unresolved`  
**G**: Есть сильное docs-покрытие и UI-факт, но service allocation не нормализован.  
**H**: id/slug and contour allocation debt.  
**I**: dedicated pulse service confirmation.  
**J**: `medium`  
**K**: `high`

### 4.14 `rielt-service`

**A**: listing/inquiry domain owner.  
**B**: app/runtime/tests + frontend usage есть.  
**C**: docs strong.  
**D**: runtime-declared baseline + deferred wave2.  
**E**: fact evidence strong для v1 surface.  
**F**: `operational-with-debt`  
**G**: Контур operational в baseline-смысле, но часть depth-сценариев deferred.  
**H**: owner-suite / advanced flows debt.  
**I**: wave2 scope.  
**J**: `medium`  
**K**: `light`

### 4.15 `rf-service`

**A**: partner/business contour.  
**B**: app/runtime/tests + frontend usage есть.  
**C**: docs strong.  
**D**: runtime-declared baseline с residual debt.  
**E**: evidence strong для current surface.  
**F**: `operational-with-debt`  
**G**: Базовая эксплуатация подтверждена, но persistence-grade глубина не подтверждена как закрытая.  
**H**: persistence/merchant depth debt.  
**I**: enterprise-like scopes.  
**J**: `medium`  
**K**: `light`

### 4.16 `guru-service`

**A**: read aggregator without source ownership.  
**B**: app/runtime/tests + frontend usage есть.  
**C**: docs strong.  
**D**: runtime-declared baseline + source-limits.  
**E**: evidence strong по presence; полнота upstream coverage ограничена.  
**F**: `operational-with-debt`  
**G**: Контур работает, но не все upstream источники одинаково подтверждены как live/complete.  
**H**: source coverage debt.  
**I**: wave2 aggregation depth.  
**J**: `medium`  
**K**: `light`

### 4.17 `packages/db`

**A**: schema/migration SSOT.  
**B**: package есть; workflow использует DDL apply.  
**C**: ADR-0016 authoritative.  
**D**: runtime-declared policy operational.  
**E**: evidence strong.  
**F**: `baseline-present`  
**G**: Контур governance/data дисциплины подтвержден и применим сейчас.  
**H**: стандартный migration discipline debt (процессный).  
**I**: n/a.  
**J**: `high`  
**K**: `none`

### 4.18 `openapi/contracts discipline`

**A**: OpenAPI SSOT + bundle + codegen discipline.  
**B**: артефакты docs/openapi есть.  
**C**: ADR-0014 authoritative.  
**D**: declared operational policy.  
**E**: evidence strong (наличие spec/bundle); качество исполнения каждого PR отдельно `не подтверждено` этим anchor.  
**F**: `baseline-present`  
**G**: Правило и артефакты зафиксированы; оставшийся риск — дисциплина применения.  
**H**: execution-consistency debt.  
**I**: n/a.  
**J**: `high`  
**K**: `light`

### 4.19 `staging deploy policy`

**A**: единые правила staging deploy.  
**B**: workflow файл подтвержден; docs policy конфликтуют.  
**C**: часть docs говорит `develop`, ADR/workflow — feature-branch/push.  
**D**: runtime-declared mixed.  
**E**: фактический workflow есть, но docs SSOT не выровнен.  
**F**: `mixed / unresolved`  
**G**: Пока docs не синхронизированы, статус policy не может считаться полностью нормализованным.  
**H**: ops document drift debt.  
**I**: n/a.  
**J**: `low`  
**K**: `high`

### 4.20 `frontend shell integration`

**A**: интеграционная оболочка модулей в Next app.  
**B**: `apps/go2asia-pwa-shell/app` routes подтверждены; coverage неоднородна по доменам.  
**C**: sequencing/closure notes mixed.  
**D**: runtime-declared mixed (live wave + debt/deferred).  
**E**: фактически подтверждены маршруты/интеграции для atlas/pulse/rielt/rf/guru/quest/space; для media/points/reactions/token сильный прямой UI-path ограничен/не подтвержден.  
**F**: `partial-live`  
**G**: Shell реально интегрирует ряд модулей, но не доказывает равномерную backend readiness всех доменов.  
**H**: uneven integration debt.  
**I**: полное выравнивание live-path across all contours.  
**J**: `medium`  
**K**: `material`

## 5. Canonical Status Rules for Usage

- Этот файл (`go2asia_status_anchor_v1.md`) является текущим `status anchor`.
- Плановые документы (`docs/plans/*`) не должны молча переопределять статусы из anchor.
- Любой новый closure/freeze/milestone note, изменяющий статус контура, обязан:
  - либо обновить этот anchor в том же PR,
  - либо явно сослаться на необходимое обновление anchor.
- UI milestone note не меняет backend operational status автоматически.
- `docs/backend/*` и `docs/modules/*` не трактуются как доказательство live runtime без code/runtime evidence.

## 6. Explicit Non-Normalized Areas

- `auth-service` vs `user_service` naming drift.
- `feed-service` vs `/v1/space/feed/*` ownership drift.
- `content` vs `space/reactions` ownership drift.
- `atlas/pulse` doc-defined dedicated services vs отсутствующие одноименные apps.
- `token-service` vs `blockchain/nft/connect` docs split.
- Staging deploy policy drift (`ci_cd`/`backend_deploy`/`milestone2` vs `adr_0017` + workflow).
- Quest prefix drift (`/v1/quest/*` vs `/v1/quests*`) в ops-доках.
- Gateway backend-doc contract gap.
- Неоднородная frontend evidence по `media/points/reactions/token`.

## 7. Files Used

Ключевые файлы нормализации:

- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/plans/go2asia_reconciliation_conflict_index_v1.md`
- `docs/architecture/system_status_2026_march_10.md`
- `docs/architecture/execution_cycle_closure_note_v1.md`
- `docs/architecture/frontend_sequencing_note_v1.md`
- `docs/architecture/space/space_phase1_freeze_note_v1.md`
- `docs/architecture/space/space_phase1a_runtime_shell_activation_note_v1.md`
- `docs/architecture/space/space_phase1b_cross_module_reference_note_v1.md`
- `docs/architecture/atlas/atlas_neon_maturity_gate_note_v1.md`
- `docs/architecture/atlas/atlas_pulse_broader_ui_realignment_note_v1.md`
- `docs/plans/go2asia_next_steps_plan_2026_march_10.md`
- `docs/plans/go2asia_plan_reconciliation_note_v1.md`
- `docs/plans/mvp_implementation_plan.md`
- `docs/backend/**/*`
- `docs/modules/**/*`
- `docs/decisions/adr_0014_openapi_ssot_and_bundling.md`
- `docs/decisions/adr_0015_jwt_verification_at_gateway.md`
- `docs/decisions/adr_0016_sql_ddl_and_ddl_applier.md`
- `docs/decisions/adr_0017_staging_deploys_from_feature_branches.md`
- `docs/ops/infrastructure_context.md`
- `docs/ops/staging_services_overview.md`
- `docs/ops/ci_cd.md`
- `docs/ops/deployment_guides/backend_deploy.md`
- `docs/ops/milestone2_backend_source_of_truth.md`
- `docs/ops/runbooks.md`
- `docs/ops/service_inventory.md`
- `docs/ops/phase2_m2_0_foundations.md`
- `.github/workflows/deploy-workers-staging.yml`
- `apps/**/*`
- `packages/**/*`


# Go2Asia Reconciliation Conflict Index v1

Цель: управляемый индекс конфликтов между `repo reality`, `docs reality` и `runtime-declared reality` на основе `docs/plans/go2asia_actual_state_reconciliation_v1.md` и первичных источников.

## CF-001

1. **Conflict ID**: `CF-001`  
2. **Contour**: Social core (`Space/Feed/Reactions`)  
3. **Conflict Type**: `status drift`, `docs vs runtime-declared`  
4. **File A**: `docs/architecture/system_status_2026_march_10.md`  
5. **File B**:  
   - `docs/plans/go2asia_plan_reconciliation_note_v1.md`  
   - `docs/architecture/execution_cycle_closure_note_v1.md`  
   - `docs/architecture/space/space_phase1_freeze_note_v1.md`  
6. **Exact mismatch**: A описывает social-layer как `not started`; B-группа фиксирует baseline/closure по Space/Feed/Reactions с residual debt.  
7. **Evidence strength**: A=`medium`, B=`medium`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Блокирует корректное sequencing social задач и release-риск по ложной готовности/ложной незавершенности.  
12. **Normalization target**: `status anchor` + `closure note` reconciliation block.

## CF-002

1. **Conflict ID**: `CF-002`  
2. **Contour**: `space-service` (внутренний конфликт плана)  
3. **Conflict Type**: `status drift`, `scope/deferred ambiguity`  
4. **File A**: `docs/plans/go2asia_next_steps_plan_2026_march_10.md` (раздел незавершенности social-first backend)  
5. **File B**: `docs/plans/go2asia_next_steps_plan_2026_march_10.md` (Step 4: done/completed)  
6. **Exact mismatch**: В одном документе social-first backend заявлен незавершенным, но `space-service` внутри того же файла отмечен как done/merged.  
7. **Evidence strength**: A=`medium`, B=`medium`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Нельзя безопасно использовать этот план как status-source без ручной правки.  
12. **Normalization target**: `plan note` (исправление внутреннего статуса) + ссылка на `status anchor`.

## CF-003

1. **Conflict ID**: `CF-003`  
2. **Contour**: Frontend sequencing governance  
3. **Conflict Type**: `status drift`, `docs vs runtime-declared`  
4. **File A**: `docs/architecture/frontend_sequencing_note_v1.md`  
5. **File B**: `docs/plans/go2asia_plan_reconciliation_note_v1.md`  
6. **Exact mismatch**: A маркирует sequencing-note как active reference; B трактует его как effectively closed baseline для этой волны.  
7. **Evidence strength**: A=`medium`, B=`medium`  
8. **Severity**: `medium`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Ошибка в выборе governance-опоры напрямую влияет на порядок работ frontend/backend.  
12. **Normalization target**: `status anchor` + update статуса в `frontend_sequencing_note_v1.md`.

## CF-004

1. **Conflict ID**: `CF-004`  
2. **Contour**: Статус `mvp_implementation_plan.md` как anchor  
3. **Conflict Type**: `status drift`, `docs vs docs`  
4. **File A**: `docs/architecture/system_status_2026_march_10.md`  
5. **File B**: `docs/plans/go2asia_plan_reconciliation_note_v1.md`  
6. **Exact mismatch**: A использует `mvp_implementation_plan.md` как source-of-truth для снимка; B классифицирует его как archival/reference для текущего исполнения.  
7. **Evidence strength**: A=`medium`, B=`medium`  
8. **Severity**: `medium`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Без нормализации теряется единая точка статуса по milestones.  
12. **Normalization target**: `status anchor` + явная иерархия planning artifacts.

## CF-005

1. **Conflict ID**: `CF-005`  
2. **Contour**: Staging deploy policy  
3. **Conflict Type**: `ops policy drift`, `docs vs code`  
4. **File A**:  
   - `docs/ops/ci_cd.md`  
   - `docs/ops/deployment_guides/backend_deploy.md`  
5. **File B**:  
   - `docs/decisions/adr_0017_staging_deploys_from_feature_branches.md`  
   - `.github/workflows/deploy-workers-staging.yml`  
6. **Exact mismatch**: A описывает staging из `develop`; B фиксирует feature-branch/push модель и фактический workflow триггер.  
7. **Evidence strength**: A=`medium`, B=`strong`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `yes`  
10. **Tentative stronger source**: `adr_0017 + .github/workflows/deploy-workers-staging.yml`  
11. **Why it matters**: Неверная policy приводит к ошибочным deploy-процедурам и сбоям release governance.  
12. **Normalization target**: `ops SSOT` (`ci_cd.md`, `backend_deploy.md`).

## CF-006

1. **Conflict ID**: `CF-006`  
2. **Contour**: Branch policy в milestone2 SSOT  
3. **Conflict Type**: `ops policy drift`  
4. **File A**: `docs/ops/milestone2_backend_source_of_truth.md`  
5. **File B**: `docs/decisions/adr_0017_staging_deploys_from_feature_branches.md`  
6. **Exact mismatch**: A содержит несовместимую веточную политику staging относительно ADR-0017.  
7. **Evidence strength**: A=`medium`, B=`strong`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `yes`  
10. **Tentative stronger source**: `adr_0017`  
11. **Why it matters**: Сервисный SoT вводит команду в неправильный deploy-flow.  
12. **Normalization target**: `ops SSOT` (выравнивание milestone2-документа).

## CF-007

1. **Conflict ID**: `CF-007`  
2. **Contour**: Quest route prefix  
3. **Conflict Type**: `contract drift`, `ops policy drift`  
4. **File A**: `docs/ops/phase2_m2_0_foundations.md`  
5. **File B**:  
   - `docs/ops/staging_services_overview.md`  
   - `docs/ops/service_inventory.md`  
   - `docs/ops/runbooks.md`  
6. **Exact mismatch**: A использует `/v1/quest/*`; B-группа — `/v1/quests*`.  
7. **Evidence strength**: A=`medium`, B=`medium`  
8. **Severity**: `medium`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Ошибка префикса ломает интеграции, smoke и incident triage.  
12. **Normalization target**: `ops SSOT` + `code/doc alignment` с gateway routes.

## CF-008

1. **Conflict ID**: `CF-008`  
2. **Contour**: `auth-service` vs `user_service`  
3. **Conflict Type**: `naming drift`, `docs vs code`  
4. **File A**: `apps/auth-service`  
5. **File B**: `docs/backend/user_service/*`  
6. **Exact mismatch**: Кодовой контур именуется `auth-service`; backend docs именуют его `user_service`.  
7. **Evidence strength**: A=`strong`, B=`strong`  
8. **Severity**: `medium`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Naming drift мешает правильному ownership, triage и task mapping.  
12. **Normalization target**: `backend/module docs` + `status anchor` naming policy.

## CF-009

1. **Conflict ID**: `CF-009`  
2. **Contour**: `api-gateway` documentation coverage  
3. **Conflict Type**: `docs vs code`, `contract drift`  
4. **File A**: `apps/api-gateway/src/index.ts`  
5. **File B**: отсутствие `docs/backend/api_gateway/*`  
6. **Exact mismatch**: Критичный runtime-контур присутствует в коде, но нет симметричного backend-doc subtree с контрактной картой.  
7. **Evidence strength**: A=`strong`, B=`strong`  
8. **Severity**: `medium`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Слабая формальная база для аудита auth boundary и route ownership.  
12. **Normalization target**: `backend/module docs` (gateway contract map).

## CF-010

1. **Conflict ID**: `CF-010`  
2. **Contour**: Atlas service form  
3. **Conflict Type**: `target vs actual`, `docs vs code`  
4. **File A**:  
   - `docs/backend/atlas_service/*`  
   - `docs/modules/atlas/*`  
5. **File B**:  
   - отсутствие `apps/atlas-service`  
   - `apps/content-service/src/index.ts` (consolidated contour evidence)  
6. **Exact mismatch**: Docs описывают отдельный `atlas_service`; отдельного app нет, часть runtime потока consolidated в `content-service`.  
7. **Evidence strength**: A=`strong`, B=`strong`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Без явной фиксации ownership нельзя безопасно планировать API и data integrity по geo SSOT.  
12. **Normalization target**: `status anchor` + `backend/module docs`.

## CF-011

1. **Conflict ID**: `CF-011`  
2. **Contour**: Pulse service form  
3. **Conflict Type**: `target vs actual`, `docs vs code`  
4. **File A**:  
   - `docs/backend/pulse_service/*`  
   - `docs/modules/pulse/*`  
5. **File B**:  
   - отсутствие `apps/pulse-service`  
   - frontend pulse usage + mixed content SDK path  
6. **Exact mismatch**: Docs описывают отдельный pulse backend, но отдельный app не подтвержден; runtime контур смешан.  
7. **Evidence strength**: A=`strong`, B=`medium`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Риск неверного boundary в event ownership и cross-domain зависимостях.  
12. **Normalization target**: `status anchor` + `code/doc alignment`.

## CF-012

1. **Conflict ID**: `CF-012`  
2. **Contour**: Feed vs Space API ownership  
3. **Conflict Type**: `ownership drift`, `frontend vs backend readiness`, `docs vs code`  
4. **File A**:  
   - `apps/feed-service/src/index.ts`  
   - `docs/architecture/feed/*`  
5. **File B**: `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx` (`/v1/space/feed/*`)  
6. **Exact mismatch**: Есть отдельный feed-service, но UI ходит через `space`-prefixed feed endpoints; прямой `/v1/feed` path не подтвержден.  
7. **Evidence strength**: A=`strong`, B=`strong`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Неясный ownership feed-маршрутов ломает контрактную дисциплину и тестовые гейты.  
12. **Normalization target**: `status anchor` + `ops SSOT` + gateway contract docs.

## CF-013

1. **Conflict ID**: `CF-013`  
2. **Contour**: Content vs Space/Reactions ownership  
3. **Conflict Type**: `ownership drift`, `scope/deferred ambiguity`  
4. **File A**:  
   - `docs/decisions/adr_0020_no_inline_comments_social_first.md`  
   - `docs/architecture/space/*`  
5. **File B**:  
   - `docs/backend/content_service/*`  
   - `apps/content-service/src/index.ts`  
6. **Exact mismatch**: Social-first policy и отдельные social services coexist с active content contours; финальная граница обсуждений не нормализована.  
7. **Evidence strength**: A=`medium`, B=`strong`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Ведет к дублированию contract surface и inconsistent user behavior.  
12. **Normalization target**: `ADR` + `backend/module docs` + `status anchor`.

## CF-014

1. **Conflict ID**: `CF-014`  
2. **Contour**: Token contour coherence  
3. **Conflict Type**: `target vs actual`, `docs vs code`, `scope/deferred ambiguity`  
4. **File A**: `apps/token-service`  
5. **File B**:  
   - отсутствие `docs/backend/token_service/*`  
   - косвенные контуры: `docs/backend/blockchain_gateway_service/*`, `docs/backend/nft_service/*`, `docs/modules/connect/*`  
6. **Exact mismatch**: App существует, но нет симметричного token backend docs subtree; статус active/scaffold не нормализован.  
7. **Evidence strength**: A=`strong`, B=`strong`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Риск неверного включения token/on-chain scope в текущий цикл.  
12. **Normalization target**: `status anchor` + `backend/module docs`.

## CF-015

1. **Conflict ID**: `CF-015`  
2. **Contour**: Referral UI vs backend readiness  
3. **Conflict Type**: `frontend vs backend readiness`, `scope/deferred ambiguity`  
4. **File A**: `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/page.tsx`  
5. **File B**: `apps/referral-service/*` + notes про mock/partial path в reconciliation  
6. **Exact mismatch**: UI route присутствует, но live-path без mock по всем веткам не подтвержден.  
7. **Evidence strength**: A=`strong`, B=`medium`  
8. **Severity**: `medium`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Повышает риск ложной оценки production readiness growth-flow.  
12. **Normalization target**: `status anchor` + `code/doc alignment`.

## CF-016

1. **Conflict ID**: `CF-016`  
2. **Contour**: Reactions integration visibility  
3. **Conflict Type**: `frontend vs backend readiness`, `ownership drift`  
4. **File A**: `apps/reactions-service/*`  
5. **File B**: отсутствие подтвержденных прямых `/v1/reactions` вызовов в `apps/go2asia-pwa-shell/app/**/*`  
6. **Exact mismatch**: Runtime app присутствует, но frontend integration path подтвержден слабо/косвенно.  
7. **Evidence strength**: A=`strong`, B=`strong`  
8. **Severity**: `medium`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Непрозрачный path реакций усложняет SLA и границы между feed/space/reactions.  
12. **Normalization target**: `status anchor` + `backend/module docs`.

## CF-017

1. **Conflict ID**: `CF-017`  
2. **Contour**: Workspace manifest vs filesystem  
3. **Conflict Type**: `docs vs code`, `target vs actual`  
4. **File A**: `pnpm-workspace.yaml`  
5. **File B**: фактическая структура (`services/*`/`prototypes/*` файлов не подтверждено; `frontend-shell` есть, но не в workspace)  
6. **Exact mismatch**: Workspace globs и фактическое дерево частично расходятся.  
7. **Evidence strength**: A=`strong`, B=`medium`  
8. **Severity**: `low`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Риск путаницы в toolchain/ownership, особенно для новых участников и CI assumptions.  
12. **Normalization target**: `code/doc alignment` (workspace manifest hygiene).

## CF-018

1. **Conflict ID**: `CF-018`  
2. **Contour**: `docs/backend` model vs app allocation  
3. **Conflict Type**: `target vs actual`, `docs vs code`  
4. **File A**: `docs/backend/*_service/*` (полный сервисный каталог)  
5. **File B**: `apps/*` (часть сервисов отсутствует как отдельные apps)  
6. **Exact mismatch**: Backend docs выглядят как полная сервисная декомпозиция, но repo allocation частично иной (consolidated/absent services).  
7. **Evidence strength**: A=`strong`, B=`strong`  
8. **Severity**: `high`  
9. **Can be auto-normalized?**: `no`  
10. **Tentative stronger source**: `none — manual normalization required`  
11. **Why it matters**: Неправильное прочтение docs как runtime-факта приводит к ошибочному sequencing и завышению readiness.  
12. **Normalization target**: `status anchor` + `backend/module docs` clarifications.


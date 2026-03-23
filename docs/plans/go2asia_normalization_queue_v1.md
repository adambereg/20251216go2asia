# Go2Asia Normalization Queue v1

## 1. Purpose

Этот документ фиксирует короткую рабочую очередь нормализации governance-расхождений перед следующим execution-planning циклом.

Основание:

- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/plans/go2asia_reconciliation_conflict_index_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`

Очередь нормализует:

- status truth между конфликтующими артефактами;
- policy-конфликты (`ops` vs `ADR` vs workflow);
- ownership ambiguity по ключевым routing/domain boundaries;
- target-vs-actual mapping и docs symmetry.

Очередь **не является** roadmap, feature backlog или implementation plan.

## 2. Prioritization Rules

1. Конфликты, искажающие `status truth`, выше обычных doc gaps.
2. `ops/ADR/workflow` конфликты выше naming/cosmetic drift.
3. Ownership ambiguity, влияющая на API routing и sequencing, выше локальных описательных расхождений.
4. Артефакты, уже используемые как planning anchors, нормализуются раньше вторичных notes.
5. Порядок нормализации: governance/policy -> status truth -> ownership boundaries -> docs symmetry.
6. Если конфликт закрывается документно, код не меняется без необходимости.

## 3. Queue Summary

| Metric | Value |
|---|---:|
| Total items | 11 |
| High priority | 6 |
| Medium priority | 5 |
| Low priority | 0 |
| Items requiring code/doc alignment | 6 |
| Purely governance/docs items | 5 |
| Items requiring owner decision | 10 |
| Items closable without code changes | 8 |

## 4. Normalization Queue

### NQ-001

1. **Queue ID**: `NQ-001`  
2. **Related conflict(s)**: `CF-001`, `CF-003`, `CF-004`  
3. **Theme**: Status truth normalization  
4. **Priority**: `high`  
5. **Why priority**: Пока не зафиксирована единая иерархия статуса, любой новый план будет опираться на конфликтующие источники. Это базовый блокер для безопасного sequencing.  
6. **Normalization type**: `status truth`, `artifact role cleanup`  
7. **Primary owner role**: `Architecture Governance`  
8. **Supporting roles**: `Solution Architect`, `Engineering Lead`, `Domain Leads`  
9. **Required artifact(s) to update**:  
   - `docs/plans/go2asia_status_anchor_v1.md`  
   - `docs/architecture/system_status_2026_march_10.md`  
   - `docs/architecture/frontend_sequencing_note_v1.md`  
   - `docs/plans/mvp_implementation_plan.md` (role annotation)  
10. **Required decision / action**: Утвердить единую иерархию status-артефактов и явно зафиксировать, какие документы operational, а какие historical/reference.  
11. **Expected output of normalization**: Обновленный status anchor + согласованные роли ключевых status/planning документов.  
12. **Done when**: В конфликтующих документах нет конкурирующих claims о source-of-truth без явной ссылки на anchor.  
13. **Requires code change?**: `no`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `none`  
16. **Risk if skipped**: Следующий execution plan снова будет построен на противоречивой картине статусов.

### NQ-002

1. **Queue ID**: `NQ-002`  
2. **Related conflict(s)**: `CF-005`, `CF-006`  
3. **Theme**: Staging deploy policy  
4. **Priority**: `high`  
5. **Why priority**: Это operational policy-конфликт между docs и фактическим workflow. Ошибка здесь напрямую влияет на release hygiene.  
6. **Normalization type**: `ADR/policy alignment`, `ops normalization`, `code/doc alignment`  
7. **Primary owner role**: `DevOps / Platform`  
8. **Supporting roles**: `Architecture Governance`, `Backend Lead`  
9. **Required artifact(s) to update**:  
   - `docs/ops/ci_cd.md`  
   - `docs/ops/deployment_guides/backend_deploy.md`  
   - `docs/ops/milestone2_backend_source_of_truth.md`  
   - `docs/plans/go2asia_status_anchor_v1.md`  
10. **Required decision / action**: Признать `ADR-0017` + `.github/workflows/deploy-workers-staging.yml` канонической staging policy и вычистить противоречащие ops-страницы.  
11. **Expected output of normalization**: Согласованные ops SSOT docs без конфликтов по веткам/триггерам staging.  
12. **Done when**: Все релевантные ops-документы и anchor дают одну и ту же staging policy.  
13. **Requires code change?**: `no`  
14. **Requires owner decision?**: `no`  
15. **Sequencing dependency**: `NQ-001`  
16. **Risk if skipped**: Команда продолжит запускать неверные deploy assumptions и терять воспроизводимость релизов.

### NQ-003

1. **Queue ID**: `NQ-003`  
2. **Related conflict(s)**: `CF-002`  
3. **Theme**: Plan self-consistency cleanup  
4. **Priority**: `high`  
5. **Why priority**: Внутреннее противоречие в одном plan note делает его опасным как status-ссылку.  
6. **Normalization type**: `status truth`, `artifact role cleanup`  
7. **Primary owner role**: `Architecture Governance`  
8. **Supporting roles**: `Engineering Lead`  
9. **Required artifact(s) to update**:  
   - `docs/plans/go2asia_next_steps_plan_2026_march_10.md`  
   - `docs/plans/go2asia_status_anchor_v1.md`  
10. **Required decision / action**: Удалить взаимоисключающие формулировки по social-first backend/space-service и привести к единой формулировке с долгом/deferred.  
11. **Expected output of normalization**: Внутренне непротиворечивый plan-note с явной ссылкой на anchor.  
12. **Done when**: В документе нет одновременного `not finished` и `done` для одного и того же контура без четкого scope разграничения.  
13. **Requires code change?**: `no`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-001`  
16. **Risk if skipped**: План будет продолжать генерировать ложные трактовки в постановке задач.

### NQ-004

1. **Queue ID**: `NQ-004`  
2. **Related conflict(s)**: `CF-007`  
3. **Theme**: Quest API prefix normalization  
4. **Priority**: `medium`  
5. **Why priority**: Контрактный префикс должен быть единым в ops SSOT, иначе ломаются smoke и интеграционные ожидания.  
6. **Normalization type**: `ops normalization`, `contract drift`, `code/doc alignment`  
7. **Primary owner role**: `Shared Platform Maintainer`  
8. **Supporting roles**: `Backend Lead`, `DevOps / Platform`  
9. **Required artifact(s) to update**:  
   - `docs/ops/phase2_m2_0_foundations.md`  
   - `docs/ops/staging_services_overview.md`  
   - `docs/ops/service_inventory.md`  
   - `docs/ops/runbooks.md`  
10. **Required decision / action**: Подтвердить канонический префикс (`/v1/quest*` vs `/v1/quests*`) по gateway reality и унифицировать ops docs.  
11. **Expected output of normalization**: Единый route-prefix в ops SSOT.  
12. **Done when**: Во всех релевантных ops docs одинаковый префикс и нет пометок, противоречащих gateway.  
13. **Requires code change?**: `possibly`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-002`  
16. **Risk if skipped**: Ошибки в интеграции/отладке и ложные 404/route mismatch при эксплуатации.

### NQ-005

1. **Queue ID**: `NQ-005`  
2. **Related conflict(s)**: `CF-008`  
3. **Theme**: Auth/User naming normalization  
4. **Priority**: `medium`  
5. **Why priority**: Naming drift мешает ownership и связыванию задач между docs и кодом.  
6. **Normalization type**: `naming normalization`, `docs symmetry`  
7. **Primary owner role**: `Architecture Governance`  
8. **Supporting roles**: `Backend Lead`, `Platform Lead`  
9. **Required artifact(s) to update**:  
   - `docs/backend/user_service/*` (alias/canonical naming note)  
   - `docs/plans/go2asia_status_anchor_v1.md`  
10. **Required decision / action**: Выбрать каноническое имя контура (`auth-service` или `user_service`) и зафиксировать alias policy.  
11. **Expected output of normalization**: Непротиворечивое naming-правило для auth-контура.  
12. **Done when**: Все ключевые status/docs references используют одно canonical label или документированный alias.  
13. **Requires code change?**: `no`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-001`  
16. **Risk if skipped**: Останутся ошибки в triage/ownership и неоднозначные ссылки в документации.

### NQ-006

1. **Queue ID**: `NQ-006`  
2. **Related conflict(s)**: `CF-009`  
3. **Theme**: API gateway contract documentation  
4. **Priority**: `medium`  
5. **Why priority**: Для критического boundary нет симметричного backend-doc contract map.  
6. **Normalization type**: `docs symmetry`, `contract drift`, `code/doc alignment`  
7. **Primary owner role**: `Platform Lead`  
8. **Supporting roles**: `Security/Architecture Governance`, `Backend Leads`  
9. **Required artifact(s) to update**:  
   - `docs/backend/` (создать/добавить gateway contract note subtree)  
   - `docs/plans/go2asia_status_anchor_v1.md`  
10. **Required decision / action**: Зафиксировать минимальную route->service и auth boundary карту gateway как auditable артефакт.  
11. **Expected output of normalization**: Документированная gateway contract map с ссылками на ADR-0015.  
12. **Done when**: Gateway boundary описан в одном authoritative месте и не противоречит фактическим маршрутам.  
13. **Requires code change?**: `no`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-005`  
16. **Risk if skipped**: Сохраняется высокий риск расхождения security/route assumptions между командами.

### NQ-007

1. **Queue ID**: `NQ-007`  
2. **Related conflict(s)**: `CF-010`, `CF-011`  
3. **Theme**: Atlas/Pulse service allocation (target vs actual)  
4. **Priority**: `high`  
5. **Why priority**: Это ключевой target-vs-actual конфликт, напрямую влияющий на чтение status и ownership по базовым доменам.  
6. **Normalization type**: `target vs actual mapping`, `status truth`, `docs symmetry`  
7. **Primary owner role**: `Solution Architect`  
8. **Supporting roles**: `Domain Lead`, `Backend Lead`, `Architecture Governance`  
9. **Required artifact(s) to update**:  
   - `docs/backend/atlas_service/*`  
   - `docs/backend/pulse_service/*`  
   - `docs/modules/atlas/*`  
   - `docs/modules/pulse/*`  
   - `docs/plans/go2asia_status_anchor_v1.md`  
10. **Required decision / action**: Формально зафиксировать: atlas/pulse в текущем цикле являются consolidated runtime contours или отдельными service targets с текущим `not-separated` статусом.  
11. **Expected output of normalization**: Явная mapping-нота target vs actual для Atlas/Pulse без двусмысленности.  
12. **Done when**: В status anchor и профильных docs нет противоречия «отдельный сервис уже есть» при отсутствии соответствующего app.  
13. **Requires code change?**: `possibly`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-001`  
16. **Risk if skipped**: Следующий planning снова исказит зависимости по geo/event базовым доменам.

### NQ-008

1. **Queue ID**: `NQ-008`  
2. **Related conflict(s)**: `CF-012`  
3. **Theme**: Feed vs Space ownership  
4. **Priority**: `high`  
5. **Why priority**: Неясная ownership граница по feed endpoints влияет на API routing, тесты и статус social-core.  
6. **Normalization type**: `ownership clarification`, `code/doc alignment`, `status truth`  
7. **Primary owner role**: `Backend Lead`  
8. **Supporting roles**: `Platform Lead`, `Frontend Lead`, `Architecture Governance`  
9. **Required artifact(s) to update**:  
   - `docs/plans/go2asia_status_anchor_v1.md`  
   - `docs/architecture/feed/*`  
   - `docs/architecture/space/*`  
   - gateway contract note (из `NQ-006`)  
10. **Required decision / action**: Явно решить, `/v1/space/feed/*` — это временный consolidation path или канонический ownership path, и кто владелец контракта.  
11. **Expected output of normalization**: Формализованный ownership feed path + синхронизированные docs.  
12. **Done when**: В anchor/architecture/gateway docs нет unresolved противоречий по feed ownership.  
13. **Requires code change?**: `possibly`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-006`  
16. **Risk if skipped**: Сохраняется риск route drift и конфликтов между backend/FE при любых изменениях feed.

### NQ-009

1. **Queue ID**: `NQ-009`  
2. **Related conflict(s)**: `CF-013`  
3. **Theme**: Content vs Space/Reactions boundary  
4. **Priority**: `high`  
5. **Why priority**: Ownership ambiguity в social/content контуре напрямую создает риск дублирования и неконсистентных контрактов.  
6. **Normalization type**: `ownership clarification`, `ADR/policy alignment`, `status truth`  
7. **Primary owner role**: `Solution Architect`  
8. **Supporting roles**: `Backend Lead`, `Product + Tech Lead`, `Architecture Governance`  
9. **Required artifact(s) to update**:  
   - `docs/decisions/adr_0020_no_inline_comments_social_first.md` (или companion note)  
   - `docs/backend/content_service/*`  
   - `docs/architecture/space/*`  
   - `docs/plans/go2asia_status_anchor_v1.md`  
10. **Required decision / action**: Зафиксировать каноническую границу: что считается social discussion ownership, что остается в content contour, что legacy/deferred.  
11. **Expected output of normalization**: Явный boundary-policy артефакт и синхронизация профильных docs.  
12. **Done when**: Для discussion/reaction paths нет competing ownership claims между content и social docs.  
13. **Requires code change?**: `possibly`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-008`  
16. **Risk if skipped**: Повторное появление конфликтов API и ложная оценка готовности social-first модели.

### NQ-010

1. **Queue ID**: `NQ-010`  
2. **Related conflict(s)**: `CF-014`  
3. **Theme**: Token contour classification  
4. **Priority**: `medium`  
5. **Why priority**: Без четкой классификации `token-service` легко ошибочно включить в текущий operational scope.  
6. **Normalization type**: `target vs actual mapping`, `docs symmetry`, `status truth`  
7. **Primary owner role**: `Domain Lead`  
8. **Supporting roles**: `Architecture Governance`, `Backend Lead`  
9. **Required artifact(s) to update**:  
   - `docs/plans/go2asia_status_anchor_v1.md`  
   - `docs/backend/*` (token contour note или явная ссылка на split)  
   - `docs/modules/connect/*`  
10. **Required decision / action**: Определить `token-service`: active bounded context, scaffold/future contour или deferred, и отразить это одинаково во всех статусных docs.  
11. **Expected output of normalization**: Однозначная классификация token контура в anchor и профильных docs.  
12. **Done when**: В документах нет competing трактовок текущего статуса token/on-chain scope.  
13. **Requires code change?**: `no`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-007`  
16. **Risk if skipped**: Следующий план рискует включить неготовый/неподтвержденный scope как operational.

### NQ-011

1. **Queue ID**: `NQ-011`  
2. **Related conflict(s)**: `CF-017`, `CF-018`  
3. **Theme**: Repo truth model and docs symmetry  
4. **Priority**: `high`  
5. **Why priority**: Это фундаментальная проблема чтения репозитория: docs backend каталог не равен runtime app allocation 1:1.  
6. **Normalization type**: `target vs actual mapping`, `docs symmetry`, `code/doc alignment`, `artifact role cleanup`  
7. **Primary owner role**: `Architecture Governance`  
8. **Supporting roles**: `Shared Platform Maintainer`, `Engineering Lead`  
9. **Required artifact(s) to update**:  
   - `docs/plans/go2asia_status_anchor_v1.md`  
   - `docs/backend/*` (explicit runtime allocation disclaimer/index)  
   - `pnpm-workspace.yaml` (или поясняющий note в docs при сохранении как есть)  
10. **Required decision / action**: Явно задать правило интерпретации: doc-defined service contour vs actual app allocation (including consolidated/runtime-missing apps).  
11. **Expected output of normalization**: Единая repo truth model note + синхронизированные ссылки в anchor/backend docs.  
12. **Done when**: Команда из одного документа понимает, какие контуры doc-only, code-only, consolidated, и это не противоречит workspace reality.  
13. **Requires code change?**: `possibly`  
14. **Requires owner decision?**: `yes`  
15. **Sequencing dependency**: `NQ-001`  
16. **Risk if skipped**: Продолжатся системные ошибки интерпретации “что реально существует”, что ломает планирование и ownership.

## 5. Grouped View by Urgency

### 5.1 Must normalize before next execution plan

- `NQ-001` (status truth hierarchy)
- `NQ-002` (staging deploy policy)
- `NQ-007` (atlas/pulse target-vs-actual)
- `NQ-008` (feed vs space ownership)
- `NQ-011` (repo truth model)

### 5.2 Should normalize in same governance cycle

- `NQ-003` (next-steps internal consistency)
- `NQ-004` (quest prefix drift)
- `NQ-005` (auth/user naming)
- `NQ-006` (gateway contract docs)
- `NQ-009` (content vs social boundary)

### 5.3 Can remain explicitly unresolved for one cycle

- `NQ-010` (token contour classification), **только если** в anchor явно зафиксирован как unresolved/deferred и не используется как execution baseline.

## 6. Grouped View by Nature of Work

- **Policy / ADR / Ops**: `NQ-002`, `NQ-004`, `NQ-009`
- **Status truth / planning anchors**: `NQ-001`, `NQ-003`
- **Ownership / routing / contour boundaries**: `NQ-008`, `NQ-009`, `NQ-007`
- **Docs symmetry / naming**: `NQ-005`, `NQ-006`, `NQ-011`
- **Target vs actual mapping**: `NQ-007`, `NQ-010`, `NQ-011`

## 7. Safe-to-Plan Gate

### Required before new master plan

- `[NQ-001]` — без единого status truth любые planning артефакты снова будут конфликтовать.
- `[NQ-002]` — без единой staging policy release assumptions будут неконсистентны.
- `[NQ-007]` — без atlas/pulse mapping искажается базовая архитектурная картина зависимостей.
- `[NQ-008]` — без feed/space ownership невалиден sequencing social/API задач.
- `[NQ-011]` — без repo truth model команда продолжит путать doc-модель и runtime reality.

### What remains allowed to stay unresolved temporarily

- `NQ-010` может остаться unresolved на один цикл, если token contour явно зафиксирован как deferred/mixed и исключен из execution baseline.
- `NQ-005` и `NQ-006` могут быть завершены в том же governance cycle после safe-to-plan gate, если они не блокируют принятую status truth/ownership модель.

## 8. Explicit Non-Goals

- Не заменяет product roadmap.
- Не утверждает implementation sequencing по фичам.
- Не детализирует feature scope.
- Не подменяет ADR.
- Не решает автоматически все ownership disputes без owner decision.
- Не доказывает production readiness runtime.

## 9. Files Used

- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/plans/go2asia_reconciliation_conflict_index_v1.md`
- `docs/plans/go2asia_status_anchor_v1.md`
- `docs/architecture/system_status_2026_march_10.md`
- `docs/architecture/frontend_sequencing_note_v1.md`
- `docs/architecture/execution_cycle_closure_note_v1.md`
- `docs/architecture/space/space_phase1_freeze_note_v1.md`
- `docs/plans/go2asia_next_steps_plan_2026_march_10.md`
- `docs/plans/go2asia_plan_reconciliation_note_v1.md`
- `docs/plans/mvp_implementation_plan.md`
- `docs/ops/ci_cd.md`
- `docs/ops/deployment_guides/backend_deploy.md`
- `docs/ops/milestone2_backend_source_of_truth.md`
- `docs/ops/staging_services_overview.md`
- `docs/ops/service_inventory.md`
- `docs/ops/runbooks.md`
- `docs/ops/phase2_m2_0_foundations.md`
- `docs/decisions/adr_0017_staging_deploys_from_feature_branches.md`
- `.github/workflows/deploy-workers-staging.yml`
- `apps/api-gateway/src/index.ts`
- `apps/feed-service/src/index.ts`
- `apps/content-service/src/index.ts`
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `apps/auth-service/*`
- `apps/token-service/*`
- `docs/backend/**/*`
- `docs/modules/**/*`


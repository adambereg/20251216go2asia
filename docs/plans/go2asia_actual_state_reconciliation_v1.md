# Go2Asia Actual State Reconciliation v1

## 1. Executive Summary

- В репозитории подтверждено 15 приложений в `apps/*` с `package.json`: `api-gateway`, `auth-service`, `content-service`, `feed-service`, `go2asia-pwa-shell`, `guru-service`, `media-service`, `points-service`, `quest-service`, `reactions-service`, `referral-service`, `rf-service`, `rielt-service`, `space-service`, `token-service`.
- Подтверждено 8 shared-пакетов в `packages/*` с `package.json`: `atlas-taxonomy`, `config`, `db`, `logger`, `schemas`, `sdk`, `types`, `ui`.
- В `docs/backend/*` существуют контуры, для которых нет одноименного `apps/*-service`: `atlas_service`, `pulse_service`, `user_service`, `connect_service`, `notification_service`, `nft_service`, `voucher_service`, `logging_service`, `blockchain_gateway_service`.
- В `apps/*` существуют контуры без зеркальной ветки `docs/backend/<service>_service`: `api-gateway`, `auth-service`, `space-service`, `feed-service`, `token-service`.
- Подтвержден дрейф статусов: `docs/architecture/system_status_2026_march_10.md` фиксирует social/partner/guru как not started, а `docs/plans/go2asia_plan_reconciliation_note_v1.md` и closure/freeze-ноты фиксируют baseline/closed для части этих же контуров.
- Подтвержден внутренний конфликт в `docs/plans/go2asia_next_steps_plan_2026_march_10.md`: одновременно заявлены незавершенный social-first backend и `space-service` done/completed.
- По frontend интеграции подтверждены живые маршруты/клиенты для `atlas`, `pulse`, `rielt`, `rf`, `guru`, `quest`, `space`; для `media`, `points`, `reactions`, `token` в `app/` сильная прямая интеграция не подтверждена.
- `go2asia-pwa-shell` имеет Next.js `app`-структуру; `src`-каталог для него не подтвержден как используемый runtime-entrypoint.
- Для всех Worker-приложений, кроме `go2asia-pwa-shell`, подтверждены `wrangler.toml`; для `token-service` тесты в `apps/token-service/test` не подтверждены.
- По policy/ADR strongest-constraints подтверждены: JWT boundary на gateway (`adr_0015`), OpenAPI SSOT/bundle (`adr_0014`), SQL DDL SSOT (`adr_0016`), staging from feature branches (`adr_0017`).
- Подтвержден документный конфликт CI/CD: `docs/ops/ci_cd.md` и `docs/ops/deployment_guides/backend_deploy.md` описывают staging через `develop`, но `adr_0017` и `.github/workflows/deploy-workers-staging.yml` указывают feature-branch/push trigger.
- По ownership `Feed -> Space/Reactions` в коде и docs в целом читается, но прямой frontend вызов `/v1/feed` не подтвержден; в `space` UI используются `/v1/space/feed/*`.
- По ownership `Content vs Space/Reactions` граница в документах неоднородна: social-first заявлен в ADR, но контентные API и legacy-контуры продолжают сосуществовать.
- По `Atlas/Pulse` как отдельным backend-service контуры в docs присутствуют, а отдельные `apps/atlas-service` и `apps/pulse-service` не подтверждены.
- По `Token` есть отдельный `apps/token-service`, но в `docs/backend`/`docs/modules` нет симметричного `token_service`; подтверждение текущей production-готовности токен-контуров отсутствует.
- По `docs/*` надежность неоднородна: есть authoritative SSOT-папки (`openapi`, части `ops`, `decisions`), и есть historical/supporting зоны (`reviews`, часть `plans`, часть `testing`).

## 2. Repo Reality

### 2.1 Top-level structure

Подтвержденные верхнеуровневые каталоги (по фактическому обходу файлов):

- `apps`
- `packages`
- `docs`
- `content`
- `scripts`
- `tests`
- `templates`
- `design-system`
- `exports`
- `frontend-shell`
- `.github`
- `types`

Подтвержденные верхнеуровневые файлы:

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `orval.config.ts`
- `tsconfig.base.json`
- `README.md`
- `design.pen`

Примечания по факту:

- `pnpm-workspace.yaml` содержит `services/*` и `prototypes/*`, но файлов в этих ветках не подтверждено.
- `frontend-shell` физически присутствует, но в `pnpm-workspace.yaml` не указан.
- Исчерпывающий список всех пустых/скрытых директорий без отдельного листинга не подтвержден.

### 2.2 Actual apps inventory

Подтверждены:

- `apps/api-gateway`
- `apps/auth-service`
- `apps/content-service`
- `apps/feed-service`
- `apps/go2asia-pwa-shell`
- `apps/guru-service`
- `apps/media-service`
- `apps/points-service`
- `apps/quest-service`
- `apps/reactions-service`
- `apps/referral-service`
- `apps/rf-service`
- `apps/rielt-service`
- `apps/space-service`
- `apps/token-service`

Фактические признаки runtime по apps:

- Для всех Worker-сервисов подтверждены `wrangler.toml`.
- Для `go2asia-pwa-shell` `wrangler.toml` не подтвержден (ожидаемо для Next app).
- Для большинства сервисов подтверждены `test/request.test.ts`; для `token-service` тесты в `apps/token-service/test/**/*` не подтверждены.

### 2.3 Actual packages inventory

Подтверждены:

- `packages/atlas-taxonomy`
- `packages/config`
- `packages/db`
- `packages/logger`
- `packages/schemas`
- `packages/sdk`
- `packages/types`
- `packages/ui`

### 2.4 Actual docs inventory

Подтвержденные подкаталоги первого уровня в `docs`:

- `docs/ai`
- `docs/architecture`
- `docs/audits`
- `docs/backend`
- `docs/content`
- `docs/decisions`
- `docs/design`
- `docs/knowledge`
- `docs/modules`
- `docs/openapi`
- `docs/ops`
- `docs/overview`
- `docs/plans`
- `docs/playbooks`
- `docs/reviews`
- `docs/standards`
- `docs/testing`

Файлы в корне `docs`:

- `docs/README.md`
- `docs/backend_microservice.md`

### 2.5 Missing / partial / doc-only contours

Doc-only (есть в `docs/backend/*`, нет одноименного `apps/*-service`):

- `atlas_service`
- `pulse_service`
- `user_service`
- `connect_service`
- `notification_service`
- `nft_service`
- `voucher_service`
- `logging_service`
- `blockchain_gateway_service`

Code-only относительно `docs/backend/<service>_service`:

- `api-gateway`
- `auth-service`
- `space-service`
- `feed-service`
- `token-service`

Частичный/смешанный контур:

- `atlas` и `pulse` полно описаны в `docs/backend` и `docs/modules`, но отдельные `apps/atlas-service` и `apps/pulse-service` не подтверждены.
- `content-service` в коде содержит runtime для части Atlas/Pulse контуров (неэквивалентно полностью выделенным сервисам из docs).

Interpretive note (NQ-011):

- `docs/backend/*` следует читать как модель backend contours/contracts (включая target/deferred/consolidated формы), а не как автоматическое 1:1 доказательство отдельно инстанцированных `apps/*-service`.
- `pnpm-workspace.yaml` следует читать как include patterns workspace scope, а не как canonical inventory заполненных/активных сервисных директорий.

## 3. Docs Reliability Map

### 3.1 By `docs/*` top-level folders

| Папка | Роль | Тип | Надежность для инженерных решений |
|---|---|---|---|
| `docs/architecture` | Архкарты, dependency maps, статусы/ноты | `SSOT` + `working note` + `closure/freeze artifact` | `supporting` / `unsafe without cross-check` при конфликте статусов |
| `docs/plans` | Плановые и reconciliation документы | `working note` + частично `historical` | `unsafe without cross-check` |
| `docs/backend` | Сервисные описания/контракты/безопасность | `SSOT` на уровне сервисных спецификаций | `authoritative` для модели, не всегда для фактического выделения app |
| `docs/modules` | Продуктовые доменные модели | `working note` + частично контрактный слой | `supporting` |
| `docs/decisions` | ADR/политики | `policy/ADR` | `authoritative` (особенно Accepted/Implemented) |
| `docs/ops` | Операционный контур, env/deploy/runbooks | `SSOT` + `working note` + `historical` | от `authoritative` до `unsafe without cross-check` (зависит от файла) |
| `docs/openapi` | Контрактные спецификации API | `SSOT` | `authoritative` |
| `docs/testing` | Тест-планы/гейты/сценарии | `working note` / часть `draft` | `supporting` |
| `docs/reviews` | Отчеты ревью по вехам | `archive` / `closure artifact` | `historical only` |
| `docs/audits` | Аудитные артефакты/rollback manifests | `closure artifact` / `archive` | `supporting` |
| `docs/overview` | Обзорные сводки | `working note` | `supporting` |
| `docs/content` | Контентные инструкции | `working note` | `supporting` |
| `docs/design` | Дизайн-материалы | `working note` | `supporting` |
| `docs/knowledge` | Знаниевая база | `working note` | `supporting` |
| `docs/playbooks` | Инженерные правила процесса | `policy/guide` | `supporting` (сверять с ADR/ops SSOT) |
| `docs/standards` | Конвенции/стандарты | `policy` | `authoritative` в своей области |
| `docs/ai` | Контекст AI-воркфлоу | `working note` | `supporting` |

### 3.2 Which docs are authoritative

Явно authoritative (подтверждено):

- `docs/ops/infrastructure_context.md`
- `docs/ops/staging_services_overview.md`
- `docs/decisions/adr_0014_openapi_ssot_and_bundling.md`
- `docs/decisions/adr_0015_jwt_verification_at_gateway.md`
- `docs/decisions/adr_0016_sql_ddl_and_ddl_applier.md`
- `docs/decisions/adr_0017_staging_deploys_from_feature_branches.md`
- `docs/openapi/*.yaml` и `docs/openapi/openapi.bundle.yaml` (по ADR-0014)

### 3.3 Which docs are historical or unsafe without cross-check

- `docs/plans/mvp_implementation_plan.md` как primary execution anchor: в ряде новых notes помечен как historical/reference.
- `docs/ops/ci_cd.md` и `docs/ops/deployment_guides/backend_deploy.md` (staging via `develop`) конфликтуют с `adr_0017` и фактическим workflow.
- `docs/ops/milestone2_backend_source_of_truth.md` в части branch policy конфликтует с `adr_0017`.
- `docs/testing/guide_engine_v1_test_plan.md` (Draft) — supporting, не release SSOT.
- `docs/architecture/system_status_2026_march_10.md` как snapshot — полезен, но unsafe в одиночку без сверки с более поздними closure/freeze/reconciliation заметками.

## 4. Domain-by-Domain Reconciliation

Формат каждой карточки: A-H.

### 4.1 `api-gateway`

**A. Target architecture state**
- Роль: edge-perimeter, JWT verification, маршрутизация на backend-сервисы.
- Отдельный сервис: да, как gateway-контур.

**B. Actual repo/code state**
- Отдельный app: `apps/api-gateway` (подтверждено).
- Runtime code: `apps/api-gateway/src/index.ts` подтвержден.
- API routes: подтверждены route groups в коде gateway (частично по именам групп, полный map не подтвержден в этом проходе).
- Persistence/schema: не подтверждено как собственный persistence.
- Contracts: отдельный `docs/backend/api_gateway` не подтвержден.
- Tests: `apps/api-gateway/test/request.test.ts` подтвержден.
- Frontend integration: косвенно через общий API base; прямой UI-контур gateway как модуль не подтвержден.

**C. Docs-declared state**
- В `docs/backend` и `docs/modules` отдельной папки gateway нет.
- В ops/decisions роль gateway зафиксирована (JWT boundary, staging routes).

**D. Runtime reality**
- Declared operational: medium.
- Подтверждение: strong по наличию app + entry + tests; medium по operational claims в docs без live runtime-логов.

**E. Frontend reality**
- Frontend работает через API-клиенты/маршруты, но прямой readiness gateway в UI не виден.

**F. Contradictions**
- Нет backend-doc subtree для gateway при критической платформенной роли.

**G. Controlled debt / deferred scope**
- Контрактная документация gateway в `docs/backend` не подтверждена.

**H. Next admissible step**
- Зафиксировать authoritative gateway contract map (routes + auth semantics) в одном месте docs.

### 4.2 `auth-service` (и `user_service` в docs)

**A**
- Target: identity/auth boundary, user context.
- В docs backend назван как `user_service`.

**B**
- App: `apps/auth-service` подтвержден.
- Entry/test/wrangler: подтверждены.
- API: runtime есть, но полный список эндпоинтов не подтвержден в этом проходе.
- Persistence/schema: не подтверждено детально.
- Frontend: Clerk интеграция подтверждена в `go2asia-pwa-shell/app` (`layout`, `AppContent`, `sign-in`).

**C**
- Docs backend: `docs/backend/user_service/*` (overview/api_contracts/security/roadmap).
- ADR: `adr_0015` задает JWT boundary.

**D**
- Declared operational: medium.
- Evidence: medium (код + docs + frontend auth integration); production-hardening не подтверждено как завершенное.

**E**
- UI auth integration: strong.

**F**
- Naming drift: `auth-service` в code vs `user_service` в docs/backend.

**G**
- RBAC/hardening в ряде плановых документов помечен незавершенным.

**H**
- Выровнять naming + статус (`auth-service` vs `user_service`) и зафиксировать текущий hardening-state в status anchor.

### 4.3 `content-service`

**A**
- Target: контентный контур (посты/материалы), в ряде документов также consolidation для Atlas/Pulse/Blog в MVP.

**B**
- App и runtime code подтверждены.
- API entry есть.
- Tests: `test/request.test.ts` подтвержден.
- Frontend: прямые вызовы контента подтверждены (`sitemap`, части blog/pulse detail через SDK/content).
- Persistence/contracts: контракты в docs/backend подтверждены.

**C**
- `docs/backend/content_service/*`, `docs/modules/blog/*`, и ADR о consolidation (`adr_0013`).

**D**
- Declared operational: medium.
- Evidence: strong по существованию кода/тестов/frontend integration; weak по полноте hardening.

**E**
- Frontend: medium-strong (используется в нескольких путях).

**F**
- Boundary conflict с social-first (`Content` vs `Space/Reactions`) в документах.

**G**
- Legacy coexistence/миграционные долги помечены в ряде status-планов.

**H**
- Зафиксировать единую ownership-модель обсуждений: content publish vs social discussion.

### 4.4 `media-service`

**A**
- Target: медиа-слой платформы/ассетов.

**B**
- App, entry, wrangler, tests подтверждены.
- Frontend прямые вызовы media API в `app/` не подтверждены.
- Persistence/contracts: docs/backend contracts есть.

**C**
- `docs/backend/media_service/*`, плюс архитектурные media-notes в `docs/architecture/media/*`.

**D**
- Declared operational: medium.
- Evidence: medium (код есть), но прямой UI-runtime usage не подтвержден.

**E**
- Frontend readiness: weak/unclear.

**F**
- В docs встречается переходный/legacy оттенок относительно канонического media SSOT.

**G**
- Scope и статус media в фазах различается между разными документами.

**H**
- Подтвердить фактические active media endpoints и их потребителей в frontend/backend.

### 4.5 `points-service`

**A**
- Target: ledger/points economy, idempotent операции.

**B**
- App, entry, wrangler подтверждены.
- Tests подтверждены (включая `idempotency_external_id.test.ts`).
- Frontend прямой `/v1/points` usage в `app/` не подтвержден.
- Contracts/docs backend подтверждены.

**C**
- `docs/backend/points_service/*`, `docs/modules/connect/*`, ADR терминологии (`adr_0021`).

**D**
- Declared operational: medium.
- Evidence: strong по code/tests; weak-medium по полной готовности ops/hardening.

**E**
- UI integration: weak (прямая не подтверждена).

**F**
- Возможный разрыв perception: экономика заявлена, но явные frontend точки `points` ограниченно подтверждены.

**G**
- Off-chain/on-chain разведение и token-связка в ряде документов отнесены к более поздним фазам.

**H**
- Зафиксировать минимальный активный points surface в runtime (какие endpoints реально используются сейчас).

### 4.6 `referral-service`

**A**
- Target: referral graph/claim/reward trigger.

**B**
- App, entry, wrangler, тесты (несколько файлов) подтверждены.
- Frontend: есть `connect/referrals` route, но есть mock-ветвление; прямая SDK интеграция referral в `app/` не подтверждена однозначно.

**C**
- `docs/backend/referral_service/*`, `docs/modules/connect/*`, ADR-0018.

**D**
- Declared operational: medium.
- Evidence: medium-strong по code/tests; medium по live UI flow.

**E**
- Frontend: partial/medium (есть route, но чисто runtime integration не полностью подтверждена).

**F**
- UI может создавать впечатление готовности при наличии mock-веток.

**G**
- Бонусные/интеграционные сценарии в docs/ops описывают чувствительность к env/secret конфигу.

**H**
- Подтвердить end-to-end referral claim path без mock и с points side effect.

### 4.7 `token-service`

**A**
- Target: токен-контур/будущая экономика (в разных docs связан с future/on-chain фазами).

**B**
- App + entry + wrangler подтверждены.
- Тесты не подтверждены.
- Frontend интеграция не подтверждена.
- В `docs/backend`/`docs/modules` симметричный `token_service` контур не подтвержден.

**C**
- Косвенная документация через `blockchain_gateway_service`, `nft_service`, `modules/connect`, ADR tokenomics.

**D**
- Declared operational: weak.
- Evidence: medium по наличию app; weak по API/contracts/frontend evidence как active contour.

**E**
- Frontend: absent/не подтверждено.

**F**
- Code exists vs docs contour fragmented (no direct token_service backend doc subtree).

**G**
- On-chain/token части в плановых документах часто вне current phase.

**H**
- Явно зафиксировать текущий статус token-service: active runtime или scaffold-only.

### 4.8 `space-service`

**A**
- Target: social publication contour (posts/groups/feed-related surfaces).

**B**
- App, entry, wrangler, tests подтверждены.
- Frontend интеграция подтверждена (`/space`, `SpacePageClient`, `/v1/space/feed/*`).
- Отдельной ветки `docs/backend/space_service` нет.

**C**
- Основная документация в `docs/architecture/space/*` и `docs/modules/space/*`.
- Статусы в space freeze/integration notes: phase-1 completion формулировки.

**D**
- Declared operational: medium.
- Evidence: strong по code+frontend route; medium по platform-wide readiness.

**E**
- Frontend: strong для shell/feed views.

**F**
- Drift с `system_status_2026_march_10.md` (social not started) vs freeze/closure/reconciliation notes.

**G**
- Cross-module references и часть social scope явно deferred.

**H**
- Нормализовать один authoritative status по Space phase1 и residual debt.

### 4.9 `reactions-service`

**A**
- Target: interactions/reactions as separate bounded context.

**B**
- App, entry, wrangler, tests подтверждены.
- Frontend прямой вызов `/v1/reactions` в `app/` не подтвержден.

**C**
- `docs/backend/reactions_service/*`, architecture notes про social boundaries.

**D**
- Declared operational: medium.
- Evidence: strong по code/tests; weak-medium по UI evidence.

**E**
- Frontend: weak/unclear прямой integration.

**F**
- Возможный ownership drift с `space` и legacy-comment flows.

**G**
- Некоторые функции reactions могут быть implicit через feed/space API, не подтверждено отдельно.

**H**
- Явно подтвердить клиентский путь до reactions endpoints (или зафиксировать backend-only stage).

### 4.10 `feed-service`

**A**
- Target: feed read model above Space/Reactions.

**B**
- App, entry, wrangler, tests подтверждены.
- Отдельный frontend вызов `/v1/feed` не подтвержден (в UI используется `/v1/space/feed/*`).
- `docs/backend/feed_service` и `docs/modules/feed` не подтверждены.

**C**
- Feed контур описан в `docs/architecture/feed/*` (не в `docs/backend`/`docs/modules`).

**D**
- Declared operational: weak-medium.
- Evidence: strong по existence app; weak по доказанному active API consumption из frontend.

**E**
- Frontend: partial/shell через space endpoints.

**F**
- Boundary ambiguity: Feed как отдельный app vs UI calls через Space-prefixed APIs.

**G**
- Возможен controlled debt на уровне separation contracts.

**H**
- Подтвердить route ownership: какие endpoints обслуживает именно `feed-service` в текущем gateway map.

### 4.11 `quest-service`

**A**
- Target: quests/progress/reward-related flows.

**B**
- App + runtime + wrangler + tests подтверждены.
- Frontend routes и SDK-интеграция подтверждены (`/quest`, leaderboard, details).
- Contracts в backend/modules подтверждены.

**C**
- `docs/backend/quest_service/*`, `docs/modules/quest/*`, зависимости в архитектурных notes (Atlas/Pulse/Points).

**D**
- Declared operational: medium.
- Evidence: strong по code+frontend presence; medium по завершенности всех deferred UI/backoffice функций.

**E**
- Frontend: strong (несколько страниц и flows).

**F**
- В разных notes часть quest surfaces отмечена deferred при одновременном operational baseline.

**G**
- Deferred scope: `my`, extended leaderboard, social integrations (по ряду notes).

**H**
- Закрепить, какие quest flows считаются production-admissible сейчас (а какие строго deferred).

### 4.12 `atlas` (домен)

**A**
- Target: geo SSOT (country/city/place) и upstream для других доменов.

**B**
- Отдельный `apps/atlas-service` не подтвержден.
- Frontend atlas routes и SDK интеграции подтверждены.
- Backend контур в коде может быть частично реализован через `content-service` (полная декомпозиция не подтверждена).

**C**
- `docs/backend/atlas_service/*`, `docs/modules/atlas/*`, `docs/architecture/atlas/*`.

**D**
- Declared operational: medium.
- Evidence: medium (много docs + frontend + косвенный runtime), но отдельный service-app отсутствует.

**E**
- Frontend: strong.

**F**
- Target (separate atlas service) vs actual repo (нет отдельного app).

**G**
- Geo normalization debt и controlled gate/deferred backfill явно зафиксированы в архитектурных notes.

**H**
- Формально закрепить runtime ownership Atlas API (отдельный service или consolidated contour).

### 4.13 `pulse` (домен)

**A**
- Target: events lifecycle/attendance truth.

**B**
- Отдельный `apps/pulse-service` не подтвержден.
- Frontend pulse routes и SDK usage подтверждены.
- Часть pulse-details идет через content SDK (смешанный runtime contour).

**C**
- `docs/backend/pulse_service/*`, `docs/modules/pulse/*`, `docs/architecture/pulse/*`.

**D**
- Declared operational: medium.
- Evidence: medium (UI + docs + code integration), отдельный service-app не подтвержден.

**E**
- Frontend: strong.

**F**
- Pulse как отдельный backend сервис в docs vs consolidated implementation fragments.

**G**
- Legacy/id-slug normalization и broader alignment notes фиксируют долг.

**H**
- Явно задокументировать active runtime boundaries Pulse API.

### 4.14 `rielt-service`

**A**
- Target: listings/inquiries/property domain ownership.

**B**
- App + entry + wrangler + tests подтверждены.
- Frontend `/rielt` integration подтверждена.
- Contracts backend/modules подтверждены.

**C**
- `docs/backend/rielt_service/*`, `docs/modules/rielt/*`, `docs/architecture/rielt/*`.

**D**
- Declared operational: medium.
- Evidence: strong по code + frontend; medium по wave2/deferred capabilities.

**E**
- Frontend: medium-strong (public flows подтверждены).

**F**
- В документах встречаются различия между более ранними и поздними milestone-пометками по отдельным UI-фичам.

**G**
- Owner suite и часть продвинутых сценариев — deferred/wave2.

**H**
- Зафиксировать единый текущий feature baseline Rielt v1 (без wave2 scope creep).

### 4.15 `rf-service`

**A**
- Target: partner/business contour (RF).

**B**
- App + entry + wrangler + tests подтверждены.
- Frontend `rf` public/auth routes подтверждены.
- Contracts backend/modules подтверждены.

**C**
- `docs/backend/rf_service/*`, `docs/modules/rf_partners/*`, `docs/architecture/rf/*`.

**D**
- Declared operational: medium.
- Evidence: strong по code presence; medium по persistent-grade maturity (не подтверждено как закрыто).

**E**
- Frontend: medium-strong (route surface есть).

**F**
- В ряде docs состояние `runtime baseline` соседствует с deferred enterprise-like scope.

**G**
- Persistence/merchant-pro depth часто вынесены за wave1.

**H**
- Четко зафиксировать RF v1 runtime boundaries и что именно остается вне done.

### 4.16 `guru-service`

**A**
- Target: read-aggregator, без владения upstream-данными.

**B**
- App + entry + wrangler + tests подтверждены.
- Frontend `/guru` SDK integration подтверждена.
- Contracts backend/modules подтверждены.

**C**
- `docs/backend/guru_service/*`, `docs/modules/guru/*`, `docs/architecture/guru/*`.

**D**
- Declared operational: medium.
- Evidence: strong по code/UI; medium по полноте источников и depth integration.

**E**
- Frontend: strong (публичный клиент и страницы есть).

**F**
- В docs встречается одновременно live adoption и ограничения по неполноте источников.

**G**
- Wave2/deferred источники и режимы агрегации.

**H**
- Явно зафиксировать whitelist активных upstream источников Guru для текущего цикла.

### 4.17 Shared/platform packages

#### `packages/db`

**A**: SQL DDL/migrations SSOT.  
**B**: пакет подтвержден; используется в workflow (`db:ddl:apply:staging` подтвержден в GHA).  
**C**: ADR-0016.  
**D**: operational evidence medium-strong.  
**E**: frontend не применимо.  
**F**: противоречий по SSOT роли не подтверждено.  
**G**: not applicable.  
**H**: поддерживать migration discipline и связь с release checks.

#### `packages/sdk`, `packages/types`, `packages/schemas`, `packages/logger`, `packages/config`, `packages/ui`, `packages/atlas-taxonomy`

**A**: shared runtime/contracts/tooling layer.  
**B**: физически существуют как пакеты.  
**C**: API/contract pipeline закреплен ADR-0014; подробные policy per package в данном проходе не подтверждены.  
**D**: evidence medium (existence confirmed, depth usage partially confirmed).  
**E**: frontend integration для `sdk` strong (множество импортов в `go2asia-pwa-shell/app`).  
**F**: не подтверждено существенных противоречий уровня docs/code в этом проходе.  
**G**: не подтверждено.  
**H**: для спринта фиксировать package-level ownership и release impact matrix.

## 5. Document Drift Findings

1) `system_status_2026_march_10.md` vs `go2asia_plan_reconciliation_note_v1.md`:
- Первый: social/partner/guru not started.
- Второй: `space/reactions/feed/guru/rf/rielt` completed/baseline with residual debt.
- Автовыбор победителя: нет.

2) `system_status_2026_march_10.md` vs `go2asia_next_steps_plan_2026_march_10.md`:
- Конфликт про `space-service` (не существует vs done/merged).
- Внутренний конфликт внутри next-steps: social-first backend незавершен, но step 4 done.

3) `frontend_sequencing_note_v1.md` (active sequencing reference) vs `go2asia_plan_reconciliation_note_v1.md` (effectively closed baseline):
- Статус governance артефакта расходится.
- Автовыбор: нет.

4) `system_status` source-of-truth список vs reconciliation:
- `mvp_implementation_plan.md` в одном контексте SoT аудита, в другом — больше archival/reference.
- Автовыбор: нет.

5) Ops drift:
- `docs/ops/ci_cd.md` и `docs/ops/deployment_guides/backend_deploy.md` (`develop`) vs `adr_0017` + workflow (`feature branches / push`).
- `docs/ops/milestone2_backend_source_of_truth.md` в части branch policy также конфликтует с `adr_0017`.

6) Quest API prefix drift:
- `docs/ops/phase2_m2_0_foundations.md`: `/v1/quest/*`.
- `docs/ops/staging_services_overview.md` / `docs/ops/service_inventory.md` / `docs/ops/runbooks.md`: `/v1/quests*`.
- Автовыбор: без проверки gateway routes — нет.

## 6. Boundary / Ownership Findings

### `Content` vs `Space/Reactions`

- Ownership в документах частично плавает: social-first policy присутствует, но контентные/legacy контуры сохраняются.
- В коде подтвержден активный `content-service` + отдельные `space-service` и `reactions-service`.
- Степень окончательной миграции discussion ownership: `не подтверждено`.

### `Feed` vs `Space`

- Отдельный `feed-service` существует как app.
- В frontend подтверждены вызовы `/v1/space/feed/*`, а не `/v1/feed/*`.
- Текущее runtime route ownership feed endpoints: `не подтверждено` без полного map gateway->service.

### `Atlas` как geo/source-of-truth vs runtime contours

- В docs Atlas — SSOT.
- В коде отдельный `apps/atlas-service` не подтвержден; часть Atlas-потоков вероятно в consolidated контуре.
- Final ownership between dedicated service and consolidated runtime: `не подтверждено`.

### `Quest` зависимости на `Pulse/Atlas/Points`

- В docs зависимости заявлены явно.
- В коде quest app и frontend интеграция подтверждены; end-to-end доказательство всех зависимостей на runtime-интеграциях (особенно points side effects) `не подтверждено` в этом проходе.

### `Guru` как read-aggregator vs ownership drift

- В docs роль read-only aggregator заявлена.
- В коде отдельный `guru-service` есть; ownership violations (запись в чужие домены) не подтверждены и не опровергнуты этим проходом.

### `Rielt` / `RF` / `Space` cross-module references

- В docs присутствуют notes про cross-module references и deferred coverage.
- В code-level верификация качества reference-resolution (массово) `не подтверждено`.

### `Points/Referral/Token`

- `points-service` и `referral-service` как apps подтверждены, тесты подтверждены.
- `token-service` app есть, но docs-контур фрагментирован и frontend/runtime usage не подтвержден.
- Что входит в current phase как production-ready, особенно по token/on-chain: `не подтверждено` однозначно.

## 7. Readiness Matrix by Evidence

Шкала: `strong` / `medium` / `weak` / `absent` / `unclear`.

| Контур | Docs | Code/runtime | API contract | Persistence/data integrity | Frontend integration | Ops/hardening | Observability/testing |
|---|---|---|---|---|---|---|---|
| `api-gateway` | medium | strong | weak (в `docs/backend` нет отдельного контракта) | absent/unclear | medium (косвенно) | medium | medium (тест есть, полная observability не подтверждена) |
| `auth-service` | medium (`user_service` docs) | strong | medium | unclear | strong | medium | medium |
| `content-service` | strong | strong | strong | medium | medium-strong | medium | medium |
| `media-service` | medium-strong | strong | strong | unclear | weak | medium | medium |
| `points-service` | strong | strong | strong | medium-strong (идемпотентность тест подтвержден) | weak | medium | medium |
| `referral-service` | strong | strong | strong | medium | medium (partial/mock risk) | medium | medium |
| `token-service` | weak | medium (app exists) | weak | unclear | absent | weak/unclear | weak (tests absent) |
| `space-service` | medium-strong (через architecture/modules) | strong | medium (no backend subtree, но modules contracts есть) | unclear | strong | medium | medium |
| `reactions-service` | strong | strong | strong | unclear | weak | medium | medium |
| `feed-service` | weak-medium (архдоки есть, backend/modules ветки нет) | strong | weak | unclear | weak-medium | medium | medium |
| `quest-service` | strong | strong | strong | medium | strong | medium | medium |
| `atlas` домен | strong | medium (отдельный app absent) | strong (docs) | medium | strong | medium | medium/unclear |
| `pulse` домен | strong | medium (отдельный app absent) | strong (docs) | medium/unclear | strong | medium | medium/unclear |
| `rielt-service` | strong | strong | strong | medium | medium-strong | medium | medium |
| `rf-service` | strong | strong | strong | medium | medium-strong | medium | medium |
| `guru-service` | strong | strong | strong | unclear | strong | medium | medium |

Пояснение:

- `strong` ставится только при наличии явных файловых подтверждений.
- Где есть только документные заявления или косвенные признаки, оценка снижена до `medium`/`weak`.
- Для persistence/ops/observability во многих контурах без deep runtime telemetry доказательства ограничены.

## 8. Controlled Debt and Deferred Scope

Подтвержденные долги/deferred, которые нельзя считать `done`:

- Cross-module reference coverage в `space` (часть target types deferred по phase1 notes).
- Geo normalization/backfill и slug/id consistency (в Atlas notes фиксируется controlled debt).
- Wave2 surfaces для ряда доменов (`rielt`, `rf`, `quest`, `guru`) в milestone/closure note контексте.
- Token/on-chain полнота: app есть, но цельная операционная подтвержденность в текущем проходе отсутствует.
- Полноценный единый status anchor по всем документам не подтвержден; есть drift.
- Feed ownership boundary (`/v1/feed` vs `/v1/space/feed`) не зафиксирован как однозначно закрытый.

## 9. Next Admissible Steps

Только ближайшие допустимые шаги из фактов (без roadmap expansion):

- `Docs governance`: зафиксировать единый статусный anchor-файл и обязательное обновление его в PR для closure/freeze артефактов.
- `Gateway/ops`: сверить и унифицировать branch/deploy policy в `docs/ops/*` с `adr_0017` и фактическим workflow.
- `Feed/Space boundary`: подтвердить текущий route ownership на уровне gateway map и отразить его в docs.
- `Atlas/Pulse runtime ownership`: явно записать, какие API обслуживаются отдельными сервисами, а какие consolidated контуром.
- `Content vs Social`: формально закрепить текущую ownership-матрицу обсуждений и отметить legacy/deprecated границы.
- `Token`: явно классифицировать `token-service` (active runtime или scaffold) в статусном артефакте.
- `Testing evidence`: закрыть пробелы по отсутствующим/неподтвержденным тестам (минимум по `token-service`) и зафиксировать это как факт, если intentionally absent.

## 10. Files Read

Ниже ключевые файлы и директории, реально использованные в этом reconciliation pass (напрямую и через multi-agent обход):

### Repo structure / code

- `E:/projects/work_go2asia/20251216go2asia/package.json`
- `E:/projects/work_go2asia/20251216go2asia/pnpm-workspace.yaml`
- `E:/projects/work_go2asia/20251216go2asia/.github/workflows/deploy-workers-staging.yml`
- `E:/projects/work_go2asia/20251216go2asia/apps/*/package.json`
- `E:/projects/work_go2asia/20251216go2asia/apps/*/wrangler.toml`
- `E:/projects/work_go2asia/20251216go2asia/apps/*/src/index.ts`
- `E:/projects/work_go2asia/20251216go2asia/apps/*/test/**/*.test.ts`
- `E:/projects/work_go2asia/20251216go2asia/apps/go2asia-pwa-shell/app/**/*`
- `E:/projects/work_go2asia/20251216go2asia/packages/*/package.json`

### Docs (core sets)

- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/**/*`
- `E:/projects/work_go2asia/20251216go2asia/docs/plans/**/*`
- `E:/projects/work_go2asia/20251216go2asia/docs/backend/**/*`
- `E:/projects/work_go2asia/20251216go2asia/docs/modules/**/*`
- `E:/projects/work_go2asia/20251216go2asia/docs/decisions/**/*`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/**/*`
- `E:/projects/work_go2asia/20251216go2asia/docs/testing/**/*`

### Explicitly referenced conflict/authority files

- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/system_status_2026_march_10.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/execution_cycle_closure_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/frontend_sequencing_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/space/space_phase1_freeze_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/space/space_phase1a_runtime_shell_activation_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/space/space_phase1b_cross_module_reference_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/atlas/atlas_neon_maturity_gate_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/architecture/atlas/atlas_pulse_broader_ui_realignment_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/plans/go2asia_next_steps_plan_2026_march_10.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/plans/go2asia_plan_reconciliation_note_v1.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/plans/mvp_implementation_plan.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/decisions/adr_0014_openapi_ssot_and_bundling.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/decisions/adr_0015_jwt_verification_at_gateway.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/decisions/adr_0016_sql_ddl_and_ddl_applier.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/decisions/adr_0017_staging_deploys_from_feature_branches.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/infrastructure_context.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/staging_services_overview.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/ci_cd.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/deployment_guides/backend_deploy.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/milestone2_backend_source_of_truth.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/runbooks.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/service_inventory.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/ops/phase2_m2_0_foundations.md`
- `E:/projects/work_go2asia/20251216go2asia/docs/testing/guide_engine_v1_test_plan.md`

---

Статус формулировок в этом документе:

- `implemented` — только при фактическом подтверждении кодом/путями.
- `documented` — только если подтверждено в docs.
- `declared operational` — только как цитируемое утверждение docs.
- `actually evidenced` — только при наличии файловых/кодовых подтверждений в текущем проходе.
- `не подтверждено` — когда подтверждение не найдено в границах этого pass.

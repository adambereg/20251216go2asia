Go2Asia Canon-Alignment Backlog v1

1. Purpose

Этот документ фиксирует управляемый backlog выравнивания текущего состояния Go2Asia относительно Platform Canon v2:

- `docs/architecture/platform/go2asia_ecosystem_overview_v2.md`
- `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`

Цель документа - не implementation и не массовый refactor. Цель - зафиксировать, где runtime, UI copy, service inventory, legacy docs и future-слои требуют выравнивания, чтобы будущие задачи не возвращали старые концепции: Connect Service как backend-владелец экономики, Quest Missions, classic chat, дублирующую geo truth или обход Points / reward-intent границ.

P0 docs-only pass status (2026-04-28):

- CA-001: completed for the initial high-risk legacy notice set. Target docs were marked as legacy / superseded, without rewriting their content.
- CA-002: completed for `docs/ops/service_inventory.md`. The inventory now reflects actual `apps/*` runtime and Platform Canon v2 service categories.
- CA-010: completed as a standalone baseline document: `docs/architecture/platform/pre_missions_reward_baseline_v1.md`.

P1 decision lock status (2026-04-28):

- Completed for CA-006, CA-008, CA-009 and CA-014 in `docs/architecture/platform/go2asia_p1_decisions_v1.md`.
- Remaining P1 implementation details stay future work; no code/API/UI/DB changes are implied by this lock.
- RF-001 contract lock documented: `docs/architecture/rf/rf_runtime_contract_lock_v1.md` (docs-only boundary lock between current runtime and target/future RF scope).
- RF-002 in progress: voucher lifecycle contract baseline hardening (`docs/architecture/rf/rf_voucher_lifecycle_contract_v1.md`).
- RF-003 in progress: partner-offer-voucher relation hardening + terminology alignment (`docs/architecture/rf/rf_runtime_contract_lock_v1.md`, `docs/architecture/rf/rf_voucher_lifecycle_contract_v1.md`).
- RF-004 in progress: Rielt voucher-first contract support (`docs/architecture/rf/rf_rielt_voucher_first_contract_v1.md`).
- RF-005 in progress: PRO trust-chain visibility baseline (`docs/architecture/rf/rf_pro_trust_visibility_v1.md`).
- RF-IMPL-001 completed: claim/redeem execution hardening in `rf-service` (`apps/rf-service/src/store.ts`, `apps/rf-service/test/request.test.ts`, `docs/openapi/rf.yaml`).
- Connect-001 completed: runtime contract lock (`docs/architecture/connect/connect_runtime_contract_lock_v1.md`).

2. Canon Baseline

Текущий Platform Canon v2 задает следующие правила:

- Connect Asia - продуктовый и UI-хаб экономики, прогресса и наград, но не backend-domain service.
- Points Service владеет Points balance, transactions, ledger и reward execution в текущем off-chain runtime.
- Missions - future ecosystem orchestration layer для целей, прогресса и reward intents. Missions не являются частью Quest и не владеют ledger.
- Quest Asia владеет квестами, маршрутами, Tasks/Steps/заданиями, proof, validation, progress и completion. Внутри Quest использовать Task / Step / Задание / Шаг, не Mission / Миссия.
- RF Asia - business/partner layer. RF владеет partners, business lines, branches, offers, vouchers, RF status и PRO links.
- Rielt Market - housing/listing domain. Rielt может ссылаться на RF, но не владеет RF-логикой, voucher lifecycle, payments, booking или chat.
- Space - social layer для posts, groups, reposts, reactions, reviews и object-bound interactions. Space не должен становиться classic messenger и не владеет business/economy domains.
- Geo Layer - platform capability для geo contracts, nearby, viewport и map layers. Atlas/content остается primary truth для countries, cities, districts и places; domain-specific coordinates должны быть явно ограничены.
- Tokenomics, G2A, on-chain NFT, Blockchain Gateway, зрелый Missions Service, зрелый Geo Service и полноценный Badges/NFT Service остаются future layers, пока явно не классифицированы как runtime.
- UI может агрегировать и вести пользователя, но backend владеет truth. UI не должен считать final Points, валидировать proof как source of truth, менять voucher status, создавать canonical geography или решать reward eligibility.

3. Current Runtime Baseline

Текущее дерево `apps/*` содержит следующие приложения и категории:

| App | Category | Canon-alignment note |
| --- | --- | --- |
| `apps/api-gateway` | BFF/composition/read-model | Edge routing и proxy layer. Не владеет domain logic. |
| `apps/auth-service` | domain service | Identity, webhooks, user materialization. Может быть producer reward-событий в pre-Missions baseline. |
| `apps/content-service` | domain service | Runtime-контур Atlas / Pulse / Blog данных. Заменяет старое ожидание отдельных `atlas_service` и `pulse_service` runtime apps. |
| `apps/media-service` | support/service utility | Media pipeline/storage/signing. Не владеет продуктовым доменом. |
| `apps/points-service` | domain service | Владелец Points ledger/balances/transactions/reward execution. Также содержит `connect-dashboard` read-model endpoint. |
| `apps/referral-service` | domain service | Referral graph/relations и referral reward integration. |
| `apps/token-service` | future/skeleton | Baseline/future tokenomics contour, не зрелый G2A engine и не Connect Service. |
| `apps/space-service` | domain service | Space UGC/social domain. |
| `apps/feed-service` | BFF/composition/read-model | Feed projection поверх Space/Reactions. |
| `apps/reactions-service` | domain service | Reactions и structured interactions. |
| `apps/quest-service` | domain service | Quest routes/tasks/proof/progress/completion и reward handoff. |
| `apps/rf-service` | domain service | RF partners/offers/vouchers/branches/business lines contour. |
| `apps/rielt-service` | domain service | Housing/listing/inquiry domain со ссылками на RF. |
| `apps/guru-service` | BFF/composition/read-model | Nearby composition поверх доменных сервисов. Не владеет geo/domain truth. |
| `apps/organizer-service` | legacy/unclear until classified | Trips/organizer contour существует, но его platform role пока не отражена в Canon v2. |
| `apps/go2asia-pwa-shell` | frontend application | Next.js PWA shell, не backend service. |

Special baseline: `GET /v1/points/connect-dashboard` внутри `apps/points-service/src/index.ts` допустим только как Connect UI read-model / composition endpoint. Он не должен становиться скрытым Connect backend-domain owner.

4. Backlog Items

CA-001: Deprecate legacy Connect Service docs

- Area: Docs / SSOT drift.
- Canon rule: Connect UI не равен Connect Service; Connect не владеет economy backend, ledger, rewards, Missions, NFT или tokenomics.
- Current drift: Часть legacy docs все еще описывает Connect Service / `connect_service` как backend-service и economy orchestrator.
- Evidence / paths:
  - `docs/backend/connect_service/*`
  - `docs/architecture/connect/connect_service_production_architecture_v1.md`
  - `docs/backend/points_service/overview.md`
  - `docs/backend/points_service/integration.md`
  - `docs/backend/points_service/workflows.md`
  - `docs/overview/go2asia_architecture.md`
  - `docs/overview/go2asia_modules_map.md`
  - `docs/knowledge/backend_microservice.md`
  - `docs/playbooks/FRONTEND_PLAYBOOK.md`
- Risk: Future work может заново создать `connect-service` как скрытый economy monolith и обойти ownership Points / Referral / Missions / Badges.
- Priority: P0.
- Work type: docs-only.
- Explicit non-goals: Не удалять старые docs. Не делать global replace. Не создавать Connect Service.
- Recommended next action: Добавить legacy/superseded notice в самые рискованные Connect Service docs и направить читателя к Platform Canon v2 и этому backlog.

CA-002: Align service inventory with Platform Canon v2

- Area: Service inventory alignment.
- Canon rule: Runtime truth нужно явно отделять от future target architecture.
- Current drift: Некоторые docs описывают старую topology, включая `atlas_service`, `pulse_service`, `voucher_service`, `nft_service`, `connect_service` как runtime services. Часть inventory docs устарела относительно текущего `apps/*`.
- Evidence / paths:
  - `docs/ops/service_inventory.md`
  - `docs/overview/go2asia_modules_map.md`
  - `docs/backend/atlas_service/*`
  - `docs/backend/pulse_service/*`
  - `docs/backend/voucher_service/*`
  - `docs/backend/nft_service/*`
  - `apps/*/package.json`
- Risk: Engineers и agents могут ставить задачи против несуществующих сервисов или воспринимать future services как runtime truth.
- Priority: P0.
- Work type: docs-only.
- Explicit non-goals: Не удалять legacy folders. Не менять service code. Не менять OpenAPI contracts.
- Recommended next action: Создать или обновить canonical service inventory с классификацией actual `apps/*`: domain service, support utility, composition/read-model, future/skeleton, legacy/unclear.

CA-003: Classify guru-service as composition/BFF, not domain owner

- Area: Service inventory / Geo / hidden owner risk.
- Canon rule: Guru - user-facing nearby interface; Geo Layer и domain services дают данные. Guru не владеет places, events, listings, partners, quests, profiles или reviews.
- Current drift: `apps/guru-service` существует и агрегирует nearby data, но его имя может смешиваться с Guru product module или будущим Geo Service.
- Evidence / paths:
  - `apps/guru-service/src/index.ts`
  - `apps/guru-service/src/routes/nearby.ts`
  - `apps/guru-service/src/normalize/entityCard.ts`
  - `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- Risk: Nearby composition может незаметно стать владельцем geo/domain truth.
- Priority: P1.
- Work type: architecture decision.
- Explicit non-goals: Не переименовывать сервис. Не реализовывать Geo Service. Не переносить data ownership.
- Recommended next action: Зафиксировать `guru-service` как composition/BFF/read-model с явными source-of-truth boundaries для Atlas/content, RF, Rielt, Quest, Space и future Geo Layer.

CA-004: Classify organizer-service role

- Area: Service inventory alignment.
- Canon rule: Runtime services должны иметь понятный ownership и platform role.
- Current drift: `apps/organizer-service` существует как trips/organizer contour, но Platform Canon v2 не классифицирует его явно как product module, support service или transitional domain.
- Evidence / paths:
  - `apps/organizer-service/package.json`
  - `apps/organizer-service/src/index.ts`
  - `apps/organizer-service/src/routes/trips.ts`
- Risk: Неясная роль может пересекаться с Pulse, Quest, PRO Console, Guru или future Missions.
- Priority: P2.
- Work type: architecture decision.
- Explicit non-goals: Не refactor trips. Не удалять сервис. Не merge в другой домен.
- Recommended next action: Решить, является ли organizer-service bounded domain, support workflow, experimental service или legacy/transitional contour.

CA-005: Define token-service runtime/future boundary

- Area: Economy / future layers.
- Canon rule: Token Service / G2A / on-chain NFT - future/advanced layers и не должны смешиваться с current off-chain Points/Badges runtime.
- Current drift: `apps/token-service` существует как skeleton/baseline, а старые docs могут выглядеть как mature tokenomics/NFT/Blockchain Gateway runtime.
- Evidence / paths:
  - `apps/token-service/package.json`
  - `apps/token-service/src/index.ts`
  - `docs/backend/nft_service/*`
  - `docs/backend/blockchain_gateway_service/*`
  - `docs/overview/go2asia_modules_map.md`
- Risk: Future tokenomics может быть воспринята как production-ready или смешана с Points ledger и Connect UI.
- Priority: P1.
- Work type: docs-only.
- Explicit non-goals: Не реализовывать tokenomics. Не добавлять wallet/on-chain flows. Не менять Points.
- Recommended next action: Пометить `token-service` как future/skeleton в service inventory и явно отделить Points/Badges runtime от future G2A/NFT/Gateway.

CA-006: Rielt voucher-first vs hybrid inquiry decision

- Area: Rielt CTA alignment.
- Canon rule: Rielt v1 должен быть voucher-first и не должен становиться booking/chat/inquiry-first.
- Current drift: Rielt detail UI содержит voucher-first presentation fields, но рабочий flow все еще сильно поддерживает direct listing inquiry.
- Decision locked: strict voucher-first. Rielt is listing discovery; RF owns partner identity; voucher layer is the canonical claim/redeem baseline.
- Evidence / paths:
  - `apps/go2asia-pwa-shell/components/rielt/ListingDetail/CTAPanel.tsx`
  - `apps/go2asia-pwa-shell/components/rielt/types.ts`
  - `apps/rielt-service/src/index.ts`
  - `apps/rielt-service/src/routes`
- Risk: Product UX и backend ownership могут съехать к classic inquiry marketplace и ослабить RF/voucher-first архитектуру.
- Priority: P1.
- Work type: architecture decision.
- Explicit non-goals: Не менять UI в этом backlog. Не удалять inquiry. Не реализовывать voucher flow.
- Recommended next action: Принять product/architecture decision: strict voucher-first или explicitly hybrid MVP с bounded inquiry как secondary/fallback.

CA-007: Quest terminology controlled pass

- Area: Quest terminology / UI copy / SEO.
- Canon rule: Внутри Quest использовать Quest / Task / Step / Задание / Шаг. Mission / Миссия зарезервировать для future ecosystem Missions.
- Current drift: Часть public Quest copy/SEO и landing text все еще использует “missions”, “photo-missions” или похожие формулировки вокруг Quest.
- Evidence / paths:
  - `apps/go2asia-pwa-shell/app/(public)/quest/page.tsx`
  - `apps/go2asia-pwa-shell/app/(public)/quest/QuestHomeClient.tsx`
  - `apps/go2asia-pwa-shell/app/HomePageClient.tsx`
  - `apps/go2asia-pwa-shell/components/landing/HomePageContent.tsx`
  - `components/connect` / `app/(authenticated)/connect/missions` как легитимный context для ecosystem Missions UI.
- Risk: Users, SEO, docs и engineers могут смешивать Quest Tasks с future ecosystem Missions.
- Priority: P1.
- Work type: controlled copy pass.
- Explicit non-goals: Не делать global replace слова “mission”. Не менять Connect Missions naming. Не менять DB или API fields.
- Recommended next action: Провести scoped terminology pass только для Quest-facing copy и зафиксировать glossary note: Connect/Missions сохраняет “Mission”.

CA-008: Geo SSOT and city resolver alignment

- Area: Geo SSOT alignment.
- Canon rule: Atlas/content-service - primary geo truth для countries, cities, districts и places. Domain-specific geo должен быть bounded и не становиться competing canonical geography.
- Current drift: Geo распределено между Atlas/content, Rielt listing coordinates, Pulse event coordinates, Quest `geoScope` и duplicated UI fallback city centers.
- Decision locked: Atlas-backed Geo Resolver is the target policy; UI fallback city centers are temporary UX fallback, not canonical geo truth.
- Evidence / paths:
  - `packages/db/src/schema/content.ts`
  - `packages/db/src/schema/rielt.ts`
  - `packages/db/src/importPulseEventsFromMarkdown.ts`
  - `apps/go2asia-pwa-shell/components/rielt/utils/geo.ts`
  - `apps/go2asia-pwa-shell/app/(public)/quest/questMapPresentation.ts`
  - `content/atlas/*`
  - `content/pulse/*`
- Risk: Coordinates, city centers, place references и event/listing map positions могут расходиться между модулями.
- Priority: P1.
- Work type: architecture decision.
- Explicit non-goals: Не мигрировать DB columns. Не менять map UI. Не реализовывать Geo Service.
- Recommended next action: Определить city center resolver policy и классифицировать UI fallback city centers как temporary UX fallback, не geo truth.

CA-009: Quest geo proof backend truth decision

- Area: Geo / Quest proof validation.
- Canon rule: UI может помогать proof flow, но backend владеет validation truth.
- Current drift: Quest UI делает geo check-in calculations и захватывает geolocation/manual coordinates. Server-side proof truth boundary требует явного решения.
- Decision locked: permanent hybrid validation model. Client assists; backend decides production completion through validation or backend-controlled review policy.
- Evidence / paths:
  - `apps/go2asia-pwa-shell/components/quest/utils/validation.ts`
  - `apps/go2asia-pwa-shell/components/quest/QuestRunner/Steps/StepGeoCheckin.tsx`
  - `apps/go2asia-pwa-shell/app/(public)/quest/[id]/run/QuestRunnerClient.tsx`
  - `apps/quest-service/src/services/questService.ts`
  - `packages/db/src/schema/quest.ts`
- Risk: Client-side geo checks могут быть приняты как final proof, что создает spoofing и trust risks.
- Priority: P1.
- Work type: architecture decision.
- Explicit non-goals: Не реализовывать server validation сейчас. Не удалять client UX checks. Не менять proof schema.
- Recommended next action: Решить и задокументировать, должна ли Quest geo proof server-валидироваться для production completion и что именно означает client validation.

CA-010: Pre-Missions reward baseline

- Area: Economy / reward baseline before Missions.
- Canon rule: Points Service владеет ledger и reward execution. Future Missions Service владеет mission catalog, conditions, progress и reward intents, но не ledger.
- Current drift: До появления Missions Service несколько сервисов напрямую вызывают `POST /internal/points/add`.
- Evidence / paths:
  - `apps/points-service/src/index.ts`
  - `apps/auth-service/src/index.ts`
  - `apps/content-service/src/index.ts`
  - `apps/quest-service/src/services/questService.ts`
  - `apps/referral-service/src/index.ts`
- Risk: Transitional direct calls могут стать permanent reward orchestration и позже обойти reward-intent модель.
- Priority: P0.
- Work type: docs-only.
- Explicit non-goals: Не реализовывать Missions Service. Не менять internal Points API. Не удалять direct calls.
- Recommended next action: Задокументировать “pre-Missions reward baseline”: allowed producers, idempotency/externalId, service JWT, action taxonomy и future migration path к reward intents.

CA-011: Connect dashboard read-model guardrails

- Area: Connect / hidden owner risk.
- Canon rule: Connect может иметь BFF/read-model, но не должен владеть economy или принимать economic decisions.
- Current drift: `connect-dashboard` endpoint существует внутри Points Service как UI aggregation для Connect.
- Evidence / paths:
  - `apps/points-service/src/index.ts`
  - `packages/sdk/src/connectDashboard.ts`
  - `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardView.tsx`
  - `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
- Risk: Dashboard aggregation может постепенно накопить Connect-owned rules для balances, badges, referrals, vouchers, Missions или tokenomics.
- Priority: P1.
- Work type: docs-only.
- Explicit non-goals: Не переносить endpoint. Не создавать connect-bff. Не менять Connect UI.
- Recommended next action: Добавить guardrails: read-only aggregation, no ledger writes, no reward decisions, no referral graph ownership, no voucher lifecycle ownership, no Mission progress ownership.

CA-012: RF local/demo voucher state guardrails

- Area: RF frontend / UI truth boundaries.
- Canon rule: RF/Voucher layer владеет voucher lifecycle; UI local/mock state не должен становиться source of truth.
- Current drift: RF UI содержит localStorage planning vouchers и demo/ops mock areas рядом с live RF API flows.
- Evidence / paths:
  - `apps/go2asia-pwa-shell/app/(public)/rf/my-vouchers/page.tsx`
  - `apps/go2asia-pwa-shell/lib/rfFirstSliceContent.ts`
  - `apps/go2asia-pwa-shell/components/rf/Vouchers/RfMyVouchersView.tsx`
  - `apps/go2asia-pwa-shell/hooks/useRfLocalContour.ts`
  - `apps/go2asia-pwa-shell/components/rf/Merchant/MerchantLayout.tsx`
  - `apps/go2asia-pwa-shell/components/rf/live/RfBusinessCreatePanel.tsx`
- Risk: Users, QA или future developers могут спутать local planning/demo voucher state с server claim/redeem truth.
- Priority: P2.
- Work type: controlled copy pass.
- Explicit non-goals: Не удалять local storage features. Не реализовывать server voucher lifecycle. Не менять RF APIs.
- Recommended next action: Сохранить и усилить labels, которые различают local planning, demo UI и live RF API voucher state.

CA-013: Seed/demo economy scripts are not production reward path

- Area: Economy / seed data / operational guardrails.
- Canon rule: Production reward path идет через Points Service; seed/demo scripts не являются source of production economy truth.
- Current drift: Demo scripts/data напрямую вставляют Points/badges/transactions для Connect demo state.
- Evidence / paths:
  - `packages/db/src/connectDemoData.ts`
  - `packages/db/src/seedConnectDemo.ts`
  - `packages/db/src/verifyConnectDemo.ts`
- Risk: Direct DB writes для demo могут быть восприняты как valid production reward path или скопированы в runtime flows.
- Priority: P2.
- Work type: docs-only.
- Explicit non-goals: Не удалять seed scripts. Не менять demo data. Не менять Points schema.
- Recommended next action: Добавить operational note: demo/seed data может обходить service invariants только в controlled demo setup и не является implementation pattern.

CA-014: Badges/NFT future ownership boundary

- Area: Badges / NFT / future economy.
- Canon rule: Current economy - off-chain first. Badges могут существовать как off-chain achievements; NFT/on-chain - future и не владеют Points ledger или Mission progress.
- Current drift: Current runtime показывает badges через Points Service, а legacy docs описывают `nft_service` и Blockchain Gateway как active reward infrastructure.
- Decision locked: badges stay off-chain achievement/reputation markers in current runtime; NFT/Token/TON/on-chain layer remains post-release future.
- Evidence / paths:
  - `apps/points-service/src/index.ts`
  - `packages/sdk/src/badges.ts`
  - `docs/modules/connect/connect_frontend_reality_audit_v1.md`
  - `docs/backend/nft_service/*`
  - `docs/backend/blockchain_gateway_service/*`
  - `docs/overview/go2asia_modules_map.md`
- Risk: Badges, NFT, Points, Missions и Tokenomics могут смешаться до готовности future layers.
- Priority: P1.
- Work type: docs-only.
- Explicit non-goals: Не создавать Badges Service. Не реализовывать NFT. Не менять Points badges endpoints.
- Recommended next action: Зафиксировать current runtime как off-chain badges через Points-related APIs и пометить NFT/Blockchain Gateway как future/superseded-by-canon до отдельного решения.

5. Priority Matrix

| Priority | Meaning | Items |
| --- | --- | --- |
| P0 | Blocks correct future work | CA-001, CA-002, CA-010 |
| P1 | High drift risk | CA-003, CA-005, CA-006, CA-007, CA-008, CA-009, CA-011, CA-014 |
| P2 | Medium cleanup / decision | CA-004, CA-012, CA-013 |
| P3 | Later polish | None in v1 |

6. Recommended Sequencing

1. Docs/service inventory: CA-001, CA-002, CA-003, CA-004, CA-005.
2. Terminology and UI copy decisions: CA-007, CA-012.
3. Rielt CTA decision: CA-006.
4. Economy baseline: CA-010, CA-011, CA-013.
5. Geo SSOT: CA-008, CA-009.
6. Future layers: CA-014, then later Missions, Badges/NFT, Token, Geo Service decisions when product/runtime is ready.

7. Non-Goals

- No code refactor.
- No OpenAPI changes.
- No UI rewrites.
- No DB migrations.
- No service creation.
- No global replacements.
- No implementation.
- No deletion of legacy documents.
- No immediate conversion of future target services into runtime services.
- No architectural redesign beyond backlog classification and decision tracking.

8. Resolved Decisions (P1 Decision Lock)

- CA-006 — Rielt voucher-first: locked as strict voucher-first. Rielt is listing discovery; RF owns partner identity; voucher layer is the canonical claim/redeem baseline.
- CA-008 — Geo resolver policy: locked as Atlas-backed Geo Resolver target. UI fallback city centers remain temporary UX fallback, not canonical geo truth.
- CA-009 — Quest geo proof: locked as permanent hybrid validation model. Client assists; backend decides production completion through validation or backend-controlled review policy.
- CA-014 — Badges vs NFT: locked as off-chain badges for current runtime. NFT/Token/TON/on-chain layer remains post-release future.

9. Product / Architecture Questions Requiring Owner Decision

- Какова формальная роль `organizer-service`: bounded domain, support workflow, experiment или legacy/transitional contour?
- Какой pre-Missions reward baseline принять: какие сервисы могут вызывать Points напрямую, какие actions допустимы и какие metadata/idempotency обязательны?

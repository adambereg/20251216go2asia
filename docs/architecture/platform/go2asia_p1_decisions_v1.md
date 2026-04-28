Go2Asia P1 Decisions v1

1. Purpose

Этот документ фиксирует P1 decision / docs pass по canon-alignment backlog без implementation.

Источник контекста:

- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md`
- `docs/ops/service_inventory.md`
- `docs/architecture/platform/pre_missions_reward_baseline_v1.md`

Ограничение документа: если фактических деталей недостаточно в уже прочитанном контексте, это фиксируется как uncertainty. Документ не является заданием на код, API, DB schema, UI rewrite или service creation.

2. Decisions

CA-003: Classify guru-service as composition/BFF, not domain owner

- Current state:
  - `apps/guru-service` существует в runtime.
  - В service inventory он классифицирован как BFF/composition/read-model.
  - Его роль описана как nearby composition поверх доменных сервисов.
- Canon requirement:
  - Guru - user-facing nearby interface.
  - Geo Layer и domain services дают данные.
  - Guru не владеет places, events, listings, partners, quests, profiles или reviews.
- Observed drift:
  - Сам факт отдельного `guru-service` может быть ошибочно прочитан как domain service или future Geo Service.
  - Риск: nearby aggregation может незаметно превратиться в geo/domain truth owner.
- Decision options:
  - Option A: оставить `guru-service` строго как BFF/composition/read-model.
  - Option B: повысить `guru-service` до Geo Service owner.
  - Option C: слить nearby aggregation в frontend/UI.
- Recommended direction:
  - Option A. Зафиксировать `guru-service` как composition layer, не domain owner.
- Guardrails:
  - No persistence as source of truth.
  - No geo truth ownership.
  - No domain decisions.
  - No ownership of places, events, listings, partners, quests, profiles or reviews.
  - Source-of-truth boundaries remain with Atlas/content, RF, Rielt, Quest, Space and future Geo Layer.
- Non-goals:
  - No service rename.
  - No Geo Service implementation.
  - No data ownership migration.
  - No code changes.

CA-005: Define token-service runtime/future boundary

- Current state:
  - `apps/token-service` exists as future/skeleton.
  - Service inventory says it is health-only baseline for future tokenomics.
  - Points runtime exists separately in `apps/points-service`.
- Canon requirement:
  - Points = current off-chain runtime.
  - Token / NFT / G2A / Blockchain Gateway = future layer unless explicitly promoted by canon.
  - Token Service is not Connect Service and is not Points Service.
- Observed drift:
  - Older docs may imply mature tokenomics/NFT/Blockchain Gateway runtime.
  - Risk: future tokenomics may be treated as production-ready.
- Decision options:
  - Option A: keep token-service as future/skeleton only.
  - Option B: promote token-service into current economy runtime.
  - Option C: remove token-service from inventory until future work.
- Recommended direction:
  - Option A. Keep it visible but explicitly bounded as future/skeleton.
- Guardrails:
  - Points Service remains current ledger/reward execution owner.
  - Token Service does not participate in current reward execution.
  - Token Service does not own Points ledger, badges, Missions progress or Connect UI.
  - NFT / G2A / on-chain operations remain future.
- Non-goals:
  - No tokenomics implementation.
  - No wallet/on-chain flows.
  - No Points API changes.
  - No service deletion.

CA-006: Rielt voucher-first vs hybrid inquiry decision

- Current state:
  - Rielt is classified as housing/listing domain.
  - Backlog records drift: Rielt detail UI has voucher-first presentation fields, but direct listing inquiry remains a strong working flow.
- Canon requirement:
  - Rielt v1 should be voucher-first.
  - Rielt must not become booking/chat/inquiry-first.
  - Rielt may reference RF partner/offer/voucher data, but RF/Voucher ownership remains outside Rielt.
- Observed drift:
  - Current UX direction can be read as hybrid or inquiry-forward.
  - Risk: Rielt drifts toward classic marketplace, chat, booking or direct lead model.
- Decision options:
  - Option A: strict voucher-first. Primary CTA is voucher/offer activation; inquiry is removed or deeply secondary.
  - Option B: hybrid MVP. Voucher remains primary architecture element, but bounded inquiry is allowed as secondary/fallback.
  - Option C: inquiry-first fallback. Inquiry becomes primary and voucher is secondary. This is undesirable under current canon.
- Final decision:
  - Option A: strict voucher-first.
  - Rielt Market is not Airbnb, Avito, or an independent direct-deal marketplace.
  - Rielt Market is a discovery layer / accommodation listing surface, a supply surface for RF-linked objects, and an entry point into voucher-driven consumption.
  - Canon formula:
    - Rielt = listing discovery.
    - RF = partner identity / business layer.
    - Voucher layer = canonical inquiry / claim / redeem baseline.
    - Notifications = signal fan-out after claim/purchase.
    - PRO = curator / mediator / escalation layer.
    - Space reposts = optional social echo, not transactional foundation.
- Guardrails:
  - Rielt does not become chat system.
  - Rielt does not become booking engine.
  - Rielt does not own voucher lifecycle.
  - Rielt does not own partner identity.
  - Rielt does not own payment for the base service.
  - Primary CTA must point to claim voucher, purchase voucher, activate offer, get VIP bonus, or open partner offer.
  - Direct inquiry is not baseline and must not be primary CTA.
  - Post-claim coordination is allowed only as coordination, not as a direct inquiry marketplace.
- Non-goals:
  - No UI rewrite.
  - No inquiry removal in this pass.
  - No voucher flow implementation.
  - No API changes.

CA-007: Quest terminology controlled pass

- Current state:
  - Backlog records terminology drift in Quest-facing copy/SEO and landing text.
  - Connect/Missions context is legitimate for ecosystem Missions.
- Canon requirement:
  - Inside Quest use Quest / Task / Step / Задание / Шаг.
  - Mission / Миссия is reserved for Connect / future ecosystem Missions.
- Observed drift:
  - Some public Quest copy may use “missions”, “photo-missions” or similar wording.
  - Risk: Quest Tasks become confused with ecosystem Missions.
- Decision options:
  - Option A: strict terminology pass for all Quest-facing copy.
  - Option B: allow marketing use of “mission” around Quest.
  - Option C: defer terminology cleanup until Missions Service exists.
- Recommended direction:
  - Option A. Use a controlled pass, not global replace.
- Guardrails:
  - Quest context: Task / Step / Задание / Шаг.
  - Connect/future Missions context: Mission / Миссия.
  - No global replace.
  - Keep Connect Missions naming intact.
  - Add glossary note before any copy cleanup.
- Non-goals:
  - No DB/API field changes.
  - No UI rewrite.
  - No Missions Service creation.
  - No automated broad replacement.

CA-008: Geo SSOT and city resolver alignment

- Current state:
  - Service inventory and backlog identify `apps/content-service` as runtime owner for Atlas / Pulse / Blog content.
  - Backlog records distributed geo: Atlas/content, Rielt coordinates, Pulse event coordinates, Quest `geoScope`, UI fallback city centers.
- Canon requirement:
  - Atlas/content = primary geo truth for countries, cities, districts and places.
  - Domain-specific coordinates are allowed only as bounded domain data.
  - UI fallback centers are temporary UX fallback, not geo truth.
- Observed drift:
  - Multiple geo representations can drift apart.
  - City centers and `geoScope` can be mistaken for canonical geo data.
- Decision options:
  - Option A: define a shared city resolver concept backed by Atlas/content.
  - Option B: keep per-module fallback coordinates with clear temporary labels.
  - Option C: create mature Geo Service immediately.
- Final decision:
  - Atlas-backed Geo Resolver is the target policy.
  - Temporary fallbacks are allowed only as UX fallback until resolver v1 exists.
  - Geo resolver v1 target concept:
    - `cityId -> center lat/lng`
    - `cityId -> bbox`
    - `placeId -> coordinates`
    - optional `districtId -> center/bbox`
    - return `source: atlas / fallback / unavailable`
    - return `precision: exact / district / city / country / unknown`
- Guardrails:
  - No duplicate geo truth.
  - Atlas/content remains primary geo truth.
  - Rielt coordinates are listing-specific.
  - Pulse coordinates are event-specific.
  - Quest `geoScope` is route/map/proof context, not absolute geo owner.
  - UI fallback centers are temporary UX fallback.
  - No per-module canonical city center ownership.
  - Modules may consume resolver output but must not become geo truth owners.
- Non-goals:
  - No DB migration.
  - No map UI rewrite.
  - No Geo Service implementation.
  - No coordinate refactor in this pass.

CA-009: Quest geo proof backend truth decision

- Current state:
  - Backlog records client-side geo check-in calculations and captured geolocation/manual coordinates.
  - Server-side proof truth boundary is not yet fully clarified in the docs used for this pass.
- Canon requirement:
  - UI may assist proof flow.
  - Backend owns validation truth.
  - Quest owns proof/progress/completion, but not Missions or Points ledger.
- Observed drift:
  - Client-side geo checks may be interpreted as final proof.
  - Risk: spoofing and trust issues if client-only validation becomes production truth.
- Decision options:
  - Option A: server-side validation as target.
  - Option B: hybrid model: client UX check plus server validation.
  - Option C: client-only validation. This is high risk.
- Final decision:
  - Option B: permanent hybrid validation model, client + backend.
  - This is not a temporary compromise. It is the canonical two-contour model.
  - Canon rule: Client assists. Backend decides.
  - Client role:
    - collect GPS / geolocation;
    - show UX check for nearby / not nearby;
    - pass accuracy, timestamp, photo, QR/code, manual note where applicable;
    - help the user complete proof flow.
  - Backend role:
    - act as final arbiter;
    - check target, distance, accuracy, timestamp, task status and repeat attempts;
    - decide accepted / rejected / needs review;
    - determine production completion;
    - use review policy, PRO/partner confirmation, QR/code or photo proof where appropriate.
- Guardrails:
  - Client-side validation is UX-only.
  - Client cannot complete Quest by itself.
  - Production completion requires backend validation or backend-controlled review policy.
  - Manual coordinates require explicit trust/review rules.
  - Quest geo proof must not create Missions ownership or Points ledger ownership.
- Non-goals:
  - No server validation implementation now.
  - No proof schema changes.
  - No removal of client UX checks.
  - No anti-fraud implementation in this pass.

CA-011: Connect dashboard read-model guardrails

- Current state:
  - `GET /v1/points/connect-dashboard` exists inside `apps/points-service`.
  - Service inventory classifies it as read-model / UI aggregation.
  - Pre-Missions baseline says Connect dashboard must be read-only and must not write ledger or decide rewards.
- Canon requirement:
  - Connect is UI/product hub, not backend-domain service.
  - A dashboard/read-model may exist only as composition.
- Observed drift:
  - Dashboard aggregation can accumulate business rules over time and become hidden Connect Service.
- Decision options:
  - Option A: keep dashboard inside Points Service as read-only aggregation.
  - Option B: create a separate Connect BFF.
  - Option C: expand dashboard into Connect backend owner.
- Recommended direction:
  - Option A. Do not create new service in this pass.
- Guardrails:
  - No ledger writes.
  - No reward decisions.
  - No referral ownership.
  - No voucher lifecycle ownership.
  - No Mission logic.
  - No tokenomics ownership.
  - No source-of-truth status for composed data.
- Non-goals:
  - No endpoint move.
  - No connect-bff creation.
  - No Connect UI changes.
  - No Points API changes.

CA-014: Badges / NFT future ownership boundary

- Current state:
  - Current runtime exposes badges through Points-related APIs.
  - Service inventory says current badges are off-chain; `nft_service` and Blockchain Gateway are future-layer references.
- Canon requirement:
  - Current economy is off-chain first.
  - Badges may exist as off-chain achievements.
  - NFT/on-chain is future unless explicitly promoted.
- Observed drift:
  - Legacy docs may describe NFT / Blockchain Gateway as active reward infrastructure.
  - Risk: achievements, assets, Points, Missions and Tokenomics become mixed.
- Decision options:
  - Option A: keep badges as off-chain achievements in current runtime.
  - Option B: split Badges into separate service now.
  - Option C: promote NFT/on-chain into current reward runtime.
- Final decision:
  - Option A: keep badges as off-chain achievements in current runtime.
  - NFT / Token / TON / on-chain layer is postponed until the post-release future, after Go2Asia works as a product.
  - Badges are conceptually a separate achievement / reputation domain, not a Points subdomain.
  - Points:
    - quantitative soft currency;
    - mass/repeatable reward for routine activity;
    - likes, posts, reactions, registrations, repeated actions and base activity.
  - Badges:
    - qualitative reward;
    - achievement sign;
    - status marker;
    - reputation / trust signal;
    - recognition for milestones, task completion, ecosystem contribution, correct behavior and accumulated achievements.
  - Current MVP placement through Points-related APIs is acceptable as technical placement only. It is not final domain ownership.
  - Future export / mint / totemization of selected badges is possible only after explicit canon promotion.
- Guardrails:
  - Achievement = off-chain badge/status marker.
  - Asset = future NFT/on-chain object.
  - Points ledger does not own the meaning of badges.
  - Badges are not spendable currency.
  - NFT does not own achievements before a separate decision.
  - Blockchain Gateway does not decide rewards.
  - Token/G2A/NFT remains future until explicit canon promotion.
- Non-goals:
  - No Badges Service creation.
  - No NFT implementation.
  - No blockchain integration.
  - No Points badges endpoint changes.

3. Cross-Cutting Non-Goals

- No code changes.
- No API / OpenAPI changes.
- No DB schema changes.
- No UI rewrite.
- No refactor.
- No global replace.
- No new services.
- No business logic changes.
- No reward-intent implementation.
- No Geo Service implementation.

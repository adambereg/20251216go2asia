# RF Asia Business Contour Stabilization v1

## 1. Purpose

Документ фиксирует read-only аудит readiness RF Asia как business contour (шире voucher layer) и определяет первый безопасный bounded slice перед runtime-изменениями.

RF-001 contract lock created: `docs/architecture/rf/rf_runtime_contract_lock_v1.md`

## 2. Canon Context

- RF = partner/business layer.
- Rielt = strict voucher-first discovery layer.
- Voucher claim/redeem = canonical inquiry baseline.
- Points Service = ledger/reward execution owner.
- Connect != backend-service.
- NFT/tokenomics/on-chain = future layer.

## 3. Current RF Runtime Inventory

| Area | Current state | Evidence paths | Readiness | Notes |
| --- | --- | --- | --- | --- |
| partners | Реализованы partner entities, list/get/create, ownership checks | `packages/db/src/schema/rf.ts`, `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts`, `docs/openapi/rf.yaml` | ready | Есть базовый partner lifecycle, но без полноценных moderation states из target-доков. |
| branches / locations | В runtime RF branch-сущности/роутов нет; есть только partner-level atlas refs | `packages/db/src/schema/rf.ts`, `docs/openapi/rf.yaml`, `docs/architecture/rf/rf_openapi_outline_v1.md` | missing | Branch model подробно есть в docs/outline, но не в текущем runtime контракте. |
| business lines | В runtime RF business_line-сущности/роутов нет | `packages/db/src/schema/rf.ts`, `docs/openapi/rf.yaml`, `docs/architecture/rf/rf_openapi_outline_v1.md` | missing | Зафиксировано как target в RF docs, не реализовано в runtime baseline. |
| offers | Реализованы list/get/create/activate + owner checks | `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts`, `packages/db/src/schema/rf.ts`, `docs/openapi/rf.yaml` | ready | Базовый lifecycle есть (draft/active/archived). |
| vouchers | Реализованы voucher entity и выдача по claim с уникальными ограничениями | `packages/db/src/schema/rf.ts`, `apps/rf-service/src/store.ts`, `docs/openapi/rf.yaml` | ready | Есть code и status lifecycle baseline. |
| claims | Реализован idempotent claim (`Idempotency-Key`, `rf_claim_idempotency`) | `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts`, `packages/db/src/schema/rf.ts`, `docs/openapi/rf.yaml` | ready | Хороший baseline для voucher-first. |
| redeems | Реализован redeem endpoint с переходом `claimed -> redeemed` и partner ownership guard | `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts`, `docs/openapi/rf.yaml` | ready | Нет подтвержденного QR scan endpoint; redeem идет по voucher id/role checks. |
| PRO links | Реализованы list/create/accept + statuses `pending/active/ended` | `packages/db/src/schema/rf.ts`, `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts`, `docs/openapi/rf.yaml` | partial | Нет полного trust-chain цикла (pause/end analytics/moderation surface) из target docs. |
| RF status / verification | Есть только coarse statuses (`partner: active/archived`, `offer: draft/active/archived`) | `packages/db/src/schema/rf.ts`, `apps/rf-service/src/store.ts`, `docs/openapi/rf.yaml` | partial | Полные verification/moderation endpoints находятся в outline/docs, не в runtime API. |
| RF admin / merchant / PRO surfaces | Есть mix live+mock/local; merchant/PRO разделы сильно опираются на mockData | `apps/go2asia-pwa-shell/components/rf/live/RfBusinessCreatePanel.tsx`, `apps/go2asia-pwa-shell/components/rf/mockData.ts`, `apps/go2asia-pwa-shell/components/rf/Merchant/*`, `apps/go2asia-pwa-shell/components/rf/PRO/*`, `apps/go2asia-pwa-shell/hooks/useRfLocalContour.ts` | partial | Риск смешения demo/local/live явно подтвержден (CA-012). |
| RF API routes | Runtime RF API покрывает baseline partner/offer/voucher/pro-link flows | `apps/rf-service/src/routes/rf.ts`, `docs/openapi/rf.yaml` | partial | Target surface в `rf_openapi_outline_v1.md` заметно шире runtime. |
| RF DB schema | Есть `rf_partner`, `rf_offer`, `rf_voucher`, `rf_pro_link`, `rf_claim_idempotency` | `packages/db/src/schema/rf.ts` | partial | Нет runtime таблиц branch/business-line/verification cases из target architecture docs. |
| RF frontend demo/local/live states | Есть guardrails-лейблы и local notices, но mock/local state остается рядом с live flows | `apps/go2asia-pwa-shell/lib/rfFirstSliceContent.ts`, `apps/go2asia-pwa-shell/components/rf/Shared/RfLocalStorageNotice.tsx`, `apps/go2asia-pwa-shell/components/rf/Vouchers/RfMyVouchersView.tsx`, `apps/go2asia-pwa-shell/components/rf/mockData.ts` | partial | Нужно дисциплинировать границы источников истины без UI rewrite в этом pass. |

## 4. Ownership Boundaries

### RF owns

- partner identity/profile (в текущем runtime baseline).
- RF offers и voucher lifecycle (claim/redeem/status).
- PRO-business relation (`rf_pro_link`).
- partner business status baseline (active/archived).

### RF references

- Atlas geo/place references (`atlas_place_id`, `host_atlas_place_id`).
- Rielt listing linkage через `rf_partner_id` / `rf_offer_id` на стороне Rielt.
- Points reward taxonomy/actions (как downstream consumer contract, не как RF ledger logic).
- Media references через общий media owner model (`rf_partner`).

### RF must not own

- Points ledger / reward execution.
- Tokenomics / NFT/on-chain.
- User identity/auth ownership.
- Atlas canonical geography.
- Rielt listing catalog ownership.
- Space social domain.
- Booking/chat/payment engine.

## 5. Voucher-first Readiness

- **offer model:** `partial` — базовый lifecycle готов, но без branch-scoped/runtime verification richness.
- **voucher model:** `partial` — рабочий baseline есть (`claimed/redeemed/cancelled`), но target statuses/flows шире.
- **claim lifecycle:** `ready` — idempotency и dedupe уже реализованы.
- **redeem lifecycle:** `ready` — терминальный переход и owner checks в runtime есть.
- **QR/code readiness:** `partial` — voucher code есть, QR/scanner flow явно не выделен как backend runtime contract.
- **notification/signal readiness:** `missing` — в `rf-service` не подтвержден runtime fan-out/outbox/notification integration.
- **Rielt CTA readiness:** `partial` — canon locked на voucher-first, но Rielt runtime все еще хранит inquiry surface и soft RF refs без строгой cross-service валидации.

## 6. RF <-> Rielt Contract Implications

Что Rielt должен получать от RF/voucher layer:

- partner identity reference (`rf_partner_id`) и offer reference (`rf_offer_id`).
- offer summary для listing trust/CTA.
- voucher CTA target, ведущий в RF claim flow.
- claim/redeem status source-of-truth из RF/voucher layer.
- PRO/trust signals (минимум как reference слой).

Что Rielt не должен делать:

- direct inquiry как baseline сделки.
- booking ownership.
- chat ownership.
- voucher lifecycle ownership.
- payment ownership для базового partner service.

Примечание readiness: в `rielt_listing` RF refs сейчас мягкие (без FK к RF), поэтому строгий междоменный contract enforcement пока `partial`.

## 7. RF <-> PRO / Trust Chain

Текущая готовность:

- `rf_pro_link` уже есть в schema/runtime.
- Есть create/list/accept flow для PRO link.

Gaps:

- Нет полного доверительного lifecycle (например, расширенные moderation states, quality/trust signals, escalation outcomes) в runtime contract.
- Нет отдельного подтвержденного signal fan-out после claim/redeem в PRO/notification контуры.

Итог: `partial` readiness для MVP trust baseline; расширенный PRO trust-chain остается next slices/future.

## 8. RF <-> Economy / Points

Текущая готовность:

- Points поддерживает action taxonomy: `rf_partner_verified`, `rf_voucher_claimed`, `rf_voucher_redeemed`.
- Points сохраняет роль ledger/reward execution owner.

Gaps:

- В pre-Missions baseline RF не подтвержден как текущий direct producer `/internal/points/add`.
- В `rf-service` не обнаружен runtime вызов Points/producer pipeline.

Итог: taxonomy готова (`partial ready`), end-to-end reward bridge from RF runtime пока `missing`.

## 9. Risk Zones

- RF/voucher readiness может оказаться недостаточной для strict voucher-first, если контракт Rielt<->RF останется мягким.
- Смешение local/demo vouchers с live RF vouchers в UI.
- Риск возврата inquiry-first в Rielt.
- Риск превращения PRO в ручного оператора каждой транзакции.
- Риск дублирования geo/media truth в RF вместо ссылочной модели.
- Риск bypass Points ownership при reward логике.

## 10. Recommended Implementation Sequencing

### Slice RF-001: RF runtime inventory and contract lock

- goal: Зафиксировать runtime-vs-target RF contour как официальный implementation boundary.
- scope: Обновление/синхронизация RF contract docs (runtime rf.yaml vs target outline), явные `ready/partial/missing` статусы.
- files likely involved: `docs/architecture/rf/rf_business_contour_stabilization_v1.md`, `docs/architecture/rf/rf_openapi_outline_v1.md`, `docs/openapi/rf.yaml`, `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md`.
- non-goals: Без кода, без API-breaking изменений, без DB миграций.
- readiness dependency: Текущий pass завершен; можно делать сразу.

### Slice RF-002: Voucher lifecycle contract baseline hardening

- goal: Закрыть неоднозначности claim/redeem/QR-code/status/signal semantics на уровне контракта.
- scope: Уточнить lifecycle matrix, idempotency guarantees, signal contract и ownership handoff в документах/OpenAPI.
- files likely involved: `docs/openapi/rf.yaml`, `docs/architecture/rf/rf_openapi_outline_v1.md`, `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`.
- non-goals: Без внедрения Notifications/Points producer в этом slice.
- readiness dependency: RF-001.

### Slice RF-003: RF partner-offer-voucher relation hardening

- goal: Подготовить строгую доменную связность partner/offer/voucher перед расширением branch/business-line.
- scope: Runtime guards и consistency rules для offer/voucher ownership и terminal transitions.
- files likely involved: `apps/rf-service/src/store.ts`, `apps/rf-service/src/routes/rf.ts`, `packages/db/src/schema/rf.ts`, `docs/openapi/rf.yaml`.
- non-goals: Не вводить full branch/business-line model.
- readiness dependency: RF-002.

### Slice RF-004: Rielt voucher-first contract support

- goal: Убрать contract ambiguity между listing discovery и voucher ownership.
- scope: Согласовать и минимально зафиксировать Rielt->RF reference validation policy и CTA handoff contract.
- files likely involved: `apps/rielt-service/src/validation/rielt.ts`, `apps/rielt-service/src/services/rieltService.ts`, `packages/db/src/schema/rielt.ts`, `docs/openapi/rielt.yaml`, `docs/openapi/rf.yaml`.
- non-goals: Не внедрять booking/chat/payment.
- readiness dependency: RF-002, RF-003.

### Slice RF-005: PRO trust-chain visibility baseline

- goal: Добавить минимальную наблюдаемость PRO участия в voucher flows без ручной операционки.
- scope: Trust/projection fields и event visibility baseline.
- files likely involved: `apps/rf-service/src/store.ts`, `docs/openapi/rf.yaml`, `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`.
- non-goals: Не строить полноценный moderation platform.
- readiness dependency: RF-003.

## 11. First Practical Implementation Slice

**Выбран slice: RF-001 (RF runtime inventory and contract lock).**

Почему это первый и самый безопасный шаг:

- минимальный blast radius, без runtime-модификаций;
- прямо поддерживает strict voucher-first через четкий contract baseline;
- снижает риск implementation drift перед любыми backend changes;
- подготавливает детерминированный вход в RF-002/RF-003.

## 12. Open Questions

- Подтверждаем ли policy: для Rielt `rf_offer_id` должен валидироваться на существование/активность в RF при create/patch listing, или пока достаточно soft reference?
- Какой минимальный signal fan-out считается MVP-обязательным после voucher claim/redeem: только in-app marker или обязательный notification hook?
- Нужен ли в first runtime expansion branch/business-line сначала только в schema+API contracts, или сразу с write flows?
- Подтверждаем ли, что RF остается вне direct Points producer на ближайший этап, пока не зафиксирован явный pre-Missions bridge?

## 13. Non-Goals

- no code changes in this pass;
- no API changes in this pass;
- no DB migration in this pass;
- no UI rewrite;
- no booking;
- no chat;
- no token/NFT;
- no Missions Service;
- no Connect Service.


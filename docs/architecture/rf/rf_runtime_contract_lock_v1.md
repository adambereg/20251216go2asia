# RF Runtime Contract Lock v1

## 1. Purpose

Документ фиксирует contract lock для RF-001, чтобы не смешивать:

- current RF runtime;
- target RF architecture;
- future/non-current слои.

Задача lock-прохода: безопасно подготовить вход в RF-002/RF-003 без runtime drift.

## 2. Canon Context

- RF = partner/business layer.
- Rielt = strict voucher-first discovery.
- Voucher claim/redeem = canonical inquiry baseline.
- Points = ledger owner.
- Connect != backend-service.
- NFT/token/on-chain = future.

## 3. Current Runtime Scope

| Entity / route / concept | Current status | Evidence path | Notes |
| --- | --- | --- | --- |
| Partner identity/profile baseline (`RfPartner`) | active | `docs/openapi/rf.yaml` | Runtime schema присутствует в контракте (`status`, Atlas refs). |
| Partner-level location refs (`atlasPlaceId`, `hostAtlasPlaceId`) | active | `docs/openapi/rf.yaml`, `docs/architecture/rf/rf_business_contour_stabilization_v1.md` | Это partner-level refs, не branch-level runtime model. |
| Offers baseline (`RfOffer`) | active | `docs/openapi/rf.yaml` | Поддержаны draft/active/archived в runtime contract. |
| Vouchers baseline (`RfVoucher`) | active | `docs/openapi/rf.yaml` | Статусы baseline: claimed/redeemed/cancelled. |
| Voucher claim | active | `docs/openapi/rf.yaml` (`/v1/rf/offers/{offerId}/claim`) | Идемпотентность через `Idempotency-Key`. |
| Voucher redeem | active | `docs/openapi/rf.yaml` (`/v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`) | Redeem truth в RF runtime baseline. |
| Voucher status baseline | active | `docs/openapi/rf.yaml`, `docs/architecture/rf/rf_business_contour_stabilization_v1.md` | Baseline lifecycle зафиксирован, но без расширенного target lifecycle. |
| PRO links (`RfProLink`) | active | `docs/openapi/rf.yaml` (`/v1/rf/pro/links*`) | Есть list/create/accept baseline. |
| Public partner/offer read routes | active | `docs/openapi/rf.yaml` | `GET /v1/rf/partners*`, `GET /v1/rf/offers*`. |
| Business partner/offer create routes | active | `docs/openapi/rf.yaml` | `POST /v1/rf/business/partners`, `POST /v1/rf/business/partners/{partnerId}/offers`. |
| Me/vouchers | active | `docs/openapi/rf.yaml` (`GET /v1/rf/me/vouchers`) | User wallet baseline read surface. |
| Minimal owner/protected routes | active | `docs/openapi/rf.yaml` | Защищенные mutation paths через `X-Gateway-Auth`. |

## 4. Target / Future Scope (non-current)

Следующее фиксируется как target/future, не current runtime:

- branch/location как отдельная runtime entity;
- business lines;
- richer verification/moderation lifecycle;
- signal fan-out / notification hook;
- QR scanner flow;
- RF -> Points reward bridge;
- PRO trust analytics;
- partner dashboards beyond current baseline;
- full lifecycle archive/cancel/end operations как runtime-complete contour;
- branch-scoped offers/vouchers.

Evidence paths:

- `docs/architecture/rf/rf_openapi_outline_v1.md` (broader planned surface);
- `docs/architecture/rf/rf_business_contour_stabilization_v1.md` (missing/partial зоны);
- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md` (future-layer boundaries);
- `docs/architecture/platform/go2asia_p1_decisions_v1.md` (locked decisions).

## 5. Runtime vs Target Matrix

| Area | Current runtime? | Target/future? | Lock decision | Notes |
| --- | --- | --- | --- | --- |
| partner | yes | yes (richer) | lock-current | Runtime baseline valid; расширения отдельно. |
| branch/location | no | yes | lock-target-only | Не считать runtime до явного contract/runtime ввода. |
| business line | no | yes | lock-target-only | Не считать runtime до явного contract/runtime ввода. |
| offer | yes | yes (richer) | lock-current | Runtime baseline valid. |
| voucher | yes | yes (richer) | lock-current | Runtime baseline valid. |
| claim | yes | yes (hardened) | lock-current | Идемпотентный baseline уже contract-locked. |
| redeem | yes | yes (hardened) | lock-current | Redeem truth остается в RF/voucher layer. |
| QR/code | code: partial, QR scanner: no | yes | lock-partial | Не трактовать QR scanner как runtime-ready. |
| PRO link | partial | yes | lock-partial | Baseline есть, trust-chain аналитика future. |
| verification | partial | yes | lock-partial | Расширенные moderation flows в target docs. |
| moderation | partial | yes | lock-partial | Runtime contract неполный относительно outline. |
| signal fan-out | no | yes | lock-target-only | Нет runtime hook в current baseline. |
| RF rewards | taxonomy yes, bridge no | yes | lock-partial | Points taxonomy есть, RF producer bridge не locked. |
| RF/Rielt refs | yes (soft refs) | yes (strict) | lock-current-plus-future | Soft refs current; strict validation = отдельный slice decision. |
| media refs | yes (reference) | yes | lock-current | RF ссылается на media assets, не владеет storage. |
| Atlas refs | yes (partner-level) | yes (branch-level later) | lock-current-plus-future | Atlas truth вне RF ownership. |

## 6. RF <-> Rielt Contract Lock

- Rielt may reference RF partner/offer.
- Rielt must not own voucher lifecycle.
- Rielt must not become direct inquiry baseline.
- RF/voucher layer owns claim/redeem truth.
- Current Rielt refs may be soft; strict validation is future decision/slice.
- Rielt CTA should point toward RF/voucher claim target, not message/booking baseline.

Evidence paths:

- `docs/architecture/platform/go2asia_p1_decisions_v1.md` (CA-006 strict voucher-first);
- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md` (CA-006 lock);
- `docs/architecture/rf/rf_business_contour_stabilization_v1.md` (RF<->Rielt implications).

## 7. RF <-> Points Contract Lock

- Points has RF action taxonomy (`rf_partner_verified`, `rf_voucher_claimed`, `rf_voucher_redeemed`).
- RF is not yet locked as direct Points producer in current pre-Missions baseline.
- RF must not write ledger.
- Любой future RF reward bridge обязан следовать pre-Missions baseline:
  - service-to-service auth;
  - externalId/idempotency;
  - explicit action;
  - metadata with source domain event.

Evidence paths:

- `docs/architecture/platform/pre_missions_reward_baseline_v1.md`;
- `docs/architecture/rf/rf_business_contour_stabilization_v1.md`;
- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md`.

## 8. RF <-> Atlas / Media Contract Lock

- RF references Atlas; не владеет canonical geo.
- Partner-level Atlas refs are current baseline.
- Branch-level geo in RF runtime = future target.
- RF may reference media assets; media storage ownership stays outside RF.

Evidence paths:

- `docs/architecture/rf/rf_business_contour_stabilization_v1.md`;
- `docs/architecture/rf/rf_openapi_outline_v1.md`;
- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md`.

## 9. RF Frontend Demo / Local / Live Boundary

- Live API surfaces: public RF pages и защищенные runtime actions на `docs/openapi/rf.yaml`.
- Local planning states: favorites/my-vouchers local contour (не server truth).
- Demo/mock merchant/PRO surfaces: допускаются только как demo contour.
- Guardrail lock: local/demo state не должен подаваться как live voucher truth.

Evidence path:

- `docs/architecture/rf/rf_business_contour_stabilization_v1.md`.

## 10. Allowed Next Slices

- **RF-002:** Voucher lifecycle contract baseline hardening (contract semantics, idempotency/ownership clarity).
- **RF-003:** Partner-offer-voucher relation hardening (consistency/guards внутри runtime contour).
- **RF-004:** Rielt voucher-first contract support (strict handoff rules, reference validation policy).
- **RF-005:** PRO trust-chain visibility baseline (минимальная observability без full moderation platform).
- RF-004 contract support documented in `docs/architecture/rf/rf_rielt_voucher_first_contract_v1.md`.
- RF-005 documented in `docs/architecture/rf/rf_pro_trust_visibility_v1.md`.

## 11. Non-Goals

- no code changes;
- no DB migration;
- no OpenAPI breaking change;
- no UI rewrite;
- no branch implementation;
- no business-line implementation;
- no notification implementation;
- no Points producer implementation;
- no token/NFT;
- no Connect Service;
- no Missions Service.

## 12. RF-002 Decision Lock

### 12.1 RF <-> Rielt validation

Decision:

- current = soft references (`rf_partner_id`, `rf_offer_id`);
- target = strict validation.

Rule:

- сейчас не блокируем listing create/patch из-за отсутствия RF сущностей;
- strict validation переносится в slice RF-004.

### 12.2 Signal fan-out

Decision: minimal MVP signal.

Rule:

- обязательный минимум: `voucher_claim` и `voucher_redeem` фиксируются как событие/запись;
- не требуется в RF-002:
  - полноценная notification system;
  - threads;
  - chat;
- notification hook = future slice.

### 12.3 Branch / business-line

Decision: contract-first.

Rule:

- сначала фиксируются schema/OpenAPI contract boundaries;
- runtime write flows идут следующим этапом.

### 12.4 RF -> Points

Decision: NOT NOW.

Rule:

- RF не является direct Points producer в текущем baseline;
- reward bridge = future (Missions / отдельное explicit decision);
- Points ownership ledger/reward execution остается изолированным.

## 13. Partner–Offer–Voucher Relation Lock

### 13.1 Canon Model

- Partner = владелец бизнеса;
- Offer = предложение партнера;
- Voucher = результат user claim по offer.

Формула:

- Partner -> owns -> Offer;
- Offer -> produces -> Voucher;
- Voucher -> belongs to -> User;
- Voucher -> is redeemable by -> Partner.

### 13.2 Ownership Rules

- partner владеет offer;
- offer всегда принадлежит одному partner;
- voucher всегда связан с:
  - offer;
  - partner;
  - user;
- voucher lifecycle (claim/redeem/status) принадлежит только RF layer.

### 13.3 Consistency Rules

- нельзя создать voucher без offer;
- нельзя создать offer без partner;
- `voucher.partner_id` должен соответствовать `offer.partner_id`;
- redeem возможен только partner-side actor;
- один voucher относится к одному пользователю.

### 13.4 Runtime vs Contract Gaps

- текущие Rielt refs остаются soft (без строгой валидации);
- strict validation переносится в future slice RF-004;
- branch/business-line отсутствуют в current runtime.

### 13.5 Guardrails

- Rielt не создает vouchers;
- Rielt не владеет offers;
- Rielt не владеет partner;
- RF остается единственным source of truth для:
  - offer;
  - voucher;
  - claim/redeem lifecycle.


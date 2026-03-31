# RF Dependency Map v1

**Status:** SSOT / boundary fixation pass  
**Scope:** compact RF-centric dependency map  
**Type:** architecture/reference only

---

## 1. Purpose

Этот документ фиксирует dependency map вокруг RF:

- какие контуры являются upstream для RF;
- какие контуры downstream/peer относительно RF;
- где допустимы только references;
- где запрещены ownership/write drift patterns.

---

## 2. RF-centered topology

### Authoritative upstream for RF

- Auth/User identity context
- Atlas canonical geo/place truth

### Peer bounded contexts

- Pulse
- Rielt
- Quest
- Space
- Guru
- Points/reward contour

### Downstream consumers of RF

- RF public/business/pro/admin frontends
- read/aggregation consumers (включая Guru-like projections)
- notification/analytics pipelines (через events/projections)

---

## 3. Ownership / read-link / write boundaries

| Neighbor | RF reads | RF writes there | Neighbor reads RF | Neighbor direct writes to RF tables | Boundary summary |
|---|---|---|---|---|---|
| Atlas | canonical geo/place refs | No | limited/optional | No | Atlas owns geo identity; RF only attaches business layer |
| Pulse | optional event refs/context | No | yes (partner/offer context) | No | Pulse owns events; RF owns vouchers/offers |
| Rielt | optional partner/link context | No | yes (trust/partner context) | No | Rielt owns listings/inquiries |
| Quest | optional eligibility/context refs | No | yes (branch/voucher targets) | No | Quest owns progression/proof |
| Space | typically minimal | No | yes (circulation/projection) | No | Space owns social truth |
| Guru | usually none as truth source | No | yes (aggregation/projection) | No | Guru aggregates, does not own RF truth |
| Points | usually none for core writes | No | yes (reward reactions by events) | No | Points owns ledger/economics |

Rule for all neighbors: cross-domain writes идут через API/events/contracts, но не через direct table mutation.

---

## 4. Allowed reference flows

- `Atlas -> RF`: canonical geo anchors for branch/location semantics.
- `RF -> Pulse`: event-related linkage for partner/offer contexts.
- `RF <-> Quest`: branch/voucher targets and eligibility context by reference.
- `RF <-> Rielt`: shared business context by links, без ownership merge.
- `RF -> Space/Guru`: public projections/circulation/aggregation.
- `RF -> Points`: partner/voucher events for reward/economic reactions.

---

## 5. Prohibited patterns

- RF writes Atlas geo truth or becomes geo-service.
- RF writes Pulse event truth.
- RF writes Quest progression/proof truth.
- RF writes Rielt listing/inquiry truth.
- RF writes Space post/group truth.
- RF writes Points ledger truth.
- Any neighbor writes RF-owned tables directly.
- Shared mutable ownership of partner/branch/offer/voucher across modules.

---

## 6. Sequencing dependency guardrail

Для RF-зависимых geo/business сценариев:

- RF contract/boundary fixation должна предшествовать или идти параллельно с adoption в Rielt и Quest;
- цель guardrail — не допустить параллельные несовместимые partner/business модели в downstream;
- это требование к контракту/границам, а не утверждение, что RF должен быть полностью runtime-complete раньше всех.

---

## 7. Anti-cycle rule

Запрещены циклы, где владение истины зависит от взаимных write-обязательств между RF и соседним доменом.

Допустимо:

- локальный commit RF truth;
- затем событие/проекция для downstream реакций.

Недопустимо:

- cross-service distributed write, где RF и соседний модуль одновременно выступают owner одного и того же состояния.

---

## 8. Current documented reality notes

- RF в текущем статусе платформы рассматривается как `operational-with-debt`, не как fully-complete contour.
- RF frontend wave 1 зафиксирован как meaningful live baseline, но с отложенной глубиной merchant/PRO surfaces.
- Поэтому dependency map используется как boundary guardrail для текущего цикла, а не как claim полной завершенности интеграций.

---

## 9. What this map does NOT decide

- не задает implementation roadmap;
- не заменяет execution/status anchor;
- не фиксирует endpoint-level API contracts;
- не утверждает full conformance всех downstream контуров уже сейчас;
- не расширяет scope RF до god-module.

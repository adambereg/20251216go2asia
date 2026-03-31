# RF Boundary and Ownership v1

**Status:** SSOT / boundary fixation pass  
**Scope:** RF ownership boundaries vs Atlas / Pulse / Rielt / Quest / Space (and Guru where relevant)  
**Type:** architecture/reference only

---

## 1. Purpose

Этот документ фиксирует ownership boundaries вокруг RF, чтобы:

- исключить ownership drift;
- сохранить Atlas как canonical geo owner;
- зафиксировать корректную межмодульную стыковку business-linked сценариев.

---

## 2. Core ownership split

### Atlas owns

- canonical geo identity и hierarchy (`country/city/district/container/place`);
- place truth и geo anchors.

### RF owns

- partner/business presence;
- partner branch attachment semantics;
- offer/voucher lifecycle;
- partner verification/visibility semantics;
- partner/pro operational linkage.

### Downstream modules own their own cores

- Pulse: event lifecycle;
- Rielt: listing/property lifecycle;
- Quest: progression/proof lifecycle;
- Space: social publication/distribution lifecycle;
- Guru: aggregation/read composition lifecycle.

---

## 3. Atlas vs RF boundary

- RF опирается на canonical geo refs Atlas и не подменяет Atlas geo SSOT.
- Atlas не поглощает business partner semantics RF.
- Link model: Atlas отвечает на "где", RF отвечает на "кто из бизнеса действует здесь и с какой offer/voucher semantics".

---

## 4. Module boundary matrix (RF-centric)

| Module | Owns | Reads/links via RF | Must not do |
|---|---|---|---|
| Atlas | geo identity/place truth | optional RF overlays on top of place | transfer geo ownership to RF |
| Pulse | events/attendance truth | partner/business context by reference | outsource event ownership to RF |
| Rielt | listing/inquiry truth | partner/trust/offer context by reference | invent standalone partner/business layer bypassing RF |
| Quest | progression/proof truth | branch/voucher context by reference | invent standalone partner/business identity bypassing RF |
| Space | social truth | RF-linked objects for circulation | own partner/business source truth |
| Guru | read aggregation truth | RF projections for discovery | become RF source truth |

---

## 5. Allowed references

- `partner -> branch -> canonical geo anchor`;
- `offer -> voucher`;
- optional `offer/voucher -> pulse_event` reference;
- optional quest eligibility/proof context references to RF artifacts;
- optional Rielt <-> RF linking by stable IDs.

References разрешены, ownership transfer запрещен.

---

## 6. Prohibited ownership patterns

- RF as geo-service or geo identity owner.
- RF as owner of listing/event/quest/social core entities.
- RF as universal "god-module" для всех business-related процессов.
- direct cross-service table writes between RF and соседними доменами.
- parallel partner/business identity models в Rielt/Quest в обход RF boundary.

---

## 7. Sequencing guardrail

- RF contract/boundary fixation должна быть зафиксирована до или параллельно geo/business adoption в Rielt и Quest.
- Смысл guardrail: сохранить совместимость моделей и избежать параллельных ad hoc бизнес-слоев.
- Это не означает обязательную full runtime-first реализацию RF раньше всех; речь о фиксации контракта и границ ownership.

---

## 8. Current documented role vs target boundary vs gaps

### Current documented role

- RF уже документирован как partner/business layer с live baseline и residual debt.
- Atlas уже документирован как canonical geo substrate.

### Target boundary (фиксируется этим документом)

- RF = межмодульный business/partner attachment слой поверх canonical geo;
- downstream adoption = through `RF + canonical geo`, без parallel ownership.

### Not yet fully formalized

- финальный runtime-contract depth для всех RF контуров;
- единый обязательный validation profile для всех cross-module reference paths;
- full maturity всех RF business/pro/admin surfaces.

---

## 9. What this document does NOT decide

- не является execution/implementation plan;
- не утверждает, что RF полностью реализован;
- не меняет API/DB/migration контракты;
- не переопределяет status anchor;
- не утверждает full canonical conformance всех downstream модулей на текущую дату.

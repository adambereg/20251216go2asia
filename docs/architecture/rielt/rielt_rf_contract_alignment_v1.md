# Rielt RF Contract Alignment v1

**Status:** audit/reference fixation  
**Scope:** contract alignment seams for `Rielt <-> RF`  
**Type:** architecture/contract-alignment only

---

## 1. Purpose

Этот документ фиксирует contract seams между Rielt и RF так, чтобы уже принятые ownership boundaries были practically implementable без ownership drift.

Документ не является implementation plan, не меняет API/DB и не подменяет status anchor.

---

## 2. Boundary baseline

- Atlas owns canonical geo identity/place truth.
- RF owns partner/business presence, branch/offer/voucher/verification semantics.
- Rielt owns listing/property/inquiry truth.
- Rielt не должен строить параллельный partner/business layer.
- RF не должен поглощать ownership listing/inquiry lifecycle.

---

## 3. Contract surface candidates

Ниже surfaces, которые прямо следуют из текущих документов:

1. **Stable ID/reference links between Rielt and RF entities**  
   Optional linking by stable IDs (`Rielt <-> RF`) для shared business context.

2. **Partner/business actor context seam**  
   В business-linked listing сценариях Rielt читает partner/business контекст из RF, а не из собственной identity модели.

3. **Trust/verification/business presence context seam**  
   Rielt использует RF как source для trust/business presence semantics, где это требуется.

4. **Branch/business attachment seam**  
   Для branch/business attachment сценариев — стыковка через `RF + canonical geo`, без hybrid ad hoc модели внутри Rielt.

5. **Offer/promotional context seam**  
   Listing-related promotional/business context может ссылаться на RF offer semantics (как context/reference, без ownership transfer).

6. **Atlas-anchored listing geo seam (adjacent but required)**  
   `atlasPlaceId` / `atlasContainerPlaceId` в Rielt contract hints показывают, что geo grounding должен оставаться каноническим и согласуемым с RF-linked business context.

---

## 4. Minimum alignment contract

Минимальные ожидания согласования (без навязывания implementation details):

### 4.1 Stable references

- Междоменные связи должны использовать стабильные ID/references.
- Derived/free-text поля не могут быть source of truth для междоменных business/geo links.

### 4.2 Ownership preservation

- Rielt остается owner listing/property/inquiry lifecycle.
- RF остается owner partner/business/trust/offer/voucher semantics.
- Atlas остается owner geo identity/place truth.

### 4.3 Allowed links

- `Rielt -> RF`: partner/trust/business/offer context by reference.
- `RF -> Rielt`: optional partner/link context by reference where contractually needed.
- `Rielt -> Atlas`: canonical listing geo grounding.

### 4.4 Forbidden writes

- RF не пишет listing/inquiry truth в Rielt.
- Rielt не пишет RF-owned partner/business truth.
- Direct cross-service table writes запрещены.

### 4.5 Validation expectations (target)

- Нужен минимально согласованный validation profile для cross-module references (как target contract), даже если full runtime-validation еще не обязательна в текущем этапе.

---

## 5. Current documented alignment

Уже зафиксировано и согласовано в документации:

- RF дает Rielt partner/trust/offer context by reference.
- Rielt ownership на listing/property/inquiry явно сохранен.
- Optional stable-ID linking между Rielt и RF допускается.
- Прямой ownership transfer запрещен; разрешены only-reference seams.
- Sequencing guardrail закреплен: RF contract/boundary should precede or accompany Rielt geo/business adoption.

---

## 6. Current gaps / ambiguities

Текущие contract gaps по документам:

1. Нет единого endpoint-level `Rielt <-> RF` контракта.
2. Не зафиксирован единый обязательный validation profile для всех reference paths.
3. Есть ambiguity между target adoption boundary и текущим v1 baseline Rielt без полноценного RF integration surface.
4. Optional vs mandatory по отдельным partner/business сценариям описано качественно, но не сведено в machine-readable contract matrix.
5. Не полностью harmonized field-level mapping между listing context и RF business context across all surfaces.

---

## 7. Forbidden contract patterns

Для `Rielt <-> RF` contract layer запрещено:

- shared ownership listing/business entity;
- direct cross-service table writes;
- RF mutating listing/inquiry core truth;
- Rielt inventing standalone partner/business identity in bypass RF;
- hybrid ad hoc model `geo + partner + listing` в обход `Atlas + RF`;
- ownership transfer, замаскированный под "reference" поля.

---

## 8. Practical alignment formula

Короткая contract формула:

- `Rielt owns listing/inquiry truth`;
- `RF owns partner/business/trust/offer-voucher semantics`;
- `Atlas owns canonical geo identity`;
- `Rielt <-> RF` связаны stable references и context seams, но без shared mutable ownership.

---

## 9. What this document does NOT decide

Этот документ:

- не является roadmap/implementation plan;
- не поднимает operational status contour;
- не заменяет `go2asia_status_anchor_v1.md` и execution master plan;
- не утверждает full runtime readiness/conformance;
- не фиксирует endpoint/API schema changes;
- не фиксирует DB/migration changes;
- не расширяет ownership RF или Rielt beyond already fixed boundaries.

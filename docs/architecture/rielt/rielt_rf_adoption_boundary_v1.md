# Rielt RF Adoption Boundary v1

**Status:** audit/reference fixation  
**Scope:** RF adoption boundaries for Rielt  
**Type:** architecture/boundary only

---

## 1. Purpose

Этот документ фиксирует границы adoption Rielt относительно RF, чтобы:

- отделить обязательные RF-ссылки от опциональных;
- зафиксировать зоны, которые должны оставаться полностью в ownership Rielt;
- предотвратить scope drift в параллельную partner/business модель внутри Rielt.

Документ не является implementation plan и не изменяет status anchor.

---

## 2. Current boundary context

- Atlas остается owner canonical geo identity/place truth.
- RF остается owner partner/business presence и offer/voucher/trust semantics.
- Rielt остается owner listing/property/inquiry lifecycle.
- Sequencing guardrail зафиксирован: RF contract/boundary fixation должна предшествовать или идти параллельно geo/business adoption в Rielt.

---

## 3. Mandatory RF-linked zones

Ниже зоны, где Rielt обязан опираться на RF, чтобы не создавать параллельный business layer:

1. **Partner/business actor context**  
   Там, где listing-сценарий требует partner/business actor semantics, источник этой семантики должен быть RF, а не собственная identity-модель Rielt.

2. **Trust/verification/business presence semantics**  
   Там, где нужен partner trust/business presence context, Rielt должен ссылаться на RF-слой, а не дублировать trust/business ownership у себя.

3. **Business-linked offer/promotional context**  
   Там, где listing-контур использует business-linked offer/promotional semantics, контекст должен приходить через RF links/references.

4. **Branch/business attachment scenarios**  
   Для сценариев привязки к business branch/partner presence Rielt должен использовать `RF + canonical geo` boundary, а не собственный гибридный partner/geo слой.

---

## 4. Optional RF-linked zones

RF-контекст в Rielt остается опциональным там, где:

- сценарий не является partner/business-linked;
- достаточно canonical geo grounding без partner/trust enrichment;
- нужны только soft projections/read context, не влияющие на ownership listing/inquiry truth;
- структурные интеграции с RF остаются на этапе reference/links без обязательной глубокой runtime-сцепки в каждом кейсе.

---

## 5. Explicitly non-RF-owned zones (must stay in Rielt)

В ownership Rielt должны оставаться:

- listing identity и listing lifecycle;
- property/listing truth и доменная metadata/availability semantics;
- inquiry/lead lifecycle и inquiry truth;
- owner/agent/requester сценарии внутри доменного контура листингов;
- любые core transitions, где Rielt является source of truth по listings/inquiries.

RF не должен мутировать listing core напрямую без явного контракта.

---

## 6. Scope drift risks

Критические риски drift для Rielt:

1. Создание собственной partner/business identity модели внутри Rielt.
2. Гибридная ad hoc модель `geo + partner + listing` в обход `Atlas + RF`.
3. Перенос listing/inquiry ownership в RF.
4. Использование derived/free-text полей как замены canonical geo/business refs.
5. Негласное допущение, что RF optional во всех business-linked сценариях (что ломает boundary).

---

## 7. Practical boundary formula

Короткая рабочая формула для Rielt:

- **Rielt owns** listing/property/inquiry lifecycle truth.  
- **RF provides** partner/business presence/trust/offer context where business semantics is required.  
- **Atlas provides** canonical geo identity/place truth.  
- **Rielt must not** replace RF in partner/business ownership and must not replace Atlas in geo identity ownership.

---

## 8. Not yet fully formalized

На текущем этапе недоформализованы (и считаются contract/documentation debt):

- финальный endpoint-level runtime-contract между Rielt и RF;
- единый обязательный validation profile для всех cross-module reference paths;
- полная field-level синхронизация Rielt geo depth с расширенной canonical geo matrix во всех сценариях.

Это не основание для параллельной модели ownership.

---

## 9. What this document does NOT decide

Этот документ:

- не является roadmap или implementation планом;
- не поднимает status контуров автоматически;
- не утверждает full runtime readiness/conformance;
- не фиксирует API/OpenAPI changes;
- не фиксирует DB/migration/schema changes;
- не расширяет ownership RF за уже зафиксированные границы.

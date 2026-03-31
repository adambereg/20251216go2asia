# Quest RF Adoption Boundary v1

**Status:** audit/reference fixation  
**Scope:** RF adoption boundaries for Quest  
**Type:** architecture/boundary only

---

## 1. Purpose

Этот документ фиксирует границы adoption Quest относительно RF, чтобы:

- отделить обязательные RF-ссылки от опциональных;
- зафиксировать зоны, которые должны оставаться полностью в ownership Quest;
- исключить drift в параллельную partner/business/voucher ownership модель внутри Quest.

Документ не является implementation plan и не изменяет status anchor.

---

## 2. Current boundary context

- Atlas остается owner canonical geo identity/place truth.
- RF остается owner partner/business presence и offer/voucher lifecycle semantics.
- Quest остается owner progression/proof/execution truth.
- Sequencing guardrail зафиксирован: RF contract/boundary fixation должна предшествовать или идти параллельно geo/business adoption в Quest.

---

## 3. Mandatory RF-linked zones

Ниже зоны, где Quest обязан опираться на RF, чтобы не возникла параллельная business identity:

1. **Business-linked quest targets**  
   Для шагов/таргетов, где используется partner/branch business context, Quest должен ссылаться на RF source truth.

2. **Voucher/offer business context**  
   Там, где quest-сценарий использует voucher/offer semantics, Quest должен использовать RF context links, не становясь owner этих артефактов.

3. **Partner-hosted quest experiences**  
   Если квестовый опыт привязан к partner/business presence, соответствующая partner/branch identity должна идти через RF.

4. **Business eligibility/redeem-related context**  
   Там, где выполнение шага зависит от business eligibility/redeem context, Quest должен интегрироваться с RF boundary, а не дублировать lifecycle логики RF у себя.

---

## 4. Optional RF-linked zones

RF-контекст в Quest остается опциональным там, где:

- шаги/квесты не являются business-linked;
- достаточно canonical geo targets без partner/business layer;
- сценарий зависит только от event/geo/proof логики без voucher/offer semantics;
- используется read/projection контекст RF без переноса ownership.

---

## 5. Explicitly non-RF-owned zones (must stay in Quest)

В ownership Quest должны оставаться:

- quest lifecycle;
- step lifecycle;
- progression/completion truth;
- proof/submission/review/validation execution truth;
- правила выполнения и переходы состояния внутри Quest.

RF не должен владеть progression/proof/execution truth.

---

## 6. Scope drift risks

Критические риски drift для Quest:

1. Построение собственной partner/business identity модели в обход RF.
2. Встраивание voucher/offer lifecycle в Quest как owned state.
3. Смешение geo/business/execution в один parallel model без `Atlas + RF + Quest` ownership split.
4. Подмена canonical refs derived/free-text полями в business-linked шагах.
5. Предположение, что любой бизнес-сценарий можно закрыть только локальной логикой Quest без RF boundary.

---

## 7. Practical boundary formula

Короткая рабочая формула для Quest:

- **Quest owns** progression/proof/execution truth.  
- **RF provides** partner/branch/offer/voucher business context where business semantics is required.  
- **Atlas provides** canonical geo identity/place truth for location-bound targeting.  
- **Quest must not** replace RF in business ownership and must not replace Atlas in geo identity ownership.

---

## 8. Not yet fully formalized

На текущем этапе недоформализованы (и считаются contract/documentation debt):

- финальный endpoint-level runtime-contract между Quest и RF для всех business-linked сценариев;
- единый обязательный profile cross-service validation hooks по всем proof/eligibility вариантам;
- полная harmonization field-level модели target refs и RF-linked context across all quest surfaces.

Это не основание для ownership drift.

---

## 9. What this document does NOT decide

Этот документ:

- не является roadmap или implementation планом;
- не поднимает status контуров автоматически;
- не утверждает full runtime readiness/conformance;
- не фиксирует API/OpenAPI changes;
- не фиксирует DB/migration/schema changes;
- не расширяет ownership RF или Quest beyond already fixed boundaries.

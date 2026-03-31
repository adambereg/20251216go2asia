# Quest RF Contract Alignment v1

**Status:** audit/reference fixation  
**Scope:** contract alignment seams for `Quest <-> RF`  
**Type:** architecture/contract-alignment only

---

## 1. Purpose

Этот документ фиксирует contract seams между Quest и RF так, чтобы ownership boundaries оставались practically implementable без drift между business semantics и quest execution truth.

Документ не является implementation plan, не меняет API/DB и не подменяет status anchor.

---

## 2. Boundary baseline

- Atlas owns canonical geo identity/place truth.
- RF owns partner/business presence and offer/voucher lifecycle semantics.
- Quest owns progression/proof/execution truth.
- Quest не должен строить параллельную partner/business identity.
- RF не должен поглощать quest progression/proof ownership.

---

## 3. Contract surface candidates

Ниже surfaces, которые прямо следуют из текущих документов:

1. **Business-linked quest target seam**  
   Quest steps/targets, связанные с partner/branch semantics, должны ссылаться на RF source truth.

2. **Partner/branch reference seam**  
   Quest хранит reference/context links на partner/branch, не дублируя business ownership.

3. **Voucher/offer context seam**  
   Business-linked reward/eligibility context может ссылаться на RF voucher/offer semantics без переноса lifecycle ownership в Quest.

4. **Redeem/eligibility context seam**  
   Где step completion зависит от business eligibility/redeem context, требуется согласованный reference/validation seam с RF.

5. **Proof/validation hook seam (cross-service context)**  
   Quest proof/validation остается в Quest ownership, но может использовать RF context hooks в business-linked сценариях.

6. **Target reference harmonization seam (`target_type/target_id` vs RF refs)**  
   Необходима согласованность ссылочной модели target refs с RF branch/partner/voucher context на contract уровне.

---

## 4. Minimum alignment contract

Минимальные ожидания согласования:

### 4.1 Stable references

- Business-linked Quest сценарии используют стабильные references на RF artifacts.
- `target_type/target_id` и RF-linked refs должны быть semantically harmonized на contract уровне.

### 4.2 Ownership preservation

- Quest остается owner progression/proof/execution lifecycle.
- RF остается owner partner/business/offer/voucher lifecycle.
- Atlas остается owner geo identity/place truth.

### 4.3 Allowed links

- `Quest -> RF`: branch/partner/offer/voucher eligibility context by reference.
- `RF -> Quest`: limited context hooks where required by explicit contract.
- `Quest -> Atlas`: canonical geo refs для location-bound targeting.

### 4.4 Forbidden writes

- Quest не пишет RF-owned voucher/offer/business truth.
- RF не пишет quest progression/proof/execution truth.
- Direct cross-service table writes запрещены.

### 4.5 Validation expectations (target)

- Нужен минимальный cross-service validation profile для business-linked proof/eligibility seams (как target contract), даже если полная реализация еще staged.

---

## 5. Current documented alignment

Уже зафиксировано:

- Quest business-linked зоны обязаны опираться на RF (partner/branch/voucher context).
- Quest ownership на progression/proof/execution явно сохранен.
- RF ownership на voucher/offer lifecycle явно сохранен.
- Layer model `Atlas -> RF -> Quest` согласован как reference/adoption boundary.
- Sequencing guardrail закреплен: RF contract/boundary should precede or accompany Quest geo/business adoption.

---

## 6. Current gaps / ambiguities

Текущие contract gaps по документам:

1. Нет единого endpoint-level `Quest <-> RF` контракта для business-linked сценариев.
2. Не завершен единый обязательный validation profile для proof/eligibility hooks.
3. Полная harmonization target refs и RF-linked context across all quest surfaces остается недоформализованной.
4. Есть machine-readable ambiguity в типизации/стандартизации части target refs относительно RF entity refs.
5. Voucher ownership seam местами описан в разных doc слоях неоднородно (нужна явная contract синхронизация формулировок).

---

## 7. Forbidden contract patterns

Для `Quest <-> RF` contract layer запрещено:

- Quest owning voucher/offer lifecycle;
- RF owning progression/proof/execution truth;
- partner/business identity ownership inside Quest;
- direct cross-service ownership writes;
- shared mutable ownership одной business-linked сущности;
- подмена canonical refs derived/free-text surrogate значениями.

---

## 8. Practical alignment formula

Короткая contract формула:

- `Quest owns progression/proof/execution truth`;
- `RF owns partner/business/offer-voucher lifecycle semantics`;
- `Atlas owns canonical geo identity`;
- `Quest <-> RF` связаны reference/context seams для business-linked experiences, но без ownership transfer.

---

## 9. What this document does NOT decide

Этот документ:

- не является roadmap/implementation plan;
- не поднимает operational status contour;
- не заменяет `go2asia_status_anchor_v1.md` и execution master plan;
- не утверждает full runtime readiness/conformance;
- не фиксирует endpoint/API schema changes;
- не фиксирует DB/migration changes;
- не расширяет ownership RF или Quest beyond already fixed boundaries.

# Quest RF Implementation Gap Audit v1

**Status:** implementation gap audit (docs-only)  
**Scope:** `Quest <-> RF` implementation surface vs boundary/contract baseline  
**Type:** audit/reference only (no runtime/API/DB patch in this pass)

---

## 1. Purpose

Этот документ фиксирует implementation gaps для связки `Quest <-> RF` на основании:

- уже принятых boundary/contract документов;
- текущих OpenAPI/DTO hints;
- фактической code surface в `quest-service` и `rf-service`.

Цель: определить минимальный безопасный patch set, который запускает практическое выравнивание без ownership drift.

---

## 2. Boundary/contract baseline

Опорные правила:

- Atlas owns canonical geo identity/place truth.
- RF owns partner/business/branch/offer/voucher semantics.
- Quest owns progression/proof/execution truth.
- `Quest <-> RF` использует stable references/context seams.
- Ownership transfer и direct cross-service table writes запрещены.
- Voucher/offer lifecycle не переносится в Quest.

---

## 3. Current implementation reality

### 3.1 What exists now (code/contract surface)

1. **Business-linked step seam существует в минимальном виде**
   - В Quest есть step type `visit_partner`.
   - Есть связка `target_type/target_id` на шаге.
   - В БД и сервисе `partner` уже фигурирует как допустимый target-type.

2. **Quest API/DTO уже несет полиморфные target refs**
   - `targetType`/`targetId` присутствуют в OpenAPI/SDK.
   - Это даёт базовый reference seam, но без строгой RF contract типизации.

3. **Quest ownership реализован явно**
   - progression/proof/submit/validate/complete flow локально в Quest.
   - RF lifecycle ownership в Quest runtime не реализован (и не должен).

4. **RF runtime surface для read-context есть**
   - `rf-service` предоставляет публичные partners/offers read endpoints.
   - Это можно использовать как read-only context источник без ownership transfer.

### 3.2 What is missing in implementation

1. Нет endpoint-level контракта `Quest <-> RF` для business-linked шагов.
2. Нет branch-level contract seam (партнер есть, branch surface в runtime ограничен).
3. Нет voucher/offer eligibility/redeem hooks в Quest runtime.
4. Нет unified validation profile для cross-service RF refs.
5. Нет machine-readable harmonization `target_type/target_id` vs RF artifact refs.

---

## 4. Already aligned surfaces

Уже aligned относительно baseline:

- ownership split по доменам в коде не нарушен;
- Quest не поглощает voucher/offer lifecycle как owner;
- RF не поглощает progression/proof/execution truth Quest;
- direct cross-service writes между Quest и RF не используются;
- базовая reference-модель через `target_type/target_id` уже существует.

---

## 5. Implementation gaps

1. **Missing stable RF ref harmonization**
   - `targetId` в Quest не привязан строго к RF artifact contract (partner vs branch vs offer/voucher refs).

2. **Missing branch/business context seam**
   - Для partner-hosted/business-location сценариев нет завершенного contract-safe branch seam.

3. **Missing voucher/offer context seam in implementation**
   - Документы допускают/ожидают такой context, но runtime API/DTO Quest не фиксирует это как безопасный interop contract.

4. **Missing eligibility/redeem hooks**
   - Нет явного cross-service hook для business eligibility/redeem checks.

5. **Missing cross-service validation hooks**
   - Валидация доказательств/шагов в Quest не использует согласованный RF validation profile.

6. **Docs vs implementation ambiguity**
   - В ряде слоёв docs (architecture/backend/openapi) детализация richer, чем фактический runtime seam.

7. **Optional vs mandatory ambiguity**
   - На уровне implementation нет явной, машинно-проверяемой границы где RF mandatory для business-linked step.

8. **Potential ownership risk via flexible payloads**
   - Слишком свободные requirement/proof payload поля повышают риск неявной surrogate business модели внутри Quest.

---

## 6. Minimal safe patch set

Минимальный консервативный first-slice (без redesign):

1. **Harmonize `targetType` contract in Quest OpenAPI**
   - Привести `targetType` к явному enum, согласованному с фактическими step target types в service/DB.
   - Закрывает mismatch OpenAPI vs runtime expectations.

2. **Add explicit RF reference semantics for `visit_partner`**
   - В OpenAPI/docs Quest зафиксировать, что `targetId` для business-linked шага — stable RF artifact reference (без ownership transfer).
   - Закрывает ambiguity partner/branch identity seam.

3. **Introduce minimal validation guardrail for business-linked steps**
   - На уровне Quest service ввести минимальное правило (формат/наличие/допустимость refs) без полного RF integration hook.
   - Закрывает риск surrogate/free-text drift.

4. **Add optional event payload fields for step target refs**
   - В quest events добавить опциональные `stepTargetType`/`stepTargetId` для downstream consumer consistency.
   - Закрывает implicit integration ambiguity без изменения ownership.

5. **Align Quest docs with implemented RF seam maturity**
   - Явно разделить `implemented vs planned` для voucher/eligibility/business hooks в backend/docs слоях.
   - Убирает docs/code mismatch risk.

6. **Add focused tests for `visit_partner` contract behavior**
   - Минимальный набор tests для позитивного и негативного path по business-linked step references.
   - Закрывает регрессионный риск на boundary seam.

7. **(Optional) Add thin read-only RF context adapter contract**
   - Не внедрение deep integration, а узкий adapter interface-level seam для future first call.
   - Оставляет ownership границы неизменными и уменьшает ad hoc код в будущем.

---

## 7. Explicitly deferred

В этом срезе явно не трогаем:

- полный endpoint-level redesign `Quest <-> RF`;
- перенос voucher/offer lifecycle в Quest;
- branch/domain redesign в RF;
- полный cross-service validation orchestration;
- общий platform roadmap/status uplift;
- любые runtime/API/DB изменения в рамках этого audit-прохода.

---

## 8. Risks if patch set is skipped

- business-linked steps останутся семантически слабо закреплены в контракте;
- вырастет риск ad hoc partner/business surrogate логики в Quest;
- усилится docs/runtime drift между Quest/RF слоями;
- future integration slice станет дороже из-за отсутствия минимального stable seam.

---

## 9. What this document does NOT decide

Этот документ:

- не является implementation roadmap;
- не заменяет `go2asia_status_anchor_v1.md` и execution master plan;
- не поднимает operational status contour;
- не утверждает full runtime readiness/conformance;
- не фиксирует endpoint/API schema changes как уже выполненные;
- не фиксирует DB/migration changes;
- не расширяет ownership RF и не размывает ownership Quest.

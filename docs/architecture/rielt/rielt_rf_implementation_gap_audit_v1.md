# Rielt RF Implementation Gap Audit v1

**Status:** implementation gap audit (docs-only)  
**Scope:** `Rielt <-> RF` implementation surface vs boundary/contract baseline  
**Type:** audit/reference only (no runtime/API/DB patch in this pass)

---

## 1. Purpose

Этот документ фиксирует implementation gaps для связки `Rielt <-> RF` на основании текущих:

- boundary/contract документов;
- OpenAPI/DTO hints;
- фактической code surface в `rielt-service` и `rf-service`.

Цель: определить минимальный безопасный patch set для стартового выравнивания контракта без ownership drift.

---

## 2. Boundary/contract baseline

Опорные правила (уже зафиксированы в репозитории):

- Atlas owns canonical geo identity/place truth.
- RF owns partner/business presence, branch/offer/voucher/verification semantics.
- Rielt owns listing/property/inquiry truth.
- `Rielt <-> RF` допускает stable references/context seams.
- ownership transfer и direct cross-service table writes запрещены.

---

## 3. Current implementation reality

### 3.1 What exists now (code/contract surface)

1. **Atlas-linked geo seams в Rielt уже есть**
   - `atlas_place_id`, `atlas_container_place_id` в схеме листинга.
   - DTO/OpenAPI в Rielt уже содержат `atlasPlaceId` / `atlasContainerPlaceId`.
   - Runtime-валидация Atlas-ссылок присутствует (`validateAtlasGeoLinks`).

2. **Rielt ownership реализован явно**
   - listing/property/inquiry lifecycle централизован в `rielt-service`.
   - RF-поля/модели как owner-слой в Rielt runtime не реализованы.

3. **RF runtime/openapi surface существует, но как отдельный контур**
   - `/v1/rf/*` endpoints, RF entities (partner/offer/voucher/pro-link).
   - явного endpoint-level шва именно для Rielt как consumer не оформлено.

### 3.2 What is missing in implementation

1. Нет стабильных RF references в Rielt schema/DTO/OpenAPI (`rfPartnerId`/`rfBranchId`/`rfOfferId` и т.п. как optional seam).
2. Нет explicit contract-safe Rielt↔RF read seam в коде (никаких RF lookup hooks в rielt-service).
3. Нет единого validation profile для будущих cross-module RF refs.
4. Нет machine-readable matrix mandatory vs optional RF-linked scenarios.

---

## 4. Already aligned surfaces

Уже aligned относительно baseline:

- ownership split (Rielt lifecycle vs RF business layer) не нарушен в текущем runtime;
- Atlas-first geo grounding в Rielt реализован;
- cross-service direct table write pattern между Rielt и RF не используется;
- Rielt пока не внедрил standalone partner/business модель с собственными entity ownership claims.

---

## 5. Implementation gaps

1. **Missing stable RF references in Rielt contract**
   - В `rielt` API/schema нет согласованного optional reference seam к RF сущностям.

2. **Missing endpoint-level Rielt↔RF alignment**
   - Документы фиксируют seams, но runtime/openapi не дают явного минимального контракта для Rielt consumer use.

3. **Validation gap for cross-module refs**
   - Есть Atlas-link validation, но отсутствует аналогичный профиль для RF references (как target contract).

4. **Docs/runtime mismatch risk**
   - В части Rielt-docs сохраняются устаревшие/смешанные формулировки о степени runtime validation и RF integration maturity.

5. **Optional vs mandatory ambiguity**
   - На уровне реализации пока невозможно однозначно отличить business-linked сценарии (где RF должен быть обязательным) от purely geo/listing сценариев.

6. **Contract shape ambiguity for inquiry/read subsets**
   - Есть локальные расхождения DTO/OpenAPI vs фактического состава полей в отдельных ответах.

---

## 6. Minimal safe patch set

Минимальный стартовый срез (без redesign):

1. **Свести OpenAPI и runtime-ответы по текущим полям Rielt в строгое соответствие**  
   Закрывает contract mismatch в уже существующих ответах/DTO.

2. **Добавить в Rielt machine-readable optional RF seam (refs only) в OpenAPI + DTO типах**  
   Только nullable/reference поля, без внедрения RF ownership/logic.

3. **Подготовить минимальный storage seam для optional RF refs в Rielt schema (single-slice)**  
   Узкий набор ref-полей, без переноса business lifecycle в Rielt.

4. **Добавить базовый validation profile для RF refs (format/existence policy as target guardrail)**  
   Не full integration, а минимальные правила корректности reference seams.

5. **Обновить Rielt architecture docs до фактического runtime состояния Atlas-validation и RF-gap статуса**  
   Убирает ambiguity «документ vs код», не меняя runtime.

6. **Зафиксировать одну короткую contract matrix mandatory/optional для Rielt business-linked scenarios**  
   Чтобы предотвратить drift «RF optional везде» при следующих изменениях.

7. **Нормализовать path/DTO consistency мелких контрактных швов (без domain redesign)**  
   Закрывает технические mismatches, которые мешают безопасной межсервисной стыковке.

---

## 7. Explicitly deferred

В этом срезе явно не трогаем:

- полный endpoint-level redesign `Rielt <-> RF`;
- полную гео-перестройку под финальную модель container/district;
- расширение RF ownership или перенос listing/inquiry ownership;
- новый roadmap/implementation wave;
- status uplift claims.

---

## 8. Risks if patch set is skipped

- RF boundary останется документным, но не machine-readable для Rielt integration;
- вырастет риск ad hoc business-layer решений внутри Rielt;
- увеличится расхождение между docs и фактическим runtime контрактом;
- future integration slice станет дороже из-за накопленного contract drift.

---

## 9. What this document does NOT decide

Этот документ:

- не является implementation plan или roadmap;
- не меняет runtime/API/DB в текущем проходе;
- не поднимает status anchor контуров;
- не утверждает full runtime readiness/conformance;
- не расширяет ownership RF и не размывает ownership Rielt.

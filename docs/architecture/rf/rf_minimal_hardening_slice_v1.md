# RF Minimal Hardening Slice v1

**Status:** bounded implementation prep + minimal hardening  
**Scope:** narrow RF hardening for first downstream slices (`Rielt` / `Quest`)  
**Type:** implementation-oriented, non-redesign slice

---

## 1. Purpose

Зафиксировать и реализовать минимальный RF hardening срез, который:

- повышает consumer-safe интегрируемость RF;
- не ломает текущий baseline;
- не раздувает scope до RF v2/outline-поверхности;
- удерживает Atlas как canonical geo substrate и ownership boundaries между доменами.

---

## 2. Included in slice

В slice включены только четыре узких изменения:

1. **RF-scoped not-found semantics в runtime**  
   Для несуществующих `/v1/rf/*` маршрутов введён machine-readable код `RF_ROUTE_NOT_FOUND` вместо общего `NOT_FOUND`.

2. **Machine-readable consumer seam в `docs/openapi/rf.yaml`**  
   На теге `rf` добавлен vendor extension `x-go2asia-rf` с:
   - `contractClass`,
   - stable reference policy (`partnerId`, `offerId`, `voucherId`, `proLinkId`),
   - first-slice policy для `branchId` (пока не требовать),
   - нормативными HTTP путями и явно out-of-scope поверхностями.

3. **Implemented vs planned clarity в `rf.yaml`**  
   В `info.description` уточнено, что `rf.yaml` описывает implemented baseline, а расширенная поверхность живёт в outline-доке.

4. **Outline contract position clarity**  
   В `rf_openapi_outline_v1.md` явно зафиксировано, что это target/planned surface; machine-readable implemented contract — в `docs/openapi/rf.yaml`.

---

## 3. Explicitly out of scope

В этот slice сознательно **не** входят:

- branch-domain redesign;
- полный outline-level endpoint rollout;
- full moderation/verification platform;
- full internal projection platform;
- полный cross-service orchestration validation;
- изменение ownership model;
- geo identity перестройка в RF;
- roadmap/execution replanning/status uplift.

---

## 4. What was changed

- Runtime: RF-route miss semantics сделана отдельной и явной для downstream consumers.
- OpenAPI: добавлена machine-readable policy для first-slice consumer seams.
- Docs: устранена двусмысленность implemented vs planned для RF API surface.
- Bundle: regenerated `openapi.bundle.yaml`, чтобы tag-level seam policy попал в bundle artifact.

---

## 5. Why these changes are enough for first downstream slices

Этот минимальный срез закрывает критичные first-slice риски без redesign:

- consumer понимает, где RF route miss, а где общий platform 404;
- downstream получает machine-readable baseline policy по стабильным refs;
- исключается интеграция «по outline как будто уже implemented»;
- partner/business слой остается поверх canonical geo, без попытки RF стать geo-service.

Этого достаточно, чтобы начать bounded integration prep для `Rielt`/`Quest` на более устойчивой контрактной базе.

---

## 6. Remaining deferred zones

Остаются deferred (не блокируют этот hardening slice):

- endpoint-level Rielt↔RF и Quest↔RF full contract suites;
- branch-level full runtime surfaces;
- unified deep validation profile across all cross-service hooks;
- richer lifecycle/moderation/pro/admin surfaces;
- full RF v2 hardening.

# Pulse Event Geography Contract Alignment v1

## Purpose

Зафиксировать минимальный, practically usable contract для event location semantics в Pulse, согласованный с Atlas geo canon и RF optional business context, без redesign и без implementation scope.

## Alignment baseline

Контракт опирается на:

- Atlas geo canon (`geo_canon_milestone_2026_q1`, `geo_canon_v1`, `geo_layer_dependency_map_v1`).
- RF boundary package (`rf_domain_model_v1`, `rf_boundary_and_ownership_v1`, `rf_dependency_map_v1`).
- Cross-domain guardrails (`Cross-Domain-Architecture-Note-v1`).
- Pulse audit reality (`pulse_geo_alignment_event_location_audit_v1` + pulse docs/openapi/backend docs).

## Event location classes

### 1) Place-bound

- **Meaning:** событие реально привязано к конкретному месту/venue.
- **Correct anchors:** canonical Atlas place anchor (и при необходимости host/container anchor).
- **Do not:** подменять canonical anchor только text location/slug/name.

### 2) Area-bound

- **Meaning:** событие привязано к району/зоне, но не к одному leaf place.
- **Correct anchors:** canonical area/district-level geo anchor + city/country chain.
- **Do not:** насильно деградировать в fake single-place.

### 3) City-wide

- **Meaning:** событие относится к масштабу города.
- **Correct anchors:** canonical city (и country) anchor, без обязательного конкретного place.
- **Do not:** требовать фиктивный place только ради point-centric контрактов.

### 4) Diffuse / distributed

- **Meaning:** распределённая серия/кампания/маршрутный или многоточечный формат.
- **Correct anchors:** city/country scope + explicit scope semantics.
- **Do not:** сводить в один искусственный venue anchor.

## Pulse vs Atlas boundary

- Atlas остаётся owner canonical geo identity (`country/city/district/container/place`).
- Pulse остаётся owner event truth (`what happens`) и не становится geo identity owner.
- Pulse обязан использовать canonical Atlas anchors там, где событие реально location-bound.
- Text/location display fields допустимы как derived/display слой, но не как source of truth для structural geography.
- Place/host_place уместны для place-bound кейсов; district/area/city-level anchors допустимы без обязательного place для area/city/diffuse кейсов.

## Pulse vs RF boundary

- RF для Pulse — только optional business/partner context layer.
- RF уместен в business-linked event scenarios (partner/host/offer context), но не обязателен для всех событий.
- RF не подменяет event location semantics и не становится geo-service.
- Pulse не должен строить собственную partner/business identity вне RF.

## Minimum contract expectations

- Contract обязан различать event location classes (не только «есть/нет place»).
- Contract обязан различать geo anchor и business actor context.
- Для каждой class должна быть недвусмысленная geo anchor discipline (что допустимо, что запрещено).
- Fake place assignment для city-wide/diffuse кейсов считается недопустимым.
- Text/slug-only geography без canonical anchor discipline считается временной/legacy зоной, а не каноном.
- RF context остаётся optional и подключается только по смыслу сценария.

## Current non-aligned / not yet formalized zones

- Единый machine-readable contract для location classes ещё не формализован на публичном Pulse API surface.
- Runtime/OpenAPI list semantics по event geography не полностью синхронизированы.
- First-class place/container/district refs в текущем Pulse event contract не закреплены как единый контур.
- Граница между city-wide/diffuse legitimacy и place/host обязательностью ещё не сведена в один строгий operational contract.
- Downstream consumers местами сохраняют point-only bias.

## Drift risks

- point-only bias как implicit requirement для «валидного события»;
- fake place assignment для city-wide/diffuse событий;
- text/slug-only geography как pseudo-canon;
- смешение business actor context с geo anchor;
- постепенное превращение optional RF context в pseudo-required слой.

## Practical alignment formula

- **Pulse:** event truth (`what happens`).
- **Atlas:** canonical geography (`where`).
- **RF:** optional business/partner context (`which business actor`).

Для Pulse контракта это означает:

- place-bound события должны иметь canonical place/host grounding;
- area/city/diffuse события должны оставаться валидными без фиктивного place;
- RF контекст добавляется только там, где есть business-linked semantics.

## What this document does NOT decide

- Не фиксирует implementation plan, roadmap или migration sequence.
- Не фиксирует redesign Pulse domain/runtime.
- Не делает RF обязательным слоем для всех event scenarios.
- Не утверждает full runtime alignment текущего Pulse contour.
- Не меняет ownership split Atlas/RF/Pulse.

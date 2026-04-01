# Pulse Event Geography Bounded Contract Hardening Slice v1

## Purpose

Implement a minimal, conservative contract hardening slice for Pulse event geography so downstream consumers can read event location semantics in a machine-readable way without redesigning Pulse storage/model.

## Included in slice

- Align `GET /v1/content/events` OpenAPI query parameters with the existing runtime behavior.
- Expose existing event geo semantics from runtime/storage in public event DTO:
  - `geoScope`
  - `primaryType`
  - `secondaryType`
  - `countryId`
  - `cityId`
- Add contract-level guardrail clarifying that `latitude`/`longitude` may be `null` for city-wide and diffuse/distributed events.

## Explicitly out of scope

- Event storage redesign or migration to a new Pulse event geo model.
- Mandatory `placeId` rollout for all event scenarios.
- Full place/container/district first-class contract migration.
- RF-first event redesign or making RF mandatory for event geography.
- Distributed event engine or full venue/business lifecycle modeling.

## What was changed

- `apps/content-service/src/index.ts`
  - `ContentEventDto` extended with `countryId`, `cityId`, `geoScope`, `primaryType`, `secondaryType`.
  - `toContentEvent()` now maps these values from already available event row fields.
- `packages/db/src/queries/content.ts`
  - `EventRow` extended with `country_id`, `city_id`.
  - `listEvents()` and `getEventByIdOrSlug()` now select `e.country_id` and `e.city_id`.
- `docs/openapi/content.yaml`
  - `GET /v1/content/events` parameters aligned with runtime (`offset`, `page`, `country`/`country_id`, `city`/`city_id`, `category`, `date_from`, `date_to`, `price`, `verified`, `q`, `search`).
  - `ContentEventDto` schema extended with `countryId`, `cityId`, `geoScope`, `primaryType`, `secondaryType`.
  - Added explicit nullable semantics for `latitude`/`longitude` to avoid point-only/fake-place bias.
- `packages/sdk/src/content.ts`
  - Manual SDK `ContentEventDto` aligned with runtime/OpenAPI additions.

## Boundary safety checks

- Atlas ownership is preserved: Pulse consumes canonical geo anchors (`countryId`, `cityId`) but does not own geo identity.
- Pulse remains event-truth owner: no geo SSOT transfer, no geo-service behavior added.
- RF remains optional: no RF-required fields or RF-coupled validation introduced.
- City-wide/diffuse legitimacy preserved: no fake place requirement added; coordinates remain nullable.
- No hidden redesign: changes are additive contract/runtime hardening on existing fields.

## Remaining deferred zones

- First-class place/container/district event anchors and strict event location class enums.
- Runtime validation rules that enforce class-specific anchor combinations.
- Full docs/runtime harmonization for all legacy location display fields beyond this bounded slice.
- Any deep downstream refactor (Guru/feed interpretation upgrades, full consumer migration).

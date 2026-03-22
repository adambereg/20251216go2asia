# Atlas/Neon Maturity Gate Note v1

## Status / verdict
completed as pre-Space maturity gate

## 1. Purpose
This note fixes the controlled Atlas/Neon maturity pass executed before Space Asia work.  
The pass scope was narrow: reduce confirmed geo/content truth drift between Neon structure, content-service runtime DTOs, OpenAPI, generated SDK/types, and Pulse guide-feed query semantics.

## 2. Starting maturity gap
Before this pass:
- `ContentEventDto` in runtime was richer than OpenAPI and generated SDK/types.
- `/v1/content/events` runtime returned paging metadata (`total`, `limit`, `offset`) not reflected in OpenAPI schema.
- Pulse markdown ingestion can create slug-based event rows without `country_id`/`city_id`, while guide-feed event query filtered by FK only.
- Minimal geo discipline for Pulse import existed implicitly, but was not explicitly stated in the importer rules.

## 3. Confirmed scope of this pass
### In scope
- Contract truth alignment for Pulse/content events (`runtime DTO -> OpenAPI -> generated SDK/types`).
- Narrow guide-feed query alignment for slug-based Pulse events.
- Minimal geo-link discipline clarification in Pulse markdown importer.
- Short architectural fixation note for this gate.

### Explicitly out of scope
- Full Atlas schema redesign.
- Broad Neon content backfill/migration wave.
- Content-service redesign.
- Space implementation.
- Reopening RF/Rielt/Guru/Quest workstreams.

## 4. Changes made
### A) Contract truth alignment (events)
- Updated event list response schema to include paging metadata returned by runtime.
- Expanded `ContentEventDto` schema to match current runtime event serializer surface.
- Regenerated SDK/types outputs from updated OpenAPI bundle.

Files:
- `docs/openapi/content.yaml`
- `docs/openapi/openapi.bundle.yaml`
- `packages/sdk/src/generated/contentEventDto.ts`
- `packages/sdk/src/generated/listEventsResponse.ts`
- `packages/types/src/generated/contentEventDto.ts`
- `packages/types/src/generated/listEventsResponse.ts`

### B) Ingestion/query seam cleanup (Pulse guide feed)
- Updated guide-feed events query to accept both FK and slug matching for city/country filters.
- Preserved runtime behavior while reducing drop risk for slug-only imported Pulse rows.
- Added `COALESCE` for country/city display names to keep feed cards populated when FK is absent.

File:
- `packages/db/src/queries/guides.ts`

### C) Minimal geo-link discipline clarification
- Added explicit MVP geo-discipline rules to Pulse markdown import script comments:
  - slugs are canonical public geo refs for imported rows,
  - names are denormalized read-model fields,
  - coordinates anchor map location when present,
  - `geo_scope` captures coverage semantics.

File:
- `packages/db/src/importPulseEventsFromMarkdown.ts`

## 5. What improved
### Contract truth
- Runtime/OpenAPI/generated types are now aligned for current event payload and list pagination shape.

### Geo/content discipline
- Pulse import geo semantics are explicitly stated, reducing ambiguity before Space integration shell work.

### Ingestion/query consistency
- Guide-feed query no longer depends exclusively on FK filters for event inclusion.

### Pre-Space readiness impact
- Space can start on a clearer Atlas/Pulse event/content baseline with controlled debt instead of unresolved contract and feed-filter drift.

## 6. Residual debt (explicitly deferred)
- No broad historical FK backfill for all existing Pulse events.
- No global normalization pass for slug/id across all domains.
- No broader Atlas/Pulse IA/product-surface cleanup.
- No expansion of this pass into blog/space/reactions normalization.

## 7. Verification summary
Executed:
- `pnpm openapi:bundle`
- `pnpm exec orval --config orval.config.ts --output types`
- `pnpm exec orval --config orval.config.ts --output sdk`
- `pnpm -C packages/db typecheck`
- `pnpm -C packages/sdk typecheck`
- `pnpm -C packages/types typecheck`
- `pnpm -C apps/content-service typecheck`
- `pnpm -C apps/content-service lint`
- `pnpm -C packages/sdk build`
- `pnpm -C packages/types build`
- `pnpm -C apps/content-service build`

Result: passed; blocker-level issues not found in the touched maturity scope.

## 8. Final recommendation
Space Asia can proceed with controlled debt.  
Constraint: keep Space phase-1 as integration shell first, and avoid assuming full global geo normalization beyond the aligned event/content truth delivered in this maturity gate.

# Atlas Geo/Place Foundation Pass v1

Status: completed with minor residual debt

## Scope

This pass introduces only the minimum cross-domain place foundation required for RF and Rielt linkability without rebuilding Atlas.

Included:
- explicit Atlas place reference fields for RF partner and Rielt listing records;
- optional container place references for host/complex semantics;
- runtime validation that referenced Atlas places exist and are geo-consistent with declared country/city;
- OpenAPI alignment for newly exposed reference fields.

Excluded:
- full Atlas ontology redesign;
- broad content cleanup or seed overhaul;
- frontend migration work;
- advanced geo platform changes (PostGIS, polygons, external geo graph).

## Foundation truth established by this pass

- Atlas `places` remains the shared reference layer for concrete place IDs.
- RF partner can now carry:
  - `atlasPlaceId` (partner place),
  - `hostAtlasPlaceId` (container/host place),
  with a guard that they cannot be the same place.
- Rielt listing can now carry:
  - `atlasPlaceId` (listing place),
  - `atlasContainerPlaceId` (complex/container place),
  with a guard that they cannot be the same place.
- When these fields are provided, runtime enforces:
  - referenced Atlas place existence;
  - country/city consistency against listing/partner geo IDs.

## Residual debt kept out of scope

- no mandatory Atlas place linking for all RF/Rielt records yet (fields are optional);
- no Atlas table normalization for container/complex as standalone entity classes;
- no historical backfill/migration of existing RF/Rielt records to place references;
- no Guru adapter contract extension in this pass.

# Atlas Service — OpenAPI Outline v1

**Project:** Go2Asia  
**Domain:** Atlas / Atlas Asia  
**Document role:** SSOT API outline for `atlas-service`  
**Status:** Draft v1  
**Purpose:** Define the canonical API surface, endpoint groups, DTO direction, lifecycle operations, and boundary rules for `atlas-service`.

---

## 1. Purpose

This document defines the recommended OpenAPI outline for `atlas-service`.

The API must expose Atlas as the canonical geo/place domain of Go2Asia with:

- country management;
- region management where applicable;
- city management;
- district management;
- place management;
- place type management;
- place containment and relation management;
- Atlas-native guide content management;
- public Atlas read surfaces;
- business/internal projection surfaces for downstream domains.

This API outline is derived from the Atlas domain model and must preserve Atlas as the system of record for geographic and place identity.

---

## 2. API Design Principles

## 2.1 Single-domain ownership

`atlas-service` APIs must expose only Atlas-owned concepts:

- country
- region
- city
- district
- place
- place type
- place relation
- guide content
- Atlas media reference
- Atlas moderation/review case

They must not expose Atlas as owner of:

- partner/business presence
- event lifecycle
- quest completion truth
- listing/property truth
- social post truth
- voucher lifecycle
- balances / token / NFT / on-chain logic

---

## 2.2 Canonical URL namespace

All Atlas endpoints must live under:

- `/v1/atlas/*`

Legacy content routes or frontend page URLs must not be treated as canonical backend ownership APIs.

---

## 2.3 OpenAPI-first rule

All public and internal-facing Atlas DTOs must be generated from OpenAPI.

Frontend, internal adapters, and SDK consumers should rely on generated contracts rather than hand-written transport models.

---

## 2.4 Stable geo/place IDs first

Atlas is the source of truth for geo/place identity.

Therefore, API contracts should prioritize stable IDs:

- `countryId`
- `regionId`
- `cityId`
- `districtId`
- `placeId`
- `placeTypeId`

Readable fields such as slugs may be used for navigation and public querying, but ID-based contracts remain canonical for service integration.

---

## 2.5 Separation of identity from guide content

Atlas APIs must distinguish clearly between:

- canonical geo/place identity objects;
- Atlas-native guide content attached to those objects.

A city/place endpoint should not assume content blob ownership is identical to identity ownership, even if both are served by Atlas.

---

## 2.6 Explicit lifecycle operations

Publication, moderation, verification, and archival flows should be represented through explicit actions or constrained mutations.

Do not hide Atlas lifecycle behind unrestricted PATCH semantics.

---

## 2.7 Read vs write separation

Atlas should distinguish clearly between:

- write endpoints for canonical geo/place/content mutations;
- public/internal read endpoints for guide cards, place cards, breadcrumbs, and minimal projections.

This keeps Atlas extraction-safe and read-model-ready.

---

## 3. API Surface Overview

Recommended endpoint groups:

1. Health / metadata
2. Public geography reads
3. Public place reads
4. Public guide reads
5. Admin/editor geography management
6. Admin/editor place management
7. Place type management
8. Place relation management
9. Guide content management
10. Moderation / publication management
11. Internal projection endpoints

---

## 4. Auth and Actor Model

## 4.1 Anonymous access

Anonymous access may be allowed for selected public read endpoints such as:

- country list/detail
- city list/detail
- district list/detail
- place list/detail
- guide content reads
- breadcrumbs / lightweight public projections

All write surfaces require authentication.

---

## 4.2 Actor classes

Atlas APIs should be designed around these actor classes:

- `anonymous`
- `user`
- `atlas_editor`
- `atlas_moderator`
- `admin`
- `internal_service`

---

## 4.3 Role semantics

### `user`

May:
- read public Atlas geography and place data
- read public guide content

### `atlas_editor`

May:
- create/update draft countries/regions/cities/districts/places where policy allows
- create/update guide content drafts
- submit entities/content for review
- manage place relations and media references where policy allows

### `atlas_moderator`

May:
- review submissions
- verify/reject/publish eligible Atlas entities/content
- flag/archive problematic records
- manage moderation cases

### `admin`

May:
- perform all editor and moderator actions
- override or repair entity lifecycle where authorized

### `internal_service`

May:
- read narrow internal Atlas projections
- validate place/geography references
- consume breadcrumb / hierarchy / identity projections

---

## 5. Common Query and Response Conventions

## 5.1 Pagination

List endpoints should support cursor pagination.

Recommended query params:
- `cursor` optional
- `limit` optional

Recommended response pattern:

```json
{
  "items": [],
  "nextCursor": "..."
}
```

---

## 5.2 Filtering

Collection endpoints may support explicit filters only.

Examples:
- `status`
- `publicationStatus`
- `verificationStatus`
- `countryId`
- `regionId`
- `cityId`
- `districtId`
- `placeTypeCode`
- `hostPlaceId`
- `entityKind`
- `locale`

Do not overload Atlas with fuzzy global search semantics in v1.

---

## 5.3 Sorting

Allowed sort fields should be explicit.

Examples:
- `createdAt`
- `updatedAt`
- `publishedAt`
- `displayName`

---

## 5.4 Error envelope

Recommended standard error shape:

```json
{
  "error": {
    "code": "ATLAS_PLACE_NOT_FOUND",
    "message": "Atlas place was not found",
    "details": null
  },
  "requestId": "..."
}
```

---

## 5.5 Success envelope

Single-resource endpoints may return direct objects.

List endpoints should return:

```json
{
  "items": [],
  "nextCursor": "..."
}
```

Mutation endpoints may return:
- full resource;
- minimal operation result;
- or `204 No Content` where appropriate.

---

## 6. Health and Metadata

# 6.1 `GET /v1/atlas/health`

## Purpose

Basic healthcheck endpoint.

## Auth

No.

## Success response

`200 OK`

```json
{
  "status": "ok"
}
```

---

# 6.2 `GET /v1/atlas/meta`

## Purpose

Return lightweight service metadata / capability hints for admin or internal tooling.

## Auth

Internal/admin only, if exposed.

## Success response

`200 OK`

---

## 7. Public Geography Read Surface

---

# 7.1 `GET /v1/atlas/countries`

## Purpose

List public Atlas countries.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `status` optional
- `publicationStatus` optional

## Success response

`200 OK`

Returns `AtlasCountryListResponse`.

---

# 7.2 `GET /v1/atlas/countries/{countryId}`

## Purpose

Get public country detail by ID.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasCountryResponse`.

---

# 7.3 `GET /v1/atlas/countries/by-slug/{slug}`

## Purpose

Get public country detail by slug.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasCountryResponse`.

---

# 7.4 `GET /v1/atlas/regions`

## Purpose

List public regions.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `countryId` optional
- `status` optional
- `publicationStatus` optional

## Success response

`200 OK`

Returns `AtlasRegionListResponse`.

---

# 7.5 `GET /v1/atlas/regions/{regionId}`

## Purpose

Get public region detail.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasRegionResponse`.

---

# 7.6 `GET /v1/atlas/cities`

## Purpose

List public cities.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `countryId` optional
- `regionId` optional
- `status` optional
- `publicationStatus` optional

## Success response

`200 OK`

Returns `AtlasCityListResponse`.

---

# 7.7 `GET /v1/atlas/cities/{cityId}`

## Purpose

Get public city detail.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasCityResponse`.

---

# 7.8 `GET /v1/atlas/cities/by-slug/{slug}`

## Purpose

Get public city detail by slug.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasCityResponse`.

---

# 7.9 `GET /v1/atlas/districts`

## Purpose

List public districts.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `countryId` optional
- `regionId` optional
- `cityId` optional
- `status` optional
- `publicationStatus` optional

## Success response

`200 OK`

Returns `AtlasDistrictListResponse`.

---

# 7.10 `GET /v1/atlas/districts/{districtId}`

## Purpose

Get public district detail.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasDistrictResponse`.

---

## 8. Public Place Read Surface

---

# 8.1 `GET /v1/atlas/places`

## Purpose

List public places.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `countryId` optional
- `regionId` optional
- `cityId` optional
- `districtId` optional
- `placeTypeCode` optional
- `hostPlaceId` optional
- `status` optional
- `publicationStatus` optional
- `isContainer` optional
- `isLandmark` optional

## Success response

`200 OK`

Returns `AtlasPlaceListResponse`.

---

# 8.2 `GET /v1/atlas/places/{placeId}`

## Purpose

Get public place detail.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasPlaceResponse`.

---

# 8.3 `GET /v1/atlas/places/by-slug/{slug}`

## Purpose

Get public place detail by slug.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasPlaceResponse`.

---

# 8.4 `GET /v1/atlas/places/{placeId}/children`

## Purpose

List child places contained by a host/container place.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `placeTypeCode` optional
- `publicationStatus` optional

## Success response

`200 OK`

Returns `AtlasPlaceListResponse`.

---

# 8.5 `GET /v1/atlas/places/{placeId}/relations`

## Purpose

List explicit place relations involving this place.

## Auth

Optional.

## Query params

- `relationType` optional
- `direction` optional (`incoming`, `outgoing`, `both`)

## Success response

`200 OK`

Returns `AtlasPlaceRelationListResponse`.

---

# 8.6 `GET /v1/atlas/places/{placeId}/breadcrumbs`

## Purpose

Return canonical breadcrumb / containment path for a place.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasBreadcrumbResponse`.

---

## 9. Public Guide Read Surface

---

# 9.1 `GET /v1/atlas/guides`

## Purpose

List public guide content items.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `entityKind` optional
- `entityId` optional
- `locale` optional
- `publicationStatus` optional

## Success response

`200 OK`

Returns `AtlasGuideContentListResponse`.

---

# 9.2 `GET /v1/atlas/guides/{guideContentId}`

## Purpose

Get public guide content by content ID.

## Auth

Optional.

## Success response

`200 OK`

Returns `AtlasGuideContentResponse`.

---

# 9.3 `GET /v1/atlas/guides/by-entity`

## Purpose

Get public guide content by attached entity.

## Auth

Optional.

## Query params

- `entityKind` required
- `entityId` required
- `locale` optional

## Success response

`200 OK`

Returns `AtlasGuideContentResponse`.

---

## 10. Admin/Editor Geography Management Surface

---

# 10.1 `POST /v1/atlas/admin/countries`

## Purpose

Create a country draft.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasCountryRequest`

## Success response

`201 Created`

Returns `AtlasCountryResponse`.

---

# 10.2 `PATCH /v1/atlas/admin/countries/{countryId}`

## Purpose

Update a country draft or editable fields.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasCountryRequest`

## Success response

`200 OK`

Returns updated `AtlasCountryResponse`.

---

# 10.3 `POST /v1/atlas/admin/countries/{countryId}/submit-for-review`

## Purpose

Submit a country for moderation/review.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Success response

`200 OK`

Returns `AtlasSubmissionResponse`.

---

# 10.4 `POST /v1/atlas/admin/countries/{countryId}/publish`

## Purpose

Publish a country if policy allows.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasCountryResponse`.

---

# 10.5 `POST /v1/atlas/admin/countries/{countryId}/archive`

## Purpose

Archive a country.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasCountryResponse`.

---

# 10.6 `POST /v1/atlas/admin/regions`

## Purpose

Create a region draft.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasRegionRequest`

## Success response

`201 Created`

Returns `AtlasRegionResponse`.

---

# 10.7 `PATCH /v1/atlas/admin/regions/{regionId}`

## Purpose

Update a region.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasRegionRequest`

## Success response

`200 OK`

Returns updated `AtlasRegionResponse`.

---

# 10.8 `POST /v1/atlas/admin/regions/{regionId}/submit-for-review`

## Purpose

Submit a region for review.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Success response

`200 OK`

Returns `AtlasSubmissionResponse`.

---

# 10.9 `POST /v1/atlas/admin/regions/{regionId}/publish`

## Purpose

Publish a region.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasRegionResponse`.

---

# 10.10 `POST /v1/atlas/admin/cities`

## Purpose

Create a city draft.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasCityRequest`

## Success response

`201 Created`

Returns `AtlasCityResponse`.

---

# 10.11 `PATCH /v1/atlas/admin/cities/{cityId}`

## Purpose

Update a city.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasCityRequest`

## Success response

`200 OK`

Returns updated `AtlasCityResponse`.

---

# 10.12 `POST /v1/atlas/admin/cities/{cityId}/submit-for-review`

## Purpose

Submit a city for review.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Success response

`200 OK`

Returns `AtlasSubmissionResponse`.

---

# 10.13 `POST /v1/atlas/admin/cities/{cityId}/publish`

## Purpose

Publish a city.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasCityResponse`.

---

# 10.14 `POST /v1/atlas/admin/districts`

## Purpose

Create a district draft.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasDistrictRequest`

## Success response

`201 Created`

Returns `AtlasDistrictResponse`.

---

# 10.15 `PATCH /v1/atlas/admin/districts/{districtId}`

## Purpose

Update a district.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasDistrictRequest`

## Success response

`200 OK`

Returns updated `AtlasDistrictResponse`.

---

# 10.16 `POST /v1/atlas/admin/districts/{districtId}/submit-for-review`

## Purpose

Submit a district for review.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Success response

`200 OK`

Returns `AtlasSubmissionResponse`.

---

# 10.17 `POST /v1/atlas/admin/districts/{districtId}/publish`

## Purpose

Publish a district.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasDistrictResponse`.

---

## 11. Admin/Editor Place Management Surface

---

# 11.1 `POST /v1/atlas/admin/places`

## Purpose

Create a place draft.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasPlaceRequest`

## Success response

`201 Created`

Returns `AtlasPlaceResponse`.

---

# 11.2 `PATCH /v1/atlas/admin/places/{placeId}`

## Purpose

Update a place.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasPlaceRequest`

## Success response

`200 OK`

Returns updated `AtlasPlaceResponse`.

---

# 11.3 `POST /v1/atlas/admin/places/{placeId}/submit-for-review`

## Purpose

Submit a place for review.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Success response

`200 OK`

Returns `AtlasSubmissionResponse`.

---

# 11.4 `POST /v1/atlas/admin/places/{placeId}/publish`

## Purpose

Publish a place.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasPlaceResponse`.

---

# 11.5 `POST /v1/atlas/admin/places/{placeId}/archive`

## Purpose

Archive a place.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasPlaceResponse`.

---

# 11.6 `POST /v1/atlas/admin/places/{placeId}/verify`

## Purpose

Verify or trust-mark a place where verification is used.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Request body

`VerifyAtlasPlaceRequest`

## Success response

`200 OK`

Returns updated `AtlasPlaceResponse`.

---

## 12. Place Type Management Surface

---

# 12.1 `GET /v1/atlas/place-types`

## Purpose

List public or admin-visible place types.

## Auth

Optional for public if place types are intended to be visible; otherwise authenticated.

## Success response

`200 OK`

Returns `AtlasPlaceTypeListResponse`.

---

# 12.2 `POST /v1/atlas/admin/place-types`

## Purpose

Create a place type.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasPlaceTypeRequest`

## Success response

`201 Created`

Returns `AtlasPlaceTypeResponse`.

---

# 12.3 `PATCH /v1/atlas/admin/place-types/{placeTypeId}`

## Purpose

Update a place type.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasPlaceTypeRequest`

## Success response

`200 OK`

Returns updated `AtlasPlaceTypeResponse`.

---

## 13. Place Relation Management Surface

---

# 13.1 `POST /v1/atlas/admin/place-relations`

## Purpose

Create an explicit place relation.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasPlaceRelationRequest`

## Success response

`201 Created`

Returns `AtlasPlaceRelationResponse`.

---

# 13.2 `PATCH /v1/atlas/admin/place-relations/{relationId}`

## Purpose

Update a place relation.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasPlaceRelationRequest`

## Success response

`200 OK`

Returns updated `AtlasPlaceRelationResponse`.

---

# 13.3 `POST /v1/atlas/admin/place-relations/{relationId}/archive`

## Purpose

Archive or deactivate a place relation.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasPlaceRelationResponse`.

---

## 14. Guide Content Management Surface

---

# 14.1 `GET /v1/atlas/admin/guides`

## Purpose

List guide content drafts and published items for admin/editor workflows.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `atlas_moderator`
- `admin`

## Query params

- `cursor` optional
- `limit` optional
- `entityKind` optional
- `entityId` optional
- `locale` optional
- `status` optional
- `publicationStatus` optional

## Success response

`200 OK`

Returns `AtlasGuideContentListResponse`.

---

# 14.2 `POST /v1/atlas/admin/guides`

## Purpose

Create guide content draft attached to an Atlas entity.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`CreateAtlasGuideContentRequest`

## Success response

`201 Created`

Returns `AtlasGuideContentResponse`.

---

# 14.3 `PATCH /v1/atlas/admin/guides/{guideContentId}`

## Purpose

Update guide content draft.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Request body

`UpdateAtlasGuideContentRequest`

## Success response

`200 OK`

Returns updated `AtlasGuideContentResponse`.

---

# 14.4 `POST /v1/atlas/admin/guides/{guideContentId}/submit-for-review`

## Purpose

Submit guide content for moderation/review.

## Auth

Required.

## Allowed actors

- `atlas_editor`
- `admin`

## Success response

`200 OK`

Returns `AtlasSubmissionResponse`.

---

# 14.5 `POST /v1/atlas/admin/guides/{guideContentId}/publish`

## Purpose

Publish guide content.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasGuideContentResponse`.

---

# 14.6 `POST /v1/atlas/admin/guides/{guideContentId}/archive`

## Purpose

Archive guide content.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `AtlasGuideContentResponse`.

---

## 15. Moderation Surface

---

# 15.1 `GET /v1/atlas/moderation/cases`

## Purpose

List Atlas moderation/review cases.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Query params

- `cursor` optional
- `limit` optional
- `entityKind` optional
- `status` optional
- `caseType` optional

## Success response

`200 OK`

Returns `AtlasModerationCaseListResponse`.

---

# 15.2 `POST /v1/atlas/moderation/cases/{caseId}/resolve`

## Purpose

Resolve a moderation case.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Request body

`ResolveAtlasModerationCaseRequest`

## Success response

`200 OK`

Returns updated `AtlasModerationCaseResponse`.

---

# 15.3 `POST /v1/atlas/moderation/entities/{entityKind}/{entityId}/reject`

## Purpose

Reject an Atlas entity or guide submission.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Request body

`RejectAtlasEntityRequest`

## Success response

`200 OK`

Returns operation result or updated entity response.

---

# 15.4 `POST /v1/atlas/moderation/entities/{entityKind}/{entityId}/flag`

## Purpose

Flag an Atlas entity or content item.

## Auth

Required.

## Allowed actors

- `atlas_moderator`
- `admin`

## Request body

`FlagAtlasEntityRequest`

## Success response

`200 OK`

Returns operation result.

---

## 16. Internal Projection Surface

These endpoints should remain narrow and stable.

---

# 16.1 `GET /v1/atlas/internal/countries/{countryId}/projection`

## Purpose

Return minimal country projection for internal consumers.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `AtlasCountryProjectionResponse`.

---

# 16.2 `GET /v1/atlas/internal/cities/{cityId}/projection`

## Purpose

Return minimal city projection for internal consumers.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `AtlasCityProjectionResponse`.

---

# 16.3 `GET /v1/atlas/internal/districts/{districtId}/projection`

## Purpose

Return minimal district projection.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `AtlasDistrictProjectionResponse`.

---

# 16.4 `GET /v1/atlas/internal/places/{placeId}/projection`

## Purpose

Return minimal place projection.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `AtlasPlaceProjectionResponse`.

---

# 16.5 `POST /v1/atlas/internal/places/validate`

## Purpose

Validate one or more place/geography references for downstream services.

## Auth

Internal service only.

## Request body

`ValidateAtlasReferencesRequest`

## Success response

`200 OK`

Returns `ValidateAtlasReferencesResponse`.

---

# 16.6 `GET /v1/atlas/internal/places/{placeId}/breadcrumbs`

## Purpose

Return canonical place breadcrumb path for internal services.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `AtlasBreadcrumbResponse`.

---

## 17. Recommended DTO Set

Below is the recommended DTO direction.

---

## 17.1 `CreateAtlasCountryRequest`

```json
{
  "slug": "thailand",
  "code": "TH",
  "displayName": "Thailand",
  "nativeName": "ประเทศไทย"
}
```

---

## 17.2 `AtlasCountryResponse`

```json
{
  "id": "uuid",
  "slug": "thailand",
  "code": "TH",
  "displayName": "Thailand",
  "nativeName": "ประเทศไทย",
  "status": "draft",
  "publicationStatus": "hidden",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z",
  "publishedAt": null
}
```

---

## 17.3 `CreateAtlasRegionRequest`

```json
{
  "countryId": "uuid",
  "slug": "phuket-province",
  "displayName": "Phuket Province",
  "nativeName": "ภูเก็ต",
  "regionType": "province"
}
```

---

## 17.4 `AtlasRegionResponse`

```json
{
  "id": "uuid",
  "countryId": "uuid",
  "slug": "phuket-province",
  "displayName": "Phuket Province",
  "nativeName": "ภูเก็ต",
  "regionType": "province",
  "status": "draft",
  "publicationStatus": "hidden",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z",
  "publishedAt": null
}
```

---

## 17.5 `CreateAtlasCityRequest`

```json
{
  "countryId": "uuid",
  "regionId": "uuid",
  "slug": "phuket-city",
  "displayName": "Phuket City",
  "nativeName": "ภูเก็ต",
  "timezone": "Asia/Bangkok"
}
```

---

## 17.6 `AtlasCityResponse`

```json
{
  "id": "uuid",
  "countryId": "uuid",
  "regionId": "uuid",
  "slug": "phuket-city",
  "displayName": "Phuket City",
  "nativeName": "ภูเก็ต",
  "timezone": "Asia/Bangkok",
  "status": "draft",
  "publicationStatus": "hidden",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z",
  "publishedAt": null
}
```

---

## 17.7 `CreateAtlasDistrictRequest`

```json
{
  "countryId": "uuid",
  "regionId": "uuid",
  "cityId": "uuid",
  "slug": "patong",
  "displayName": "Patong",
  "nativeName": "ป่าตอง",
  "districtType": "district"
}
```

---

## 17.8 `AtlasDistrictResponse`

```json
{
  "id": "uuid",
  "countryId": "uuid",
  "regionId": "uuid",
  "cityId": "uuid",
  "slug": "patong",
  "displayName": "Patong",
  "nativeName": "ป่าตอง",
  "districtType": "district",
  "status": "draft",
  "publicationStatus": "hidden",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z",
  "publishedAt": null
}
```

---

## 17.9 `CreateAtlasPlaceTypeRequest`

```json
{
  "code": "mall",
  "displayName": "Mall",
  "parentTypeCode": "commercial_complex"
}
```

---

## 17.10 `AtlasPlaceTypeResponse`

```json
{
  "id": "uuid",
  "code": "mall",
  "displayName": "Mall",
  "parentTypeCode": "commercial_complex",
  "status": "active",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 17.11 `CreateAtlasPlaceRequest`

```json
{
  "countryId": "uuid",
  "regionId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "slug": "central-phuket",
  "displayName": "Central Phuket",
  "nativeName": null,
  "placeTypeId": "uuid",
  "latitude": 7.8901,
  "longitude": 98.3671,
  "addressText": "74-75 Wichitsongkram Road",
  "hostPlaceId": null,
  "isContainer": true,
  "isLandmark": true
}
```

---

## 17.12 `AtlasPlaceResponse`

```json
{
  "id": "uuid",
  "countryId": "uuid",
  "regionId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "slug": "central-phuket",
  "displayName": "Central Phuket",
  "nativeName": null,
  "placeTypeId": "uuid",
  "status": "draft",
  "publicationStatus": "hidden",
  "verificationStatus": "unverified",
  "latitude": 7.8901,
  "longitude": 98.3671,
  "addressText": "74-75 Wichitsongkram Road",
  "hostPlaceId": null,
  "isContainer": true,
  "isLandmark": true,
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z",
  "publishedAt": null
}
```

---

## 17.13 `CreateAtlasPlaceRelationRequest`

```json
{
  "fromPlaceId": "uuid",
  "toPlaceId": "uuid",
  "relationType": "inside"
}
```

---

## 17.14 `AtlasPlaceRelationResponse`

```json
{
  "id": "uuid",
  "fromPlaceId": "uuid",
  "toPlaceId": "uuid",
  "relationType": "inside",
  "status": "active",
  "createdAt": "2026-03-20T10:00:00Z"
}
```

---

## 17.15 `CreateAtlasGuideContentRequest`

```json
{
  "entityKind": "place",
  "entityId": "uuid",
  "version": 1,
  "locale": "ru",
  "title": "Central Phuket — гид по месту",
  "subtitle": "Торгово-развлекательный комплекс на Пхукете",
  "summary": "Краткое описание места",
  "bodyStructured": {
    "sections": [
      {
        "kind": "overview",
        "title": "Обзор",
        "body": "..."
      }
    ]
  },
  "seoTitle": "Central Phuket — гид Go2Asia",
  "seoDescription": "Обзор, расположение и практическая информация"
}
```

---

## 17.16 `AtlasGuideContentResponse`

```json
{
  "id": "uuid",
  "entityKind": "place",
  "entityId": "uuid",
  "version": 1,
  "locale": "ru",
  "status": "draft",
  "publicationStatus": "hidden",
  "title": "Central Phuket — гид по месту",
  "subtitle": "Торгово-развлекательный комплекс на Пхукете",
  "summary": "Краткое описание места",
  "bodyStructured": {
    "sections": [
      {
        "kind": "overview",
        "title": "Обзор",
        "body": "..."
      }
    ]
  },
  "seoTitle": "Central Phuket — гид Go2Asia",
  "seoDescription": "Обзор, расположение и практическая информация",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z",
  "publishedAt": null
}
```

---

## 17.17 `AtlasPlaceProjectionResponse`

```json
{
  "id": "uuid",
  "countryId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "slug": "central-phuket",
  "displayName": "Central Phuket",
  "placeTypeCode": "mall",
  "publicationStatus": "published",
  "verificationStatus": "verified",
  "hostPlaceId": null,
  "isContainer": true,
  "isLandmark": true
}
```

---

## 17.18 `ValidateAtlasReferencesRequest`

```json
{
  "countryId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "placeId": "uuid",
  "hostPlaceId": null
}
```

---

## 17.19 `ValidateAtlasReferencesResponse`

```json
{
  "isValid": true,
  "country": {
    "id": "uuid",
    "slug": "thailand"
  },
  "city": {
    "id": "uuid",
    "slug": "phuket-city"
  },
  "district": {
    "id": "uuid",
    "slug": "patong"
  },
  "place": {
    "id": "uuid",
    "slug": "central-phuket"
  },
  "hostPlace": null,
  "errors": []
}
```

---

## 18. List Response DTO Direction

### `AtlasCountryListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "slug": "thailand",
      "code": "TH",
      "displayName": "Thailand",
      "publicationStatus": "published"
    }
  ],
  "nextCursor": "..."
}
```

### `AtlasCityListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "countryId": "uuid",
      "slug": "phuket-city",
      "displayName": "Phuket City",
      "publicationStatus": "published"
    }
  ],
  "nextCursor": "..."
}
```

### `AtlasPlaceListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "cityId": "uuid",
      "districtId": "uuid",
      "slug": "central-phuket",
      "displayName": "Central Phuket",
      "placeTypeCode": "mall",
      "hostPlaceId": null,
      "publicationStatus": "published"
    }
  ],
  "nextCursor": "..."
}
```

### `AtlasGuideContentListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "entityKind": "place",
      "entityId": "uuid",
      "locale": "ru",
      "title": "Central Phuket — гид по месту",
      "publicationStatus": "published"
    }
  ],
  "nextCursor": "..."
}
```

---

## 19. Status Enums

Recommended canonical values.

### Entity status
- `draft`
- `active`
- `archived`

### Publication status
- `hidden`
- `published`

### Verification status
- `unverified`
- `verified`
- `flagged`
- `rejected`

### Region type
- `province`
- `state`
- `region`
- `territory`
- `other`

### District type
- `district`
- `neighborhood`
- `area`
- `zone`
- `other`

### Place relation type
- `inside`
- `near`
- `part_of`
- `entrance_of`
- `terminal_of`
- `building_of`
- `wing_of`

### Moderation case status
- `open`
- `in_review`
- `resolved`
- `rejected`

### Guide content entity kind
- `country`
- `region`
- `city`
- `district`
- `place`

---

## 20. Business Rule Error Codes

Recommended examples:

- `ATLAS_COUNTRY_NOT_FOUND`
- `ATLAS_REGION_NOT_FOUND`
- `ATLAS_CITY_NOT_FOUND`
- `ATLAS_DISTRICT_NOT_FOUND`
- `ATLAS_PLACE_NOT_FOUND`
- `ATLAS_PLACE_TYPE_NOT_FOUND`
- `ATLAS_GUIDE_CONTENT_NOT_FOUND`
- `ATLAS_INVALID_COUNTRY_REFERENCE`
- `ATLAS_INVALID_REGION_REFERENCE`
- `ATLAS_INVALID_CITY_REFERENCE`
- `ATLAS_INVALID_DISTRICT_REFERENCE`
- `ATLAS_INVALID_HOST_PLACE_REFERENCE`
- `ATLAS_PLACE_CITY_REQUIRED`
- `ATLAS_PLACE_TYPE_REQUIRED`
- `ATLAS_SLUG_ALREADY_EXISTS`
- `ATLAS_PUBLICATION_REQUIRES_COMPLETE_IDENTITY`
- `ATLAS_RELATION_INVALID`
- `ATLAS_MODERATION_REQUIRED`

---

## 21. Cross-Domain Contract Rules

These rules must be enforced in API design.

### 21.1 Atlas ↔ RF
Atlas exposes geo/place truth by stable IDs and projections.  
Atlas must not expose partner/branch ownership APIs.

### 21.2 Atlas ↔ Pulse
Atlas may provide place identity and breadcrumb/projection data.  
Atlas must not expose event lifecycle as Atlas-owned resources.

### 21.3 Atlas ↔ Quest
Atlas may provide place targets and hierarchy.  
Atlas must not expose quest completion state as Atlas-owned resources.

### 21.4 Atlas ↔ Rielt
Atlas may provide district/city/place references and project/complex place identities.  
Atlas must not expose listing or inquiry lifecycle.

### 21.5 Atlas ↔ Space
Atlas may provide shareable public geo/place/guide objects.  
Atlas must not expose social post ownership APIs.

### 21.6 Atlas ↔ Guru
Guru may consume public/internal Atlas projections.  
Atlas must not become a recommendation/ranking engine.

---

## 22. Non-Goals for v1 API

The v1 OpenAPI outline intentionally excludes:

- partner/business APIs
- event lifecycle APIs
- quest progression APIs
- listing/inquiry APIs
- social post/group APIs
- wallet/token APIs
- platform-wide search APIs
- recommendation/ranking APIs
- generic graph traversal across all domains

---

## 23. Recommended First Implementation Cut

The minimum Atlas-aligned first cut should include:

### Public
- `GET /v1/atlas/countries`
- `GET /v1/atlas/countries/{countryId}`
- `GET /v1/atlas/cities`
- `GET /v1/atlas/cities/{cityId}`
- `GET /v1/atlas/districts`
- `GET /v1/atlas/districts/{districtId}`
- `GET /v1/atlas/places`
- `GET /v1/atlas/places/{placeId}`
- `GET /v1/atlas/places/{placeId}/breadcrumbs`
- `GET /v1/atlas/guides/by-entity`

### Admin/editor
- `POST /v1/atlas/admin/cities`
- `PATCH /v1/atlas/admin/cities/{cityId}`
- `POST /v1/atlas/admin/districts`
- `PATCH /v1/atlas/admin/districts/{districtId}`
- `POST /v1/atlas/admin/places`
- `PATCH /v1/atlas/admin/places/{placeId}`
- `POST /v1/atlas/admin/guides`
- `PATCH /v1/atlas/admin/guides/{guideContentId}`

### Lifecycle/moderation
- `POST /v1/atlas/admin/places/{placeId}/submit-for-review`
- `POST /v1/atlas/admin/places/{placeId}/publish`
- `POST /v1/atlas/admin/guides/{guideContentId}/submit-for-review`
- `POST /v1/atlas/admin/guides/{guideContentId}/publish`

### Internal
- `GET /v1/atlas/internal/places/{placeId}/projection`
- `POST /v1/atlas/internal/places/validate`
- `GET /v1/atlas/internal/places/{placeId}/breadcrumbs`

---

## 24. Final Formula

The shortest correct API formula for Atlas is:

> `atlas-service` exposes the canonical geo/place API of Go2Asia with explicit management of countries, cities, districts, places, place hierarchy, and Atlas-native guide content, while serving narrow internal projections to neighboring domains.

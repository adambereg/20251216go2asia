# RF Service — OpenAPI Outline v1

**Project:** Go2Asia  
**Domain:** Russian Friendly / RF  
**Document role:** SSOT API outline for `rf-service`  
**Status:** Draft v1  
**Purpose:** Define the canonical API surface, endpoint groups, DTO direction, lifecycle operations, and boundary rules for `rf-service`.

---

## 1. Purpose

This document defines the recommended OpenAPI outline for `rf-service`.

The API must expose RF as a real partner/business presence domain with:

- partner profile management;
- partner branch management;
- partner representative / owner account linkage;
- PRO onboarding link flows;
- offers;
- vouchers;
- create / claim / redeem / status tracking;
- distinct user / PRO / business surfaces.

This API outline is derived from the RF domain model and must remain aligned with the cross-domain ownership rules of Go2Asia.

---

## 2. API Design Principles

## 2.1 Single-domain ownership

`rf-service` APIs must expose only RF-owned concepts:

- partner
- partner representative
- partner business line
- partner branch
- partner ↔ PRO link
- offer
- voucher
- moderation / verification case

They must not expose RF as owner of:

- Atlas geography source truth
- Pulse event lifecycle
- Quest completion truth
- Rielt listing truth
- Space social objects
- balances / G2A / NFT / on-chain logic

---

## 2.2 Canonical URL namespace

All RF endpoints must live under:

- `/v1/rf/*`

Legacy mock or content-like routes must not be treated as source of truth.

---

## 2.3 OpenAPI-first rule

All RF public and internal-facing DTOs must be generated from OpenAPI.

Frontend and integration clients should consume generated SDK/helpers rather than hand-written ad hoc contracts.

---

## 2.4 Canonical geo references only

RF must use canonical geo references as primary keys in API contracts:

- `countryId`
- `cityId`
- `districtId` optional
- `atlasPlaceId` optional
- `hostAtlasPlaceId` optional

Read-only compatibility fields may exist temporarily, but must not become primary routing keys.

Allowed compatibility examples:

- `countrySlug`
- `citySlug`
- `addressText`

These must be treated as secondary / read-only / transitional.

---

## 2.5 Business surfaces are role-specific, not domain-splitting

RF exposes three surface families:

- user
- PRO
- business

These are surface contours over one bounded context.  
They are not separate domains.

---

## 2.6 Lifecycle explicitness

Voucher and moderation flows must be expressed through explicit state-changing endpoints or clearly defined mutation semantics.

Do not hide RF lifecycle behind vague “update everything” endpoints.

---

## 2.7 Read vs write separation

RF API should distinguish clearly between:

- write endpoints for owned domain mutations;
- read endpoints for public/user/pro/business projections.

This will help later extraction of dedicated read models without breaking ownership.

---

## 3. API Surface Overview

Recommended first-step endpoint groups:

1. Health / service metadata
2. Public partner discovery
3. Partner public detail
4. Business partner management
5. Partner representatives
6. Business lines
7. Branches
8. PRO links
9. Offers
10. Vouchers
11. Verification / moderation
12. Internal integration / projection hooks (strictly limited)

---

## 4. Auth and Actor Model

## 4.1 Anonymous access

Anonymous access may be allowed for selected public RF read endpoints such as:

- partner public list
- partner public detail
- branch public detail
- public offers

Voucher claim/redeem and all business/PRO surfaces require authentication.

---

## 4.2 Actor classes

RF APIs should be designed around these actor classes:

- `anonymous`
- `user`
- `pro`
- `partner_representative`
- `rf_moderator`
- `admin`
- `internal_service`

---

## 4.3 Role semantics

### `user`

May:
- view public partners/branches/offers
- claim vouchers
- inspect own vouchers

### `pro`

May:
- create onboarding links or requests where allowed
- view managed/relevant partner queues
- help with partner workflows via PRO surface

### `partner_representative`

May:
- manage owned partner profile
- manage branches
- manage offers
- inspect voucher operations
- respond to moderation flows

### `rf_moderator`

May:
- review verification state
- suspend or reject partner/branch publication
- inspect abuse / redemption anomalies

### `internal_service`

May:
- read minimal RF projections
- validate voucher eligibility/redemption state where explicitly allowed
- trigger controlled workflows through documented internal endpoints only

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
- `verificationStatus`
- `countryId`
- `cityId`
- `partnerId`
- `branchId`
- `businessLineCode`
- `offerType`
- `visibility`

Do not introduce fuzzy free-text business filtering as primary logic in v1 unless backed by clear indexing and semantics.

---

## 5.3 Sorting

Allowed sort fields should be explicit.

Examples:
- `createdAt`
- `publishedAt`
- `updatedAt`
- `startsAt`
- `endsAt`

---

## 5.4 Error envelope

Recommended standard error shape:

```json
{
  "error": {
    "code": "RF_BRANCH_NOT_FOUND",
    "message": "RF branch was not found",
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

## 6. Health and Service Metadata

# 6.1 `GET /v1/rf/health`

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

# 6.2 `GET /v1/rf/meta`

## Purpose

Return lightweight service metadata / capabilities for debugging or admin UI support.

## Auth

Internal/admin only, if exposed.

## Success response

`200 OK`

---

## 7. Public Discovery Surface

These endpoints support user-facing RF discovery without turning RF into Guru.

---

# 7.1 `GET /v1/rf/partners`

## Purpose

List public RF partners.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `countryId` optional
- `cityId` optional
- `verificationStatus` optional
- `status` optional
- `businessLineCode` optional
- `q` optional, lightweight only

## Success response

`200 OK`

Returns `RfPartnerListResponse`.

---

# 7.2 `GET /v1/rf/partners/{partnerId}`

## Purpose

Get public partner detail.

## Auth

Optional.

## Path params

- `partnerId`

## Success response

`200 OK`

Returns `RfPartnerResponse`.

---

# 7.3 `GET /v1/rf/branches`

## Purpose

List public RF branches.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `countryId` optional
- `cityId` optional
- `districtId` optional
- `partnerId` optional
- `atlasPlaceId` optional
- `hostAtlasPlaceId` optional
- `businessLineCode` optional
- `verificationStatus` optional

## Success response

`200 OK`

Returns `RfBranchListResponse`.

---

# 7.4 `GET /v1/rf/branches/{branchId}`

## Purpose

Get public branch detail.

## Auth

Optional.

## Path params

- `branchId`

## Success response

`200 OK`

Returns `RfBranchResponse`.

---

# 7.5 `GET /v1/rf/offers`

## Purpose

List public offers.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `partnerId` optional
- `branchId` optional
- `offerType` optional
- `visibility` optional
- `relatedPulseEventId` optional
- `activeOnly` optional

## Success response

`200 OK`

Returns `RfOfferListResponse`.

---

# 7.6 `GET /v1/rf/offers/{offerId}`

## Purpose

Get public offer detail.

## Auth

Optional.

## Path params

- `offerId`

## Success response

`200 OK`

Returns `RfOfferResponse`.

---

## 8. Business Surface — Partner Management

These endpoints are for partner representatives, owners, admins, and moderators depending on action.

---

# 8.1 `POST /v1/rf/business/partners`

## Purpose

Create a new partner draft.

## Auth

Required.

## Allowed actors

- authenticated business starter
- admin
- moderator (optional)
- PRO only if business creation by PRO is explicitly allowed

## Request body

`CreateRfPartnerRequest`

## Success response

`201 Created`

Returns `RfPartnerResponse`.

---

# 8.2 `GET /v1/rf/business/partners/{partnerId}`

## Purpose

Get editable/business projection of a partner.

## Auth

Required.

## Allowed actors

- owner representative
- manager representative
- moderator
- admin

## Success response

`200 OK`

Returns `RfBusinessPartnerResponse`.

---

# 8.3 `PATCH /v1/rf/business/partners/{partnerId}`

## Purpose

Update partner draft/business fields.

## Auth

Required.

## Allowed actors

- owner representative
- manager representative
- admin

## Request body

`UpdateRfPartnerRequest`

## Success response

`200 OK`

Returns updated `RfBusinessPartnerResponse`.

---

# 8.4 `POST /v1/rf/business/partners/{partnerId}/submit-for-review`

## Purpose

Move partner from editable draft to moderation/review queue.

## Auth

Required.

## Allowed actors

- owner representative
- manager representative

## Success response

`200 OK`

Returns `RfPartnerReviewSubmissionResponse`.

---

# 8.5 `POST /v1/rf/business/partners/{partnerId}/publish`

## Purpose

Publish a partner if moderation and business rules allow it.

## Auth

Required.

## Allowed actors

- moderator
- admin
- possibly representative if auto-publication is allowed after verification

## Success response

`200 OK`

Returns `RfPartnerResponse`.

---

# 8.6 `POST /v1/rf/business/partners/{partnerId}/archive`

## Purpose

Archive a partner.

## Auth

Required.

## Allowed actors

- owner representative
- admin
- moderator

## Success response

`200 OK`

Returns updated `RfPartnerResponse`.

---

## 9. Business Surface — Representatives

---

# 9.1 `GET /v1/rf/business/partners/{partnerId}/representatives`

## Purpose

List representatives linked to a partner.

## Auth

Required.

## Allowed actors

- owner representative
- manager representative
- admin
- moderator

## Success response

`200 OK`

Returns `RfRepresentativeListResponse`.

---

# 9.2 `POST /v1/rf/business/partners/{partnerId}/representatives`

## Purpose

Invite/add a representative.

## Auth

Required.

## Allowed actors

- owner representative
- admin

## Request body

`CreateRfRepresentativeRequest`

## Success response

`201 Created`

Returns `RfRepresentativeResponse`.

---

# 9.3 `PATCH /v1/rf/business/partners/{partnerId}/representatives/{representativeId}`

## Purpose

Update representative role or flags.

## Auth

Required.

## Allowed actors

- owner representative
- admin

## Request body

`UpdateRfRepresentativeRequest`

## Success response

`200 OK`

Returns updated `RfRepresentativeResponse`.

---

# 9.4 `POST /v1/rf/business/partners/{partnerId}/representatives/{representativeId}/revoke`

## Purpose

Revoke representative access.

## Auth

Required.

## Allowed actors

- owner representative
- admin

## Success response

`200 OK`

Returns operation result or updated `RfRepresentativeResponse`.

---

## 10. Business Surface — Business Lines

---

# 10.1 `GET /v1/rf/business/partners/{partnerId}/business-lines`

## Purpose

List business lines for a partner.

## Auth

Required.

## Allowed actors

- representative
- admin
- moderator

## Success response

`200 OK`

Returns `RfBusinessLineListResponse`.

---

# 10.2 `POST /v1/rf/business/partners/{partnerId}/business-lines`

## Purpose

Create a business line.

## Auth

Required.

## Allowed actors

- owner representative
- manager representative
- admin

## Request body

`CreateRfBusinessLineRequest`

## Success response

`201 Created`

Returns `RfBusinessLineResponse`.

---

# 10.3 `PATCH /v1/rf/business/partners/{partnerId}/business-lines/{businessLineId}`

## Purpose

Update a business line.

## Auth

Required.

## Allowed actors

- owner representative
- manager representative
- admin

## Request body

`UpdateRfBusinessLineRequest`

## Success response

`200 OK`

Returns updated `RfBusinessLineResponse`.

---

# 10.4 `POST /v1/rf/business/partners/{partnerId}/business-lines/{businessLineId}/deactivate`

## Purpose

Deactivate a business line.

## Auth

Required.

## Allowed actors

- representative
- admin

## Success response

`200 OK`

Returns updated `RfBusinessLineResponse`.

---

## 11. Business Surface — Branches

---

# 11.1 `GET /v1/rf/business/partners/{partnerId}/branches`

## Purpose

List all branches for a partner.

## Auth

Required.

## Allowed actors

- representative
- moderator
- admin

## Query params

- `status` optional
- `publicationStatus` optional
- `verificationStatus` optional
- `cursor` optional
- `limit` optional

## Success response

`200 OK`

Returns `RfBranchListResponse`.

---

# 11.2 `POST /v1/rf/business/partners/{partnerId}/branches`

## Purpose

Create a new partner branch.

## Auth

Required.

## Allowed actors

- representative
- admin

## Request body

`CreateRfBranchRequest`

## Success response

`201 Created`

Returns `RfBranchResponse`.

---

# 11.3 `GET /v1/rf/business/partners/{partnerId}/branches/{branchId}`

## Purpose

Get editable/business branch detail.

## Auth

Required.

## Allowed actors

- representative
- moderator
- admin

## Success response

`200 OK`

Returns `RfBusinessBranchResponse`.

---

# 11.4 `PATCH /v1/rf/business/partners/{partnerId}/branches/{branchId}`

## Purpose

Update branch fields.

## Auth

Required.

## Allowed actors

- representative
- admin

## Request body

`UpdateRfBranchRequest`

## Success response

`200 OK`

Returns updated `RfBusinessBranchResponse`.

---

# 11.5 `POST /v1/rf/business/partners/{partnerId}/branches/{branchId}/submit-for-review`

## Purpose

Send branch to moderation/review.

## Auth

Required.

## Allowed actors

- representative
- admin

## Success response

`200 OK`

Returns `RfBranchReviewSubmissionResponse`.

---

# 11.6 `POST /v1/rf/business/partners/{partnerId}/branches/{branchId}/publish`

## Purpose

Publish a branch.

## Auth

Required.

## Allowed actors

- moderator
- admin
- possibly representative if policy allows after verification

## Success response

`200 OK`

Returns updated `RfBranchResponse`.

---

# 11.7 `POST /v1/rf/business/partners/{partnerId}/branches/{branchId}/archive`

## Purpose

Archive a branch.

## Auth

Required.

## Allowed actors

- representative
- moderator
- admin

## Success response

`200 OK`

Returns updated `RfBranchResponse`.

---

# 11.8 `PUT /v1/rf/business/partners/{partnerId}/branches/{branchId}/business-lines`

## Purpose

Replace branch ↔ business line assignments.

## Auth

Required.

## Allowed actors

- representative
- admin

## Request body

`ReplaceRfBranchBusinessLinesRequest`

## Success response

`200 OK`

Returns `RfBranchBusinessLinesResponse`.

---

## 12. PRO Surface — Partner / PRO Link

These endpoints support PRO onboarding and ongoing RF operational linkage.

---

# 12.1 `GET /v1/rf/pro/links`

## Purpose

List RF partner links relevant to current PRO.

## Auth

Required.

## Allowed actors

- PRO
- admin
- moderator

## Query params

- `status` optional
- `cursor` optional
- `limit` optional

## Success response

`200 OK`

Returns `RfProLinkListResponse`.

---

# 12.2 `POST /v1/rf/pro/links`

## Purpose

Create a PRO onboarding/request link to a partner.

## Auth

Required.

## Allowed actors

- PRO
- admin

## Request body

`CreateRfProLinkRequest`

## Success response

`201 Created`

Returns `RfProLinkResponse`.

---

# 12.3 `PATCH /v1/rf/pro/links/{proLinkId}`

## Purpose

Update PRO link status or scope.

## Auth

Required.

## Allowed actors

- PRO owner of link
- partner owner/manager where policy allows
- admin

## Request body

`UpdateRfProLinkRequest`

## Success response

`200 OK`

Returns updated `RfProLinkResponse`.

---

# 12.4 `POST /v1/rf/pro/links/{proLinkId}/accept`

## Purpose

Accept a pending PRO relationship.

## Auth

Required.

## Allowed actors

- partner representative
- admin

## Success response

`200 OK`

Returns updated `RfProLinkResponse`.

---

# 12.5 `POST /v1/rf/pro/links/{proLinkId}/end`

## Purpose

End an active PRO relationship.

## Auth

Required.

## Allowed actors

- partner owner
- linked PRO
- admin

## Success response

`200 OK`

Returns updated `RfProLinkResponse`.

---

## 13. Business Surface — Offers

---

# 13.1 `GET /v1/rf/business/partners/{partnerId}/offers`

## Purpose

List offers belonging to a partner.

## Auth

Required.

## Allowed actors

- representative
- moderator
- admin

## Query params

- `status` optional
- `visibility` optional
- `branchId` optional
- `cursor` optional
- `limit` optional

## Success response

`200 OK`

Returns `RfOfferListResponse`.

---

# 13.2 `POST /v1/rf/business/partners/{partnerId}/offers`

## Purpose

Create an offer.

## Auth

Required.

## Allowed actors

- representative
- admin

## Request body

`CreateRfOfferRequest`

## Success response

`201 Created`

Returns `RfOfferResponse`.

---

# 13.3 `GET /v1/rf/business/partners/{partnerId}/offers/{offerId}`

## Purpose

Get editable offer detail.

## Auth

Required.

## Allowed actors

- representative
- moderator
- admin

## Success response

`200 OK`

Returns `RfOfferResponse`.

---

# 13.4 `PATCH /v1/rf/business/partners/{partnerId}/offers/{offerId}`

## Purpose

Update an offer.

## Auth

Required.

## Allowed actors

- representative
- admin

## Request body

`UpdateRfOfferRequest`

## Success response

`200 OK`

Returns updated `RfOfferResponse`.

---

# 13.5 `POST /v1/rf/business/partners/{partnerId}/offers/{offerId}/activate`

## Purpose

Activate an offer.

## Auth

Required.

## Allowed actors

- representative
- admin
- optionally moderator if moderation-gated

## Success response

`200 OK`

Returns updated `RfOfferResponse`.

---

# 13.6 `POST /v1/rf/business/partners/{partnerId}/offers/{offerId}/pause`

## Purpose

Pause an offer.

## Auth

Required.

## Allowed actors

- representative
- admin

## Success response

`200 OK`

Returns updated `RfOfferResponse`.

---

# 13.7 `POST /v1/rf/business/partners/{partnerId}/offers/{offerId}/archive`

## Purpose

Archive an offer.

## Auth

Required.

## Allowed actors

- representative
- admin

## Success response

`200 OK`

Returns updated `RfOfferResponse`.

---

## 14. User Surface — Voucher Claim and Wallet

---

# 14.1 `POST /v1/rf/offers/{offerId}/claim`

## Purpose

Claim a voucher from an offer.

## Auth

Required.

## Allowed actors

- user

## Request body

`ClaimRfVoucherRequest`

## Success response

`201 Created`

Returns `RfVoucherResponse`.

## Notes

This is one of the central Step 10 endpoints.

---

# 14.2 `GET /v1/rf/me/vouchers`

## Purpose

List vouchers belonging to current user.

## Auth

Required.

## Query params

- `status` optional
- `partnerId` optional
- `branchId` optional
- `cursor` optional
- `limit` optional

## Success response

`200 OK`

Returns `RfVoucherListResponse`.

---

# 14.3 `GET /v1/rf/me/vouchers/{voucherId}`

## Purpose

Get current user voucher detail.

## Auth

Required.

## Success response

`200 OK`

Returns `RfVoucherResponse`.

---

## 15. Business / PRO Surface — Voucher Operations

These endpoints define controlled voucher lifecycle operations.

---

# 15.1 `GET /v1/rf/business/partners/{partnerId}/vouchers`

## Purpose

List vouchers relevant to a partner.

## Auth

Required.

## Allowed actors

- representative
- moderator
- admin
- PRO only if policy allows scoped visibility

## Query params

- `status` optional
- `offerId` optional
- `branchId` optional
- `issuedToUserId` optional, privileged only
- `cursor` optional
- `limit` optional

## Success response

`200 OK`

Returns `RfVoucherListResponse`.

---

# 15.2 `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`

## Purpose

Redeem a claimed voucher.

## Auth

Required.

## Allowed actors

- representative/operator
- admin
- moderator if operationally allowed

## Request body

`RedeemRfVoucherRequest`

## Success response

`200 OK`

Returns updated `RfVoucherResponse`.

## Notes

Redeem must be auditable and terminal.

---

# 15.3 `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/cancel`

## Purpose

Cancel a voucher where business rules allow.

## Auth

Required.

## Allowed actors

- representative
- admin
- moderator

## Request body

`CancelRfVoucherRequest`

## Success response

`200 OK`

Returns updated `RfVoucherResponse`.

---

# 15.4 `GET /v1/rf/business/partners/{partnerId}/voucher-operations`

## Purpose

List recent voucher operations / audit-like business view.

## Auth

Required.

## Allowed actors

- representative
- moderator
- admin

## Query params

- `cursor` optional
- `limit` optional
- `branchId` optional
- `status` optional
- `from` optional
- `to` optional

## Success response

`200 OK`

Returns `RfVoucherOperationListResponse`.

---

## 16. Verification and Moderation Surface

RF must not ignore trust and moderation.

---

# 16.1 `GET /v1/rf/moderation/partners`

## Purpose

List partners in moderation/verification queue.

## Auth

Required.

## Allowed actors

- moderator
- admin

## Query params

- `status`
- `verificationStatus`
- `cursor`
- `limit`

## Success response

`200 OK`

Returns `RfModerationPartnerListResponse`.

---

# 16.2 `POST /v1/rf/moderation/partners/{partnerId}/verify`

## Purpose

Mark partner as verified.

## Auth

Required.

## Allowed actors

- moderator
- admin

## Request body

`VerifyRfPartnerRequest`

## Success response

`200 OK`

Returns updated `RfPartnerResponse`.

---

# 16.3 `POST /v1/rf/moderation/partners/{partnerId}/reject`

## Purpose

Reject partner verification/publication.

## Auth

Required.

## Allowed actors

- moderator
- admin

## Request body

`RejectRfPartnerRequest`

## Success response

`200 OK`

Returns updated `RfPartnerResponse`.

---

# 16.4 `POST /v1/rf/moderation/branches/{branchId}/verify`

## Purpose

Verify a branch.

## Auth

Required.

## Allowed actors

- moderator
- admin

## Request body

`VerifyRfBranchRequest`

## Success response

`200 OK`

Returns updated `RfBranchResponse`.

---

# 16.5 `POST /v1/rf/moderation/branches/{branchId}/reject`

## Purpose

Reject or return branch for revision.

## Auth

Required.

## Allowed actors

- moderator
- admin

## Request body

`RejectRfBranchRequest`

## Success response

`200 OK`

Returns updated `RfBranchResponse`.

---

# 16.6 `POST /v1/rf/moderation/partners/{partnerId}/suspend`

## Purpose

Suspend partner operations/publication.

## Auth

Required.

## Allowed actors

- moderator
- admin

## Request body

`SuspendRfPartnerRequest`

## Success response

`200 OK`

Returns updated `RfPartnerResponse`.

---

## 17. Internal Integration Surface

These endpoints must remain minimal and carefully bounded.

---

# 17.1 `GET /v1/rf/internal/partners/{partnerId}/projection`

## Purpose

Return a minimal internal projection of a partner for other services.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `RfPartnerProjectionResponse`.

## Notes

Projection only. Not a generic read-all endpoint.

---

# 17.2 `GET /v1/rf/internal/branches/{branchId}/projection`

## Purpose

Return minimal branch projection.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `RfBranchProjectionResponse`.

---

# 17.3 `GET /v1/rf/internal/vouchers/{voucherId}/projection`

## Purpose

Return minimal voucher projection for controlled integrations.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `RfVoucherProjectionResponse`.

---

# 17.4 `POST /v1/rf/internal/vouchers/{voucherId}/validate-redemption`

## Purpose

Validate whether voucher redemption is currently allowed.

## Auth

Internal service only.

## Request body

`ValidateRfVoucherRedemptionRequest`

## Success response

`200 OK`

Returns `ValidateRfVoucherRedemptionResponse`.

## Notes

This does not transfer voucher ownership to caller.

---

## 18. Recommended DTO Set

Below is the recommended DTO direction.

---

## 18.1 `CreateRfPartnerRequest`

```json
{
  "displayName": "Phuket Family Cafe",
  "legalName": "Phuket Family Cafe Co. Ltd.",
  "descriptionShort": "Русскоязычное семейное кафе на Пхукете",
  "descriptionFull": "Полное описание...",
  "countryId": "uuid",
  "cityId": "uuid",
  "primaryContactEmail": "owner@example.com",
  "primaryContactPhone": "+66...",
  "websiteUrl": "https://example.com",
  "telegramUrl": "https://t.me/example"
}
```

---

## 18.2 `RfPartnerResponse`

```json
{
  "id": "uuid",
  "slug": "phuket-family-cafe",
  "displayName": "Phuket Family Cafe",
  "legalName": "Phuket Family Cafe Co. Ltd.",
  "descriptionShort": "Русскоязычное семейное кафе на Пхукете",
  "status": "draft",
  "verificationStatus": "unverified",
  "countryId": "uuid",
  "cityId": "uuid",
  "publishedAt": null,
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 18.3 `CreateRfRepresentativeRequest`

```json
{
  "userId": "uuid",
  "role": "manager",
  "isPrimary": false
}
```

---

## 18.4 `RfRepresentativeResponse`

```json
{
  "id": "uuid",
  "partnerId": "uuid",
  "userId": "uuid",
  "role": "manager",
  "status": "invited",
  "isPrimary": false,
  "invitedAt": "2026-03-20T10:00:00Z",
  "acceptedAt": null
}
```

---

## 18.5 `CreateRfBusinessLineRequest`

```json
{
  "code": "restaurant",
  "title": "Restaurant",
  "description": "Основной ресторанный бизнес"
}
```

---

## 18.6 `RfBusinessLineResponse`

```json
{
  "id": "uuid",
  "partnerId": "uuid",
  "code": "restaurant",
  "title": "Restaurant",
  "description": "Основной ресторанный бизнес",
  "status": "active",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 18.7 `CreateRfBranchRequest`

```json
{
  "displayName": "Phuket Family Cafe — Central Branch",
  "countryId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "atlasPlaceId": null,
  "hostAtlasPlaceId": "uuid",
  "unit": "B12",
  "floor": "2",
  "zone": "Food Court",
  "landmarkNote": "Напротив детской зоны",
  "contactPhone": "+66...",
  "contactEmail": "branch@example.com",
  "openingHoursNote": "10:00–22:00"
}
```

---

## 18.8 `RfBranchResponse`

```json
{
  "id": "uuid",
  "partnerId": "uuid",
  "slug": "phuket-family-cafe-central",
  "displayName": "Phuket Family Cafe — Central Branch",
  "status": "draft",
  "publicationStatus": "hidden",
  "verificationStatus": "unverified",
  "countryId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "atlasPlaceId": null,
  "hostAtlasPlaceId": "uuid",
  "unit": "B12",
  "floor": "2",
  "zone": "Food Court",
  "landmarkNote": "Напротив детской зоны",
  "publishedAt": null,
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 18.9 `ReplaceRfBranchBusinessLinesRequest`

```json
{
  "businessLineIds": ["uuid", "uuid"]
}
```

---

## 18.10 `CreateRfProLinkRequest`

```json
{
  "partnerId": "uuid",
  "proUserId": "uuid",
  "roleScope": "onboarding",
  "note": "Первичный онбординг партнёра"
}
```

---

## 18.11 `RfProLinkResponse`

```json
{
  "id": "uuid",
  "partnerId": "uuid",
  "proUserId": "uuid",
  "status": "pending",
  "roleScope": "onboarding",
  "note": "Первичный онбординг партнёра",
  "startedAt": null,
  "endedAt": null,
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 18.12 `CreateRfOfferRequest`

```json
{
  "branchId": "uuid",
  "title": "Welcome Coffee Set",
  "description": "Сет со скидкой 20% для новых гостей",
  "offerType": "discount",
  "visibility": "public",
  "startsAt": "2026-03-25T00:00:00Z",
  "endsAt": "2026-04-25T00:00:00Z",
  "relatedPulseEventId": null
}
```

---

## 18.13 `RfOfferResponse`

```json
{
  "id": "uuid",
  "partnerId": "uuid",
  "branchId": "uuid",
  "title": "Welcome Coffee Set",
  "description": "Сет со скидкой 20% для новых гостей",
  "offerType": "discount",
  "status": "draft",
  "visibility": "public",
  "startsAt": "2026-03-25T00:00:00Z",
  "endsAt": "2026-04-25T00:00:00Z",
  "relatedPulseEventId": null,
  "createdByUserId": "uuid",
  "publishedAt": null,
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 18.14 `ClaimRfVoucherRequest`

```json
{
  "branchId": "uuid",
  "context": {
    "source": "partner_page"
  }
}
```

---

## 18.15 `RedeemRfVoucherRequest`

```json
{
  "branchId": "uuid",
  "redeemNote": "Validated at cashier desk"
}
```

---

## 18.16 `RfVoucherResponse`

```json
{
  "id": "uuid",
  "offerId": "uuid",
  "partnerId": "uuid",
  "branchId": "uuid",
  "issuedToUserId": "uuid",
  "status": "claimed",
  "code": "RF-8K2M-AB12",
  "issuedAt": "2026-03-20T10:00:00Z",
  "claimedAt": "2026-03-20T10:02:00Z",
  "redeemedAt": null,
  "expiresAt": "2026-04-01T00:00:00Z",
  "relatedPulseEventId": null,
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:02:00Z"
}
```

---

## 18.17 `RfPartnerProjectionResponse`

```json
{
  "id": "uuid",
  "slug": "phuket-family-cafe",
  "displayName": "Phuket Family Cafe",
  "status": "active",
  "verificationStatus": "verified",
  "countryId": "uuid",
  "cityId": "uuid"
}
```

---

## 18.18 `RfBranchProjectionResponse`

```json
{
  "id": "uuid",
  "partnerId": "uuid",
  "displayName": "Phuket Family Cafe — Central Branch",
  "status": "active",
  "verificationStatus": "verified",
  "countryId": "uuid",
  "cityId": "uuid",
  "atlasPlaceId": null,
  "hostAtlasPlaceId": "uuid"
}
```

---

## 18.19 `RfVoucherProjectionResponse`

```json
{
  "id": "uuid",
  "offerId": "uuid",
  "partnerId": "uuid",
  "branchId": "uuid",
  "issuedToUserId": "uuid",
  "status": "claimed",
  "expiresAt": "2026-04-01T00:00:00Z"
}
```

---

## 19. List Response DTO Direction

### `RfPartnerListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "slug": "phuket-family-cafe",
      "displayName": "Phuket Family Cafe",
      "verificationStatus": "verified",
      "cityId": "uuid"
    }
  ],
  "nextCursor": "..."
}
```

### `RfBranchListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "partnerId": "uuid",
      "displayName": "Phuket Family Cafe — Central Branch",
      "verificationStatus": "verified",
      "cityId": "uuid",
      "hostAtlasPlaceId": "uuid"
    }
  ],
  "nextCursor": "..."
}
```

### `RfOfferListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "partnerId": "uuid",
      "branchId": "uuid",
      "title": "Welcome Coffee Set",
      "offerType": "discount",
      "status": "active"
    }
  ],
  "nextCursor": "..."
}
```

### `RfVoucherListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "offerId": "uuid",
      "partnerId": "uuid",
      "branchId": "uuid",
      "status": "claimed",
      "expiresAt": "2026-04-01T00:00:00Z"
    }
  ],
  "nextCursor": "..."
}
```

---

## 20. Status Enums

Recommended canonical values.

### Partner status
- `draft`
- `pending_review`
- `active`
- `suspended`
- `archived`

### Verification status
- `unverified`
- `pending`
- `verified`
- `rejected`

### Branch publication status
- `hidden`
- `published`

### Representative role
- `owner`
- `manager`
- `operator`

### Representative status
- `invited`
- `active`
- `revoked`

### Business line status
- `active`
- `inactive`

### PRO link status
- `pending`
- `active`
- `paused`
- `ended`

### PRO link role scope
- `onboarding`
- `curation`
- `promotion`
- `moderation_support`
- `account_support`

### Offer type
- `discount`
- `bundle`
- `gift`
- `access`
- `campaign`
- `event_related`

### Offer status
- `draft`
- `active`
- `expired`
- `paused`
- `archived`

### Offer visibility
- `public`
- `pro_only`
- `invite_only`

### Voucher status
- `issued`
- `claimed`
- `redeemed`
- `expired`
- `cancelled`

---

## 21. Business Rule Error Codes

Recommended examples:

- `RF_PARTNER_NOT_FOUND`
- `RF_BRANCH_NOT_FOUND`
- `RF_OFFER_NOT_FOUND`
- `RF_VOUCHER_NOT_FOUND`
- `RF_PARTNER_FORBIDDEN`
- `RF_BRANCH_FORBIDDEN`
- `RF_INVALID_GEO_REFERENCE`
- `RF_BRANCH_GEO_REQUIRED`
- `RF_VERIFICATION_REQUIRED`
- `RF_OFFER_INACTIVE`
- `RF_VOUCHER_ALREADY_REDEEMED`
- `RF_VOUCHER_EXPIRED`
- `RF_VOUCHER_NOT_CLAIMED`
- `RF_REPRESENTATIVE_ROLE_INVALID`
- `RF_PRO_LINK_NOT_ALLOWED`
- `RF_MODERATION_REQUIRED`
- `RF_BRANCH_NOT_PUBLISHED`
- `RF_DUPLICATE_ACTIVE_PRO_LINK`

---

## 22. Cross-Domain Contract Rules

These rules must be enforced in API design.

### 22.1 RF ↔ Atlas
RF stores and returns Atlas-linked IDs only.  
RF must not invent alternate geography ownership.

### 22.2 RF ↔ Pulse
RF may hold `relatedPulseEventId` references.  
RF must not expose event lifecycle fields as if RF owned them.

### 22.3 RF ↔ Quest
RF may support voucher eligibility/redeem validation contexts.  
RF must not expose quest completion truth as RF-owned state.

### 22.4 RF ↔ Guru
Guru may consume RF public/internal projections.  
RF must not become a nearby aggregation API.

### 22.5 RF ↔ Space
RF may later trigger social campaign posts through Space API.  
RF must not expose social-post ownership in RF contracts.

### 22.6 RF ↔ Points
RF may emit operational events for rewards/economics handling elsewhere.  
RF must not expose balances or points ledger as RF-owned resources.

---

## 23. Non-Goals for v1 API

The v1 OpenAPI outline intentionally excludes:

- cart/checkout/order APIs;
- payment APIs;
- on-chain voucher/token APIs;
- NFT-gated APIs;
- generic graph traversal APIs;
- full-text global search as a platform feature;
- social publishing endpoints;
- real-estate listing APIs;
- event attendance APIs.

---

## 24. Recommended First Implementation Cut

The minimum Step 10-aligned cut should include:

### Public
- `GET /v1/rf/partners`
- `GET /v1/rf/partners/{partnerId}`
- `GET /v1/rf/branches`
- `GET /v1/rf/branches/{branchId}`
- `GET /v1/rf/offers`
- `GET /v1/rf/offers/{offerId}`

### Business
- `POST /v1/rf/business/partners`
- `PATCH /v1/rf/business/partners/{partnerId}`
- `POST /v1/rf/business/partners/{partnerId}/representatives`
- `POST /v1/rf/business/partners/{partnerId}/branches`
- `PATCH /v1/rf/business/partners/{partnerId}/branches/{branchId}`
- `POST /v1/rf/business/partners/{partnerId}/offers`
- `PATCH /v1/rf/business/partners/{partnerId}/offers/{offerId}`

### PRO
- `GET /v1/rf/pro/links`
- `POST /v1/rf/pro/links`
- `POST /v1/rf/pro/links/{proLinkId}/accept`

### Voucher lifecycle
- `POST /v1/rf/offers/{offerId}/claim`
- `GET /v1/rf/me/vouchers`
- `GET /v1/rf/me/vouchers/{voucherId}`
- `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`

### Moderation
- `POST /v1/rf/business/partners/{partnerId}/submit-for-review`
- `POST /v1/rf/business/partners/{partnerId}/branches/{branchId}/submit-for-review`
- `POST /v1/rf/moderation/partners/{partnerId}/verify`
- `POST /v1/rf/moderation/branches/{branchId}/verify`

---

## 25. Final Formula

The shortest correct API formula for RF is:

> `rf-service` exposes a canonical partner/business presence API with explicit branch management, PRO-linked operations, offers, vouchers, and moderation flows.  
> It references other domains through stable IDs, but does not absorb their ownership.
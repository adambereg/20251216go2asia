# Pulse Service — OpenAPI Outline v1

**Project:** Go2Asia  
**Domain:** Pulse / Pulse Asia  
**Document role:** SSOT API outline for `pulse-service`  
**Status:** Draft v1  
**Purpose:** Define the canonical API surface, endpoint groups, DTO direction, lifecycle operations, and boundary rules for `pulse-service`.

---

## 1. Purpose

This document defines the recommended OpenAPI outline for `pulse-service`.

The API must expose Pulse as the canonical event domain of Go2Asia with:

- event management;
- schedule management;
- venue reference management;
- organizer reference management;
- registration / RSVP management;
- attendance management;
- moderation/publication workflows;
- public event read surfaces;
- user-facing registration/attendance surfaces;
- organizer/admin/internal projection surfaces.

This API outline is derived from the Pulse domain model and must preserve Pulse as the system of record for event identity, schedule, registration, and attendance truth.

---

## 2. API Design Principles

## 2.1 Single-domain ownership

`pulse-service` APIs must expose only Pulse-owned concepts:

- event
- event schedule
- event venue reference
- event organizer reference
- event registration
- event attendance
- event media reference
- Pulse moderation/review case

They must not expose Pulse as owner of:

- country/city/district/place identity
- partner/business presence
- offer/voucher lifecycle
- quest progression truth
- listing/property truth
- social post truth
- balances / token / NFT / on-chain logic

---

## 2.2 Canonical URL namespace

All Pulse endpoints must live under:

- `/v1/pulse/*`

Legacy frontend page URLs or feed-specific routes must not be treated as canonical backend ownership APIs.

---

## 2.3 OpenAPI-first rule

All public and internal-facing Pulse DTOs must be generated from OpenAPI.

Frontend, internal adapters, and SDK consumers should rely on generated contracts rather than ad hoc hand-written transport models.

---

## 2.4 Stable event IDs first

Pulse is the source of truth for event identity.

Therefore API contracts should prioritize stable IDs:

- `eventId`
- `scheduleId`
- `registrationId`
- `attendanceId`

Geo/place references remain external Atlas IDs:

- `countryId`
- `cityId`
- `districtId`
- `atlasPlaceId`
- `hostAtlasPlaceId`

Readable slugs may be used for public navigation and querying, but ID-based contracts remain canonical for service integration.

---

## 2.5 Separation of event identity from attendance and registration

Pulse APIs must distinguish clearly between:

- the event itself;
- registration / RSVP intent;
- attendance truth.

An event response must not collapse registration and attendance into a single ambiguous state.

---

## 2.6 Explicit lifecycle operations

Publication, scheduling, cancellation, registration acceptance, attendance verification, and archival flows should be represented through explicit actions or constrained mutations.

Do not hide Pulse lifecycle behind unrestricted PATCH semantics.

---

## 2.7 Read vs write separation

Pulse should distinguish clearly between:

- write endpoints for event and participation mutations;
- read endpoints for public event cards, user registrations, attendances, organizer dashboards, and internal projections.

This keeps Pulse extraction-safe and read-model-ready.

---

## 3. API Surface Overview

Recommended endpoint groups:

1. Health / metadata
2. Public event reads
3. Public place-scoped and city-scoped event reads
4. User registration / RSVP surface
5. User attendance surface
6. Organizer/admin event management
7. Schedule management
8. Registration management
9. Attendance management
10. Moderation / publication management
11. Internal projection and validation endpoints

---

## 4. Auth and Actor Model

## 4.1 Anonymous access

Anonymous access may be allowed for selected public read endpoints such as:

- event list/detail
- city-scoped event list
- place-scoped event list

All write surfaces require authentication.

---

## 4.2 Actor classes

Pulse APIs should be designed around these actor classes:

- `anonymous`
- `user`
- `event_organizer`
- `pulse_moderator`
- `admin`
- `internal_service`

---

## 4.3 Role semantics

### `user`

May:
- read public events
- register / RSVP for eligible events
- inspect own registrations
- inspect own attendance states where exposed

### `event_organizer`

May:
- create/update draft events
- manage schedules and event-facing details
- manage organizer-scoped registrations where policy allows
- verify/check-in attendance where policy allows
- submit events for review

### `pulse_moderator`

May:
- review and publish/reject/flag events
- review moderation cases
- suspend/archive event visibility
- inspect organizer/attendance anomalies where policy allows

### `admin`

May:
- perform all organizer and moderator actions
- override and repair lifecycle state where authorized

### `internal_service`

May:
- read narrow internal event projections
- validate event existence/state
- validate attendance state via controlled internal contracts

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
- `visibility`
- `eventType`
- `countryId`
- `cityId`
- `districtId`
- `atlasPlaceId`
- `hostAtlasPlaceId`
- `startsFrom`
- `startsTo`
- `registrationStatus`
- `attendanceStatus`

Do not overload Pulse with vague platform-wide fuzzy search semantics in v1.

---

## 5.3 Sorting

Allowed sort fields should be explicit.

Examples:
- `startsAt`
- `endsAt`
- `createdAt`
- `updatedAt`
- `publishedAt`

---

## 5.4 Error envelope

Recommended standard error shape:

```json
{
  "error": {
    "code": "PULSE_EVENT_NOT_FOUND",
    "message": "Pulse event was not found",
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

# 6.1 `GET /v1/pulse/health`

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

# 6.2 `GET /v1/pulse/meta`

## Purpose

Return lightweight service metadata / capability hints for admin or internal tooling.

## Auth

Internal/admin only, if exposed.

## Success response

`200 OK`

---

## 7. Public Event Read Surface

---

# 7.1 `GET /v1/pulse/events`

## Purpose

List public Pulse events.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `status` optional
- `publicationStatus` optional
- `visibility` optional
- `eventType` optional
- `countryId` optional
- `cityId` optional
- `districtId` optional
- `atlasPlaceId` optional
- `hostAtlasPlaceId` optional
- `startsFrom` optional
- `startsTo` optional

## Success response

`200 OK`

Returns `PulseEventListResponse`.

---

# 7.2 `GET /v1/pulse/events/{eventId}`

## Purpose

Get public event detail by ID.

## Auth

Optional.

## Success response

`200 OK`

Returns `PulseEventResponse`.

---

# 7.3 `GET /v1/pulse/events/by-slug/{slug}`

## Purpose

Get public event detail by slug.

## Auth

Optional.

## Success response

`200 OK`

Returns `PulseEventResponse`.

---

# 7.4 `GET /v1/pulse/events/by-city/{cityId}`

## Purpose

List public events scoped to a city.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `startsFrom` optional
- `startsTo` optional
- `eventType` optional
- `visibility` optional

## Success response

`200 OK`

Returns `PulseEventListResponse`.

---

# 7.5 `GET /v1/pulse/events/by-place/{placeId}`

## Purpose

List public events scoped to a place.

## Auth

Optional.

## Query params

- `cursor` optional
- `limit` optional
- `startsFrom` optional
- `startsTo` optional
- `eventType` optional

## Success response

`200 OK`

Returns `PulseEventListResponse`.

---

# 7.6 `GET /v1/pulse/events/{eventId}/schedule`

## Purpose

Get public schedule detail for an event.

## Auth

Optional.

## Success response

`200 OK`

Returns `PulseEventScheduleResponse`.

---

## 8. User Registration / RSVP Surface

---

# 8.1 `POST /v1/pulse/events/{eventId}/register`

## Purpose

Create a user registration / RSVP for an event.

## Auth

Required.

## Allowed actors

- `user`

## Request body

`CreatePulseRegistrationRequest`

## Success response

`201 Created`

Returns `PulseEventRegistrationResponse`.

---

# 8.2 `GET /v1/pulse/me/registrations`

## Purpose

List current user registrations.

## Auth

Required.

## Query params

- `cursor` optional
- `limit` optional
- `status` optional
- `eventId` optional
- `startsFrom` optional
- `startsTo` optional

## Success response

`200 OK`

Returns `PulseRegistrationListResponse`.

---

# 8.3 `GET /v1/pulse/me/registrations/{registrationId}`

## Purpose

Get current user registration detail.

## Auth

Required.

## Success response

`200 OK`

Returns `PulseEventRegistrationResponse`.

---

# 8.4 `POST /v1/pulse/me/registrations/{registrationId}/cancel`

## Purpose

Cancel current user registration where policy allows.

## Auth

Required.

## Success response

`200 OK`

Returns updated `PulseEventRegistrationResponse`.

---

## 9. User Attendance Surface

---

# 9.1 `GET /v1/pulse/me/attendances`

## Purpose

List current user attendance records.

## Auth

Required.

## Query params

- `cursor` optional
- `limit` optional
- `status` optional
- `eventId` optional
- `startsFrom` optional
- `startsTo` optional

## Success response

`200 OK`

Returns `PulseAttendanceListResponse`.

---

# 9.2 `GET /v1/pulse/me/attendances/{attendanceId}`

## Purpose

Get current user attendance detail.

## Auth

Required.

## Success response

`200 OK`

Returns `PulseEventAttendanceResponse`.

---

## 10. Organizer/Admin Event Management Surface

---

# 10.1 `POST /v1/pulse/admin/events`

## Purpose

Create an event draft.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Request body

`CreatePulseEventRequest`

## Success response

`201 Created`

Returns `PulseEventResponse`.

---

# 10.2 `PATCH /v1/pulse/admin/events/{eventId}`

## Purpose

Update an event draft or editable fields.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Request body

`UpdatePulseEventRequest`

## Success response

`200 OK`

Returns updated `PulseEventResponse`.

---

# 10.3 `POST /v1/pulse/admin/events/{eventId}/submit-for-review`

## Purpose

Submit an event for moderation/review.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Success response

`200 OK`

Returns `PulseSubmissionResponse`.

---

# 10.4 `POST /v1/pulse/admin/events/{eventId}/publish`

## Purpose

Publish an event if policy allows.

## Auth

Required.

## Allowed actors

- `pulse_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `PulseEventResponse`.

---

# 10.5 `POST /v1/pulse/admin/events/{eventId}/cancel`

## Purpose

Cancel an event.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `pulse_moderator`
- `admin`

## Request body

`CancelPulseEventRequest`

## Success response

`200 OK`

Returns updated `PulseEventResponse`.

---

# 10.6 `POST /v1/pulse/admin/events/{eventId}/complete`

## Purpose

Mark an event as completed.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `pulse_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `PulseEventResponse`.

---

# 10.7 `POST /v1/pulse/admin/events/{eventId}/archive`

## Purpose

Archive an event.

## Auth

Required.

## Allowed actors

- `pulse_moderator`
- `admin`

## Success response

`200 OK`

Returns updated `PulseEventResponse`.

---

## 11. Schedule Management Surface

---

# 11.1 `POST /v1/pulse/admin/events/{eventId}/schedules`

## Purpose

Create a schedule for an event.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Request body

`CreatePulseEventScheduleRequest`

## Success response

`201 Created`

Returns `PulseEventScheduleResponse`.

---

# 11.2 `PATCH /v1/pulse/admin/events/{eventId}/schedules/{scheduleId}`

## Purpose

Update a schedule.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Request body

`UpdatePulseEventScheduleRequest`

## Success response

`200 OK`

Returns updated `PulseEventScheduleResponse`.

---

# 11.3 `POST /v1/pulse/admin/events/{eventId}/schedules/{scheduleId}/cancel`

## Purpose

Cancel a schedule entry.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Success response

`200 OK`

Returns updated `PulseEventScheduleResponse`.

---

## 12. Registration Management Surface

---

# 12.1 `GET /v1/pulse/admin/events/{eventId}/registrations`

## Purpose

List registrations for an event.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `pulse_moderator`
- `admin`

## Query params

- `cursor` optional
- `limit` optional
- `status` optional

## Success response

`200 OK`

Returns `PulseRegistrationListResponse`.

---

# 12.2 `POST /v1/pulse/admin/events/{eventId}/registrations/{registrationId}/approve`

## Purpose

Approve a pending registration where policy requires approval.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Success response

`200 OK`

Returns updated `PulseEventRegistrationResponse`.

---

# 12.3 `POST /v1/pulse/admin/events/{eventId}/registrations/{registrationId}/reject`

## Purpose

Reject a registration.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Request body

`RejectPulseRegistrationRequest`

## Success response

`200 OK`

Returns updated `PulseEventRegistrationResponse`.

---

# 12.4 `POST /v1/pulse/admin/events/{eventId}/registrations/{registrationId}/waitlist`

## Purpose

Move a registration to waitlist.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Success response

`200 OK`

Returns updated `PulseEventRegistrationResponse`.

---

## 13. Attendance Management Surface

---

# 13.1 `GET /v1/pulse/admin/events/{eventId}/attendances`

## Purpose

List attendance records for an event.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `pulse_moderator`
- `admin`

## Query params

- `cursor` optional
- `limit` optional
- `status` optional

## Success response

`200 OK`

Returns `PulseAttendanceListResponse`.

---

# 13.2 `POST /v1/pulse/admin/events/{eventId}/attendances/check-in`

## Purpose

Create or update attendance as checked-in.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`
- `internal_service` where explicitly allowed

## Request body

`CheckInPulseAttendanceRequest`

## Success response

`200 OK`

Returns `PulseEventAttendanceResponse`.

---

# 13.3 `POST /v1/pulse/admin/events/{eventId}/attendances/{attendanceId}/verify`

## Purpose

Verify attendance as attended.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`
- `pulse_moderator`

## Request body

`VerifyPulseAttendanceRequest`

## Success response

`200 OK`

Returns updated `PulseEventAttendanceResponse`.

---

# 13.4 `POST /v1/pulse/admin/events/{eventId}/attendances/{attendanceId}/mark-no-show`

## Purpose

Mark attendance as no-show.

## Auth

Required.

## Allowed actors

- `event_organizer`
- `admin`

## Success response

`200 OK`

Returns updated `PulseEventAttendanceResponse`.

---

# 13.5 `POST /v1/pulse/admin/events/{eventId}/attendances/{attendanceId}/revoke`

## Purpose

Revoke or invalidate attendance where policy allows.

## Auth

Required.

## Allowed actors

- `pulse_moderator`
- `admin`

## Request body

`RevokePulseAttendanceRequest`

## Success response

`200 OK`

Returns updated `PulseEventAttendanceResponse`.

---

## 14. Moderation Surface

---

# 14.1 `GET /v1/pulse/moderation/cases`

## Purpose

List Pulse moderation/review cases.

## Auth

Required.

## Allowed actors

- `pulse_moderator`
- `admin`

## Query params

- `cursor` optional
- `limit` optional
- `status` optional
- `caseType` optional

## Success response

`200 OK`

Returns `PulseModerationCaseListResponse`.

---

# 14.2 `POST /v1/pulse/moderation/cases/{caseId}/resolve`

## Purpose

Resolve a moderation case.

## Auth

Required.

## Allowed actors

- `pulse_moderator`
- `admin`

## Request body

`ResolvePulseModerationCaseRequest`

## Success response

`200 OK`

Returns updated `PulseModerationCaseResponse`.

---

# 14.3 `POST /v1/pulse/moderation/events/{eventId}/reject`

## Purpose

Reject an event submission.

## Auth

Required.

## Allowed actors

- `pulse_moderator`
- `admin`

## Request body

`RejectPulseEventRequest`

## Success response

`200 OK`

Returns updated `PulseEventResponse`.

---

# 14.4 `POST /v1/pulse/moderation/events/{eventId}/flag`

## Purpose

Flag an event.

## Auth

Required.

## Allowed actors

- `pulse_moderator`
- `admin`

## Request body

`FlagPulseEventRequest`

## Success response

`200 OK`

Returns updated `PulseEventResponse` or operation result.

---

## 15. Internal Projection and Validation Surface

These endpoints should remain narrow and stable.

---

# 15.1 `GET /v1/pulse/internal/events/{eventId}/projection`

## Purpose

Return minimal event projection for internal consumers.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `PulseEventProjectionResponse`.

---

# 15.2 `GET /v1/pulse/internal/events/{eventId}/attendance-summary`

## Purpose

Return attendance summary for an event.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `PulseAttendanceSummaryResponse`.

---

# 15.3 `GET /v1/pulse/internal/attendances/{attendanceId}/projection`

## Purpose

Return minimal attendance projection.

## Auth

Internal service only.

## Success response

`200 OK`

Returns `PulseAttendanceProjectionResponse`.

---

# 15.4 `POST /v1/pulse/internal/events/validate`

## Purpose

Validate one or more event references for downstream services.

## Auth

Internal service only.

## Request body

`ValidatePulseReferencesRequest`

## Success response

`200 OK`

Returns `ValidatePulseReferencesResponse`.

---

# 15.5 `POST /v1/pulse/internal/attendance/validate`

## Purpose

Validate attendance state for downstream services such as Quest or RF integrations where policy allows.

## Auth

Internal service only.

## Request body

`ValidatePulseAttendanceRequest`

## Success response

`200 OK`

Returns `ValidatePulseAttendanceResponse`.

---

## 16. Recommended DTO Set

Below is the recommended DTO direction.

---

## 16.1 `CreatePulseEventRequest`

```json
{
  "slug": "phuket-expat-breakfast-march-30",
  "title": "Phuket Expat Breakfast",
  "subtitle": "Утренний нетворкинг для русскоязычного сообщества",
  "summary": "Завтрак и знакомство для экспатов на Пхукете",
  "descriptionFull": "Полное описание события...",
  "eventType": "community",
  "visibility": "public",
  "registrationMode": "open",
  "attendanceMode": "verified",
  "countryId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "atlasPlaceId": "uuid",
  "hostAtlasPlaceId": null
}
```

---

## 16.2 `PulseEventResponse`

```json
{
  "id": "uuid",
  "slug": "phuket-expat-breakfast-march-30",
  "title": "Phuket Expat Breakfast",
  "subtitle": "Утренний нетворкинг для русскоязычного сообщества",
  "summary": "Завтрак и знакомство для экспатов на Пхукете",
  "descriptionFull": "Полное описание события...",
  "eventType": "community",
  "status": "draft",
  "publicationStatus": "hidden",
  "visibility": "public",
  "registrationMode": "open",
  "attendanceMode": "verified",
  "countryId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "atlasPlaceId": "uuid",
  "hostAtlasPlaceId": null,
  "primaryScheduleId": null,
  "createdByUserId": "uuid",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z",
  "publishedAt": null
}
```

---

## 16.3 `CreatePulseEventScheduleRequest`

```json
{
  "startsAt": "2026-03-30T09:00:00+07:00",
  "endsAt": "2026-03-30T11:00:00+07:00",
  "timezone": "Asia/Bangkok",
  "allDay": false
}
```

---

## 16.4 `PulseEventScheduleResponse`

```json
{
  "id": "uuid",
  "eventId": "uuid",
  "startsAt": "2026-03-30T09:00:00+07:00",
  "endsAt": "2026-03-30T11:00:00+07:00",
  "timezone": "Asia/Bangkok",
  "allDay": false,
  "scheduleStatus": "active",
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 16.5 `CreatePulseRegistrationRequest`

```json
{
  "source": "direct"
}
```

---

## 16.6 `PulseEventRegistrationResponse`

```json
{
  "id": "uuid",
  "eventId": "uuid",
  "userId": "uuid",
  "status": "registered",
  "source": "direct",
  "registeredAt": "2026-03-20T10:00:00Z",
  "approvedAt": null,
  "cancelledAt": null,
  "createdAt": "2026-03-20T10:00:00Z",
  "updatedAt": "2026-03-20T10:00:00Z"
}
```

---

## 16.7 `CheckInPulseAttendanceRequest`

```json
{
  "userId": "uuid",
  "registrationId": "uuid"
}
```

---

## 16.8 `VerifyPulseAttendanceRequest`

```json
{
  "status": "attended"
}
```

---

## 16.9 `PulseEventAttendanceResponse`

```json
{
  "id": "uuid",
  "eventId": "uuid",
  "userId": "uuid",
  "registrationId": "uuid",
  "status": "checked_in",
  "attendanceVerifiedByKind": "organizer",
  "attendanceVerifiedById": "uuid",
  "attendedAt": null,
  "checkedInAt": "2026-03-30T09:05:00+07:00",
  "createdAt": "2026-03-30T09:05:00+07:00",
  "updatedAt": "2026-03-30T09:05:00+07:00"
}
```

---

## 16.10 `PulseEventProjectionResponse`

```json
{
  "id": "uuid",
  "slug": "phuket-expat-breakfast-march-30",
  "title": "Phuket Expat Breakfast",
  "status": "scheduled",
  "publicationStatus": "published",
  "visibility": "public",
  "countryId": "uuid",
  "cityId": "uuid",
  "districtId": "uuid",
  "atlasPlaceId": "uuid",
  "hostAtlasPlaceId": null,
  "startsAt": "2026-03-30T09:00:00+07:00",
  "endsAt": "2026-03-30T11:00:00+07:00"
}
```

---

## 16.11 `ValidatePulseReferencesRequest`

```json
{
  "eventId": "uuid"
}
```

---

## 16.12 `ValidatePulseReferencesResponse`

```json
{
  "isValid": true,
  "event": {
    "id": "uuid",
    "slug": "phuket-expat-breakfast-march-30",
    "status": "scheduled",
    "publicationStatus": "published"
  },
  "errors": []
}
```

---

## 16.13 `ValidatePulseAttendanceRequest`

```json
{
  "eventId": "uuid",
  "userId": "uuid"
}
```

---

## 16.14 `ValidatePulseAttendanceResponse`

```json
{
  "isValid": true,
  "attendance": {
    "eventId": "uuid",
    "userId": "uuid",
    "status": "attended"
  },
  "errors": []
}
```

---

## 17. List Response DTO Direction

### `PulseEventListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "slug": "phuket-expat-breakfast-march-30",
      "title": "Phuket Expat Breakfast",
      "eventType": "community",
      "status": "scheduled",
      "publicationStatus": "published",
      "cityId": "uuid",
      "atlasPlaceId": "uuid",
      "startsAt": "2026-03-30T09:00:00+07:00"
    }
  ],
  "nextCursor": "..."
}
```

### `PulseRegistrationListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "eventId": "uuid",
      "userId": "uuid",
      "status": "registered",
      "registeredAt": "2026-03-20T10:00:00Z"
    }
  ],
  "nextCursor": "..."
}
```

### `PulseAttendanceListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "eventId": "uuid",
      "userId": "uuid",
      "status": "attended",
      "attendedAt": "2026-03-30T10:30:00+07:00"
    }
  ],
  "nextCursor": "..."
}
```

---

## 18. Status Enums

Recommended canonical values.

### Event status
- `draft`
- `scheduled`
- `cancelled`
- `completed`
- `archived`

### Publication status
- `hidden`
- `published`

### Visibility
- `public`
- `private`
- `invite_only`

### Registration mode
- `open`
- `approval_required`
- `closed`
- `external_only`

### Attendance mode
- `manual`
- `verified`
- `external`
- `none`

### Schedule status
- `active`
- `rescheduled`
- `cancelled`

### Registration status
- `pending`
- `registered`
- `waitlisted`
- `cancelled`
- `rejected`

### Registration source
- `direct`
- `invite`
- `partner_flow`
- `external_sync`

### Attendance status
- `not_attended`
- `checked_in`
- `attended`
- `no_show`
- `revoked`

### Attendance verified by kind
- `system`
- `organizer`
- `rf_operator`
- `admin`
- `external`

### Organizer kind
- `user`
- `rf_partner`
- `rf_branch`
- `external`
- `system`

### Moderation case status
- `open`
- `in_review`
- `resolved`
- `rejected`

### Moderation case type
- `review`
- `flag`
- `suspension`
- `verification`

---

## 19. Business Rule Error Codes

Recommended examples:

- `PULSE_EVENT_NOT_FOUND`
- `PULSE_SCHEDULE_NOT_FOUND`
- `PULSE_REGISTRATION_NOT_FOUND`
- `PULSE_ATTENDANCE_NOT_FOUND`
- `PULSE_INVALID_EVENT_REFERENCE`
- `PULSE_INVALID_ATLAS_REFERENCE`
- `PULSE_EVENT_NOT_PUBLISHED`
- `PULSE_EVENT_NOT_REGISTRABLE`
- `PULSE_REGISTRATION_ALREADY_EXISTS`
- `PULSE_REGISTRATION_NOT_APPROVABLE`
- `PULSE_ATTENDANCE_INVALID`
- `PULSE_ATTENDANCE_ALREADY_VERIFIED`
- `PULSE_EVENT_CANCELLED`
- `PULSE_EVENT_COMPLETED`
- `PULSE_MODERATION_REQUIRED`
- `PULSE_FORBIDDEN`

---

## 20. Cross-Domain Contract Rules

These rules must be enforced in API design.

### 20.1 Pulse ↔ Atlas
Pulse stores and returns Atlas-linked geo/place IDs only.  
Pulse must not expose place lifecycle fields as if Pulse owned them.

### 20.2 Pulse ↔ RF
Pulse may expose organizer refs or `relatedPulseEventId` integrations indirectly through contracts.  
Pulse must not expose voucher or partner-branch lifecycle as Pulse-owned resources.

### 20.3 Pulse ↔ Quest
Pulse may expose attendance validation through narrow internal contracts.  
Pulse must not expose quest progression truth as Pulse-owned state.

### 20.4 Pulse ↔ Space
Pulse may expose shareable public event objects.  
Pulse must not expose social post ownership in Pulse contracts.

### 20.5 Pulse ↔ Rielt
Pulse may expose event objects linked to real-estate contexts by reference.  
Pulse must not expose listing/inquiry lifecycle as Pulse-owned resources.

### 20.6 Pulse ↔ Guru
Guru may consume Pulse public/internal projections.  
Pulse must not become a recommendation/ranking API.

---

## 21. Non-Goals for v1 API

The v1 OpenAPI outline intentionally excludes:

- place management APIs
- partner/business APIs
- offer/voucher lifecycle APIs
- quest progression APIs
- listing/inquiry APIs
- social post/group APIs
- wallet/token APIs
- platform-wide search APIs
- recommendation/ranking APIs
- generic graph traversal across all domains

---

## 22. Recommended First Implementation Cut

The minimum Pulse-aligned first cut should include:

### Public
- `GET /v1/pulse/events`
- `GET /v1/pulse/events/{eventId}`
- `GET /v1/pulse/events/by-city/{cityId}`
- `GET /v1/pulse/events/by-place/{placeId}`
- `GET /v1/pulse/events/{eventId}/schedule`

### User
- `POST /v1/pulse/events/{eventId}/register`
- `GET /v1/pulse/me/registrations`
- `POST /v1/pulse/me/registrations/{registrationId}/cancel`
- `GET /v1/pulse/me/attendances`

### Organizer/admin
- `POST /v1/pulse/admin/events`
- `PATCH /v1/pulse/admin/events/{eventId}`
- `POST /v1/pulse/admin/events/{eventId}/schedules`
- `PATCH /v1/pulse/admin/events/{eventId}/schedules/{scheduleId}`
- `GET /v1/pulse/admin/events/{eventId}/registrations`
- `POST /v1/pulse/admin/events/{eventId}/registrations/{registrationId}/approve`
- `POST /v1/pulse/admin/events/{eventId}/attendances/check-in`
- `POST /v1/pulse/admin/events/{eventId}/attendances/{attendanceId}/verify`

### Lifecycle/moderation
- `POST /v1/pulse/admin/events/{eventId}/submit-for-review`
- `POST /v1/pulse/admin/events/{eventId}/publish`
- `POST /v1/pulse/admin/events/{eventId}/cancel`
- `POST /v1/pulse/moderation/events/{eventId}/reject`

### Internal
- `GET /v1/pulse/internal/events/{eventId}/projection`
- `POST /v1/pulse/internal/events/validate`
- `POST /v1/pulse/internal/attendance/validate`

---

## 23. Final Formula

The shortest correct API formula for Pulse is:

> `pulse-service` exposes the canonical event API of Go2Asia with explicit management of events, schedules, registration, and attendance, while serving narrow internal projections and validation contracts to neighboring domains.

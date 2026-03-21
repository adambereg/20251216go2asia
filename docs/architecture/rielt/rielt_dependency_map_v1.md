# Rielt Dependency Map v1

**Project:** Go2Asia  
**Module:** Rielt  
**Service focus:** `rielt-service`  
**Document role:** Engineering reference for service dependencies around Rielt  
**Status:** Final for Step 8  
**Source:** `rielt_service_v1_completion.md`

---

# 1. Purpose

This document defines dependency relationships around **rielt-service**, which is the **source of truth for listings and the inquiry domain model** in Go2Asia.

Goals:

- which services **read** Rielt data
- which services **write** through the Rielt API
- which dependencies are **explicitly forbidden**
- integration posture of Rielt in the broader architecture

---

# 2. Upstream Dependencies

| Dependency | Type | Role |
|------------|------|------|
| **api-gateway** | Routing, auth | Routes /v1/rielt/* to rielt-service. Protects owner and inquiry endpoints (Bearer). Returns 501 when RIELT_SERVICE_URL not set. |
| **content-service (Atlas)** | SSOT reference | Canonical values are expected from upstream systems; Rielt does not perform strict runtime validation in Step 8. |
| **media-service** | Reference only | Rielt stores media_id. Media-service owns storage and URLs. Rielt does not call media-service in Step 8. |
| **Auth / gateway** | Identity | Principal (userId, roles) from gateway. Rielt trusts gateway-protected routes. |
| **SDK / frontend** | Client | Consumes Rielt API via gateway. |

---

# 3. Downstream / Consumers

| Consumer | Role |
|----------|------|
| **PWA shell** | Direct consumer. Search, detail, EditorPicks, NewListings. |
| **Guru (current)** | Reads listing data for nearby/discovery composition. Rielt remains listing source; Guru owns aggregation. |
| **Future Guru** | May consume inquiry signals (requester inquiry HTTP wiring already enabled in current runtime). |
| **Future RF** | May tag/link listings to RF offers. Integration structural, not implemented. |
| **Future Space** | May reference or embed listings in posts. Integration structural, not implemented. |

---

# 4. Read vs Write Dependency Map

## 4.1 Who reads Rielt

- **PWA shell:** Public list, detail, nearby. Owner my/listings.
- **Guru (current):** Listing read integration for nearby/discovery composition.
- **Future Guru / RF / Space:** Extended listing references and inquiry-adjacent flows are structural/target, not currently operational.

## 4.2 Who writes to Rielt

- **Owner/agent (via frontend):** Create, patch, archive listings.
- **Requester (via frontend):** Inquiry create/list is an operational runtime contour.
- **Only rielt-service** writes rielt-owned tables. No direct DB writes from other services.

## 4.3 Who is allowed to mutate

- Authenticated users with owner/agent role (via actor_link) for listings.
- Authenticated users as requesters for inquiries.
- Admin role for override (present in current behavior).

## 4.4 Who must not write directly

- Guru must not own listing data or write to rielt tables.
- RF must not mutate listing core directly without explicit contract.
- Space must not own inquiry or listing lifecycle.
- No service may write to rielt tables except rielt-service.

---

# 5. Forbidden Dependency Patterns

| Pattern | Rule |
|---------|------|
| **Guru owns listing data** | Guru must not own rielt_listing. Guru aggregates; Rielt is source of truth. |
| **RF mutates listing core** | RF must not mutate listing directly without explicit contract. |
| **Space owns inquiry/listing** | Space must not own inquiry or listing lifecycle. |
| **Rielt owns Atlas geo** | Rielt must not own or create Atlas geo records. |
| **Rielt owns media binaries** | Rielt must not store or serve media. Relation only. |
| **Direct DB writes** | No service other than rielt-service may write to rielt_* tables. |
| **Rielt calls media-service** | In Step 8, Rielt does not call media-service. |
| **Rielt validates geo** | In Step 8, no runtime validation against Atlas. |

---

# 6. Integration Posture

**What kind of service Rielt is:** Practical domain service. Source of truth for listings and inquiry semantics.

**Supplier for future aggregation:** Guru will consume Rielt as a data source. Rielt does not aggregate; it supplies.

**Bounded scope:** Listing-first, inquiry one-shot, no booking/chat/CRM. Keeps Rielt stable and extractable.

---

*This document describes the Step 8 dependency map. No extensions, no new features.*

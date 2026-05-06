# PRO Owner Accept Flow Gap v1

Status: gap note for RF x PRO Stage 5.1b, read-side resolved in Stage 5.1c.  
Date: 2026-05-05.

## 1. Finding

The merchant owner accept flow cannot be completed safely in UI with the current RF read API.

`acceptProLink(proLinkId)` already exists and validates partner ownership, but the merchant owner cannot list pending PRO link requests for owned partners. Without that list, the UI cannot discover the relevant `proLinkId`.

## 2. Existing Backend Capability

Existing lifecycle capability:

- `POST /v1/rf/pro/links` creates a pending `rf_pro_link` for the current user as PRO.
- `GET /v1/rf/pro/links` lists links for the current user as PRO.
- `POST /v1/rf/pro/links/{proLinkId}/accept` accepts a pending link if the current user owns the linked partner.

The accept mutation is owner-gated in backend runtime, so the write-side check is present.

## 3. Missing Read Surface

The missing piece is owner-scoped read access for incoming PRO requests.

Current `listProLinks` reads links where current user equals `pro_user_id`. A merchant owner needs to read links where current user owns `rf_partner.owner_user_id` for the linked `partner_id`.

## 4. Why UI Cannot Complete Flow Safely

The UI must not invent pending links, use mock data or ask the owner to paste an internal `proLinkId`.

A safe owner accept UI needs:

- the pending request id;
- `proUserId`;
- `partnerId`;
- partner display context;
- `roleScope`;
- `status`;
- `createdAt`;
- `updatedAt`.

Current frontend can display a placeholder and explain the gap, but cannot render a real incoming request list without a backend read endpoint.

## 5. Recommended Backend Endpoint

Recommended endpoint options:

- `GET /v1/rf/business/pro-links`
- `GET /v1/rf/business/partners/{partnerId}/pro-links`

Minimum response fields should match `RfProLink`:

- `id`;
- `partnerId`;
- `proUserId`;
- `status`;
- `roleScope`;
- `createdAt`;
- `updatedAt`.

Backend should only return rows for partners where `rf_partner.owner_user_id` equals the current principal user id. After that, the existing `acceptProLink(proLinkId)` can power the `Принять запрос` action.

No schema, migration, OpenAPI, SDK generation or backend implementation was added in Stage 5.1b.

## 6. Resolution

Stage 5.1c adds the owner-scoped read endpoint:

- `GET /v1/rf/business/partners/{partnerId}/pro-links`

The endpoint closes the read-side gap:

- merchant owner can read incoming and historical PRO links for an owned active partner;
- non-owners receive `403`;
- missing or inactive partners return `404`;
- response uses `RfProLinkListResponse`;
- `acceptProLink(proLinkId)` remains the existing owner-gated mutation.

The endpoint is read-only. It does not add claim attribution, redeem attribution, rewards, commissions, payouts, Points, G2A or NFT/Totem logic.

Stage 5.1d resolves the flow end-to-end on the UI accept side:

- Merchant cabinet reads `listPartnerProLinks(activePartner.id)`;
- pending links expose `Принять запрос`;
- accept uses existing `acceptProLink(proLinkId)`;
- active and ended links remain read-only.

Remaining future work:

- reject/end link lifecycle controls;
- richer PRO identity display beyond raw `proUserId`;
- linked partner offers visibility baseline.

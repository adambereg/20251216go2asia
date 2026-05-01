# RF Listing-Scoped Voucher Claim v1

## Purpose

Design Stage 5 for RF/Rielt voucher flow: move from offer-level claim status to listing-scoped claim where needed.

Target:

- partner-wide RF offers can remain offer-level;
- Rielt listing voucher claims can be scoped to `listingId + offerId + userId`;
- RF remains owner of voucher claim/redeem/status;
- Rielt remains discovery/handoff and does not perform claim.

This is a design pass only. It does not change code, DB schema, OpenAPI, frontend, backend, staging data, or runtime behavior.

## Problem Observed On Staging

The staging Rielt voucher flow worked end to end:

Rielt listing -> `/rf/rielt/listings/[listingId]/vouchers` -> mapped offers -> RF claim -> `/rf/my-vouchers`.

Observed issue:

- Karon and Laguna were mapped to the same `rf_offer_id` values.
- User claimed a premium offer on Karon.
- The same offer appeared as `Получен` on Laguna.
- `/rf/my-vouchers` correctly showed one server voucher for that offer.

Root cause:

- current claim uniqueness is offer-level: `offerId + userId`;
- `rf_voucher` does not store listing context;
- frontend marks a listing offer as claimed when `voucher.offerId === offer.id`;
- therefore one claimed offer appears claimed on every listing where the same offer is mapped.

Quick staging workaround:

- Karon retained two existing offers;
- Laguna was moved to a unique offer not used by Karon;
- false cross-listing `Получен` state disappeared.

The workaround is valid for staging but not a product-ready model.

## Current Offer-Level Model

Current RF claim endpoint:

`POST /v1/rf/offers/{offerId}/claim`

Current `rf_voucher` shape:

- `id`;
- `offer_id`;
- `partner_id`;
- `issued_to_user_id`;
- `status`;
- `code`;
- `claimed_at`;
- `redeemed_at`;
- timestamps.

Current uniqueness:

- active voucher uniqueness is `(offer_id, issued_to_user_id)` for statuses `claimed` / `redeemed`.

Current idempotency:

- `rf_claim_idempotency` is keyed by `(operation, actor_user_id, idempotency_key)`;
- operation is currently `voucher_claim`;
- idempotency row stores `voucher_id`;
- listing context is not part of idempotency.

Current frontend status:

- listing voucher page calls `GET /v1/rf/me/vouchers`;
- a card is marked claimed when there is a voucher with the same `offerId`;
- no `listingId` comparison is possible because vouchers do not contain listing context.

This model is correct for partner-wide offers, but not enough for property-specific Rielt benefits.

## Target Listing-Scoped Model

RF should support two claim scopes:

- `partner`: existing offer-level claim, unique by `offerId + userId`;
- `listing`: Rielt listing-specific claim, unique by `listingId + offerId + userId`.

Concept:

- RF offer can be a reusable commercial template or partner offer.
- `rielt_listing_rf_offer` says that an offer applies to a specific Rielt listing.
- Claim from `/rf/rielt/listings/[listingId]/vouchers` creates or returns a voucher in that listing context.
- Already-claimed status on a listing page is computed by `listingId + offerId + userId`.

Important product rule:

- The same `rf_offer_id` may be claimable once per listing if `scope = listing`.
- The same `rf_offer_id` remains claimable only once per user if `scope = partner`.

## Domain Model Options

### Option A: Add Listing Context To `rf_voucher`

Add fields to `rf_voucher`:

- `claim_scope`: `partner` | `listing`;
- `rielt_listing_id`: nullable string;
- optional `rielt_listing_title_snapshot`;
- optional `claim_source`: e.g. `rf`, `rielt`;
- optional `source_context` JSON or typed columns later.

Uniqueness:

- partner scope: unique `(offer_id, issued_to_user_id)` where `claim_scope = 'partner'` and status in `claimed/redeemed`;
- listing scope: unique `(rielt_listing_id, offer_id, issued_to_user_id)` where `claim_scope = 'listing'` and status in `claimed/redeemed`;
- `rielt_listing_id` required when `claim_scope = 'listing'`;
- `rielt_listing_id` null when `claim_scope = 'partner'`.

Pros:

- simplest read model for `/rf/me/vouchers`;
- voucher carries its own listing context;
- frontend can compare `voucher.listingContext.listingId` directly;
- DB can enforce uniqueness without cross-table joins;
- good for audit and post-claim UX.

Cons:

- changes `rf_voucher` table and indexes;
- existing vouchers need backward-compatible default `claim_scope = 'partner'`;
- RF voucher table gains a soft reference to a Rielt listing id;
- must carefully replace current partial unique index.

Impact:

- existing partner-wide flow remains intact with `claim_scope = 'partner'`;
- listing-specific flow becomes enforceable by DB;
- `/rf/my-vouchers` can show both voucher types from one endpoint.

### Option B: Add `rf_voucher_context`

Create separate context table:

- `voucher_id`;
- `source`: `rielt`;
- `listing_id`;
- `listing_title_snapshot`;
- timestamps.

Pros:

- keeps `rf_voucher` core table mostly unchanged;
- clean extension pattern for future sources beyond Rielt;
- context can grow without changing core voucher fields.

Cons:

- uniqueness by `listingId + offerId + userId` cannot be enforced cleanly unless context duplicates `offer_id` and `issued_to_user_id`, or enforcement is application-level;
- queries for `/rf/me/vouchers` require joins;
- the existing `(offer_id, issued_to_user_id)` unique index still blocks multiple vouchers for same offer across different listings unless changed anyway.

Impact:

- useful as an annotation table;
- insufficient alone for listing-scoped uniqueness if the same offer can be claimed per listing.

### Option C: Add `rf_rielt_listing_voucher_claim`

Create RF-owned association:

- `listing_id`;
- `offer_id`;
- `issued_to_user_id`;
- `voucher_id`;
- `status` or lifecycle mirror;
- `listing_title_snapshot`;
- timestamps.

Pros:

- explicit RF/Rielt claim context table;
- can enforce unique `(listing_id, offer_id, issued_to_user_id)`;
- avoids putting Rielt-specific columns into core voucher table.

Cons:

- if `rf_voucher` still has unique `(offer_id, issued_to_user_id)`, it blocks multiple listing-scoped vouchers for the same offer;
- duplicating status risks drift from `rf_voucher.status`;
- lifecycle spans two tables;
- `/rf/my-vouchers` still needs joins and reconciliation.

Impact:

- good if product wants claim-context records separate from voucher lifecycle;
- still requires changing voucher uniqueness or representing one voucher with many listing claims, which weakens the "voucher for object X" model.

### Option D: Separate Listing Voucher Entity

Create a new entity such as `rf_rielt_listing_voucher`.

Pros:

- clean separation of Rielt-specific vouchers;
- no need to change partner-wide voucher behavior.

Cons:

- creates a second voucher lifecycle;
- risks becoming "a second RF";
- complicates wallet, redeem, status, reporting, and future support.

Impact:

- not recommended unless listing-specific vouchers become a distinct product with separate lifecycle semantics.

## Recommended Model

Recommended: **Option A with explicit `claim_scope` on `rf_voucher`**.

Why:

- RF remains single owner of voucher lifecycle.
- A voucher can carry listing context without creating a parallel voucher system.
- DB can enforce correct uniqueness for both scopes.
- `/rf/my-vouchers` can use one source of truth.
- Frontend status logic becomes straightforward.

Recommended conceptual fields:

- `claim_scope`: `partner` | `listing`, default `partner`;
- `rielt_listing_id`: nullable;
- `rielt_listing_title_snapshot`: nullable;
- `claim_source`: nullable or enum, e.g. `rf_catalog` | `rielt_listing`;

Recommended invariants:

- `claim_scope = 'partner'` => `rielt_listing_id IS NULL`;
- `claim_scope = 'listing'` => `rielt_listing_id IS NOT NULL`;
- `claim_scope = 'listing'` requires active mapping `rielt_listing_rf_offer(listing_id, rf_offer_id)`;
- `partner_id` in voucher must match offer partner and mapping partner.

Existing vouchers:

- backfill or default as `claim_scope = 'partner'`;
- no listing context is inferred for existing vouchers;
- no localStorage state becomes server truth.

## API Design

### Recommended Endpoint

Use a dedicated listing-scoped claim route:

`POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`

Headers:

- `X-Gateway-Auth`;
- `Idempotency-Key`.

Body:

- optional, preferably empty for MVP;
- optional future fields may include `returnUrl` or UI source metadata, but these must not be entitlement truth.

Why this route:

- route lives in RF;
- route explicitly carries Rielt listing context;
- claim remains RF-owned;
- easier to validate mapping and reason about bounded context than adding `listingId` to generic `/offers/{offerId}/claim`.

### Alternative Endpoint

`POST /v1/rf/offers/{offerId}/claim` with body:

```json
{
  "source": "rielt",
  "listingId": "rielt_phuket_karon_002"
}
```

Pros:

- one claim endpoint.

Cons:

- generic claim route becomes overloaded;
- easier for clients to omit context accidentally;
- harder to apply route-level policy and observability by context.

Recommendation: keep old endpoint for partner-wide claims and add the listing-scoped endpoint for Rielt listing pages.

## Uniqueness And Idempotency

### Uniqueness

Partner-wide claim:

- endpoint: `POST /v1/rf/offers/{offerId}/claim`;
- scope: `partner`;
- unique by `(offerId, userId)`.

Listing-scoped claim:

- endpoint: `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`;
- scope: `listing`;
- unique by `(listingId, offerId, userId)`.

Allowed:

- the same user can claim the same `offerId` for different `listingId` values if scope is `listing`;
- the same user cannot claim the same `offerId` twice for the same `listingId`;
- partner-wide and listing-scoped claims are separate scopes.

Open decision:

- whether a partner-wide claim should block a listing-scoped claim for the same `offerId`, or whether scopes are fully independent.

Recommended default:

- scopes are independent unless product marks an offer as partner-wide only.

### Idempotency

Current issue:

- `rf_claim_idempotency` replays by `(operation, actorUserId, idempotencyKey)`;
- it does not store request fingerprint;
- the same key used for another offer/listing could replay the wrong voucher unless the server validates context.

Recommended Stage 5 idempotency model:

- add request fingerprint to idempotency storage:
  - `claim_scope`;
  - `offer_id`;
  - `rielt_listing_id` nullable;
  - optional `request_fingerprint` hash;
- on replay, compare current request scope/offer/listing to stored fingerprint;
- if mismatch, return `409 RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`;
- do not return a voucher for a different listing or offer.

Alternative:

- introduce a separate operation enum: `voucher_claim_listing`;
- still store `offer_id` and `listing_id` to validate replay.

Recommendation:

- add request fingerprint columns or equivalent typed columns rather than relying on client discipline.

## Backend Validation

For listing-scoped claim:

1. User is authenticated.
2. `Idempotency-Key` is present and valid length.
3. Rielt listing exists as a soft referenced published listing, if RF can query it safely.
4. Active mapping exists:
   - `rielt_listing_rf_offer.listing_id = listingId`;
   - `rielt_listing_rf_offer.rf_offer_id = offerId`;
   - `status = active`.
5. Offer exists:
   - `rf_offer.id = offerId`;
   - `status = active`;
   - `visibility = public` or claimable by current user in later eligibility work.
6. Partner exists:
   - `rf_partner.id = mapping.rf_partner_id`;
   - partner status is active.
7. Mapping partner matches offer partner:
   - `mapping.rf_partner_id = rf_offer.partner_id`.
8. If the Rielt listing has `rf_partner_id`, it matches mapping partner.
9. Existing listing-scoped voucher is returned if `(listingId, offerId, userId)` already exists.

Backend must not:

- trust frontend `listingTitle` as truth;
- infer listing context from `return_url`;
- create Rielt data;
- mutate mapping during claim.

## Response Shape

Conceptual claim response:

```json
{
  "voucher": {
    "id": "rf_voucher_...",
    "offerId": "rf_offer_...",
    "partnerId": "rf_partner_...",
    "status": "claimed",
    "code": "RF-123456",
    "claimedAt": "2026-05-01T00:00:00.000Z",
    "redeemedAt": null,
    "listingContext": {
      "source": "rielt",
      "listingId": "rielt_phuket_karon_002",
      "listingTitle": "Семейные апартаменты в Кароне"
    }
  },
  "idempotentReplay": false
}
```

For partner-wide vouchers:

- `listingContext` is `null` or omitted;
- `claimScope = partner`.

For listing-scoped vouchers:

- `listingContext` is present;
- `claimScope = listing`.

## Frontend Behavior

Listing voucher page:

- fetch listing offers through `GET /v1/rf/rielt/listings/{listingId}/offers`;
- fetch user vouchers through `GET /v1/rf/me/vouchers`;
- mark offer as received only when:
  - `voucher.offerId === offer.id`;
  - `voucher.listingContext?.listingId === currentListingId`;
  - voucher status is `claimed` or `redeemed`.

Claim action:

- call `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`;
- keep post-claim actions:
  - return to listing;
  - my vouchers;
  - partner offers.

No frontend workaround:

- do not use localStorage to store server claim truth;
- do not infer listing claim from same `offerId` alone.

## My Vouchers Behavior

`/rf/my-vouchers` should display server RF vouchers from `GET /v1/rf/me/vouchers`.

For listing-scoped vouchers show:

- `Ваучер для объекта`;
- listing title;
- offer title;
- partner;
- status;
- code;
- action: `К объекту` or `Ваучеры этого объекта`;
- action: `Предложения партнёра`.

For partner-wide vouchers show:

- `Ваучер партнёра`;
- offer title;
- partner;
- status;
- code;
- action: `Предложения партнёра`.

Local planning list:

- remains separate as "Сохранённые предложения";
- must not be used as server voucher truth.

## Backward Compatibility

Existing vouchers:

- continue to work;
- default to `claimScope = partner`;
- no listing context is inferred retroactively.

Existing endpoint:

- `POST /v1/rf/offers/{offerId}/claim` remains for partner-wide claims;
- `/rf/vouchers?partner=...` remains partner-level route;
- `/rf/my-vouchers` must render old vouchers without listing context.

Existing frontend:

- if `listingContext` is missing, listing page should not mark listing-specific offers as claimed by offerId alone;
- partner-wide pages may continue offer-level status if needed.

Existing mapping:

- `rielt_listing_rf_offer` remains RF-owned applicability mapping.

## Migration Plan

### Stage 5a: Docs / OpenAPI / Schema Design

- Finalize claim scope model.
- Decide whether `listingContext` lives directly on `rf_voucher`.
- Define response shapes and idempotency mismatch error.
- Update architecture docs and OpenAPI draft.

### Stage 5b: DB Migration

- Add `claim_scope` and nullable listing context columns to `rf_voucher`, or chosen alternative.
- Backfill existing vouchers to `claim_scope = partner`.
- Replace current unique index with scoped unique indexes.
- Extend idempotency storage with request fingerprint columns.

### Stage 5c: Backend Listing-Scoped Claim Endpoint

- Add `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`.
- Validate active mapping and offer/partner consistency.
- Create listing-scoped voucher.
- Return listing context in claim response.
- Preserve existing partner-wide claim endpoint.

### Stage 5d: SDK Update

- Add `claimRfRieltListingOffer(listingId, offerId)`.
- Extend `RfVoucherDto` with `claimScope` and optional `listingContext`.
- Preserve `claimRfOffer(offerId)` for partner-wide claims.

### Stage 5e: Frontend Update

- Listing voucher page calls listing-scoped claim endpoint.
- Listing page status compares `offerId + listingId`.
- `/rf/my-vouchers` displays listing-scoped and partner-wide vouchers distinctly.

Current implementation note:

- The Rielt listing voucher page calls the RF listing-scoped claim helper for `listingId + offerId`.
- Listing card hydration uses server vouchers only and marks a card as claimed only when `claimScope = listing`, `offerId` matches, and `listingContext.listingId` matches the current listing.
- Partner-scope vouchers no longer mark listing-specific voucher cards as claimed.
- `/rf/my-vouchers` displays listing context when present and links back to the listing voucher page.
- Wallet enrichment is currently read-only: `GET /v1/rf/me/vouchers` joins existing RF offer, RF partner, and listing-offer mapping rows to return optional human-readable `offer`, `partner`, `validityLabel`, and `usage` fields.
- The enrichment does not require a DB migration and does not create snapshot guarantees yet; production hardening may later add voucher snapshot fields for immutable display copy.

### Stage 5f: Staging Verification

- Map same offer to two listings intentionally.
- Claim offer on Karon.
- Verify Laguna does not show it claimed until Laguna-specific claim.
- Verify `/rf/my-vouchers` shows two distinct listing-scoped vouchers if both are claimed.
- Verify partner-wide claim remains one voucher per offer per user.

## Guardrails

- Rielt does not perform claim.
- Rielt does not store voucher status.
- RF remains owner of offers, vouchers, claim, redeem, and status.
- Mapping is RF-owned applicability; it is not a second voucher lifecycle.
- No redeem changes in Stage 5.
- No booking.
- No chat.
- No Points integration.
- No Connect changes.
- No localStorage as voucher truth.
- Existing partner-wide claim flow must not break.

## Open Questions

- Should `claim_scope` be stored as enum or string?
- Should `listing_title_snapshot` be stored on voucher, resolved at read time, or both?
- Should partner-wide and listing-scoped claims for the same offer block each other?
- Should mapping include `claim_scope = partner | listing`, or should scope be inferred from endpoint?
- Should hidden mapping make already claimed listing vouchers still visible in wallet?
- Should cancelled listing-scoped voucher allow re-claim for the same listing/offer?
- How should premium eligibility be enforced later, if premium vouchers require user tier?
- Should idempotency mismatch return `409` or a more specific `400`?
- Should `rf_claim_idempotency` keep typed fingerprint columns or a single hash?
- How should future redeem validate listing context, if at all?

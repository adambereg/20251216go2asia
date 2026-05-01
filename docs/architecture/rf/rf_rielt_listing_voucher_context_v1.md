# RF/Rielt Listing Voucher Context v1

## Purpose

Design the target contract for a listing-specific voucher flow between Rielt and Russian Friendly (RF):

Rielt listing -> RF listing voucher context -> user selects an offer -> RF claim -> post-claim coordination.

This document started as a design-only contract. Stage 2-3 implementation notes below record the first read-only implementation slice. The contract still does not include claim/redeem behavior.

## Current State

Current runtime state:

- Rielt-001: voucher-first UI baseline is implemented.
- RF-004: public Rielt contract exposes optional `rfPartnerId` / `rfOfferId`.
- Rielt-002: strong voucher UI is gated by real runtime `rfPartnerId`; seed overlay is not treated as RF truth.
- Staging can map a Rielt listing to an RF partner through `rielt_listing.rf_partner_id`.

Current user flow:

- Rielt listing page has a voucher-oriented CTA only when `rfPartnerId` exists.
- CTA routes to `/rf/vouchers?partner=<rfPartnerId>`.
- RF shows the partner-level offers catalog.

Current limitation:

- There is no listing-specific offer set.
- The user cannot tell which offers apply to the exact Rielt listing.
- A partner-level offer can be valid for the partner business but not necessarily for a specific property.

## Target Model

The target product flow is:

1. User opens a Rielt listing.
2. User clicks "Получить ваучер".
3. User lands inside RF on a page scoped to that Rielt listing.
4. User sees "Ваучеры для этого объекта".
5. User chooses one relevant RF offer.
6. RF performs the claim.
7. RF shows confirmation and post-claim coordination options.

The target route is:

`/rf/rielt/listings/[listingId]/vouchers`

This route makes the context explicit: the user is in RF, but the voucher set is scoped to a Rielt listing.

## Domain Model

### Core Entities

- `RieltListing`: listing/discovery entity owned by Rielt.
- `RfPartner`: business/partner identity owned by RF.
- `RfOffer`: claimable/commercial offer owned by RF.
- `RfVoucher`: result of a user claim; lifecycle owned by RF.
- `RieltListingRfOfferMapping`: association that says an RF offer applies to a Rielt listing.

### Proposed Mapping Shape

Conceptual table or association:

`rielt_listing_rf_offer`

Fields:

- `listing_id`: Rielt listing id.
- `rf_partner_id`: RF partner id.
- `rf_offer_id`: RF offer id.
- `status`: `active` | `hidden` | `archived`.
- `offer_kind`: `basic` | `premium`.
- `priority`: integer ordering for UI.
- `applicability_note`: optional human-readable condition, for example "long stay only" or "valid for monthly rent".
- `created_at`, `updated_at`: operational metadata.

Required invariants:

- `rf_offer_id` must belong to `rf_partner_id`.
- `listing_id` must exist in Rielt.
- `rf_partner_id` should match the listing's current RF partner context.
- `status = active` means the offer can appear in the listing voucher page.
- Mapping does not create, claim, redeem, or cancel vouchers.

### Alternative Ownership Options

Option A: Rielt-side mapping table

- Pros: close to listing ownership; easy for Rielt editors/admin tooling to manage property-specific eligibility.
- Cons: RF must read or be given this mapping to render RF-owned offer surfaces; risk of Rielt appearing to own offer selection.

Option B: RF-side association table

- Pros: RF owns offer visibility and voucher context; better alignment with claim/redeem ownership.
- Cons: RF needs a read reference to Rielt listing ids and a listing summary read model.

Preferred direction:

- RF-side association or RF-owned read model, with Rielt listing id as a soft external reference.
- Rielt may store `rfPartnerId` as handoff truth.
- Listing-specific offer eligibility should be governed by RF because it controls offers and claimability.

## Ownership

Rielt owns:

- listing title, geo, media, price, property metadata;
- listing discovery and search;
- handoff to RF using `listingId`, `rfPartnerId`, and return context.

Rielt does not own:

- RF partner lifecycle;
- RF offer lifecycle;
- voucher claim/redeem/status;
- user voucher wallet;
- booking;
- chat.

RF owns:

- partner identity;
- offers;
- listing-offer applicability for RF voucher surfaces;
- voucher claim;
- voucher redeem;
- voucher status truth;
- confirmation state after claim.

Integration owns:

- read-only context transfer from Rielt to RF;
- mapping contract between listing ids and RF offers;
- route semantics and return URL semantics.

## Route Contract

Canonical route:

`/rf/rielt/listings/[listingId]/vouchers`

Route meaning:

- The route lives in RF.
- The route accepts a Rielt listing id as context.
- The page displays only offers mapped to that listing.
- It is not a Rielt page and not a booking page.

Fallback routes:

- `/rf/vouchers?partner=<rfPartnerId>` remains the partner-level fallback.
- `/rf/vouchers` remains the global fallback.

Why not only `?listing=`:

- `/rf/rielt/listings/[listingId]/vouchers` is easier to reason about as a bounded context handoff.
- The path clearly says RF is rendering a Rielt listing voucher context.
- Query params can still be used for optional state like `return_url`, tracking, or preselected offer.

## Read API (Conceptual)

No OpenAPI changes are made in this design pass.

Future conceptual endpoint:

`GET /v1/rf/rielt/listings/{listingId}/offers`

Response shape:

```json
{
  "listing": {
    "id": "rielt_phuket_karon_002",
    "title": "Семейные апартаменты в Кароне",
    "source": "rielt"
  },
  "partner": {
    "id": "rf_partner_...",
    "displayName": "Partner name"
  },
  "offers": [
    {
      "id": "rf_offer_...",
      "title": "Скидка на проживание",
      "description": "5% discount for this property",
      "type": "basic",
      "benefit": "5% discount",
      "availability": "available",
      "priority": 10,
      "applicabilityNote": "For this Rielt listing"
    },
    {
      "id": "rf_offer_...",
      "title": "Premium voucher",
      "description": "Personal support and VIP terms",
      "type": "premium",
      "benefit": "VIP support",
      "availability": "available",
      "priority": 100
    }
  ]
}
```

Read API rules:

- It is read-only.
- It must not claim a voucher.
- It must not create Rielt data.
- It must not mutate RF offer state.
- It may include enough listing summary for the RF page header.

## UI Contract

Page title:

`Ваучеры для этого объекта`

Page sections:

- Listing header: title, location summary, return link to Rielt listing.
- Partner context: RF partner name and trust markers.
- Offer list: basic and premium offers that apply to the listing.
- Guardrail copy: "Получение ваучера происходит в RF. Rielt не подтверждает бронирование."

Offer card:

- title;
- benefit;
- type: `basic` or `premium`;
- short description;
- applicability note;
- CTA: `Получить ваучер`.

Empty state:

- If the listing has `rfPartnerId` but no mapped offers, show a neutral message:
  - "Для этого объекта пока нет активных RF-ваучеров."
  - Offer a fallback to `/rf/vouchers?partner=<rfPartnerId>`.

## Claim Boundary

Claim happens only in RF.

The listing voucher page may show a `Получить ваучер` button, but that button calls an RF claim flow for a specific `rfOfferId`.

Rielt must not:

- call RF claim APIs;
- create `RfVoucher`;
- store voucher status;
- redeem vouchers;
- infer `rfOfferId` from an existing voucher id.

After successful claim, RF displays:

`Вы получили выгоду: <benefit> для объекта "<listing title>". Свяжитесь с представителем объекта и покажите ваучер.`

Post-claim actions may include:

- `Связаться по объекту`;
- `Открыть контакт`;
- `Отправить сообщение`;
- `Вернуться к объекту`;
- `Открыть мои ваучеры`.

These actions are coordination surfaces, not booking confirmation and not chat ownership by Rielt.

## Handoff Contract

Rielt -> RF handoff should include:

- `listingId`;
- `rfPartnerId`;
- optional `rfOfferId` only when a preselected explicit offer exists;
- `return_url`;
- optional source context, for example `source=rielt`;
- optional `urgency_mode`, if later adopted.

Rules:

- `listingId` scopes the RF page.
- `rfPartnerId` validates the partner context.
- `rfOfferId` must be explicit; it must not be derived from `rfVoucher.id`.
- `return_url` must point back to the listing or a safe Rielt route.

## Guardrails

- Rielt does not perform claim/redeem.
- Rielt does not store voucher lifecycle state.
- Rielt does not become a booking engine.
- Rielt does not become chat.
- RF remains the only source of truth for offers, vouchers, claim, redeem, and status.
- Listing-offer mapping must not become a second RF offer system.
- Seed overlay must not be treated as RF truth.
- Local/demo voucher state must not look like live voucher state.
- `rfOfferId` must not be inferred from any post-claim voucher id.
- `rfPartnerId` is partner context, not proof that all partner offers apply to a listing.

## Migration Path

### Stage 1: Partner-Level Flow

Current state:

- Rielt listing has optional `rfPartnerId`.
- Strong Rielt voucher UI is gated by runtime `rfPartnerId`.
- CTA routes to `/rf/vouchers?partner=<rfPartnerId>`.

Use as fallback only.

### Stage 2: Listing -> Offers Mapping

Introduce mapping from Rielt listing to RF offers.

Expected output:

- A listing can have multiple basic offers.
- A listing can have premium offers.
- Active/hidden state controls visibility.
- Priority controls UI order.

Current implementation note:

- RF owns `rielt_listing_rf_offer`.
- The table stores soft Rielt `listing_id` plus RF-owned `rf_partner_id` / `rf_offer_id`.
- There is no FK to Rielt.
- RF partner/offer FKs are allowed because RF owns those entities.
- No claim implementation in this stage.

### Stage 3: Listing-Specific Voucher Page

Introduce RF route:

`/rf/rielt/listings/[listingId]/vouchers`

Expected output:

- The page displays only offers mapped to the listing.
- The page explains that claim happens in RF.
- Empty state falls back to partner-level catalog.

Current implementation note:

- RF exposes read-only `GET /v1/rf/rielt/listings/{listingId}/offers`.
- Frontend route `/rf/rielt/listings/[listingId]/vouchers` renders mapped offers.
- Stage 3 read-only voucher cards show voucher type, benefit, conditions, and next-step explanation.
- Stage 3 introduced disabled CTA as a placeholder before claim integration.
- No booking, chat, or redeem semantics are introduced by the listing voucher cards.
- If mapping is empty, the page links to `/rf/vouchers?partner=<rfPartnerId>`.

## Implementation Notes

Stage 2-3 read-only slice:

- Mapping is RF-owned in `rielt_listing_rf_offer`.
- Mapping does not create RF offers; it only associates existing RF offers with a Rielt listing id.
- Mapping does not reference Rielt with a database FK; `listing_id` is a soft external reference.
- Listing summary is read only for page context.
- RF filters mapped offers to active/public offers from active partners.
- Rielt CTA routes to `/rf/rielt/listings/[listingId]/vouchers` when `rfPartnerId` exists.
- Partner-level `/rf/vouchers?partner=<rfPartnerId>` remains fallback.

Fallback contract:

- If listing context cannot be loaded but a partner query is present, RF page shows a partner-level fallback action.
- If mapping exists but no active/public offers are available, RF page shows empty state and partner-level fallback.
- The fallback must not imply that all partner offers apply to the listing.

Still out of scope for Stage 2-3:

- claim;
- redeem;
- voucher status;
- booking;
- chat;
- Points / Connect side effects;
- production-grade cross-service validation.

### Stage 4: Claim Flow

Add RF claim from the listing voucher page.

Expected output:

- User selects one offer.
- RF creates voucher claim.
- RF shows confirmation and post-claim coordination actions.

Current implementation note:

- Listing voucher page now calls RF-owned listing-scoped claim through `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`.
- Claim remains in RF; Rielt does not perform claim and does not store voucher status.
- Listing voucher page hydrates already claimed offers from `GET /v1/rf/me/vouchers` and compares `claimScope + listingContext.listingId + offerId`.
- Partner-scope vouchers no longer mark listing-specific cards as claimed.
- `/rf/my-vouchers` separates server RF vouchers from local planning/saved offers and displays listing context where present.
- `/rf/my-vouchers` now uses the enriched server wallet response for human-readable offer, partner, validity, and usage copy. This is read-only join-based enrichment with no DB migration or snapshot guarantee.
- Success state displays listing context and post-claim actions: return to listing, my vouchers, partner offers.
- No booking, chat, or redeem semantics are introduced.

## Open Questions

- Should mapping live in RF, Rielt, or a shared read model?
- Who can manage listing-offer mapping: RF partner, PRO curator, admin, or Rielt owner?
- Should `priority` be mandatory?
- Should `status` include `draft` in addition to `active` / `hidden` / `archived`?
- Should offer grouping be explicit: basic vs premium, long-stay vs short-stay, family vs nomad?
- Should `urgency_mode` be part of the first handoff contract?
- Should `return_url` be required for every claim from a Rielt listing context?
- Should a listing-specific page allow multiple claims from the same listing if offers differ?
- Should premium vouchers require Connect tier, PRO validation, or user eligibility later?
- How should RF display unavailable offers without implying booking availability?

## Non-Goals

- no mass refactor;
- no scripts;
- no data seed;
- no claim/redeem implementation;
- no booking;
- no chat;
- no Points integration;
- no Connect integration changes.

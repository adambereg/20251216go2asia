# RF Merchant Catalog Item Model Audit v1

## 1. Executive Summary

RF currently uses an offer-centric model:

```text
Partner -> Offer -> Voucher
```

There is no canonical RF product/service item entity today. `rf_offer` stores a flat `title`, `offerType`, `visibility`, `status`, `partnerId` and creator/timestamps. This is enough for basic promotions and voucher claim/redeem flows, but it does not model the underlying product or service that an offer applies to.

The recommended next model is Option C - Hybrid:

```text
Partner -> Product/Service Item -> Offer -> Voucher
```

with a new `rf_partner_item` table as the canonical merchant catalog item and an optional item binding on offers for backward compatibility. Existing offers and vouchers must continue to work without item data.

## 2. Current RF Model

### Partner

`rf_partner` is the merchant-owned business entity.

Current key fields:

- `id`
- `slug`
- `display_name`
- `country_id`
- `city_id`
- optional Atlas place references
- `status`
- `owner_user_id`
- timestamps

Merchant ownership is enforced through `owner_user_id`.

### Offer

`rf_offer` is currently a flat promotional unit owned by a partner.

Current key fields:

- `id`
- `partner_id`
- `title`
- `offer_type`
- `visibility`
- `status`
- `created_by_user_id`
- timestamps

There are no fields for item title, item description, product/service category, price, currency, SKU, menu group or service duration.

### Voucher

`rf_voucher` is linked to an offer and partner:

- `offer_id`
- `partner_id`
- `issued_to_user_id`
- runtime/canonical status fields
- claim scope and optional Rielt listing context
- timestamps and status actor metadata

Voucher uniqueness and claim/redeem semantics are offer-level today. Partner-scope uniqueness is based on `offer_id` plus user. Listing-scope uniqueness is based on `rielt_listing_id`, `offer_id` and user.

### Claim/Redeem

Claim validates an active public offer and creates a voucher for that offer. Redeem validates partner ownership, voucher status and the voucher/offer/partner relation.

Neither claim nor redeem currently knows which product/service item the offer represents.

## 3. Current Merchant UX

Merchant creates offers from the Merchant cabinet offer management panel.

Current create form:

- title;
- offer type;
- visibility.

The created offer starts as `draft` and can later be activated. There is no item catalog, item selector, item archive flow or item edit flow.

Merchant cabinet filters existing offers by selected partner on the frontend using existing RF offer data.

## 4. Current Public RF UX

Public RF shows partners and offers.

Offer cards use:

- `offer.title`;
- `offer.offerType`;
- `offer.visibility`;
- `offer.status`;
- partner display/presentation data.

Public catalog filtering uses offer type, visibility, status and partner presentation data. There is no product/service item label, item category, item price or item detail page.

`/rf/my-vouchers` displays voucher offer and partner context. It uses offer title or fallback copy, not item data.

## 5. Current PRO Visibility

PRO linked partner offers visibility is derived from active `rf_pro_link` rows:

- read current PRO links;
- filter to `status === 'active'`;
- derive active partner ids;
- filter existing RF offers by those partner ids.

PRO sees offer context read-only. There is no item context today. PRO should be able to see item context later, but should not create, edit or archive items.

## 6. Gaps

- No canonical RF product/service item table exists.
- `rf_offer.title` currently carries both promotion label and item/service meaning.
- Merchant cannot manage a reusable product/service catalog.
- Public RF cannot show "this offer applies to this service/item" as structured data.
- Vouchers cannot display item context except through offer title copy.
- PRO can only see offer titles, not item context.
- Rielt mapping has offer mapping metadata, but it is not a general merchant product/service catalog.
- Adding item semantics directly to claim/redeem would risk changing stable voucher behavior unless item remains optional at first.

## 7. Option A - Extend Offer

Add item-like fields directly to `rf_offer`:

- `item_title`
- `item_description`
- `item_category`
- `item_price_from`
- `item_currency`

Pros:

- Smallest schema/API change.
- Keeps the current `Partner -> Offer -> Voucher` flow.
- Minimal changes to claim/redeem, since voucher still points to offer.
- Easy to expose in current offer DTOs and cards.

Cons:

- Blurs offer and product/service boundaries.
- Makes `rf_offer` a "god row" that stores both promotion and catalog data.
- Reusing the same item across multiple offers is hard.
- Archiving/changing the item independent of the offer is hard.
- Multi-item offers become awkward.
- Future analytics by item/SKU/service category are weak.

Best fit:

- Very short-lived MVP where one offer always equals one item and no reusable merchant catalog is expected.

## 8. Option B - New Partner Item

Add a new canonical table:

```text
rf_partner_item
- id
- partner_id
- title
- description
- category
- price_from
- currency
- status
- created_at
- updated_at
```

Then link offers to items through either:

- nullable `rf_offer.item_id`; or
- a junction table if one offer can target multiple items.

Pros:

- Clean domain model: partner owns catalog items; offers reference items.
- Items can be reused by multiple offers.
- Items can be archived independently.
- Public RF can show partner item catalogs.
- Merchant cabinet can manage products/services separately from promotions.
- Better foundation for future analytics, attribution and operational reporting.

Cons:

- More schema/API/UI work.
- Requires careful backward compatibility for existing offers without items.
- Requires decisions about one item per offer vs multi-item offer.
- Requires additional owner-gated endpoints and UI states.
- Claim/redeem remain offer-level unless item binding is snapshot or persisted on voucher later.

Best fit:

- A long-term merchant catalog model where product/service item is a real domain concept.

## 9. Option C - Hybrid

Use `rf_partner_item` as the canonical future model, but keep offer fields and item binding optional at first.

Proposed baseline:

- add `rf_partner_item`;
- keep `rf_offer.title` as legacy/promotion title;
- add nullable `item_id` to `rf_offer`, or introduce an optional offer-item binding table;
- public UI shows item context if available, otherwise falls back to legacy offer title;
- old offers remain valid without item data;
- vouchers continue to point to offer.

Pros:

- Preserves current claim/redeem behavior.
- Allows gradual migration.
- Gives Merchant a real item catalog without forcing all offers to migrate immediately.
- Lets public RF and PRO display item context read-only when present.
- Avoids overloading `rf_offer` with every product/service attribute.

Cons:

- UI must handle both item-linked and legacy offers.
- API must document nullable item context clearly.
- It does not solve item-level voucher uniqueness or redemption by itself.
- Rejected design decisions may resurface later if multi-item offers are needed.

Best fit:

- Recommended Stage 1 baseline.

## 10. Recommended Model

Choose Option C - Hybrid.

Reasons:

- RF vouchers and claims are stable at offer level today.
- Existing offers must remain claimable/redeemable without item data.
- Merchant needs a durable catalog model, not just extra offer fields.
- Public RF and PRO can benefit from item context without changing core voucher lifecycle.
- The model leaves room for richer future item analytics without forcing economy or attribution changes now.

Avoid Option A as the primary model unless the product intentionally accepts that `rf_offer` will remain both promotion and catalog item. That shortcut is likely to become technical debt.

Option B is the long-term destination, but Option C is the safer adoption path because it keeps item binding optional while current data and clients migrate.

## 11. Proposed Data Model

Proposed canonical table:

```text
rf_partner_item
- id varchar(80) primary key
- partner_id varchar(80) not null references rf_partner(id)
- title varchar(240) not null
- description text null
- category varchar(80) null
- price_from numeric(12,2) null
- currency varchar(3) null
- status enum('active', 'archived') not null default 'active'
- created_at timestamp not null default now()
- updated_at timestamp not null default now()
```

Recommended constraints:

- title not blank;
- partner id indexed with status and updated timestamp;
- price is non-negative when present;
- currency is required when price is present;
- item belongs to the same partner as any offer that references it.

Offer binding:

```text
rf_offer.item_id nullable references rf_partner_item(id)
```

Keep `item_id` nullable for Stage 1.1/1.3.

Future alternative:

```text
rf_offer_item
- offer_id
- item_id
- role
- sort_order
```

Use this only if one offer can cover multiple items.

## 12. API Surface Proposal

Stage 1.1 API proposal:

- `GET /v1/rf/business/partners/{partnerId}/items`
- `POST /v1/rf/business/partners/{partnerId}/items`
- `PATCH /v1/rf/business/partners/{partnerId}/items/{itemId}`
- `POST /v1/rf/business/partners/{partnerId}/items/{itemId}/archive`
- optional public `GET /v1/rf/partners/{partnerId}/items`

Offer API extension:

- add optional `itemId` to `RfCreateOfferRequest`;
- include nullable `item` or `itemId` on `RfOffer`;
- validate that item belongs to the same partner and is active when binding at create time.

Keep claim/redeem APIs unchanged in Stage 1.1.

## 13. Merchant UX Proposal

Stage 1.2 Merchant Item Catalog UI:

- show item list for selected owned partner;
- create item;
- edit title/description/category/price/currency;
- archive item;
- owner-only;
- no PRO edit rights.

Item states:

- active items can be selected for offers;
- archived items stay hidden from default picker but can remain attached to old offers for historical display.

Stage 1.3 Offer creation:

- add optional item selector to create offer form;
- keep offer title available for legacy/promotion copy;
- when item is selected, prefill or suggest offer title from item title but do not require automatic overwrite.

## 14. Public RF UX Proposal

Public offer cards:

- show item label when an offer has item context;
- keep existing offer title as primary promotion title or fallback;
- show partner item category/price only when present and safe.

Partner detail page:

- add an optional item catalog section;
- show active items;
- link item-backed offers when available.

Vouchers:

- display item context if the claimed offer has an item;
- fall back to existing offer title for legacy vouchers;
- do not change voucher uniqueness in the first item stage.

## 15. PRO Boundary

PRO can see item context read-only when it appears on linked partner offers.

PRO must not:

- create items;
- edit items;
- archive items;
- bind items to offers;
- redeem item-backed vouchers;
- receive economics or attribution from item visibility.

PRO visibility remains based on active linked partners and existing offer visibility rules.

## 16. Migration / Backward Compatibility

Recommended migration path:

- add `rf_partner_item`;
- add optional item binding for offers;
- keep existing `rf_offer.title` required;
- leave existing offers with `item_id = null`;
- keep current claim/redeem behavior unchanged;
- keep current voucher uniqueness based on `offer_id`;
- public UI falls back to legacy offer title when item is absent.

Old offers:

- remain valid;
- remain claimable/redeemable under existing rules;
- do not require backfill before launch.

Optional backfill:

- later, generate item candidates from existing active offer titles for merchant review;
- do not auto-create canonical items silently in production-like data.

## 17. Risks

- Overloading `rf_offer` can blur promotion vs product/service semantics.
- Making `item_id` required too early can break existing offers and tests.
- Item price can be mistaken for a payment/economy feature if copy is not careful.
- Public UI may imply exact SKU availability even though claim/redeem remains offer-level.
- Multi-item offers may require a junction table later.
- Archived items attached to old offers need clear display rules.
- PRO may be mistaken as item manager unless UI keeps owner-only boundaries explicit.

## 18. Proposed Implementation Sequence

### Stage 1.1 - Schema/API/SDK Implementation

Status: implemented as the foundational backend/API layer.

Added schema:

- `rf_partner_item` with owner-managed product/service item fields: `title`, `description`, `category`, `price_from`, `currency`, `status`, timestamps.
- `rf_offer.item_id` as nullable optional binding to `rf_partner_item`.
- Item indexes for partner/status/update reads and partner/title lookup.

Added API endpoints:

- `GET /v1/rf/business/partners/{partnerId}/items`
- `POST /v1/rf/business/partners/{partnerId}/items`
- `PATCH /v1/rf/business/partners/{partnerId}/items/{itemId}`
- `POST /v1/rf/business/partners/{partnerId}/items/{itemId}/archive`

Behavior:

- Item management is owner-gated and limited to active owned partners.
- Item create/update validates title, non-negative `priceFrom`, and uppercase three-letter `currency` when price is present.
- Archive is soft-only: `status` becomes `archived`; rows are not deleted.
- `RfCreateOfferRequest.itemId` is optional. When supplied, the item must belong to the same partner and be active.
- Offers without `itemId` continue to work unchanged.

Boundaries:

- Claim/redeem behavior is unchanged.
- Voucher uniqueness remains offer-level.
- No frontend UI was added in this stage.
- Merchant item catalog UI remains Stage 1.2; offer creation UI item selector remains Stage 1.3.

### Stage 1.1 - Original Planned Scope

- add `rf_partner_item`;
- add item DTOs and owner-gated endpoints;
- add optional offer item binding;
- update OpenAPI;
- update SDK;
- add backend tests for owner-only item lifecycle and offer binding validation.

### Stage 1.2 - Merchant Item Catalog UI

Status: implemented as a bounded frontend-only Merchant cabinet pass.

Added Merchant UI:

- `Товары и услуги` section in `/rf/merchant` for the selected owned business.
- Live item list from `listPartnerItems(activePartner.id)`.
- Create form for `title`, `description`, `category`, `priceFrom`, `currency`.
- Compact edit flow for active items.
- Soft archive action for active items.
- Archived items remain visible and visually muted.
- Owner-only copy clarifies that PRO can see item context later read-only, but cannot create or edit items.

Boundaries:

- No backend, schema, migration, OpenAPI or SDK generation changes.
- Offer creation item selector is not implemented in this stage.
- Public RF and PRO UI are unchanged.
- Claim/redeem and voucher behavior are unchanged.

### Stage 1.2 - Original Planned Scope

- show item list per owned partner;
- create item;
- edit item;
- archive item;
- keep owner-only copy and permissions.

### Stage 1.3 - Offer Creation With Item Binding

- add optional item selector to offer creation;
- validate item belongs to selected partner;
- keep item optional for backward compatibility;
- display linked item in merchant offer list.

### Stage 1.4 - Public RF Display Update

- show item label/context on offer cards;
- add partner item catalog section;
- show item context in voucher displays when present;
- preserve legacy offer fallback.

### Stage 1.5 - PRO Visibility Alignment

- show item context read-only in PRO linked partner offers;
- ensure PRO cannot create, edit or archive items;
- keep PRO visibility derived from active partner links.

## 19. Final Recommendation

Proceed with Option C - Hybrid.

Create `rf_partner_item` as the new canonical product/service item table, but keep item binding optional on offers for the first implementation stages. Do not change claim/redeem semantics in the same pass.

The next stage should be Stage 1.1 - Schema/API/SDK. It should introduce the item table, owner-gated item endpoints, OpenAPI/SDK contracts and tests, while preserving all existing offers and vouchers.

# RF Offer Detail & Claim Usability Gap Audit v1

## 1. Executive Summary

Stage 1.6 audited the gap between a merchant-created item-linked offer and a user being able to view, understand, and claim a real RF voucher from the public RF UI.

The backend already has the core runtime primitives:

- Public active offer list: `GET /v1/rf/offers`.
- Public active offer detail API: `GET /v1/rf/offers/{offerId}`.
- Partner-scope claim API: `POST /v1/rf/offers/{offerId}/claim`.
- Listing-scope claim API for Rielt mapped offers.

The main usability gap is in the public PWA layer and DTO shape:

- There is no public offer detail page such as `/rf/offers/{offerId}`.
- The public offer catalog does not call `claimRfOffer`.
- Public offer cards offer local save/favorite/navigation, not server voucher claim.
- The SDK has `claimRfOffer`, but no thin `fetchRfOffer(offerId)` wrapper for the existing detail endpoint.
- Public/PRO offer DTOs expose `itemId`, but do not include item title, category, or price summary.

Merchant-created offers can be claimed by an authenticated user only after the merchant activates them and only if they are public and their partner is active. The current merchant UI creates offers as draft, provides activation, and shows the offer in the merchant list, but does not provide a public preview link or claim-flow link.

## 2. Current Merchant Creation Flow

Merchant owner flow in `OfferManagementPanel.tsx`:

1. Owner selects an owned partner in the Merchant workspace.
2. Owner creates an item through the Merchant item catalog.
3. Owner opens offer creation and may select an active item.
4. `createOffer(partner.id, { title, itemId?, offerType, visibility })` is called.
5. The new offer is created as `draft`.
6. The offer appears in the Merchant offer list.
7. If the offer is `draft`, the UI shows an `Активировать` action that calls `activateOffer(partner.id, offer.id)`.

Current omissions:

- No merchant-side public preview link for a specific offer.
- No link to an offer detail page.
- No link to a claim flow.
- No explanation that public claim needs active + public + authenticated user + active partner.

## 3. Current Offer Status / Visibility Lifecycle

Offer creation is owner-gated and produces a draft offer. Public visibility depends on both runtime status and visibility:

- `draft` offers are not returned by `GET /v1/rf/offers`.
- `active` + `public` offers are returned by `GET /v1/rf/offers`.
- `active` + `public` offers are returned by `GET /v1/rf/offers/{offerId}`.
- `pro_only` and `invite_only` offers are not publicly claimable through the partner-scope claim endpoint.
- `archived` offers are not publicly visible or claimable.

Claim does not branch on `offerType`. The current backend claim requirements are status/visibility/auth/partner activity, not discount vs gift vs bundle.

## 4. Current Public Offer Listing

Public RF listing support:

- `/rf/vouchers` renders `RfOffersCatalog`.
- `RfOffersCatalog` receives data from `fetchRfOffers()`.
- `fetchRfOffers()` calls `GET /v1/rf/offers`.
- `GET /v1/rf/offers` returns active public offers only.

Public card actions today:

- `Открыть место` links to `/rf/{partnerId}`.
- `Все офферы места` links to `/rf/vouchers?partner={partnerId}`.
- Favorite offer is local browser state.
- `Сохранить оффер` uses `AddToMyVouchersButton` and stores a local saved offer, not a server voucher.
- There is no `Получить ваучер` CTA for partner-scope public offers.
- There is no `Открыть оффер` link to a dedicated offer page.

The public listing can show a merchant-created offer after activation if it is public. It cannot currently complete the real server voucher path from the card.

## 5. Current Offer Detail Support

Backend/API:

- Public offer detail endpoint exists: `GET /v1/rf/offers/{offerId}`.
- It returns the same `RfOffer` shape as the public list.
- It requires `status = active` and `visibility = public`.
- It returns 404 for missing, draft, archived, non-public offers.

SDK:

- `packages/sdk/src/rf.ts` has `fetchRfOffers()`.
- It does not currently expose a convenience `fetchRfOffer(offerId)` wrapper for `GET /v1/rf/offers/{offerId}`.

Frontend:

- There is no public route for offer detail.
- `app/(public)/rf/[id]/page.tsx` is a partner page, not an offer page.
- The public landing and partner pages link back to `/rf/vouchers?partner=...`, not to a specific offer.

## 6. Current Claim Voucher Flow

Partner-scope claim exists in backend:

- Endpoint: `POST /v1/rf/offers/{offerId}/claim`.
- SDK wrapper: `claimRfOffer(offerId, idempotencyKey?)`.
- Requires `GatewayAuth`.
- Requires `Idempotency-Key`.
- Uses per-user write throttling.
- Requires offer exists.
- Requires offer `status = active`.
- Requires offer `visibility = public`.
- Requires active partner.
- Returns `{ voucher, idempotentReplay }`.
- Returns existing active partner-scope voucher for the same offer/user when applicable.

Listing-scope claim exists separately:

- Endpoint: `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`.
- SDK wrapper: `claimRfListingOffer` / `claimRfRieltListingOffer`.
- Requires active listing-offer mapping and published listing context.
- This is the only claim flow currently wired in the PWA public UI.

PWA state split:

- Local saved offer: created by `AddToMyVouchersButton`; shown under `Сохранённые офферы`; not a server voucher.
- Real server voucher: returned by claim endpoints; shown under `Полученные ваучеры (сервер)` via `fetchMyVouchers()`.
- Partner-scope voucher: `claimScope = partner`; unique by offer and user.
- Listing-scope voucher: `claimScope = listing`; unique by listing, offer, and user.

## 7. Current Item Context Boundary

The current public offer DTO includes:

- `itemId: string | null`.
- Offer title/type/visibility/status/partnerId.

It does not include:

- Item title.
- Item category.
- Item priceFrom/currency.
- Item status.
- Embedded item summary object.

The item management endpoint `listPartnerItems(partnerId)` is business/owner-gated and must not be used by public or PRO surfaces to resolve item details. This is why public and PRO surfaces can only show a safe fallback such as `Товар/услуга недоступна` when only `itemId` is available.

## 8. What Works

- Merchant can create item records for an owned partner.
- Merchant can create offers with optional `itemId`.
- Merchant can activate draft offers.
- Active public merchant-created offers can appear in `/rf/vouchers`.
- Backend can return a public offer by id.
- Backend can claim a partner-scope voucher for active public offers of active partners.
- SDK can call the partner-scope claim endpoint through `claimRfOffer`.
- `/rf/my-vouchers` can display real server vouchers returned by `fetchMyVouchers`.
- Listing-scope Rielt voucher claim already has a working public UI.

## 9. What Does Not Work

- Public users cannot open a dedicated offer page in the PWA.
- Public users cannot claim a partner-scope RF voucher from `/rf/vouchers`.
- Public offer cards still present `Сохранить оффер` as local planning, not real server claim.
- Merchant UI does not provide public preview/deep links for newly created offers.
- SDK does not expose a thin public `fetchRfOffer(offerId)` helper even though the backend endpoint exists.
- Public/PRO offer UIs cannot show real item title/category/price because the public DTO only includes `itemId`.
- Public listing and detail SQL do not join partner activity, while claim requires active partner; this can produce a visible offer that fails claim if partner state changes.

## 10. Root Causes

### API / Backend

- Partner-scope claim endpoint exists and is usable, but it is not wired to the public PWA.
- Public offer detail endpoint exists, but the current public DTO is summary-only and item-id-only.
- Public offer listing/detail filter by offer status/visibility, not active partner.
- Claim applies stricter partner activity checks than listing/detail.

### SDK / DTO

- `claimRfOffer` exists.
- `fetchRfOffer(offerId)` convenience helper is missing from `packages/sdk/src/rf.ts`.
- `RfOfferDto` includes only `itemId`, not public item summary.
- `RfVoucherDto.offer` wallet enrichment does not include `itemId` in the declared SDK type.

### Frontend Navigation

- No `/rf/offers/{offerId}` page.
- Offer cards link to partner page and filtered listing, not offer detail.
- Merchant offer list has no public preview link.
- Public landing best-offer links go to `/rf/vouchers?partner=...`, not a specific offer.

### UI Copy

- Public offer card copy currently explains local saving, not real server voucher claim.
- The UI distinguishes local saved offers vs server vouchers in `/rf/my-vouchers`, but the primary offer card does not offer a server claim path.

### Data Visibility

- Public/PRO cannot resolve item details from `itemId` without a public read model.
- Owner-gated `listPartnerItems` is intentionally not safe for public/PRO display.

### Auth / Permissions

- Claim requires authenticated user context.
- Public listing does not require auth.
- Merchant ownership is required for create/activate, but not for a user claiming a public offer.

### Status / Activation

- Merchant-created offers start as draft.
- Activation UI exists in Merchant offer management.
- Only active public offers are listable/detail-readable/claimable.
- If merchant creates an offer as non-public, activation alone is not enough for partner-scope public claim.

## 11. Minimal Fix Options

### Option A - No detail page, claim from offer card

Scope:

- Add `Получить ваучер` CTA directly to public offer cards.
- Use existing `claimRfOffer(offer.id)`.
- Require authenticated user; show sign-in prompt if unauthenticated.
- On success, show server voucher result and link to `/rf/my-vouchers`.
- Keep local save as separate planning action or demote it visually.

Pros:

- Smallest user-facing path to real voucher claim.
- Uses existing backend and SDK claim wrapper.
- Does not require offer detail route.

Cons:

- Card UI becomes more stateful.
- Still cannot show item title/category/price without item summary DTO.
- Needs careful copy to distinguish local save from real claim.

### Option B - Offer detail page

Scope:

- Add `/rf/offers/{offerId}` or equivalent public route.
- Use public offer detail endpoint.
- Add detail view with CTA `Получить ваучер`.
- Link offer cards and merchant preview to detail page.

Pros:

- Clear place for conditions, partner context, item context, claim status, and errors.
- Better share/deep-link story.
- Cleaner than overloading catalog cards.

Cons:

- SDK currently lacks `fetchRfOffer(offerId)` wrapper.
- Detail endpoint returns no item summary.
- More frontend work than card claim CTA.

### Option C - Public item summary first

Scope:

- Extend public offer read model/DTO with item summary:
  - item title;
  - category;
  - priceFrom/currency;
  - possibly item status filtering.
- Update OpenAPI/SDK.
- Then update public/PRO display from fallback to real item context.

Pros:

- Fixes the item context gap correctly.
- Avoids owner-gated item fetch from public/PRO.
- Improves catalog, partner pages, vouchers, and PRO surfaces.

Cons:

- Requires backend/API/OpenAPI/SDK changes.
- Does not by itself create a claim CTA or offer detail route.
- Should define archived-item display semantics before implementation.

### Option D - Combined minimal path

Scope:

- Add public item summary to offer DTO.
- Add partner-scope claim CTA to public offer cards.
- Keep offer detail page for a later stage.

Pros:

- User can claim from catalog and see real item context.
- Smallest complete usability improvement.
- Avoids building a detail page before the claim path is proven.

Cons:

- Still lacks offer-specific deep link.
- Requires backend/API/SDK plus frontend changes.
- More cross-layer work than Option A.

## 12. Recommendation

Recommended next implementation slice: Stage 1.7 - Public Offer Claim CTA Baseline.

Do now:

- Wire `claimRfOffer` into public offer cards for active public offers.
- Require authenticated user for claim and show a clear sign-in path.
- Keep local save separate from real server voucher claim.
- On success, show confirmation and link to `/rf/my-vouchers`.
- Add focused tests around claim button state, success, auth-required, and error copy.

Why:

- Backend and SDK already support partner-scope claim.
- This closes the most painful usability gap: user can turn a public offer into a real server voucher.
- It does not require a new backend endpoint.
- It does not require an offer detail page first.
- It does not require item summary first.

Defer:

- Offer detail page until Stage 1.8.
- Public item summary DTO until Stage 1.9 or before Stage 1.8 if detail quality depends on item context.
- Public offer DTO enrichment until the product decision on archived/missing item display is explicit.
- PRO attribution design/implementation until claim usability is stable.

## 13. Proposed Next Stages

1. Stage 1.7 - Public Offer Claim CTA Baseline
   - Add partner-scope claim CTA to public offer cards.
   - Use `claimRfOffer`.
   - Show auth-required, loading, success, replay, and error states.
   - Link successful claim to `/rf/my-vouchers`.

2. Stage 1.8 - Public Offer Detail Page
   - Add public offer detail route.
   - Add SDK wrapper for existing detail endpoint.
   - Add deep links from offer cards and merchant preview.

3. Stage 1.9 - Public Item Summary DTO
   - Extend public offer read model with safe item summary.
   - Update OpenAPI and SDK.
   - Replace `Товар/услуга недоступна` fallbacks where summary is available.

4. Return to Stage 5 PRO Attribution Baseline Design
   - Design attribution separately from claim usability.
   - Keep it out of rewards, commissions, payouts, Points, G2A, NFT, and Totem.

## 14. Boundaries

This audit does not implement anything.

No changes are proposed in this pass to:

- backend runtime;
- schema;
- migrations;
- OpenAPI;
- SDK generation;
- frontend code;
- seed data;
- production data.

Explicit product boundaries:

- No rewards.
- No payouts.
- No commissions.
- No Points.
- No G2A.
- No NFT.
- No Totem.
- No PRO attribution implementation.
- No Connect changes.

## 15. Stage 1.7 - Public Offer Claim CTA Baseline

Status: implemented as a bounded frontend-only public CTA wiring pass.

Implemented:

- Public offer cards in `/rf/vouchers` now show a primary `Получить ваучер` CTA.
- The CTA uses existing SDK method `claimRfOffer(offerId)`.
- Successful claim creates a real server-side RF voucher.
- Success state links users to `/rf/my-vouchers` with `Открыть Мои ваучеры`.
- Auth-required state does not call claim and shows `Войдите, чтобы получить ваучер.` plus a sign-in link.
- `idempotentReplay` and an already-existing partner-scope voucher are shown as success.
- Local `Сохранить оффер` remains a separate secondary action for planning.
- Public card copy now distinguishes real server voucher claim from local save.

Boundaries:

- No offer detail page was added.
- No item public read model was added.
- No backend, schema, migration, OpenAPI or SDK generation changes.
- No claim/redeem backend changes.
- No PRO attribution implementation.
- No rewards, commissions, payouts, Points, G2A, NFT, Totem or Connect changes.

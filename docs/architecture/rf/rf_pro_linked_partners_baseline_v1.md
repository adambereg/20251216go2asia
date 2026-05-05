# RF PRO Linked Partners Baseline v1

## Status

Stage 5.1 implemented / partial.

The first live PRO layer is limited to partner links backed by `rf_pro_link`. It gives PRO users visibility into partners they are linked with, without introducing economics, claim attribution, redeem attribution or partner-owner permissions.

## Scope

- PRO linked partners through `rf_pro_link`.
- Read access through `listProLinks`.
- Low-level link request through `createProLink`.
- No attribution to claim or redeem.
- No merchant owner accept UI in this slice.

## Data Sources

- `listProLinks`
- `createProLink`
- `rf_pro_link`
- Existing RF partner list only for optional display labels when partner data is already available.

## UI

- `/rf/pro`
- Linked partners block: "Связи с партнёрами".
- The block shows `partnerId`, `status`, `roleScope`, `createdAt` and `updatedAt`.
- If existing partner display data is available, the block shows the partner name and location.
- If partner display data is unavailable, the block keeps `partnerId` visible and says partner details will be connected later.
- Link request form uses `partnerId` and `roleScope`; catalog-based partner selection is a later enhancement.

## Boundaries

- Linked partner is not the same as owned partner.
- Owner / Merchant means the user owns the RF partner, creates offers and redeems vouchers through merchant flows.
- PRO linked partner means the PRO works with the partner, but does not own it.
- PRO cannot create offers in this stage.
- PRO cannot redeem vouchers in this stage.
- PRO rewards are not included.
- Partner owner confirmation for pending links remains a separate implementation slice.

## Not Included

- Claim attribution.
- Redeem attribution.
- Commissions.
- Payouts.
- Points rewards.
- G2A.
- NFT / Totem.
- Connect changes.
- Partner revenue analytics.
- Merchant financial analytics.

## Next Step

- Stage 5.2 - linked partner offers visibility baseline.
- Or merchant owner accept flow for pending PRO links.

## Stage 5.1b - Merchant Owner Accept Flow

Status: implemented as UI gap placeholder / backend read gap documented.

Owner-side accept UI is not fully implemented in this slice because the current read API does not let a merchant owner list incoming PRO link requests for owned partners.

What exists now:

- PRO can create a pending link through `createProLink`.
- PRO can list their own links through `listProLinks`.
- Merchant owner authorization for accepting is already enforced by `acceptProLink`.
- Merchant cabinet now shows a `PRO-запросы` section explaining the gap and the owner/PRO boundary.

Endpoint gaps:

- Existing `GET /v1/rf/pro/links` lists rows where current user is `pro_user_id`.
- Merchant owner needs an owner-scoped read surface for links where `rf_partner.owner_user_id` is current user.
- Without that read surface, the UI cannot safely know which pending requests exist or which `proLinkId` to pass to `acceptProLink`.

Recommended endpoint shape:

- `GET /v1/rf/business/pro-links`
- or `GET /v1/rf/business/partners/{partnerId}/pro-links`

Next slice:

- Add an owner-scoped read endpoint and SDK method.
- Then replace the merchant placeholder with a live pending request list and `Принять запрос` action using the existing `acceptProLink`.

## Stage 5.1c - Owner-scoped PRO Links Read Endpoint

Status: implemented as backend/API/SDK read endpoint.

Endpoint added:

- `GET /v1/rf/business/partners/{partnerId}/pro-links`

Semantics:

- requires gateway auth;
- checks that `rf_partner.owner_user_id` equals the current principal user id;
- returns only PRO links for the partner in path;
- returns `RfProLinkListResponse` with `nextCursor: null`;
- sorts pending links first, active second, ended last, newest first inside each group;
- read-only: does not accept, reject, reward, attribute, mutate claims or mutate redeems.

Thin SDK:

- `listPartnerProLinks(partnerId)` reads the owner-scoped endpoint.

Boundary:

- `acceptProLink(proLinkId)` remains the existing owner-gated mutation.
- This stage does not replace the Merchant placeholder UI.
- No claim/redeem attribution was added.
- No rewards, commissions, payouts, Points, G2A or NFT/Totem logic was added.

Next slice:

- Stage 5.1d - replace the Merchant placeholder with a live pending request list and `Принять запрос` action using `listPartnerProLinks` + `acceptProLink`.

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

## Stage 5.1d - Merchant Live Pending PRO Requests UI

Status: implemented as bounded frontend UI.

Merchant placeholder has been replaced with live UI in `/rf/merchant`:

- reads selected partner links through `listPartnerProLinks(activePartner.id)`;
- shows `proUserId`, `partnerId`, `status`, `roleScope`, `createdAt`, `updatedAt`;
- shows pending, active and ended links;
- pending links can be accepted through the existing `acceptProLink(proLinkId)`;
- active and ended links are read-only;
- after accept, the partner PRO links query is invalidated/refetched.

Boundaries:

- the owner confirms a working relationship only;
- PRO does not become partner owner;
- PRO cannot create offers in this stage;
- PRO cannot redeem vouchers in this stage;
- accepting a link does not create claim/redeem attribution;
- no rewards, commissions, payouts, Points, G2A or NFT/Totem logic was added.

Next slice:

- Stage 5.2 - linked partner offers visibility baseline.
- Future lifecycle controls: reject/end link.
- Future identity enrichment: richer PRO profile display instead of raw `proUserId`.

## Stage 5.2 - Linked Partner Offers Visibility Baseline

Status: implemented as bounded frontend visibility layer.

PRO cabinet now shows offers for partners where the current PRO has an active `rf_pro_link`:

- reads PRO links through `listProLinks`;
- filters links to `status === 'active'`;
- derives `partnerId[]` from active links;
- filters existing `useRfOffers()` data by those partner ids;
- sorts active offers first, then other statuses, newest first inside each group;
- labels `pro_only` offers as `Доступно для PRO`.

This is derived visibility, not a new domain model.

Boundaries:

- read-only only;
- no offer creation;
- no offer activation;
- no offer editing;
- no voucher redeem action;
- no claim/redeem attribution;
- no rewards, commissions, payouts, Points, wallet, G2A or NFT/Totem logic.

Next slice:

- richer PRO identity display;
- reject/end link lifecycle controls;
- optional partner-linked offers detail endpoint if frontend-derived filtering becomes insufficient.

## Stage 5.4 - PRO Identity Display

Status: implemented as bounded UX/data display pass.

Merchant owner PRO requests now avoid using raw `proUserId` as the primary UX label:

- display name is resolved through the existing public Space profile endpoint `GET /v1/space/profiles/{userId}` when available;
- raw `proUserId` remains visible only as a secondary technical identifier, shortened for readability;
- when no profile is available, the UI falls back to a shortened user id and the note `Профиль PRO будет подключён позже`;
- role scope, status, `createdAt` and `updatedAt` remain visible.

PRO cabinet also shows a compact current-account block from existing Clerk `useUser()` data:

- name/display label when available;
- email for the current signed-in account when Clerk exposes it;
- shortened current user id as a technical reference;
- no profile editing.

Boundaries:

- this is not a profile system;
- this is not a social graph;
- this is not a rating/review surface;
- no backend, schema, OpenAPI or SDK generation changes were made;
- no claim/redeem attribution was added;
- no rewards, commissions, payouts, Points, wallet, G2A or NFT/Totem logic was added.

Identity gap:

- the current frontend-safe source can provide `displayName` from Space profile projection;
- email for another PRO user is not exposed by the existing safe read surface;
- see `docs/audits/pro-identity-display-gap-v1.md` for the documented future endpoint option.

Next slice:

- reject/end link lifecycle controls;
- optional RF-scoped PRO identity endpoint if Space profile projection becomes insufficient;
- optional partner-linked offers detail endpoint if frontend-derived filtering becomes insufficient.

## Stage 5.5 - Reject / End Link Lifecycle Controls

Status: implemented as bounded lifecycle control pass.

Backend/API/SDK lifecycle:

- `POST /v1/rf/pro/links/{proLinkId}/reject` lets a partner owner reject a pending PRO link;
- `POST /v1/rf/pro/links/{proLinkId}/end` lets a partner owner end an active PRO link;
- both operations return the existing `{ proLink, applied }` response shape;
- both operations are owner-gated through the linked partner owner;
- `ended` links return idempotent success with `applied: false`;
- invalid state transitions return `409`.

UI lifecycle:

- pending links show `Принять запрос` and `Отклонить`;
- active links show `Завершить связь`;
- ended links are read-only;
- lifecycle copy explains that rejecting or ending a link does not affect existing offers and is not a payout/reward decision.

Visibility:

- linked partner offers visibility continues to use only active `rf_pro_link` rows;
- pending links do not grant offer visibility;
- ended links do not grant offer visibility and remain visible as historical/completed links.

Boundaries:

- no schema changes or migrations;
- no claim/redeem attribution;
- no Connect changes;
- no rewards, commissions, payouts, Points, wallet, G2A or NFT/Totem logic;
- no merchant financial analytics.

Next slice:

- optional RF-scoped PRO identity endpoint if Space profile projection becomes insufficient;
- optional partner-linked offers detail endpoint if frontend-derived filtering becomes insufficient;
- future audit/history fields if product needs to distinguish rejected pending links from ended active links.

## Stage 5.3 - UX / Role Clarity Closure

Status: implemented as bounded UX/copy/semantics pass.

Role separation:

- public user uses the RF public surface through `Каталог партнёров`, `Офферы`, map, favorites and vouchers;
- merchant/owner uses the owner cabinet to manage `Ваши бизнесы`, offers and voucher redemption;
- PRO uses linked partner visibility through `Связанные партнёры` and read-only partner offers.

Terminology updates:

- PRO surfaces avoid ownership language such as "my partners" for linked partner relationships;
- merchant surfaces use owner language: `Ваши бизнесы` and `Партнёры, которыми вы управляете`;
- public RF navigation uses `Каталог партнёров` and `Офферы`;
- legacy/demo PRO partner and economy screens are explicitly labelled as demo/later surfaces.

Rights boundaries:

- PRO can see linked partners and linked partner offers;
- PRO cannot create, activate or edit offers;
- PRO cannot redeem vouchers;
- merchant owner remains the only role that manages offers and voucher redemption in this baseline.

Economy boundary:

- no backend, schema, OpenAPI or SDK changes were made;
- no claim/redeem changes were made;
- no rewards, commissions, payouts, Points, wallet, G2A or NFT/Totem logic was added;
- future PRO economy copy is labelled as a later-stage placeholder rather than live behavior.

Next slice:

- richer PRO identity display;
- reject/end link lifecycle controls;
- optional partner-linked offers detail endpoint if frontend-derived filtering becomes insufficient.

# PRO Attribution Readiness Audit v1

Status: read-only audit / preflight pass before RF x PRO Stage 5.0.  
Date: 2026-05-05.  
Scope lock: no backend runtime changes, no schema changes, no migrations, no OpenAPI changes, no SDK generation, no frontend changes, no reward calculation, no commissions, no payouts, no Points, no G2A token logic, no NFT / Totem logic.

## 1. Executive Summary

Stage 5.0 is ready only as a bounded PRO attribution readiness implementation, not as an economic or reward stage.

The current live PRO model is `rf_pro_link`: a PRO user can be linked to an RF partner with `pending`, `active` or `ended` status and a role scope such as `curation` or `promotion`. The backend, OpenAPI and SDK already expose `listProLinks`, `createProLink` and `acceptProLink`.

What is missing is persisted attribution from PRO to offer, voucher, claim or redeem. Claims and redemptions currently record the acting user and voucher lifecycle state, but not a `proLinkId`, promoter, curator, source or attribution reason.

The main risk before Stage 5 implementation is confusing three different meanings of "partner": RF partner owner, PRO-linked partner, and public partner listing. A second high risk is letting demo PRO UI imply rewards, commissions or live attribution that the runtime does not persist.

### Readiness answers

| Question | Answer |
| --- | --- |
| What is PRO in the current model? | A user linked to an RF partner through `rf_pro_link`, with role scope and status; also a trust/visibility actor in docs, not a reward executor. |
| Is there live PRO <-> partner linkage? | Yes. `rf_pro_link.partner_id` and `rf_pro_link.pro_user_id` are live in DB, backend, OpenAPI and SDK. |
| Is there live PRO <-> offer linkage? | No direct link. It is only derivable through linked partner -> partner offers. |
| Is there live PRO <-> voucher linkage? | No. `rf_voucher` has offer, partner and issued user fields, but no PRO attribution fields. |
| Is there attribution on claim? | No. Claim writes voucher ownership/lifecycle data, not PRO source or `proLinkId`. |
| Is there attribution on redeem? | No. Redeem writes `rf_voucher_redemption`, currently without PRO attribution; metadata is not used for PRO. |
| Data for PRO "my partners"? | Yes at link level; partner display requires joining/filtering existing partner data or adding a read endpoint later. |
| Data for PRO "my offers"? | Partially, derivable from linked partner IDs and existing offer data; no direct PRO-offer model. |
| Data for PRO "my activity"? | Only link lifecycle timestamps and derived partner/offer visibility; no claim/redeem activity attributed to PRO. |
| What can be done without schema changes? | PRO links UI/API integration, linked partners view, derived linked offers view, read-only context labels and demo boundary cleanup. |
| What requires schema changes? | Durable claim/redeem attribution, indexed PRO voucher queries, direct PRO-offer assignment, attribution event log and reward policy persistence. |
| What is strictly forbidden in Stage 5.0? | Rewards, commissions, payouts, Points, G2A, NFT/Totem, wallet entries, partner revenue and financial analytics. |

## 2. Current PRO Domain Model

| Entity / table | Fields | Purpose | Status |
| --- | --- | --- | --- |
| `rf_pro_link` | `id`, `partner_id`, `pro_user_id`, `status`, `role_scope`, `created_at`, `updated_at` | Canonical PRO-to-partner assignment baseline. | live |
| `rf_partner` | `id`, `owner_user_id`, `status`, timestamps and partner profile fields | RF merchant/partner owned by a user. This is not the same as a PRO-linked partner. | live |
| `rf_offer` | `partner_id`, `visibility`, `created_by_user_id`, `status`, timestamps and offer content fields | Offer belongs to a partner; PRO relationship can only be derived through partner linkage. | partial for PRO |
| `rf_voucher` | `offer_id`, `partner_id`, `issued_to_user_id`, `status`, `canonical_status`, `claim_scope`, `claimed_at`, `redeemed_at`, `status_actor_user_id` | Voucher lifecycle record for user claims and redemption state. | live, missing PRO attribution |
| `rf_claim_idempotency` | `actor_user_id`, `idempotency_key`, `voucher_id` | Idempotency for claim flow. | live, boundary only |
| `rf_voucher_redemption` | `voucher_id`, `user_id`, `partner_id`, `actor_user_id`, `metadata`, `correlation_id`, timestamps | RF-owned redemption ledger. | live, missing PRO attribution |
| `rielt_listing_rf_offer` | listing and offer linkage fields | Listing-scoped voucher context. | live, boundary only |
| Points / referral / badges tables | referral tree, transactions, badges, wallet data | Adjacent economy surfaces. | boundary only, not Stage 5 target |

Observed model facts:

- `proUserId` exists in PRO link DTO/runtime mapping.
- `proLinkId` exists as the accept endpoint path parameter.
- PRO <-> partner exists through `rf_pro_link`.
- PRO <-> offer and PRO <-> voucher are not persisted as first-class relations.
- No source, attribution, curator or promoter field was found on claim/redeem/voucher records.
- `rf_pro_link` has status and timestamps, but no `accepted_at` or `ended_at`.

## 3. Backend Runtime Audit

| Endpoint / function | Purpose | Status | Notes |
| --- | --- | --- | --- |
| `GET /v1/rf/pro/links` / `listProLinks` | Lists links where current principal is `pro_user_id`. | live | Returns link rows only, with `nextCursor: null`. |
| `POST /v1/rf/pro/links` / `createProLink` | Creates a pending link from current principal to an active partner. | live, needs policy hardening | Current behavior is assignment request baseline; it does not appear to require `platformRole = pro`, and does not require caller to own the partner. |
| `POST /v1/rf/pro/links/{proLinkId}/accept` / `acceptProLink` | Partner owner accepts a pending PRO link. | live | Checks partner ownership before activation. |
| `createPartner` | Creates RF partner with `owner_user_id = principal.userId`. | live | Merchant owner model is separate from PRO link model. |
| `createOffer` / `activateOffer` | Creates and activates offers for owned active partners. | live | Uses owner checks; not PRO-aware. |
| `claimVoucher` / `claimVoucherForListing` | Claims public/listing-scoped vouchers for user. | live | Does not read or write `rf_pro_link`, `proUserId` or `proLinkId`. |
| `redeemVoucher` | Partner owner redeems a voucher. | live | Uses owned active partner check; no PRO attribution. |
| Gateway principal `platformRole` | Derives roles including `pro`. | prepared / unused for RF PRO | Available in auth layer, but not used as PRO policy in RF routes. |
| `/v1/rf/pro/*` route protection | Requires gateway auth. | live | Authenticated route, but not sufficient to distinguish actual PRO role. |

Backend conclusion:

- Live endpoints exist for the PRO link lifecycle.
- No live endpoint exposes "PRO linked partners with partner details" as one consolidated read model.
- No live endpoint exposes "PRO linked partner offers" as a first-class read model.
- No claim/redeem path currently attributes activity to PRO.
- Stage 5 should first harden and consume the existing link lifecycle before adding attribution persistence.

## 4. SDK / OpenAPI Audit

OpenAPI in `docs/openapi/rf.yaml` includes:

- `GET /v1/rf/pro/links` with operation `rfListProLinks`;
- `POST /v1/rf/pro/links` with operation `rfCreateProLink`;
- `POST /v1/rf/pro/links/{proLinkId}/accept` with operation `rfAcceptProLink`;
- `RfProLink` with `id`, `partnerId`, `proUserId`, `status`, `roleScope`, `createdAt`, `updatedAt`;
- `RfCreateProLinkRequest` with `partnerId` and `roleScope`;
- `RfAcceptProLinkResponse` with `proLink` and `applied`.

`packages/sdk/src/rf.ts` includes:

- `listProLinks()`;
- `createProLink(input)`;
- `acceptProLink(proLinkId)`;
- local DTO definitions that mirror generated DTOs.

Gaps for Stage 5:

- No `GET /v1/rf/pro/links/{id}`.
- No revoke/end/PATCH lifecycle endpoint.
- No merchant-side endpoint listing all PRO links for a partner.
- No consolidated PRO read model for linked partners.
- No consolidated PRO read model for linked partner offers.
- No claim/redeem attribution DTO.
- No cursor or limit query parameters despite `nextCursor` in the list response.
- Auth contract should be checked before UI wiring: OpenAPI documents gateway auth, while the frontend SDK mutator usually relies on bearer auth flow.

No OpenAPI or SDK changes were made in this audit.

## 5. Frontend PRO Surface

| Route / component | Source data | Status | Notes |
| --- | --- | --- | --- |
| `/rf/pro` / `PROWorkspace` | `useRfPartners`, `useRfOffers`, derived PRO scope helper | partial live | Uses live partner/offer DTOs, but not `listProLinks`. "My" semantics are derived, not assignment-backed. |
| `lib/rfProWorkspace.ts` | Existing partner/offer DTOs | partial | Useful as a temporary projection helper, but it is not canonical PRO attribution. |
| `/rf/pro/partners` / `PartnersListView` | `mockData` | demo / legacy | Risky because it looks like "my partners" but is not backend-backed. |
| `/rf/pro/verifications` | `mockVerifications` and mock partners | demo | No backend link. |
| `/rf/pro/onboarding` | mock onboarding applications | demo / soon | No backend link. |
| `/rf/pro/rewards` | mock PRO rewards | demo / forbidden for Stage 5.0 | Must stay out of live Stage 5.0. |
| `PROLayout` / `PRONav` | shell/navigation only | partial | Can host a bounded live slice, but must keep demo labels visible. |
| `PRODashboardView` | mock PRO curator and dashboard data | legacy / unused | Should not be revived for Stage 5 without source-data review. |
| `/rf/merchant` / `MerchantWorkspace` | live RF SDK partners/offers | live | Owner/merchant surface, not PRO surface. Important boundary. |
| Merchant offer management | `createOffer`, `activateOffer` | live | Owner-only flow; must not be confused with PRO curation. |
| Merchant voucher redemption | `redeemRfVoucher` | live | Owner redemption flow; must not become PRO payout/commission logic. |
| Public RF routes | `fetchRfPartners`, `fetchRfOffers`, `fetchMyVouchers` | live | Discovery and user voucher lifecycle surfaces. Not PRO attribution. |
| Connect RF section | `useRfVoucherSummary`, `fetchMyVouchers`, frontend projection helpers | live read-only | Explicitly excludes PRO attribution and rewards in Stage 4 projection docs. |
| SDK PRO links | `listProLinks`, `createProLink`, `acceptProLink` | available, unused by UI | Best candidate for first Stage 5 slice. |

Frontend conclusion:

- The safest Stage 5 UI starting point is not the existing demo `/rf/pro/partners` page as-is.
- The live `/rf/pro` workspace can be adapted later, but only after it consumes `listProLinks` or clearly labels derived data.
- Demo reward, onboarding and verification views must not leak into live Stage 5 acceptance criteria.

## 6. PRO <-> RF Boundary

### PRO <-> Partner

This is the only live canonical PRO boundary today. `rf_pro_link` connects `pro_user_id` to `partner_id` and stores status, role scope and timestamps.

Stage 5 can safely expose this as assignment/readiness UX, provided the product language says "linked partners" instead of implying ownership.

### PRO <-> Offer

There is no direct PRO-offer relation. Offers belong to partners. A Stage 5 read-only "linked partner offers" view can be derived from active PRO links and existing partner offer data, but it should be documented as derived visibility, not persisted attribution.

Direct PRO-offer assignment, invitation-only curation policy or indexed queries by PRO would require additional design and likely schema work.

### PRO <-> Voucher

There is no direct PRO-voucher relation. Vouchers carry user, partner, offer and lifecycle state, but no PRO attribution key.

Any UI that says "my vouchers as PRO" would be misleading unless it means a read-only aggregate derived from linked partner offers and clearly excludes attribution.

### PRO <-> Claim

Claim flow does not persist PRO source, curator, promoter or `proLinkId`.

Stage 5.0 should not claim that a PRO "caused" a claim unless the system adds a canonical attribution field or event later.

### PRO <-> Redeem

Redeem flow is partner-owner controlled and writes RF redemption records without PRO attribution.

Stage 5.0 must not infer commissions, payouts or PRO performance from redemptions.

### PRO <-> Connect

Connect currently shows RF as a read-only voucher projection: summary counts, active/used voucher lists and lifecycle activity derived from RF voucher timestamps.

Connect docs explicitly exclude PRO attribution, PRO rewards, commissions, payouts, G2A, NFT/Totem and wallet integration from the current RF projection. Stage 5 should keep Connect read-only unless a later RF-owned attribution read model exists.

## 7. What Can Be Implemented Without Schema Changes

- PRO link list view using `listProLinks`.
- Create pending PRO link using `createProLink`, after route policy is confirmed or hardened.
- Partner owner accepts pending link using `acceptProLink`.
- "PRO linked partners" view derived from `rf_pro_link.partnerId` and existing partner data.
- "PRO linked partner offers" view derived from active links and existing offer data.
- Basic read-only attribution context labels such as "linked via roleScope=curation", without claiming claim/redeem attribution.
- Demo boundary cleanup: hide, flag or separate mock-heavy PRO pages from live Stage 5 flows.
- Copy updates that distinguish partner owner, linked partner and public partner.
- Route/permission hardening using existing auth principal fields, if product policy requires actual PRO role.

## 8. What Requires Schema Changes

- Persisted `pro_link_id` or `pro_user_id` on voucher claim records.
- A first-class claim attribution event table.
- A first-class redeem attribution event table.
- Indexed "all vouchers/claims/redeems attributed to PRO" queries.
- Direct PRO-offer assignment independent from partner linkage.
- Role-specific attribution policy beyond `rf_pro_link.role_scope`.
- `accepted_at`, `ended_at`, `accepted_by_user_id` or lifecycle audit fields for PRO links.
- Partner reward policy persistence.
- Any future commissions, payouts, Points rewards or G2A/NFT/Totem unlock tracking.

## 9. Strict Out of Scope for Stage 5

- Commissions.
- Payouts.
- Reward calculations.
- Points rewards or fake Points transactions.
- G2A token balances, withdrawals or token logic.
- NFT / Totem logic.
- Partner revenue analytics.
- Merchant financial analytics.
- PRO reward pages becoming live.
- Claim/redeem mutation from Connect.
- Connect as a source of truth for RF rewards or attribution.
- Any OpenAPI, SDK generation, migration or schema change unless explicitly moved into a later implementation stage.

## 10. Recommended Stage 5 Scope

### Slice 1 - PRO linked partners baseline

Goal: make the existing PRO link lifecycle visible and usable without inventing attribution or rewards.

Touched areas:

- RF service PRO link endpoints already exist;
- SDK `listProLinks`, `createProLink`, `acceptProLink` already exists;
- PRO cabinet can consume the link list;
- merchant owner flow may need an accept surface.

Backend changes needed: yes for policy hardening if required; no schema changes.

Risk: medium. The main risk is authorization ambiguity in `createProLink` and confusing partner owner with linked PRO.

Acceptance criteria:

- PRO can see their link rows with status and role scope.
- Pending vs active links are clearly separated.
- Partner owner acceptance remains owner-gated.
- No rewards, commissions, wallet copy or financial metrics are shown.
- UI labels say "linked partners", not "owned partners".

### Slice 2 - PRO linked offers / visibility baseline

Goal: show offers for active linked partners as read-only visibility.

Touched areas:

- Existing partner and offer reads;
- PRO workspace derivation logic;
- PRO UI copy and filtering.

Backend changes needed: no for a derived frontend slice; yes later if a canonical consolidated read endpoint is desired. No schema changes for the first derived slice.

Risk: medium. Offer visibility rules may be misunderstood as PRO ownership or attribution.

Acceptance criteria:

- Only offers from active linked partners are shown.
- The view is read-only.
- Offer creation, activation and redemption remain merchant-owner operations.
- The UI says "offers from linked partners" and does not imply reward eligibility.

### Slice 3 - PRO attribution read-only context

Goal: display safe context around PRO links without claiming persisted attribution.

Touched areas:

- PRO link status and role scope;
- partner and offer labels;
- possibly Connect/RF copy only as future-readiness text.

Backend changes needed: no for context labels; yes with schema changes if claim/redeem attribution must be persisted.

Risk: high if product copy implies that claims or redemptions are attributed to PRO today.

Acceptance criteria:

- The surface can show link role, link status and related partner/offer context.
- It explicitly does not show attributed claims, attributed redeems, commissions, payouts or rewards.
- Any "attribution" language is bounded to "readiness context" until persisted fields/events exist.

Recommended order: start with Slice 1, then Slice 2, and treat Slice 3 as copy/readiness only until schema design is approved.

## 11. Risks

| Risk | Severity | Notes / mitigation |
| --- | --- | --- |
| Confusing partner owner vs PRO-linked partner | high | Use "owned partner" for merchant cabinet and "linked partner" for PRO cabinet. Keep owner-only actions out of PRO UI. |
| Fake rewards | high | Do not connect `/rf/pro/rewards` to live UX in Stage 5.0. Keep reward copy disabled or explicitly future. |
| Accidental commissions | high | Do not derive value from claims/redeems. No payout or commission terminology. |
| Broken merchant owner flow | high | Keep `createOffer`, `activateOffer` and `redeemVoucher` owner-gated. PRO should not receive merchant mutations. |
| PRO demo UI leaking into live UX | high | Audit navigation and route labels before enabling Stage 5. Hide or clearly mark demo pages. |
| Weak create-link policy | medium | Confirm expected policy: self-request link vs PRO-only role vs invitation. Harden before public rollout if needed. |
| Attribution overclaiming | medium | Current data supports assignment, not claim/redeem attribution. Product copy must reflect that. |
| OpenAPI/SDK auth ambiguity | medium | Verify gateway auth behavior for frontend PRO methods before UI integration. |
| Derived offers treated as canonical | medium | If partner/offer joins are frontend-derived, document them as read-only projection until an RF-owned read endpoint exists. |
| Stage numbering collision | low | Distinguish RF x PRO Stage 5.0 from listing-claim Stage 5 and earlier RF Stage 4 options. |

## 12. Final Recommendation

Stage 5 implementation can begin, but only as a bounded PRO linked-partners baseline.

Start with Slice 1: consume the existing `rf_pro_link` lifecycle, show PRO linked partners, and preserve owner-only merchant actions. This can be done without schema changes if the implementation stays at assignment/readiness level.

Do not implement claim or redeem attribution in Stage 5.0 without schema design. The current model cannot truthfully answer "which PRO caused this claim/redeem" because neither claim nor redemption stores `proLinkId`, source, curator or promoter.

Before exposing Stage 5 UI broadly, close the PRO UI demo boundary: keep mock partner, verification, onboarding and reward pages separated from the live linked-partner surface. The first implementation should not touch rewards, commissions, payouts, Points, G2A, NFT/Totem or Connect wallet economics.

## Sources Checked

- `packages/db/src/schema/rf.ts`
- `packages/db/migrations/0020_rf_core_v1.sql`
- `packages/db/migrations/0046_rf_voucher_scope_v1.sql` through `0051_rf_voucher_canonical_indexes_v1.sql`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/index.ts`
- `apps/rf-service/src/middleware/auth.ts`
- `apps/api-gateway/src/index.ts`
- `docs/openapi/rf.yaml`
- `docs/openapi/openapi.bundle.yaml`
- `packages/sdk/src/rf.ts`
- `packages/sdk/src/generated/rfProLink.ts`
- `packages/types/src/generated/rfProLink.ts`
- `sdk/go2AsiaPlatformAPI.ts`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/partners/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/verifications/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/onboarding/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/rewards/page.tsx`
- `apps/go2asia-pwa-shell/components/rf/PRO/PROWorkspace.tsx`
- `apps/go2asia-pwa-shell/components/rf/PRO/PROLayout.tsx`
- `apps/go2asia-pwa-shell/components/rf/PRO/PRONav.tsx`
- `apps/go2asia-pwa-shell/lib/rfProWorkspace.ts`
- `apps/go2asia-pwa-shell/components/rf/Merchant/MerchantWorkspace.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/ConnectRfSection.tsx`
- `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`
- `docs/architecture/rf/rf_stage_3_closure_note_v1.md`
- `docs/architecture/rf/rf_pro_trust_visibility_v1.md`
- `docs/architecture/rf/rf_runtime_contract_lock_v1.md`
- `docs/architecture/connect/connect_rf_dashboard_projection_v1.md`
- `docs/architecture/connect/connect_runtime_contract_lock_v1.md`
- `docs/architecture/connect/connect_dependency_map_v1.md`
- `docs/audits/connect-rf-economic-projection-audit-v1.md`
- `docs/audits/rf-asia-current-state-audit-v1.md`
- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/domain/rf-asia-implementation-sequencing-v1.md`
- `docs/economy/README.md`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`

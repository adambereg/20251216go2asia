# RF Stage 5.0B / 5.0C — PR description (draft)

## Summary

This PR delivers **RF-owned durable PRO voucher attribution** (Stage 5.0B) and a **minimal read-only PRO visibility projection** (Stage 5.0C) on top of existing RF runtime. It introduces **no economy**, **no payouts**, **no Connect ownership**, and **no cross-ecosystem attribution platform**.

## Implemented scope

### Stage 5.0B — Durable attribution

- **DB:** Migration `0053_rf_voucher_pro_attribution_v1.sql` and `packages/db/src/schema/rf.ts` updates for attribution columns on `rf_voucher`, indexes, and `rf_pro_link.share_code`.
- **RF service:** Claim paths persist attribution; validate `shareCode` via active `rf_pro_link`; invalid attribution does not block claim; first successful claim wins (immutable durable fact).
- **Contract:** OpenAPI `docs/openapi/rf.yaml` — `RfClaimVoucherRequest`, `RfClaimAttribution`, `RfVoucherAttribution`, enums; bundle + Orval-generated `packages/sdk` / `packages/types` / root `sdk` / `types`.
- **Thin SDK:** `packages/sdk/src/rf.ts` — `claimRfOffer` / listing claim with optional attribution payload; types aligned with contract.
- **PWA:** `sessionStorage` TTL capture (`lib/rfProAttribution.ts`), catalog / offer / listing claim integration (`ClaimRfOfferButton`, `RfOffersCatalog`, `ListingVoucherOffersClient`).

### Stage 5.0C — Read-only visibility

- **API:** `GET /v1/rf/pro/attributed-vouchers` — authenticated PRO only, **confirmed attribution by default**, filters (`status`, `partnerId`, `claimScope`), `limit` / `cursor`, newest first.
- **DTO:** `RfProAttributedVoucher` / `RfProAttributedVouchersResponse` — **redacted** (no voucher code, no `issuedToUserId`, no `shareCode`, no raw `proUserId` / `proLinkId`, no attribution metadata blob in this projection).
- **PWA:** `PROWorkspace` — read-only **Attributed vouchers** block (loading / empty / error); helper copy and tests in `lib/rfProWorkspace.ts` / `lib/rfProWorkspace.test.ts`.

### Tests

- **Backend:** `apps/rf-service/test/request.test.ts` — claim/redeem/summary/PRO links + attribution matrix + PRO attributed list auth and shape.
- **Frontend:** `lib/rfProAttribution.test.ts`, `lib/rfProWorkspace.test.ts`, `lib/rfOfferClaim.test.ts` (targeted RF unit tests).

### Docs

- `docs/architecture/rf/rf_pro_attribution_baseline_stage_5_0.md` — baseline + 5.0B/5.0C implementation notes.
- `docs/architecture/rf/rf_attribution_canon_refinement_v1.md` — canon + 5.0C visibility alignment.
- `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md` — platform map + 5.0B/5.0C markers.
- `docs/architecture/platform/README.md` — platform doc index touchpoint.

## Architectural decisions

| Decision | Rationale |
|----------|-----------|
| **RF owns RF attribution** | Bounded context; no referral-service / Connect / economy as source of truth for voucher facts. |
| **Public `shareCode`, internal link resolution** | Avoids leaking Clerk / internal IDs in URLs; server validates against `rf_pro_link`. |
| **Immutable after first successful claim** | Stable audit fact; reduces dispute and rewrite surface. |
| **Separate PRO visibility DTO** | `RfVoucher` still carries user/code for wallet; PRO list is intentionally redacted. |
| **Confirmed-only default for PRO list** | Read-only observability without mixing rejected/none rows unless filters are extended later. |

## Non-goals (explicit)

- No **Points / G2A / NFT / ledger** semantics.
- No **payouts, commissions, earnings, balances**.
- No **Connect** or **referral-service** ownership of attribution capture.
- No **merchant attribution dashboard** (Stage 5.0C is PRO read-only list only).
- No **attribution correction / admin edit** flows.
- No **analytics platform** or centralized attribution service.
- No **new migrations** or **new endpoints** beyond what is already listed for 5.0B/5.0C.

## API changes (runtime contract)

| Method | Path | Notes |
|--------|------|--------|
| POST | `/v1/rf/offers/{offerId}/claim` | Optional JSON body `attribution` (`RfClaimAttribution`). |
| POST | `/v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim` | Same optional body. |
| GET | `/v1/rf/pro/attributed-vouchers` | **New (5.0C).** Gateway auth; query params as per OpenAPI. |

`RfVoucher` responses include optional `attribution` (`RfVoucherAttribution`) where implemented.

## Frontend changes

- Transient capture + claim payload for catalog, offer detail, and Rielt listing voucher flows.
- PRO workspace: linked partners / offers unchanged in behavior; **Attributed vouchers** section is read-only.

## Privacy decisions

- PRO visibility endpoint does **not** return end-user Clerk id, voucher codes, share codes, or full attribution metadata.
- Public surfaces continue to use **`shareCode`** transport, not `proUserId`.

## Verification performed (release sweep)

- `pnpm -C apps/rf-service test` — pass (49 tests).
- `pnpm -C apps/rf-service typecheck` — pass.
- `pnpm -C packages/sdk typecheck` — pass.
- `pnpm -C packages/types typecheck` — pass.
- `pnpm openapi:check` — pass (no drift vs committed bundle + generated outputs).
- PWA targeted: `vitest` on `lib/rfProAttribution.test.ts`, `lib/rfProWorkspace.test.ts`, `lib/rfOfferClaim.test.ts` — pass.
- PWA targeted ESLint on RF-touch files — pass.
- Static scan: no `console.log` / `debugger` in scoped `apps/rf-service/src` and `components/rf`.

## Known issues (non-blocking for this PR)

### PWA full `typecheck` / `.next/types`

`pnpm -C apps/go2asia-pwa-shell typecheck` **fails** due to **generated** `.next/types` disagreements with **unrelated** App Router modules:

- `app/(authenticated)/quest/pro/[id]/page.ts`
- `app/(public)/space/community/groups/[groupId]/page.ts`
- `app/(public)/space/profiles/[userId]/page.ts`
- `app/api/rielt-seed/listings/[id]/route.ts`

**Cause:** Next’s generated validators expect `params` as `Promise<...>` in some versions, while local page/route handlers still use synchronous `params` objects.

**Relation to RF:** None of the RF Stage 5.0B/5.0C files appear in these errors. This PR does **not** expand that surface.

**Recommendation:** Track as a separate PWA/Next alignment task; do not block RF merge on it if CI does not run full-app `tsc` including `.next/types`.

### Optional cleanup (non-blocking)

- `useRfProAttributedVouchers` in `packages/sdk/src/rf.ts` is exported but **not yet referenced** outside the SDK package; safe to keep for discoverability or remove in a tiny follow-up.

## Suggested commit structure (for future rebases / squash)

Current branch history (example):

1. `feat(rf): PRO voucher attribution persistence (Stage 5.0B)`
2. `feat(rf): PRO attributed vouchers read-only visibility (Stage 5.0C)`

**Options:**

- **Keep two commits** — clear review narrative (persistence vs visibility).
- **Squash to one** — if project prefers single “RF attribution + visibility” merge commit.

No recommendation to split OpenAPI vs frontend into more commits unless the team standard requires it; current split is already logical.

## Future stages (out of scope here)

- Merchant-safe read-only attribution visibility (if needed).
- User-facing soft badges in “My vouchers” without exposing PRO identity.
- Connect read-only projection of RF facts (still not Connect-owned capture).
- Economy bridge (`docs/economy/`) only after explicit product sign-off.

---

*Draft for maintainers; adjust links and CI command list to match repo pipelines.*

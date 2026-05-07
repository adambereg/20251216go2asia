# RF x PRO Stage 5 Closure Note v1

## 1. Status

Stage 5 is complete as a baseline RF x PRO layer.

The PRO layer is now live as a separate operational surface around `rf_pro_link`: PRO users can request partner links, merchant owners can manage the link lifecycle, and both sides can see clear role boundaries in the RF UI.

The system still has no PRO economy. Stage 5 does not add rewards, commissions, payouts, Points, G2A, NFT/Totem logic, claim attribution, redeem attribution or financial analytics.

## 2. What Is Live

### PRO Links

- `rf_pro_link` is the canonical live PRO-to-partner link.
- The live statuses are `pending`, `active` and `ended`.
- PRO can create and list links through `createProLink` and `listProLinks`.
- Merchant owner can list partner-scoped links through `listPartnerProLinks`.
- Merchant owner can accept, reject and end links through `acceptProLink`, `rejectProLink` and `endProLink`.
- Lifecycle writes are owner-gated and return the existing `{ proLink, applied }` response shape.

### Merchant

- Merchant cabinet shows PRO requests for the selected owned partner.
- Pending links can be accepted or rejected.
- Active links can be ended.
- Ended links are read-only.
- Merchant remains the only role that manages the business, creates/activates offers and redeems vouchers.

### PRO Cabinet

- PRO sees linked partners through live `rf_pro_link` data.
- PRO can request a partner link with `partnerId` and `roleScope`.
- PRO sees pending, active and ended link statuses.
- PRO does not create, activate or edit offers.
- PRO does not redeem vouchers.

### Offers Visibility

- Linked partner offers visibility is derived from active PRO links.
- The frontend filters existing RF offers by active linked partner ids.
- Visibility is read-only and does not create a PRO-to-offer domain model.
- Pending and ended links do not grant linked offers visibility.

### Identity

- Merchant UI resolves PRO display names through the existing Space public profile endpoint when available.
- If no display profile is available, UI falls back to a shortened `proUserId`.
- Raw `proUserId` remains visible only as a secondary technical identifier.
- Email is shown only for the current signed-in PRO user through Clerk `useUser()`.
- Email for another PRO user is not exposed by the current safe frontend contracts.

## 3. What Is Partial

- PRO identity is partial: there is no RF-scoped identity endpoint and no safe email read surface for another PRO user.
- Offer visibility is derived on the frontend, not served by a canonical partner-linked offers endpoint.
- `ended` does not distinguish between a rejected pending request and an ended active relationship.
- There is no `rejectReason`, `endedReason`, `acceptedAt`, `rejectedAt` or `endedAt` audit model.
- There is no partner-scoped PRO analytics.
- There is no aggregated PRO activity read model.
- Some legacy/demo PRO surfaces still exist, but they are not part of the live Stage 5 baseline.

## 4. What Is Not Implemented

- Claim attribution.
- Redeem attribution.
- PRO rewards.
- Commissions.
- Payouts.
- Points rewards.
- Connect integration for PRO.
- G2A token logic.
- NFT / Totem logic.
- Partner revenue analytics.
- Merchant financial analytics.

## 5. Domain Boundaries

### PRO <-> Partner

Live through `rf_pro_link`.

`rf_pro_link` defines the working relationship between a PRO user and an RF partner. It does not imply ownership, offer management rights, voucher redemption rights or economic rights.

### PRO <-> Offer

Derived only.

PRO offer visibility is calculated from active partner links and existing RF offers. There is no persisted PRO-to-offer assignment.

### PRO <-> Voucher

Absent.

`rf_voucher` does not store `proUserId`, `proLinkId`, curator, promoter or attribution source.

### PRO <-> Claim

Absent.

Claim flows do not read or write `rf_pro_link` and do not persist PRO attribution.

### PRO <-> Redeem

Absent.

Redemption flows do not read or write `rf_pro_link` and do not persist PRO attribution.

### PRO <-> Connect

Absent.

Connect currently consumes RF as a read-only user lifecycle/economic projection. It does not include PRO attribution or PRO activity.

## 6. Lifecycle Model

Current lifecycle:

```text
pending -> active -> ended
pending -> ended
```

Actions:

- PRO creates a link request: `createProLink` creates `pending`.
- Owner accepts a pending request: `acceptProLink` moves `pending` to `active`.
- Owner rejects a pending request: `rejectProLink` moves `pending` to `ended`.
- Owner ends an active relationship: `endProLink` moves `active` to `ended`.
- Already `ended` links are idempotent for reject/end and remain read-only in UI.

Invalid transitions return conflict:

- Rejecting an active link returns `409`.
- Ending a pending link returns `409`.
- Accepting an ended link returns `409`.

## 7. UX Model

Stage 5 separates the three RF roles:

- User: uses public RF, vouchers and catalog surfaces.
- Merchant / owner: manages businesses, offers and voucher redemption.
- PRO: works with linked partners and sees read-only partner context.

Canonical terminology:

- Merchant: `Ваши бизнесы`.
- PRO: `Связанные партнёры`.
- PRO offers visibility: `Офферы партнёров`.
- Public RF: `Каталог партнёров` and `Офферы`.

Rights model:

- Owner manages partner business data, offers and voucher redemption.
- PRO does not become an owner.
- PRO does not manage offers.
- PRO does not redeem vouchers.
- PRO link lifecycle is not an economic decision.

## 8. Risks

- Owner vs PRO confusion: a linked partner can be mistaken for an owned partner.
- Visibility vs ownership confusion: read-only offer visibility can be mistaken for offer management rights.
- False economy expectations: legacy/demo reward language can imply live rewards if not kept clearly separated.
- Derived offers can be mistaken for a canonical PRO-offer read model.
- No claim/redeem attribution exists, so product copy must not imply attributed user activity.
- Identity is partial: display name can be resolved through Space profile, but richer RF-scoped identity is future work.
- `ended` currently does not encode whether a relationship was rejected or ended after being active.

## 9. Next Stages

### Option A - PRO Attribution Layer

- Persist claim attribution.
- Persist redeem attribution.
- Add a read model for PRO-attributed activity.
- Decide whether attribution is stored on voucher, claim, redemption or a separate attribution event table.

### Option B - Connect x PRO Integration

- Surface PRO activity in Connect.
- Keep it read-only.
- Include attribution context only after attribution persistence exists.
- Avoid rewards, payouts or financial interpretation until a separate economy stage is designed.

### Option C - Identity Expansion

- Add richer PRO profile display.
- Add an RF-scoped PRO identity endpoint if Space profile projection is insufficient.
- Define privacy rules before exposing email or other contact data to merchant owners.

### Option D - Offer / Partner Detail Expansion

- Add a canonical linked partner offers endpoint.
- Add partner-linked operational analytics without economics.
- Keep management actions owner-only.

## 10. Final Recommendation

Stage 5 is ready and complete as a baseline.

RF x PRO now exists as a separate live layer: it has partner links, owner-gated lifecycle controls, merchant and PRO UI surfaces, read-only linked offer visibility, identity display fallback and clear role copy.

The system is ready to move to the next major stage, but the next stage should be chosen deliberately:

- If the product goal is user/action measurement, choose Option A: PRO Attribution Layer.
- If the product goal is dashboard continuity, choose Option B after Option A has at least a read model.
- If the product goal is trust and merchant decision quality, choose Option C.
- If the product goal is operational depth without economics, choose Option D.

Preferred next stage: Option A - PRO Attribution Layer, as a design-first pass. It should start with a schema/API/read-model plan before implementation, because Stage 5 intentionally did not persist PRO attribution on claims, redeems or vouchers.

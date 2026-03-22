# RF Frontend Live Adoption Milestone Note v1

Status: milestone fixed with minor residual debt

## 1. Purpose

This note records RF frontend wave 1 as a completed live baseline.
It is a milestone fixation note, not a roadmap for RF wave 2.

## 2. Current RF frontend state

- Live runtime surfaces are now present on:
  - public RF catalog (`/rf`)
  - public partner detail (`/rf/{partnerId}`)
  - public offers/vouchers view (`/rf/vouchers`)
  - minimal authenticated business entry panel (`/rf/merchant`)
- Several RF surfaces remain placeholder or mock-driven:
  - merchant profile/stats/settings
  - merchant reviews and voucher redeem UX details
  - PRO dashboard/onboarding/rewards/verification surfaces
- Current state is a mixed but controlled baseline: core public RF is live, advanced business/PRO UI remains deferred.

## 3. What wave 1 actually delivered

- Public RF reads are connected to live runtime (`/v1/rf/partners`, `/v1/rf/partners/{partnerId}`, `/v1/rf/offers`).
- Partner detail is no longer mock-only and is rendered from runtime data.
- RF business entry includes a minimal live create flow (`POST /v1/rf/business/partners`) and live voucher read (`GET /v1/rf/me/vouchers`).
- UI now exposes place-link truth honestly:
  - `atlasPlaceId` and `hostAtlasPlaceId` are shown as optional
  - missing links are presented as pending, not fabricated
- RF frontend moved from placeholder/mock-only baseline to a usable live baseline.

## 4. What remains intentionally out of scope

- Full merchant suite (profile management, settings, stats, full reviews operations).
- Deeper business tooling and operational backoffice behavior.
- Full PRO-link UX and complete PRO workspace rollout.
- Atlas place picker/search UX for guided place assignment.
- Broader RF dashboard/productization beyond first live adoption baseline.

## 5. Milestone verdict

RF frontend is now a meaningful first live adoption baseline with controlled residual debt.

## 6. What this note does not claim

- It does not claim RF frontend is fully complete.
- It does not claim a full business suite exists.
- It does not claim all RF screens are live runtime surfaces.
- It does not replace a later, explicit RF wave 2 pass.

## 7. Implication for sequencing

RF wave 1 can be treated as complete for current frontend sequencing.
The next frontend segment may proceed to Rielt frontend/live adoption.
RF wave 2 should return later as an explicit segment, not as implicit scope creep.

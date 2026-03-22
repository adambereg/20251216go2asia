# Go2Asia Practical Frontend Milestone Note v1

Status: fixed with minor residual debt

## 1. Purpose

This note records practical frontend wave 1 as a fixed baseline across RF and Rielt.
It is a milestone fixation note, not a roadmap for later waves.

## 2. Current practical frontend state

- Practical modules with live frontend surfaces:
  - RF public catalog/detail/offers and minimal merchant live entry
  - Rielt live home/search/detail with nearby mode and inquiry entry
- Practical surfaces still deferred:
  - RF PRO and broader merchant suite
  - Rielt broader owner suite and deeper management surfaces

## 3. What wave 1 actually delivered

- RF public surfaces are live on runtime APIs and no longer mock-only baseline.
- RF includes a minimal authenticated business entry contour for partner create and voucher read.
- Rielt now surfaces live home/search/detail and nearby listing mode through runtime APIs.
- Rielt requester inquiry entry is wired to live API with idempotency handling.
- Place-aware UI truth is preserved where applicable:
  - RF uses optional Atlas-linked partner fields honestly
  - Rielt reflects optional Atlas place/container linkage without fabricated precision

## 4. What remains intentionally out of scope

- RF wave 2 scope (full merchant/PRO suite and deeper business tooling).
- Rielt wave 2 scope (full owner operations suite and deeper management UX).
- Booking/payments/transaction platform behavior.
- Broader cross-app business tooling and dashboard expansion.
- Broad frontend cleanup beyond practical wave 1 fixation scope.

## 5. Milestone verdict

The practical frontend layer is now a meaningful live baseline with controlled residual debt.

## 6. What this note does not claim

- It does not claim RF is fully complete.
- It does not claim Rielt is fully complete.
- It does not claim all practical UI surfaces are live.
- It does not replace explicit later RF/Rielt wave 2 passes.

## 7. Implication for sequencing

Practical frontend wave 1 can be treated as complete enough for current sequencing.
The next frontend segment may proceed to Guru frontend/live adoption.
RF and Rielt wave 2 can return later as explicit segments, not implicit scope expansion.

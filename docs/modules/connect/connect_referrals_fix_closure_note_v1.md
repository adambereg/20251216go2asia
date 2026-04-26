# Connect Referrals Fix Closure Note v1

## 1. Purpose

This closure note records the completed debug and fix pass for the Connect referrals API.

It confirms why `/connect/referrals` previously showed an error state, what was fixed in `referral-service`, how the fix was deployed to staging, and which checks now confirm that the referrals flow works end to end.

This document is a closure record, not a new implementation plan.

## 2. Initial Symptom

The `/connect/referrals` screen showed:

- "Не удалось загрузить данные Connect. Попробуйте ещё раз."

Other Connect screens were already reading backend data successfully:

- `/connect`
- `/connect/wallet`
- `/connect/levels`

The issue was isolated to the referrals screen after the Connect demo seed had been applied and DB-level verification had passed.

## 3. Investigation Summary

The frontend referrals screen calls four backend-backed endpoints through SDK hooks:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree?depth=2`
- `GET /v1/referral/earnings?limit=50`

`ReferralsView` intentionally treats any failed referral request as a screen-level error. This avoids showing partial or mock referral data as production truth.

Gateway and service routing were checked first. The gateway routes `/v1/referral/*` to `referral-service` and applies the same gateway-origin auth model used by points endpoints: user JWT is verified at the API Gateway, then `X-Gateway-Auth` and derived user context are sent to the downstream service.

Staging API smoke with a Clerk JWT for the seeded demo user confirmed:

- `GET /v1/referral/code` returned `200`
- `GET /v1/referral/stats` returned `200`
- `GET /v1/referral/tree?depth=2` returned `200`
- `GET /v1/referral/earnings?limit=50` returned `500`

The failing layer was therefore `referral-service`, specifically the referral earnings read model.

## 4. Root Cause

The `referral-service` earnings query matched referral bonus point transactions by generated external IDs.

The query used the pattern:

- `external_id = ANY(${externalIds}::text[])`

With Neon and Drizzle, the JavaScript array parameter was serialized in a way PostgreSQL treated as a record rather than a text array.

PostgreSQL then failed with:

- `cannot cast type record to text[]`

That backend error caused `GET /v1/referral/earnings` to return `500`, which correctly triggered the referrals screen error state.

## 5. Fix

The earnings query was changed to use a parameterized `IN (...)` list built with `sql.join(...)`.

The fix keeps the same backend contract and the same read-model semantics:

- referral relations are still read from `referral_relations`
- matching earned Points are still read from `points_transactions`
- external IDs still use the existing `referral:first_login:<referrerId>:<refereeId>` format
- statuses are still derived as `pending`, `rewarded`, or `reward_missing`

The fix did not change:

- API contract
- OpenAPI
- SDK
- schema or migrations
- demo seed
- frontend UI
- fallback behavior

No mock or frontend fallback was added.

## 6. Deployment

Fix commit:

- `66f2270 fix(referral): make earnings query neon-safe`

Service:

- `go2asia-referral-service-staging`

Deployment:

- Staging deploy completed after the fix commit.

The fix is scoped to `referral-service` and its request tests.

## 7. Verification

### DB Level

The Connect demo seed verification passed for the seeded referrer user.

Expected seeded state included:

- non-zero Points balance
- referral code
- referral relations
- referral earnings items
- `rewarded` items
- `reward_missing` item
- `pending` items

### API Level

After the fix and staging deploy:

- `GET /v1/referral/earnings` returned `200`

The endpoint no longer fails on the Neon/Drizzle external ID matching query.

### UI Level

The `/connect/referrals` screen no longer shows the general error state.

The screen displays:

- referral code
- referral link
- referral summary cards
- list of referrals
- earnings values
- statuses including `pending`, `rewarded`, and `reward_missing`

### Real Flow Validation

A real referral-link scenario was also checked:

- the user signed up using the referral link from `irina.belova.seed@example.com`
- the new user appeared as a referral for the referrer

This confirms that the referral link flow and displayed referral list are connected to backend truth rather than frontend mock data.

## 8. Architectural Note

Connect does not require a separate `connect-service` for this MVP stage.

Connect referrals use existing backend services:

- dashboard-level referral summary is available through `points-service` as part of `/v1/points/connect-dashboard`
- detailed referral data is available through `referral-service` via `/v1/referral/*`
- the frontend composes these existing backend truths through SDK hooks

This bug was useful because it showed the real dependency shape of Connect:

- the Dashboard can remain healthy while a detailed referral endpoint fails
- `/connect/referrals` depends on multiple referral endpoints
- there is no mock fallback in the aligned UI, by design

The correct fix was to repair the backend read model, not to hide the failure in frontend state.

## 9. Risks

Known residual risks:

- `/connect/referrals` still has limited graceful degradation: one failed required referral endpoint can trigger the screen-level error state.
- The status surface includes `reward_missing`, while some earlier contract documentation may still mention only narrower status sets such as activated or rewarded.
- Full API smoke for authenticated user endpoints requires a valid Clerk user token or an equivalent staging test-token flow.
- Future changes to referral bonus external ID format must update both write-side transaction creation and earnings read-model matching together.

These risks do not block the current fix. They should be considered in later product polish or API contract cleanup passes.

## 10. Final Verdict

The Connect referrals API bug is fixed.

Staging has been confirmed after deployment:

- `/v1/referral/earnings` no longer returns `500`
- `/connect/referrals` renders backend-backed referral data
- referral statuses and earnings are visible
- a real referral-link registration creates a new referral for the referrer

Connect referrals are ready for product polish and future UX refinement.

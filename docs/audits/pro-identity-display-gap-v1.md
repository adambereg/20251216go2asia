# PRO Identity Display Gap v1

## 1. Finding

Merchant owners can now see a friendlier PRO identity label for incoming PRO requests, but the current safe read surface is limited.

The UI can resolve a PRO display name through the existing Space public profile projection when `proUserId` has a matching Space profile. If that profile is absent, the UI must fall back to a shortened technical id.

## 2. Existing Identity Sources

- Clerk `useUser()` exposes name and email for the current signed-in user only.
- `GET /v1/space/profiles/{userId}` exposes public profile data for a given user id, including `displayName`.
- `packages/db/src/schema/auth.ts` has user email data, but there is no frontend-safe RF endpoint for reading another user's email by id.
- `rf_pro_link` stores `pro_user_id` only; it does not embed identity fields.

## 3. Missing Safe Read Surface

There is no RF-scoped endpoint that returns a safe PRO identity card for a `proUserId` with the exact fields Merchant needs.

Specifically, email for another PRO user is not exposed by the current safe frontend contracts. That is intentional until product and privacy rules define whether Merchant owners should see it.

## 4. Recommended Future Endpoint

If Merchant owners need richer PRO identity in RF, add a dedicated read endpoint in a later slice, for example:

- `GET /v1/rf/business/pro-users/{userId}/identity`

Recommended response fields:

- `userId`
- `displayName`
- `email`, only if product/privacy policy allows it
- `source`
- `updatedAt`

The endpoint should be read-only, authenticated, and scoped to Merchant owners who have a pending or active PRO link involving that user and one of their partners.

## 5. Current Fallback

Stage 5.4 uses the existing Space profile projection for `displayName`.

When the profile is unavailable, UI shows:

- shortened `proUserId` as the label;
- `Профиль PRO будет подключён позже`;
- shortened technical id in secondary metadata.

This pass does not add profiles, ratings, reviews, rewards, payouts, commissions, claim attribution, redeem attribution, schema changes, migrations, OpenAPI changes, SDK generation, Connect changes, G2A, NFT or Totem logic.

# Connect Frontend Closure Report

## Scope

Closed the visible Connect Asia mismatch after `/v1/wallet/summary` rollout. This was a frontend-only closure slice inside `apps/go2asia-pwa-shell`.

No backend services, RF, Quest, Token, NFT, G2A, payments, DB migrations, SDK/generated files, or OpenAPI contracts were changed.

## Screens Checked

- `/connect`
- `/connect/wallet`
- `/connect/referrals`
- `/connect/levels`
- `/connect/missions`
- `/connect/statistics`

Wallet already displayed the bucket model correctly and remains the source of truth for the full Points structure.

## Files Changed

- `apps/go2asia-pwa-shell/components/connect/Dashboard/BalanceCards.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsContent.tsx`
- `docs/economy/connect_frontend_closure_report.md`

## Home Synchronization

Connect Home no longer treats the legacy balance as the only primary economy value. The "Ваши Points" block now reads `/v1/wallet/summary` using the existing frontend API pattern from Wallet:

- React Query
- `@go2asia/sdk/mutator`
- `customInstance`

It displays:

- Total Points
- Available Points
- Locked Points

If wallet summary is unavailable, Home falls back to the legacy balance and does not crash.

For the verified staging user, expected values are:

- Total Points: `5020`
- Available Points: `20`
- Locked Points: `5000`

## Referrals Copy

The referrals screen keeps its current data source and business logic, but copy now explains that referral Points may be locked:

- Referral helper text no longer implies all referral Points are spendable.
- Invitation guidance says referral Points may be locked until activation conditions are met.
- Referral cards with positive Points show: "Заблокировано до активации условий".

The UI does not claim that locked Points are immediately available for spending.

## Placeholders

Levels, Missions, and Statistics remain placeholders. They were not developed in this closure slice.

## Remaining Future Slices

- Add richer Wallet guidance: what can be bought and what value is waiting behind VIP activation.
- Connect final VIP activation/payment flow when product and backend slices are ready.
- Later connect badges/progression to NFT, premium vouchers, and achievement economy.
- Expand network Points visibility after Slice 2 referral accrual is implemented.

## Closure Status

Connect baseline can now be considered closed for Slice 1 frontend consistency:

- Home no longer shows `20` as the primary balance when wallet summary reports `5020`.
- Referrals explains the locked nature of referral value.
- Wallet remains the source of truth for the bucket model.

## Checks

- `pnpm exec eslint "components/connect/Dashboard/BalanceCards.tsx" "components/connect/Referrals/ReferralsContent.tsx" "components/connect/Wallet/WalletView.tsx" --ext .ts,.tsx` passed.
- IDE diagnostics for changed Connect files reported no linter errors.
- `pnpm typecheck` still fails on pre-existing unrelated `.next/types` route typing errors in Quest/Space/Rielt routes:
  - `app/(authenticated)/quest/pro/[id]/page.ts`
  - `app/(public)/space/community/groups/[groupId]/page.ts`
  - `app/(public)/space/profiles/[userId]/page.ts`
  - `app/api/rielt-seed/listings/[id]/route.ts`

## Recommended Next Step

Return to RF Asia / voucher economy.

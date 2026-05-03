# Connect Wallet Buckets Frontend Report

## Scope

Implemented a strictly frontend-only Slice for Connect Wallet bucket visibility. Backend services, RF, Quest, Token, NFT, G2A, payments, and DB migrations were not changed.

## Components Changed

- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`

The existing `/connect/wallet` route and page wrapper were not changed:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/WalletPageClientWrapper.tsx`

## Endpoint Connected

Connected `GET /v1/wallet/summary` from the frontend using the existing SDK fetch pattern:

- `@go2asia/sdk/mutator`
- `customInstance`
- React Query

The implementation keeps the legacy `useGetBalance` and `useGetTransactions` calls intact. If wallet summary is unavailable, the UI falls back to the existing legacy balance display.

## Buckets Displayed

The wallet now shows:

- Total Points: `totalPoints`
- Available Points: `availablePoints`
- Locked Points: `lockedPoints`
- Network Points: `networkPoints`
- Estimated Unlockable: `estimatedUnlockablePoints`

For the verified staging payload, the expected UI values are:

- Total Points: `5020`
- Available Points: `20`
- Locked Points: `5000`
- Network Points: `0`
- Estimated Unlockable: `5000`

## VIP CTA

When `lockedPoints > 0` and `vipStatus.isActive === false`, the wallet shows a cautious VIP CTA:

- Title: "У вас есть заблокированные Points"
- Text: "Активируйте VIP, чтобы в будущем разблокировать накопленную ценность и получить доступ к тратам Points. Механика разблокировки появится в следующем этапе."
- Button: disabled "Активировать VIP"

The UI does not claim that locked Points can already be unlocked immediately.

## What Stayed Unchanged

- The legacy balance hook remains in place.
- Transaction history remains unchanged.
- `TransactionList.tsx` was not changed.
- No SDK generation was run.
- No backend or economy business logic was changed.

## Future Slices

- Implement real VIP activation/payment flow.
- Connect the VIP activation CTA to the final product route.
- Add richer transaction labels for `referral_locked` if product wants to distinguish locked grants in the history feed.
- Extend wallet UI for future `networkPoints` accrual once Slice 2 is implemented.

## Manual Staging Check

1. Open staging PWA as the verified user.
2. Navigate to `/connect/wallet`.
3. Confirm the top wallet card displays total Points from `/v1/wallet/summary`.
4. Confirm bucket cards show Available, Locked, Network, and Estimated Unlockable values.
5. Confirm locked Points with inactive VIP shows the disabled VIP CTA.
6. Confirm "История начислений" still renders normally.

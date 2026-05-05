# RF Asia Stage 3 Closure Note v1

Статус: documentation-only фиксация текущего состояния RF Asia после Stage 1-2, Stage 2.5, Stage 3 и Stage 3.1.  
Дата: 2026-05-05.

## 1. Status

RF Stage 3 завершён: RF Asia получил live baseline для партнёрского кабинета, управления офферами и merchant redeem. RF Stage 3.1 также завершён: активные merchant routes больше не показывают fake inventory, demo reviews или mock статистику; неготовые разделы переведены в честный `soon` placeholder.

RF Asia теперь является live business-domain baseline для partner / offer / voucher / redeem контуров, но ещё не является полной бизнес-экономикой Go2Asia. Points, NFT, Totem, payouts, commissions, полноценная PRO attribution economics и Connect economic center остаются будущими слоями.

## 2. What is live now

### Public RF

Live public RF surface:

- Public partner catalog: `/rf` читает RF partners/offers через SDK/API и показывает discovery-представление партнёров.
- Public offers catalog: `/rf/vouchers` показывает реальные RF offers и партнёров, но не выполняет public claim из каталога.
- Partner detail: `/rf/[id]` остаётся основным публичным detail-входом партнёра.
- Map / discovery: `/rf/map` даёт discovery-группировку по RF партнёрам и географии.
- Favorites: `/rf/favorites` использует localStorage owner-scope; это локальное избранное, не серверные ваучеры.
- My vouchers: `/rf/my-vouchers` разделяет серверные RF vouchers и локально сохранённые предложения.
- Rielt listing voucher flow: `/rf/rielt/listings/[listingId]/vouchers` использует listing-scoped RF offer context и claim flow.

Важная UX-граница: сохранение предложения в public RF не равно выдаче ваучера. Серверный ваучер появляется только через claim flow; localStorage списки остаются списками планирования/избранного.

### Merchant Cabinet

Live merchant surface:

- Owned partners list: `/rf/merchant` показывает партнёров, привязанных к текущему Clerk user через `ownerUserId`.
- Create partner: форма создания партнёра вызывает существующий RF endpoint `POST /v1/rf/business/partners`.
- Live offer management: выбранный партнёр получает список офферов из RF API.
- Create draft offer: merchant UI вызывает `createOffer(partnerId, input)`.
- Activate offer: merchant UI вызывает `activateOffer(partnerId, offerId)`.
- Live redeem: `/rf/merchant/vouchers` рендерит только live redeem flow через RF backend.
- Idempotency-aware redeem: SDK и route поддерживают `Idempotency-Key` для redeem, а runtime не создаёт повторный successful redemption.
- No mock data in active merchant routes: `/rf/merchant`, `/rf/merchant/vouchers`, `/rf/merchant/reviews`, `/rf/merchant/stats`, `/rf/merchant/settings`, `/rf/merchant/profile` больше не показывают `mockPartners`, `mockVouchers` или `mockReviews`.

### Backend / Runtime

Live backend/runtime baseline находится в `apps/rf-service`:

- `rf_partner`, `rf_offer`, `rf_voucher`, `rf_pro_link`, `rf_claim_idempotency`, `rielt_listing_rf_offer`, `rf_voucher_redemption`.
- Partners / offers / vouchers runtime routes.
- Partner-scoped claim: `POST /v1/rf/offers/{offerId}/claim`.
- Listing-scoped claim: `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`.
- Merchant redeem: `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`.
- Redemption ledger: `rf_voucher_redemption` фиксирует redeem attempt/result context.
- Canonical voucher fields: `canonical_status`, `contract_version`, `claim_scope`, `status_changed_at`, `redeemed_at`, `expires_at`, `cancelled_at`, `status_reason`, `status_actor_user_id`.
- Stage 2.5 stabilization закрыла SQL/runtime риск listing claim, выровняла partner/listing claim, добавила idempotency/correlation support для redeem и покрыла базовый SQL shape тестами.

### SDK / OpenAPI

RF OpenAPI exists in `docs/openapi/rf.yaml` and отражает текущую runtime surface для RF. Thin SDK in `packages/sdk/src/rf.ts` покрывает ключевые flows:

- `fetchRfPartners`, `fetchRfPartner`, `useRfPartners`;
- `fetchRfOffers`, `useRfOffers`;
- `claimRfOffer`, `claimRfListingOffer`, `claimRfRieltListingOffer`;
- `fetchRfRieltListingOffers`;
- `fetchMyVouchers`, `fetchMyVoucherSummary`, `useRfVoucherSummary`;
- `redeemRfVoucher`;
- `createBusinessPartner`;
- `createOffer`, `activateOffer`;
- `listProLinks`, `createProLink`, `acceptProLink`.

## 3. What is partial

- Public claim from `/rf/vouchers` is not enabled. Public offers catalog is a discovery/save surface, not a direct voucher issuance surface.
- `/rf/my-vouchers` combines two concepts deliberately: server vouchers and local saved offers. Copy must keep this distinction clear.
- Map is discovery, not full geo/navigation. It is not yet Atlas-grade routing or complete geographic normalization.
- Merchant voucher operations history is `soon`; current merchant vouchers route supports redeem, not a full issued/redeemed inventory ledger UI.
- Offer terms, validity windows, limits and detailed redemption conditions remain minimal.
- PRO attribution is not implemented as a live reward/commission engine.
- Connect receives voucher summary visibility, but is not yet a full RF economic center.

## 4. What is soon

Merchant cabinet soon pages/features:

- Merchant reviews.
- Merchant stats.
- Merchant settings.
- Merchant profile editing.
- Merchant voucher operations list.
- Richer offer management: terms, validity, limits, visibility policy details and archive/edit flows.
- Partner profile editing from merchant UI.
- Merchant staff/cashier/branch permissions.

## 5. What is legacy / archived

- Old merchant mock components remain only as legacy code and are marked in code as not used in Stage 3 UI.
- Active merchant routes must not use `mockPartners`, `mockVouchers` or `mockReviews`.
- PRO cabinet remains demo/legacy and is out of Stage 3 scope.
- Old RF mock catalog components are not the current implementation path for the live public RF surfaces.
- `components/rf/mockData.ts` can remain as archive/demo support for explicitly legacy surfaces, but must not re-enter active merchant routes.

## 6. RF domain boundaries after Stage 3

### RF ↔ Rielt

- Rielt listing can expose RF voucher flow.
- Listing-scoped claim exists.
- Voucher can carry listing context through `claim_scope`, `rielt_listing_id` and listing title snapshot.
- Rielt deeper integration remains future work: listing offer availability, voucher history and owner/partner linking are not complete.

### RF ↔ Connect

- Connect can show RF voucher summary.
- Connect is not yet the RF economic center.
- RF voucher events are not yet projected into a full Connect dashboard/read model.

### RF ↔ Geo / Atlas

- Partners have `countryId`, `cityId`, `atlasPlaceId` and `hostAtlasPlaceId` fields.
- Public map/discovery can use country/city level grouping.
- Geo normalization, canonical boundaries, coordinates and stronger Atlas integration remain future work.

### RF ↔ PRO

- PRO link baseline exists through `rf_pro_link` and SDK methods.
- PRO reward / attribution engine is not live.
- PRO cabinet remains outside Stage 3 and should not be treated as current merchant production surface.

### RF ↔ Points / NFT / Totem

- Points, NFT and Totem are not implemented in RF Stage 3.
- Any relation to wallet, rewards, tokenomics or payout logic is future integration only.

## 7. Acceptance criteria achieved

- Live merchant cabinet without mock data in active routes.
- Live partner create.
- Live offer create / activate.
- Live redeem only in merchant voucher route.
- Public UX separates saved offers from server vouchers.
- Soon pages do not show fake data.
- Stage 3 did not expand economics or schema.
- Stage 3 did not add new backend endpoints beyond the existing RF runtime surface.
- Stage 3.1 closed the demo boundary for merchant reviews/stats/settings/profile.

## 8. Remaining risks

- No real Postgres integration tests for RF yet; current coverage still relies on integration-like request/SQL shape tests and mocks.
- Merchant redeem still requires `voucherId`, not a human-friendly voucher code lookup.
- Merchant model is owner-only; no staff, cashier, branch or role-based merchant permissions.
- localStorage saved offers can still confuse users if copy regresses.
- PRO cabinet still demo.
- Connect economy is not yet integrated.
- Offer policy remains minimal: no rich limits, redemption windows, branch applicability or cashier workflow.

## 9. Recommended next stages

### Option A — RF Stage 4: Connect Integration / Economic Projection

Includes:

- Enrich Connect RF summary.
- Project RF voucher events into Connect dashboard.
- Prepare points/rewards read model.
- No payouts yet.

This is the best next step if the goal is Go2Asia economy: RF events become visible in Connect without prematurely introducing payouts or token mechanics.

### Option B — RF Stage 4: PRO Attribution Baseline

Includes:

- Connect PRO link to offer/claim/redeem attribution.
- No commissions payout yet.
- Prepare reward policy.

This is the best next step if the goal is partner network growth and curator/operator attribution.

### Option C — Rielt deeper RF integration

Includes:

- Better Rielt listing voucher UX.
- Listing offer availability.
- Listing voucher history.
- Rielt owner / partner linking.

This is the best next step if the goal is to strengthen the real estate vertical and make listing-attached RF benefits more operational.

Recommendation:

- If the goal is Go2Asia economy, go to Connect Integration.
- If the goal is partner network growth, go to PRO Attribution.
- If the goal is stronger real estate conversion, go to Rielt deeper integration.

## 10. Final conclusion

RF Stage 3 is closed. RF Asia has moved from a mixed demo/runtime surface into a live business-domain baseline for partners, offers and merchant redeem.

The next stage should not be another cleanup pass. It should be a strategic expansion in one chosen direction: Connect economic projection, PRO attribution baseline, or deeper Rielt integration.

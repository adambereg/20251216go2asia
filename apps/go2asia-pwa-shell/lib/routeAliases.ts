export const ROUTE_ALIASES = {
  connectActivity: '/connect/activity',
  connectWalletLegacy: '/connect/wallet',
  spaceActivitySummary: '/space/activity-summary',
  spaceBalanceLegacy: '/space/balance',
  spaceBadges: '/space/badges',
  spaceNftLegacy: '/space/nft',
  spaceActivity: '/space/activity',
  spaceVouchers: '/space/vouchers',
  adminPointsDiagnostics: '/admin/points-diagnostics',
} as const;

export const LEGACY_ROUTE_NOTICES = {
  connectWallet:
    'Legacy route alias: Connect shows read-only activity and internal Points projections, not a financial wallet.',
  spaceBalance:
    'Legacy route alias: Space activity summary is deferred and is not an accounting balance or financial wallet.',
  spaceNft:
    'Legacy route alias: Space badges are off-chain/deferred; NFT ownership and on-chain semantics are inactive.',
} as const;

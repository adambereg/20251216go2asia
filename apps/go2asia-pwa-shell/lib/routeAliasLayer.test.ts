import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { LEGACY_ROUTE_NOTICES, ROUTE_ALIASES } from './routeAliases';

function readAppFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('route alias layer governance', () => {
  it('defines alias-first routes without removing legacy routes', () => {
    expect(ROUTE_ALIASES.connectActivity).toBe('/connect/activity');
    expect(ROUTE_ALIASES.connectWalletLegacy).toBe('/connect/wallet');
    expect(ROUTE_ALIASES.spaceActivitySummary).toBe('/space/activity-summary');
    expect(ROUTE_ALIASES.spaceBalanceLegacy).toBe('/space/balance');
    expect(ROUTE_ALIASES.spaceBadges).toBe('/space/badges');
    expect(ROUTE_ALIASES.spaceNftLegacy).toBe('/space/nft');

    const routeFiles = [
      'app/(authenticated)/connect/activity/page.tsx',
      'app/(authenticated)/connect/wallet/page.tsx',
      'app/(public)/space/activity-summary/page.tsx',
      'app/(public)/space/balance/page.tsx',
      'app/(public)/space/badges/page.tsx',
      'app/(public)/space/nft/page.tsx',
    ];

    for (const routeFile of routeFiles) {
      expect(readAppFile(routeFile).length).toBeGreaterThan(0);
    }
  });

  it('keeps navigation on safe aliases while legacy routes stay bounded', () => {
    const connectNav = readAppFile('components/connect/Shared/ConnectNav.tsx');
    const activityFeed = readAppFile('components/connect/Dashboard/ActivityFeed.tsx');
    const analyticsView = readAppFile('components/connect/Analytics/AnalyticsView.tsx');
    const balanceCards = readAppFile('components/connect/Dashboard/BalanceCards.tsx');
    const assetsBlock = readAppFile('components/space/Dashboard/AssetsBlock.tsx');

    expect(connectNav).toContain('ROUTE_ALIASES.connectActivity');
    expect(connectNav).toContain('ROUTE_ALIASES.connectWalletLegacy');
    expect(activityFeed).toContain('ROUTE_ALIASES.connectActivity');
    expect(analyticsView).toContain('ROUTE_ALIASES.connectActivity');
    expect(balanceCards).toContain('ROUTE_ALIASES.connectActivity');

    expect(assetsBlock).toContain('ROUTE_ALIASES.spaceActivity');
    expect(assetsBlock).toContain('ROUTE_ALIASES.spaceVouchers');
    expect(assetsBlock).toContain('ROUTE_ALIASES.spaceActivitySummary');
    expect(assetsBlock).not.toContain('/space/balance');
  });

  it('keeps aliases non-authoritative and free from fake metadata', () => {
    const aliasFiles = [
      'lib/routeAliases.ts',
      'app/(authenticated)/connect/activity/page.tsx',
      'app/(authenticated)/connect/wallet/page.tsx',
      'app/(public)/space/activity-summary/page.tsx',
      'app/(public)/space/balance/page.tsx',
      'app/(public)/space/badges/page.tsx',
      'app/(public)/space/nft/page.tsx',
    ];
    const source = aliasFiles.map(readAppFile).join('\n');

    expect(LEGACY_ROUTE_NOTICES.connectWallet).toContain('not a financial wallet');
    expect(LEGACY_ROUTE_NOTICES.spaceBalance).toContain('not an accounting balance');
    expect(LEGACY_ROUTE_NOTICES.spaceNft).toContain('NFT ownership');

    expect(source).toContain('not a receipt');
    expect(source).toContain('not accounting balance');
    expect(source).toContain('NFT ownership and on-chain semantics are inactive');
    expect(source).not.toMatch(/proofClass|sourceOwner|ownerFactRef|dataFreshness|stalenessStatus|projectionGeneratedAt|asOf/);
    expect(source).not.toMatch(/wallet balance|cashback|payout|bridge|top-up|withdraw/i);
  });

  it('extends protected route matching only where the legacy route was protected', () => {
    const middleware = readAppFile('middleware.ts');

    expect(middleware).toContain('/space/activity-summary(.*)');
    expect(middleware).toContain('/space/balance(.*)');
    expect(middleware).not.toContain('/space/badges(.*)');
  });
});

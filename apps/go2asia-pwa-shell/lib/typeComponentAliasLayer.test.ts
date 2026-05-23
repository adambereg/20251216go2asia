import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function readAppFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('type and component alias layer governance', () => {
  it('keeps safer component aliases beside legacy compatibility exports', () => {
    const walletBarrel = readAppFile('components/connect/Wallet/index.ts');
    const dashboardBarrel = readAppFile('components/connect/Dashboard/index.ts');
    const balanceCards = readAppFile('components/connect/Dashboard/BalanceCards.tsx');
    const spaceBalanceBarrel = readAppFile('components/space/Balance/index.ts');
    const spaceNftBarrel = readAppFile('components/space/NFT/index.ts');

    expect(walletBarrel).toContain('WalletView');
    expect(walletBarrel).toContain('ConnectActivityView');
    expect(dashboardBarrel).toContain('BalanceCards');
    expect(dashboardBarrel).toContain('ConnectActivitySummaryCards');
    expect(balanceCards).toContain('export { BalanceCards as ConnectActivitySummaryCards }');
    expect(spaceBalanceBarrel).toContain('SpaceActivitySummaryDeferredView');
    expect(spaceNftBarrel).toContain('SpaceBadgesDeferredView');
  });

  it('exposes safer type aliases while preserving legacy type names', () => {
    const connectTypes = readAppFile('components/connect/types.ts');
    const questTypes = readAppFile('components/quest/types.ts');
    const spaceTypes = readAppFile('components/space/types.ts');

    expect(connectTypes).toContain('export interface WalletData');
    expect(connectTypes).toContain('export type ConnectActivityProjectionData = WalletData');
    expect(connectTypes).toContain('export interface NFTBadge');
    expect(connectTypes).toContain('export type OffChainBadgePreview = NFTBadge');
    expect(connectTypes).toContain('export interface Reward');
    expect(connectTypes).toContain('export type ParticipationPreview = Reward');
    expect(connectTypes).toContain('export type BadgeCollectionPreviewData = NFTWalletData');

    expect(questTypes).toContain('export type OffChainBadgeRarity = NFTBadgeRarity');
    expect(questTypes).toContain('export type OffChainBadgeCategory = NFTBadgeCategory');
    expect(questTypes).toContain('export type OffChainBadgePreview = NFTBadge');

    expect(spaceTypes).toContain('export type SpaceOffChainBadgePreview = NFTBadge');
  });

  it('moves bounded active imports to aliases without route-wiring Path B components', () => {
    const connectActivityPage = readAppFile('app/(authenticated)/connect/activity/page.tsx');
    const legacyWalletWrapper = readAppFile('app/(authenticated)/connect/wallet/WalletPageClientWrapper.tsx');
    const dashboardContent = readAppFile('components/connect/Dashboard/DashboardContent.tsx');
    const appRouteSource = [
      connectActivityPage,
      readAppFile('app/(public)/space/activity-summary/page.tsx'),
      readAppFile('app/(public)/space/badges/page.tsx'),
      readAppFile('app/(public)/space/balance/page.tsx'),
      readAppFile('app/(public)/space/nft/page.tsx'),
    ].join('\n');

    expect(connectActivityPage).toContain('ConnectActivityView');
    expect(connectActivityPage).not.toContain('WalletView');
    expect(legacyWalletWrapper).toContain('WalletView');
    expect(dashboardContent).toContain('ConnectActivitySummaryCards');
    expect(dashboardContent).not.toContain('<BalanceCards');

    expect(appRouteSource).not.toMatch(/G2ATab|NFTTab|BridgeModal|NFTView|BalanceView/);
    expect(appRouteSource).not.toMatch(/proofClass|sourceOwner|ownerFactRef|dataFreshness|stalenessStatus|projectionGeneratedAt|asOf/);
  });
});

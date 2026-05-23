import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function readAppFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

function collectSourceFiles(relativeDir: string): string[] {
  const root = path.join(process.cwd(), relativeDir);
  if (!existsSync(root)) return [];

  const files: string[] = [];
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        visit(fullPath);
        continue;
      }

      if (/\.(ts|tsx)$/.test(entry)) {
        files.push(path.relative(process.cwd(), fullPath));
      }
    }
  };

  visit(root);
  return files;
}

describe('Path B quarantine hardening', () => {
  it('keeps dormant Path B components out of active app routes', () => {
    const appSource = collectSourceFiles('app')
      .map((file) => readAppFile(file))
      .join('\n');

    expect(appSource).not.toMatch(
      /from ['"][^'"]*(NFTTab|G2ATab|BridgeModal|NFTView|BalanceView)|<(NFTTab|G2ATab|BridgeModal|NFTView|BalanceView)\b/
    );
    expect(appSource).not.toMatch(/from ['"]@\/components\/space\/(Balance|NFT)['"]/);
    expect(appSource).not.toMatch(/from ['"]@\/components\/space['"].*\b(BalanceView|NFTView)\b/);
  });

  it('keeps broad barrels from exporting mock-heavy Path B views', () => {
    const spaceBarrel = readAppFile('components/space/index.ts');
    const walletBarrel = readAppFile('components/connect/Wallet/index.ts');
    const spaceBalanceBarrel = readAppFile('components/space/Balance/index.ts');
    const spaceNftBarrel = readAppFile('components/space/NFT/index.ts');

    expect(spaceBarrel).not.toContain("export * from './Balance'");
    expect(spaceBarrel).not.toContain("export * from './NFT'");

    expect(walletBarrel).not.toMatch(/export .*NFTTab/);
    expect(walletBarrel).not.toMatch(/export .*G2ATab/);
    expect(walletBarrel).not.toMatch(/export .*BridgeModal/);

    expect(spaceBalanceBarrel).toContain('@deprecated');
    expect(spaceBalanceBarrel).toContain('SpaceActivitySummaryDeferredView');
    expect(spaceNftBarrel).toContain('@deprecated');
    expect(spaceNftBarrel).toContain('SpaceBadgesDeferredView');
  });

  it('keeps active route/navigation source free of Path B activation terms', () => {
    const routeAdjacentSource = [
      ...collectSourceFiles('app/(authenticated)/connect'),
      ...collectSourceFiles('app/(public)/space'),
      'components/connect/Shared/ConnectNav.tsx',
      'components/space/Dashboard/AssetsBlock.tsx',
      'components/space/index.ts',
    ]
      .map((file) => readAppFile(file))
      .join('\n');

    expect(routeAdjacentSource).not.toMatch(/wallet balance|cashback|payout|top-up|withdraw/i);
    expect(routeAdjacentSource).not.toMatch(/\bbridge\b|\btoken ownership\b/i);
    expect(routeAdjacentSource).not.toMatch(/NFT ownership (confirmed|enabled|active|proof|receipt)/i);
    expect(routeAdjacentSource).toContain('NFT ownership and on-chain semantics are inactive');
  });
});

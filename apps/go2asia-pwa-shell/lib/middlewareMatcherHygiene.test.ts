import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function readAppFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('middleware matcher hygiene', () => {
  it('protects quest run and keeps pro/admin routes behind auth gate', () => {
    const middleware = readAppFile('middleware.ts');

    expect(middleware).toContain("'/quest/(.*)/run(.*)'");
    expect(middleware).toContain("'/quest/pro(.*)'");
    expect(middleware).toContain("'/admin(.*)'");
    expect(middleware).not.toContain("'/quest/[id]/run(.*)'");
  });

  it('preserves redirect_url continuity with query string', () => {
    const middleware = readAppFile('middleware.ts');

    expect(middleware).toContain("const redirectTarget = `${pathname}${search || ''}`;");
    expect(middleware).toContain("signInUrl.searchParams.set('redirect_url', redirectTarget);");
  });

  it('checks auth gate before role gates', () => {
    const middleware = readAppFile('middleware.ts');
    const protectedIdx = middleware.indexOf('if (isProtectedRoute(req) && !userId)');
    const adminIdx = middleware.indexOf('if (isAdminRoute(req))');
    const proIdx = middleware.indexOf('if (isPRORoute(req))');

    expect(protectedIdx).toBeGreaterThan(-1);
    expect(adminIdx).toBeGreaterThan(-1);
    expect(proIdx).toBeGreaterThan(-1);
    expect(protectedIdx).toBeLessThan(adminIdx);
    expect(adminIdx).toBeLessThan(proIdx);
  });

  it('does not import identity-core into pwa middleware', () => {
    const middleware = readAppFile('middleware.ts');
    expect(middleware).not.toContain('@go2asia/identity-core');
  });
});

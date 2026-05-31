import { describe, expect, it } from 'vitest';
import { assertLegacyNotGroupQualitySignal } from '../src/domain/forbiddenTransformations';
import {
  MINIMUM_HANDSHAKE_SURFACES,
  applyFt5SurfaceLegacyGuards,
  assertActivityFeedSurfaceProjection,
  assertHighlightSurfaceMatrix,
  assertNonEmptySurfaceId,
  assertSurfaceLegacyMatrix,
  buildSurfaceLegacyContext,
  buildSurfaceMatrixProof,
  rowInputForSurface,
} from '../src/domain/perSurfaceLegacyMatrix';

describe('FT-5D per-surface legacy matrix', () => {
  const legacyPublicRow = {
    postType: 'repost' as const,
    visibility: 'public' as const,
    text: null,
    repostTargetType: 'place',
    repostTargetId: 'place_bkk',
  };

  const legacyGroupRow = {
    postType: 'repost' as const,
    visibility: 'group' as const,
    text: null,
    repostTargetType: 'place',
    repostTargetId: 'g1',
  };

  const privateRetentionRow = {
    postType: 'repost' as const,
    visibility: 'private' as const,
    text: 'owner note',
    repostTargetType: 'place',
    repostTargetId: 'place_bkk',
  };

  it('defines minimum handshake surfaces from gate 13B.5-K', () => {
    expect(MINIMUM_HANDSHAKE_SURFACES).toEqual([
      'home_feed',
      'group_feed',
      'profile_feed',
      'publications',
      'activity_feed',
      'highlight',
      'post_detail',
    ]);
  });

  it('T1 home_feed: legacy public repost is carve-out, not authorial canon', () => {
    const row = rowInputForSurface(legacyPublicRow, 'home_feed');
    expect(() => applyFt5SurfaceLegacyGuards('home_feed', row)).not.toThrow();
    const proof = buildSurfaceMatrixProof(buildSurfaceLegacyContext('home_feed', row));
    expect(proof.legacyCarveOutOnSurface).toBe(true);
    expect(proof.notAuthorialPublicationOnSurface).toBe(true);
    expect(proof.taxonomyClass).toBe('L_PUBLIC_REPOST');
  });

  it('T2 group_feed: legacy group repost classified; group quality blocked via FT-5C', () => {
    const row = rowInputForSurface(legacyGroupRow, 'group_feed');
    expect(() => applyFt5SurfaceLegacyGuards('group_feed', row)).not.toThrow();
    const ctx = buildSurfaceLegacyContext('group_feed', row);
    expect(ctx.taxonomyClass).toBe('L_GROUP_REPOST');
    expect(() => assertLegacyNotGroupQualitySignal(ctx, true)).toThrow(/FT-07/);
  });

  it('T3 profile_feed: surface profile yields L_PROFILE_REPOST_ITEM (FR-N2)', () => {
    const row = rowInputForSurface(legacyPublicRow, 'profile_feed');
    expect(() => applyFt5SurfaceLegacyGuards('profile_feed', row)).not.toThrow();
    const ctx = buildSurfaceLegacyContext('profile_feed', row);
    expect(ctx.taxonomyClass).toBe('L_PROFILE_REPOST_ITEM');
    expect(ctx.distinction.subkind).toBe('legacy_profile_carve_out');
  });

  it('T4 publications: surface publications yields profile artifact class', () => {
    const row = rowInputForSurface(legacyPublicRow, 'publications');
    const ctx = buildSurfaceLegacyContext('publications', row);
    expect(ctx.taxonomyClass).toBe('L_PROFILE_REPOST_ITEM');
    expect(() => assertSurfaceLegacyMatrix(ctx)).not.toThrow();
    const proof = buildSurfaceMatrixProof(ctx);
    expect(proof.notAuthorialPublicationOnSurface).toBe(true);
  });

  it('T5 activity_feed: repost activity projections are legacy carve-out', () => {
    expect(() =>
      assertActivityFeedSurfaceProjection({ actionType: 'space.repost_created' })
    ).not.toThrow();
    expect(() =>
      assertActivityFeedSurfaceProjection({ actionType: 'space.post_reposted_by_other' })
    ).not.toThrow();
  });

  it('T6 highlight: highlight reference is legacy carve-out', () => {
    expect(() => assertHighlightSurfaceMatrix()).not.toThrow();
  });

  it('T7 post_detail: legacy public repost read shape passes matrix', () => {
    const row = rowInputForSurface(legacyPublicRow, 'post_detail');
    expect(() => applyFt5SurfaceLegacyGuards('post_detail', row)).not.toThrow();
  });

  it('T8 followers_feed: followers legacy uses legacy_followers_carve_out', () => {
    const row = rowInputForSurface(
      {
        postType: 'repost',
        visibility: 'followers',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'p1',
      },
      'followers_feed'
    );
    const ctx = buildSurfaceLegacyContext('followers_feed', row);
    expect(ctx.distinction.subkind).toBe('legacy_followers_carve_out');
    expect(() => assertSurfaceLegacyMatrix(ctx)).not.toThrow();
  });

  it('T9 regression surface: regression on home_feed is not legacy carve-out', () => {
    const row = rowInputForSurface(legacyPublicRow, 'home_feed');
    expect(() =>
      applyFt5SurfaceLegacyGuards('home_feed', row, { isPostAlignmentRegression: true })
    ).not.toThrow();
    const ctx = buildSurfaceLegacyContext('home_feed', row, { isPostAlignmentRegression: true });
    expect(ctx.distinction.category).toBe('regression');
    expect(ctx.taxonomyClass).toBeNull();
  });

  it('T10 F9 negative: empty surface id cannot pass matrix alignment', () => {
    expect(() => assertNonEmptySurfaceId('')).toThrow(/F9/);
    expect(() => assertNonEmptySurfaceId(null)).toThrow(/F9/);
  });

  it('T11 cross-surface consistency: same row differs on home vs profile', () => {
    const homeCtx = buildSurfaceLegacyContext('home_feed', rowInputForSurface(legacyPublicRow, 'home_feed'));
    const profileCtx = buildSurfaceLegacyContext(
      'profile_feed',
      rowInputForSurface(legacyPublicRow, 'profile_feed')
    );
    expect(homeCtx.taxonomyClass).toBe('L_PUBLIC_REPOST');
    expect(profileCtx.taxonomyClass).toBe('L_PROFILE_REPOST_ITEM');
    expect(homeCtx.distinction.subkind).not.toBe(profileCtx.distinction.subkind);
  });

  it('T12 FT-5C integration: private retention on profile_feed is target, not legacy', () => {
    const row = rowInputForSurface(privateRetentionRow, 'profile_feed');
    expect(() => applyFt5SurfaceLegacyGuards('profile_feed', row)).not.toThrow();
    const ctx = buildSurfaceLegacyContext('profile_feed', row);
    expect(ctx.distinction.category).toBe('target_behavior');
    expect(ctx.taxonomyClass).toBeNull();
  });

  it('regression cannot disguise as legacy on surface', () => {
    const ctx = buildSurfaceLegacyContext('home_feed', rowInputForSurface(legacyPublicRow, 'home_feed'));
    const disguised = {
      ...ctx,
      distinction: {
        category: 'regression' as const,
        subkind: 'legacy_public_carve_out' as never,
        taxonomyClass: 'L_PUBLIC_REPOST' as const,
        isAmbiguous: false,
      },
    };
    expect(() => assertSurfaceLegacyMatrix(disguised)).toThrow(/FT-R2L|regression/);
  });
});

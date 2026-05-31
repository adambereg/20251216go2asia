import { describe, expect, it } from 'vitest';
import {
  FORBIDDEN_TRANSFORM_IDS,
  assertDedupeScopeNotBlockingAuthorial,
  assertForbiddenTransformationGuards,
  assertLegacyArtifactNotConvertedTo,
  assertLegacyChainNotReconstructedAsAncestry,
  assertLegacyNotBlogCandidate,
  assertLegacyNotGroupQualitySignal,
  assertLegacyCarveOutNotTreatedAsTarget,
  assertLegacyNotJustifyingNewPropagation,
  assertPrivateRepostNotIncomingPressure,
  assertRegressionNotDisguisedAsLegacy,
  assertVerificationAlignmentStrategyAllowed,
  buildForbiddenGuardContext,
  buildForbiddenGuardProof,
  rowToGuardContext,
} from '../src/domain/forbiddenTransformations';
import { classifyRepostArtifactDistinction } from '../src/domain/legacyDistinction';

describe('FT-5C forbidden transformation guards', () => {
  const legacyPublicRow = {
    postType: 'repost' as const,
    visibility: 'public' as const,
    text: null,
    repostTargetType: 'place',
    repostTargetId: 'place_bkk',
  };

  const privateRetentionRow = {
    postType: 'repost' as const,
    visibility: 'private' as const,
    text: 'owner note',
    repostTargetType: 'place',
    repostTargetId: 'place_bkk',
  };

  it('defines full forbidden transform catalog from gate 13B.5-I', () => {
    expect(FORBIDDEN_TRANSFORM_IDS).toContain('FT-01');
    expect(FORBIDDEN_TRANSFORM_IDS).toContain('FT-12');
    expect(FORBIDDEN_TRANSFORM_IDS).toContain('FT-HIDE');
    expect(FORBIDDEN_TRANSFORM_IDS).toContain('FT-L2T');
    expect(FORBIDDEN_TRANSFORM_IDS.length).toBeGreaterThanOrEqual(20);
  });

  it('FT-HIDE / FT-DEL / FT-MIG block hide-delete-migrate alignment strategies', () => {
    for (const strategy of ['hide', 'delete', 'migrate', 'suppress', 'archive', 'grandfather']) {
      expect(() => assertVerificationAlignmentStrategyAllowed(strategy)).toThrow(/FT-5C/);
    }
    expect(() => assertVerificationAlignmentStrategyAllowed(undefined)).not.toThrow();
  });

  it('FT-P4 / FT-01 block legacy to authorial post conversion', () => {
    const ctx = buildForbiddenGuardContext(legacyPublicRow);
    expect(() => assertLegacyArtifactNotConvertedTo(ctx, 'authorial_post')).toThrow(/FT-P4|FT-01/);
  });

  it('FT-P5 / FT-05 block legacy to source reference conversion', () => {
    const ctx = buildForbiddenGuardContext(legacyPublicRow);
    expect(() => assertLegacyArtifactNotConvertedTo(ctx, 'source_reference')).toThrow(/FT-P5|FT-05/);
  });

  it('FT-P1 blocks legacy to private repost conversion', () => {
    const ctx = buildForbiddenGuardContext(legacyPublicRow);
    expect(() => assertLegacyArtifactNotConvertedTo(ctx, 'private_repost')).toThrow(/FT-P1/);
  });

  it('FT-R2L blocks regression disguised as legacy', () => {
    expect(() =>
      assertRegressionNotDisguisedAsLegacy({
        category: 'regression',
        subkind: 'regression_public_propagation',
        taxonomyClass: 'L_PUBLIC_REPOST',
        isAmbiguous: false,
      })
    ).toThrow(/FT-R2L/);
  });

  it('FT-L2T blocks legacy carve-out with target subkind', () => {
    expect(() =>
      assertLegacyCarveOutNotTreatedAsTarget({
        category: 'legacy_carve_out',
        subkind: 'target_private_repost' as never,
        taxonomyClass: 'L_PUBLIC_REPOST',
        isAmbiguous: false,
      })
    ).toThrow(/FT-L2T/);
  });

  it('FT-03 / FT-12 block blog candidacy from legacy carve-out', () => {
    const ctx = buildForbiddenGuardContext(legacyPublicRow);
    expect(() => assertLegacyNotBlogCandidate(ctx)).toThrow(/FT-03|FT-12/);
  });

  it('FT-07 blocks legacy group repost as group quality signal', () => {
    const ctx = buildForbiddenGuardContext({
      postType: 'repost',
      visibility: 'group',
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'g1',
    });
    expect(() => assertLegacyNotGroupQualitySignal(ctx, true)).toThrow(/FT-07/);
  });

  it('FT-08 blocks chain ancestry reconstruction', () => {
    const ctx = buildForbiddenGuardContext({
      postType: 'repost',
      visibility: 'public',
      text: 'chain',
      repostTargetType: 'space_post',
      repostTargetId: 'spost_parent',
    });
    expect(() => assertLegacyChainNotReconstructedAsAncestry(ctx, true)).toThrow(/FT-08/);
  });

  it('FT-06 blocks legacy public repost justifying new public propagation', () => {
    const ctx = buildForbiddenGuardContext(legacyPublicRow);
    expect(() => assertLegacyNotJustifyingNewPropagation(ctx, 'new_public_repost')).toThrow(/FT-06/);
  });

  it('FT-09 blocks incoming activity pressure on private repost target', () => {
    const distinction = classifyRepostArtifactDistinction({ row: privateRetentionRow });
    expect(() => assertPrivateRepostNotIncomingPressure(distinction, true)).toThrow(/FT-09/);
  });

  it('FT-10 blocks retention dedupe from constraining authorial posts', () => {
    expect(() => assertDedupeScopeNotBlockingAuthorial('retention', 'post')).toThrow(/FT-10/);
    expect(() => assertDedupeScopeNotBlockingAuthorial('propagation', 'post')).not.toThrow();
  });

  it('assertForbiddenTransformationGuards passes for legacy public repost read shape', () => {
    const ctx = rowToGuardContext(legacyPublicRow);
    expect(() => assertForbiddenTransformationGuards(ctx)).not.toThrow();
    const proof = buildForbiddenGuardProof(ctx);
    expect(proof.legacyToP4Blocked).toBe(true);
    expect(proof.legacyToP5Blocked).toBe(true);
    expect(proof.hideDeleteMigrateAlignmentBlocked).toBe(true);
  });

  it('assertForbiddenTransformationGuards passes for private retention target', () => {
    const ctx = rowToGuardContext(privateRetentionRow);
    expect(ctx.distinction.category).toBe('target_behavior');
    expect(() => assertForbiddenTransformationGuards(ctx)).not.toThrow();
  });

  it('regression marker keeps regression distinct from legacy (FT-R2L)', () => {
    const distinction = classifyRepostArtifactDistinction({
      row: legacyPublicRow,
      isPostAlignmentRegression: true,
    });
    expect(distinction.category).toBe('regression');
    const ctx = { row: legacyPublicRow, distinction, taxonomyClass: null };
    expect(() => assertForbiddenTransformationGuards(ctx)).not.toThrow();
    const proof = buildForbiddenGuardProof(ctx);
    expect(proof.regressionToLegacyBlocked).toBe(true);
  });

  it('legacy commentary remains propagation lane not authorial (FT-02 / FT-11)', () => {
    const ctx = buildForbiddenGuardContext({
      postType: 'repost',
      visibility: 'public',
      text: 'historical lane only',
      repostTargetType: 'place',
      repostTargetId: 'p1',
    });
    const proof = buildForbiddenGuardProof(ctx);
    expect(proof.authorialTextFromLegacyCommentaryBlocked).toBe(true);
    expect(proof.commentaryCanonQuarantineBlocked).toBe(true);
  });
});

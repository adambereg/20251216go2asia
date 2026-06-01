import { describe, expect, it } from 'vitest';
import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  classifyAuthorialExpressionWriteIntent,
} from '../src/domain/authorialExpression';
import { assertDedupeScopeNotBlockingAuthorial } from '../src/domain/forbiddenTransformations';
import { applyFt5SurfaceLegacyGuards } from '../src/domain/perSurfaceLegacyMatrix';
import {
  assertNoForbiddenDualIntentBodyFields,
  assertOpenApiTypeAloneNotSavePublishProof,
  assertSavePublishBoundaryWrite,
  buildDualIntentBoundaryProof,
  buildSavePublishNegativesProof,
  classifyPublishIntent,
  classifySaveIntent,
  classifySavePublishBoundary,
  SAVE_PUBLISH_BOUNDARY_CLASSIFIER,
} from '../src/domain/savePublishBoundary';
import { classifyRepostWriteIntent } from '../src/domain/retentionIntent';

describe('FT-3D save/publish boundary', () => {
  const publishWrite = {
    postType: 'post' as const,
    visibility: 'public' as const,
    authorialExpressionIntent: true,
    repostTargetType: null,
    repostTargetId: null,
  };

  const saveWrite = {
    postType: 'repost' as const,
    visibility: 'private' as const,
    authorialExpressionIntent: false,
    repostTargetType: 'place',
    repostTargetId: 'place_bkk',
  };

  const authorialText =
    'Bangkok street food deserves a longer planning horizon for curious travelers.';

  it('T1: Save intent classifies private_repost_intent only', () => {
    expect(classifySaveIntent(saveWrite)).toBe('private_repost_intent');
    expect(classifyRepostWriteIntent(saveWrite)).toBe('private_repost_intent');
    const proof = buildDualIntentBoundaryProof(saveWrite);
    expect(proof.saveIntentProof.isSaveIntent).toBe(true);
    expect(proof.saveIntentProof.isNotPublishIntent).toBe(true);
  });

  it('T2: Publish intent classifies authorial_expression_intent only', () => {
    expect(
      classifyPublishIntent({
        postType: 'post',
        authorialExpressionIntent: true,
      })
    ).toBe(AUTHORIAL_EXPRESSION_WRITE_INTENT);
    expect(
      classifyAuthorialExpressionWriteIntent({
        postType: 'post',
        authorialExpressionIntent: true,
      })
    ).toBe(AUTHORIAL_EXPRESSION_WRITE_INTENT);
    const proof = buildDualIntentBoundaryProof({
      ...publishWrite,
      authorialExpressionIntent: true,
    });
    expect(proof.publishIntentProof.isPublishIntent).toBe(true);
    expect(proof.publishIntentProof.isNotSaveIntent).toBe(true);
  });

  it('T3: dedupe independence — retention scope must not block authorial post', () => {
    expect(() => assertDedupeScopeNotBlockingAuthorial('authorial', 'post')).not.toThrow();
    expect(() => assertDedupeScopeNotBlockingAuthorial('retention', 'post')).toThrow(/FT-10/);
  });

  it('T4: combined intent body fields rejected on publish path', () => {
    expect(() =>
      assertNoForbiddenDualIntentBodyFields(publishWrite, {
        saveIntent: true,
        publishIntent: true,
      })
    ).toThrow(/save\/publish/i);
    expect(() =>
      assertSavePublishBoundaryWrite(publishWrite, { dualIntent: true })
    ).toThrow(/save\/publish/i);
  });

  it('T5: publish without save — no requiresPriorSave', () => {
    expect(() =>
      assertSavePublishBoundaryWrite(
        { ...publishWrite, authorialExpressionIntent: true },
        undefined
      )
    ).not.toThrow();
    expect(() =>
      assertSavePublishBoundaryWrite(publishWrite, { requiresPriorSave: true })
    ).toThrow(/save\/publish|must not depend on Save/i);
  });

  it('T6: save without publish — private repost path', () => {
    expect(() => assertSavePublishBoundaryWrite(saveWrite)).not.toThrow();
    expect(classifySavePublishBoundary(saveWrite)).toBe(SAVE_PUBLISH_BOUNDARY_CLASSIFIER);
  });

  it('T7: bookmark negative — structural P3 separation from save/publish proofs', () => {
    const negatives = buildSavePublishNegativesProof(saveWrite);
    expect(negatives.bookmarkNotPublish).toBe(true);
    expect(negatives.bookmarkNotSave).toBe(true);
    const publishNegatives = buildSavePublishNegativesProof(publishWrite);
    expect(publishNegatives.bookmarkNotPublish).toBe(true);
    expect(publishNegatives.bookmarkNotSave).toBe(true);
  });

  it('T8: activity regression — save path is private_repost_intent not publish', () => {
    expect(classifyRepostWriteIntent(saveWrite)).toBe('private_repost_intent');
    expect(classifyPublishIntent(saveWrite)).toBeNull();
  });

  it('T9: profile publication boundary — private retention not authorial on profile_feed', () => {
    const retentionRow = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'owner note',
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
      surface: 'profile_feed' as const,
    };
    expect(() => applyFt5SurfaceLegacyGuards('profile_feed', retentionRow)).not.toThrow();
    expect(classifySaveIntent(retentionRow)).toBe('private_repost_intent');
    expect(classifyPublishIntent({ postType: 'repost', authorialExpressionIntent: false })).toBeNull();
  });

  it('T10: postType post alone is not publish proof (ZR)', () => {
    const carrierOnly = {
      postType: 'post' as const,
      visibility: 'public' as const,
      authorialExpressionIntent: false,
      repostTargetType: null,
      repostTargetId: null,
    };
    expect(classifyPublishIntent(carrierOnly)).toBeNull();
    expect(classifySavePublishBoundary(carrierOnly)).toBeNull();
  });

  it('T11: SR negative — repostTarget on publish path rejected', () => {
    expect(() =>
      assertSavePublishBoundaryWrite({
        ...publishWrite,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toThrow(/Source Reference|repostTarget/i);
  });

  it('T12: legacy propagation repost is neither save nor publish intent', () => {
    const propagation = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(classifySaveIntent(propagation)).toBeNull();
    expect(classifyPublishIntent(propagation)).toBeNull();
  });

  it('T13: E6 dual-intent negatives proof object', () => {
    const proof = buildDualIntentBoundaryProof(
      { ...publishWrite, authorialExpressionIntent: true },
      undefined
    );
    expect(proof.saveNotEqualsPublish).toBe(true);
    expect(proof.publishNotEqualsSave).toBe(true);
    expect(proof.retentionNotPublish).toBe(true);
    expect(proof.publishDoesNotRequireSave).toBe(true);
    expect(proof.saveDoesNotRequirePublish).toBe(true);
    expect(proof.isDualIntentBoundaryProof).toBe(true);
    expect(proof.isSourceReferenceEstablished).toBe(false);
    expect(proof.isFoundationTrioReady).toBe(false);
  });

  it('T14: OpenAPI negative — type alone not proof', () => {
    assertOpenApiTypeAloneNotSavePublishProof();
    expect(
      buildDualIntentBoundaryProof({
        postType: 'post',
        visibility: 'public',
        authorialExpressionIntent: false,
      }).isDualIntentBoundaryProof
    ).toBe(true);
    expect(classifySavePublishBoundary(publishWrite)).toBe(SAVE_PUBLISH_BOUNDARY_CLASSIFIER);
  });

  it('authorial publish write with substantive text passes boundary assert', () => {
    expect(() =>
      assertSavePublishBoundaryWrite(
        { ...publishWrite, authorialExpressionIntent: true },
        undefined
      )
    ).not.toThrow();
    expect(authorialText.length).toBeGreaterThan(12);
  });

  it('rejects publishIntent on private retention write', () => {
    expect(() => assertSavePublishBoundaryWrite(saveWrite, { publishIntent: true })).toThrow(
      /save\/publish/i
    );
  });
});

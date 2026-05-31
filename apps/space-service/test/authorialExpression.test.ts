import { describe, expect, it } from 'vitest';
import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  AUTHORIAL_TEXT_ROLE,
  applyAuthorialExpressionReadGuards,
  assertAuthorialExpressionWrite,
  assertOpenApiTypeAloneNotAuthorialProof,
  authorialDistinctionForRegressionCheck,
  buildAuthorialNegativesProof,
  buildAuthorialP4ClassificationProof,
  classifyAuthorialExpressionWriteIntent,
  classifyAuthorialTextRole,
} from '../src/domain/authorialExpression';
import { applyFt5SurfaceLegacyGuards } from '../src/domain/perSurfaceLegacyMatrix';
import { classifyRepostTextRole, classifyRepostWriteIntent } from '../src/domain/retentionIntent';

describe('FT-3A authorial expression boundary', () => {
  const authorialWriteInput = {
    postType: 'post' as const,
    visibility: 'public' as const,
    text: 'My authorial thought.',
    authorialExpressionIntent: true,
    repostTargetType: null,
    repostTargetId: null,
  };

  const authorialCarrierRow = {
    postType: 'post' as const,
    visibility: 'public' as const,
    text: 'My authorial thought.',
    repostTargetType: null,
    repostTargetId: null,
    surface: null as const,
  };

  it('T1: authorial expression write classifies authorial_expression_intent', () => {
    expect(
      classifyAuthorialExpressionWriteIntent({
        postType: 'post',
        authorialExpressionIntent: true,
      })
    ).toBe(AUTHORIAL_EXPRESSION_WRITE_INTENT);
    expect(
      classifyAuthorialExpressionWriteIntent({
        postType: 'post',
        authorialExpressionIntent: false,
      })
    ).toBeNull();
  });

  it('T2: postType post + authorial intent produces P4 classification proof', () => {
    const proof = buildAuthorialP4ClassificationProof(authorialWriteInput);
    expect(proof.isP4ClassificationProof).toBe(true);
    expect(proof.textRole).toBe(AUTHORIAL_TEXT_ROLE);
    expect(proof.isAuthorialPostRuntimePrimitiveEstablished).toBe(false);
    expect(classifyAuthorialTextRole(authorialWriteInput)).toBe(AUTHORIAL_TEXT_ROLE);
  });

  it('T3: private repost write does not classify as authorial (P1 ≠ P4)', () => {
    const proof = buildAuthorialP4ClassificationProof({
      postType: 'repost',
      visibility: 'private',
      text: 'owner retention',
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    });
    expect(proof.isAuthorialExpressionWrite).toBe(false);
    expect(proof.isP4ClassificationProof).toBe(false);
    expect(classifyRepostWriteIntent({ postType: 'repost', visibility: 'private' })).toBe(
      'private_repost_intent'
    );
  });

  it('T4: legacy repost commentary does not classify as Authorial Text (P6)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: 'legacy commentary on propagation',
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(classifyRepostTextRole(row)).toBe('propagation_commentary');
    expect(classifyAuthorialTextRole({ ...row, authorialExpressionIntent: false })).toBeNull();
    const negatives = buildAuthorialNegativesProof(row);
    expect(negatives.legacyCommentaryNotAuthorialText).toBe(true);
  });

  it('T5: private note text on repost does not classify as Authorial Text (P2)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'owner note',
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(classifyRepostTextRole(row)).toBe('private_note');
    expect(classifyAuthorialTextRole({ ...row, authorialExpressionIntent: false })).toBeNull();
    const negatives = buildAuthorialNegativesProof(row);
    expect(negatives.privateNoteNotAuthorialText).toBe(true);
  });

  it('T6: authorial write rejects repostTarget* fields (SR collapse negative)', () => {
    expect(() =>
      assertAuthorialExpressionWrite({
        ...authorialWriteInput,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toThrow(/repostTarget/);
  });

  it('T7: read-path authorial post passes FT-5D profile surface without legacy publication false-pass', () => {
    expect(() => applyAuthorialExpressionReadGuards('profile_feed', authorialCarrierRow)).not.toThrow();
    expect(() => applyAuthorialExpressionReadGuards('post_detail', authorialCarrierRow)).not.toThrow();
  });

  it('T8: retention dedupe scope does not block authorial post path (FT-1D)', () => {
    expect(() => assertAuthorialExpressionWrite(authorialWriteInput)).not.toThrow();
  });

  it('T9: empty or label-only payload does not pass as authorial (F19 negative)', () => {
    expect(() =>
      assertAuthorialExpressionWrite({
        ...authorialWriteInput,
        text: '   ',
      })
    ).toThrow(/non-empty Authorial Text/);
    expect(() =>
      assertAuthorialExpressionWrite({
        ...authorialWriteInput,
        text: null,
      })
    ).toThrow(/non-empty Authorial Text/);
    const carrierOnly = buildAuthorialP4ClassificationProof({
      postType: 'post',
      visibility: 'public',
      text: 'Generic carrier without explicit intent',
      authorialExpressionIntent: false,
    });
    expect(carrierOnly.isP4ClassificationProof).toBe(false);
    expect(carrierOnly.isNotPostTypePostAloneProof).toBe(true);
  });

  it('T10: OpenAPI type presence alone does not satisfy authorial proof (F5 negative)', () => {
    assertOpenApiTypeAloneNotAuthorialProof();
    const withoutIntent = buildAuthorialP4ClassificationProof({
      postType: 'post',
      visibility: 'public',
      text: 'Generic carrier only',
      authorialExpressionIntent: false,
    });
    expect(withoutIntent.isP4ClassificationProof).toBe(false);
    expect(withoutIntent.isNotPostTypePostAloneProof).toBe(true);
  });

  it('T11: WS-5 guards still apply on repost reads alongside authorial path', () => {
    const legacyRow = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
      surface: null as const,
    };
    expect(() => applyFt5SurfaceLegacyGuards('home_feed', legacyRow)).not.toThrow();
    expect(() => applyAuthorialExpressionReadGuards('home_feed', authorialCarrierRow)).not.toThrow();
  });

  it('T12: regression propagation repost after alignment ≠ authorial post', () => {
    const regressionRow = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_new',
      surface: null as const,
    };
    const distinction = authorialDistinctionForRegressionCheck(regressionRow, true);
    expect(distinction.category).toBe('regression');
    const proof = buildAuthorialP4ClassificationProof({
      postType: 'repost',
      visibility: 'public',
      text: null,
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'place_new',
    });
    expect(proof.isAuthorialExpressionWrite).toBe(false);
    const negatives = buildAuthorialNegativesProof({
      postType: 'repost',
      visibility: 'public',
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_new',
    });
    expect(negatives.legacyRowNotAuthorialPost).toBe(true);
  });

  it('E6: repostTarget on post carrier fails read guard (not Source Reference)', () => {
    expect(() =>
      applyAuthorialExpressionReadGuards('profile_feed', {
        postType: 'post',
        visibility: 'public',
        text: 'bad',
        repostTargetType: 'place',
        repostTargetId: 'x',
        surface: null,
      })
    ).toThrow(/repostTarget/);
  });
});

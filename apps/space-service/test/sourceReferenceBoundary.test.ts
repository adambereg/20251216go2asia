import { describe, expect, it } from 'vitest';
import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  classifyAuthorialExpressionWriteIntent,
} from '../src/domain/authorialExpression';
import {
  assertAuthorialIndependenceWrite,
  classifyAuthorialIndependence,
} from '../src/domain/authorialIndependence';
import {
  assertSavePublishBoundaryWrite,
  classifySavePublishBoundary,
} from '../src/domain/savePublishBoundary';
import {
  SOURCE_REFERENCE_CLASSIFIER,
  assertOpenApiTypeAloneNotSourceReferenceProof,
  assertSourceReferenceBoundaryWrite,
  buildSourceReferenceProof,
  classifySourceReference,
  parseSourceReferenceFromBody,
} from '../src/domain/sourceReferenceBoundary';
import { assertDedupeScopeNotBlockingAuthorial } from '../src/domain/forbiddenTransformations';
import { classifyRepostWriteIntent } from '../src/domain/retentionIntent';

describe('FT-3B source reference boundary', () => {
  const authorialText =
    'Bangkok street food deserves a longer planning horizon for curious travelers.';

  const authorialWrite = {
    postType: 'post' as const,
    visibility: 'public' as const,
    text: authorialText,
    authorialExpressionIntent: true,
    repostTargetType: null,
    repostTargetId: null,
    sourceReference: null,
  };

  const withSource = {
    ...authorialWrite,
    sourceReference: {
      sourceMaterialType: 'place',
      sourceMaterialId: 'place_bkk',
    },
  };

  it('T1: authorial post without Source Reference passes optional mode', () => {
    const proof = buildSourceReferenceProof(authorialWrite);
    expect(proof.mode).toBe('optional');
    expect(proof.hopCount).toBe(0);
    expect(proof.isSourceReferenceBoundaryProof).toBe(true);
    expect(classifySourceReference(authorialWrite)).toBe(SOURCE_REFERENCE_CLASSIFIER);
    expect(() => assertSourceReferenceBoundaryWrite(authorialWrite)).not.toThrow();
  });

  it('T2: authorial post with one-hop Source Reference passes', () => {
    const proof = buildSourceReferenceProof(withSource);
    expect(proof.mode).toBe('one_hop');
    expect(proof.hopCount).toBe(1);
    expect(proof.secondaryToAuthorText).toBe(true);
    expect(proof.notRepost).toBe(true);
    expect(proof.notChain).toBe(true);
    expect(() => assertSourceReferenceBoundaryWrite(withSource)).not.toThrow();
  });

  it('T3: second reference in body is rejected', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite(
        {
          ...withSource,
          sourceReference: { sourceMaterialType: 'place', sourceMaterialId: 'place_2' },
        },
        {
          sourceReference: { sourceMaterialType: 'event', sourceMaterialId: 'event_1' },
          sourceMaterialType: 'place',
          sourceMaterialId: 'place_bkk',
        }
      )
    ).toThrow(/zero-or-one|multiple/i);
  });

  it('T4: non-authorial write with Source Reference is rejected', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        postType: 'post',
        visibility: 'public',
        text: 'Generic post without authorial intent.',
        authorialExpressionIntent: false,
        sourceReference: { sourceMaterialType: 'place', sourceMaterialId: 'place_bkk' },
      })
    ).toThrow(/authorial-only/i);
  });

  it('T5: repostTarget* cannot act as Source Reference on authorial path', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        ...authorialWrite,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toThrow(/repostTarget/i);
  });

  it('T6: weak text with Source Reference fails secondary_to_author_text', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        ...withSource,
        text: 'short',
      })
    ).toThrow(/secondary|text-primary|F19/i);
  });

  it('T7: strong author text without Source Reference passes', () => {
    expect(() => assertSourceReferenceBoundaryWrite(authorialWrite)).not.toThrow();
    expect(buildSourceReferenceProof(authorialWrite).isOptionalAttachment).toBe(true);
  });

  it('T8: legacy repost row cannot carry Source Reference', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        postType: 'repost',
        visibility: 'public',
        text: 'legacy commentary',
        authorialExpressionIntent: false,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
        sourceReference: { sourceMaterialType: 'place', sourceMaterialId: 'place_bkk' },
      })
    ).toThrow(/repost|legacy/i);
  });

  it('T9: private retention binding cannot carry Source Reference', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        postType: 'repost',
        visibility: 'private',
        text: 'owner retention note',
        authorialExpressionIntent: false,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
        sourceReference: { sourceMaterialType: 'place', sourceMaterialId: 'place_bkk' },
      })
    ).toThrow(/retention|repost/i);
    expect(
      classifyRepostWriteIntent({
        postType: 'repost',
        visibility: 'private',
      })
    ).toBe('private_repost_intent');
  });

  it('T10: propagation repost path rejects Source Reference', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        postType: 'repost',
        visibility: 'public',
        text: 'public propagation commentary',
        authorialExpressionIntent: false,
        repostTargetType: 'space_post',
        repostTargetId: 'spost_target',
        sourceReference: { sourceMaterialType: 'space_post', sourceMaterialId: 'spost_target' },
      })
    ).toThrow(/repost/i);
  });

  it('T11: authorial Source Reference does not use retention dedupe scope', () => {
    expect(() => assertDedupeScopeNotBlockingAuthorial('authorial', 'post')).not.toThrow();
    expect(() =>
      assertSourceReferenceBoundaryWrite(withSource)
    ).not.toThrow();
  });

  it('T12: parse nested sourceReference object from body', () => {
    const parsed = parseSourceReferenceFromBody({
      sourceReference: {
        sourceMaterialType: 'place',
        sourceMaterialId: 'place_bkk',
      },
    });
    expect(parsed).toEqual({
      sourceMaterialType: 'place',
      sourceMaterialId: 'place_bkk',
    });
  });

  it('T13: OpenAPI type alone is not Source Reference proof', () => {
    expect(() => assertOpenApiTypeAloneNotSourceReferenceProof()).not.toThrow();
    expect(classifySourceReference({ ...authorialWrite, sourceReference: null })).toBe(
      SOURCE_REFERENCE_CLASSIFIER
    );
  });

  it('T14: FT-3A / FT-3C / FT-3D regression on authorial write with optional SR', () => {
    expect(
      classifyAuthorialExpressionWriteIntent({
        postType: 'post',
        authorialExpressionIntent: true,
      })
    ).toBe(AUTHORIAL_EXPRESSION_WRITE_INTENT);
    expect(() =>
      assertAuthorialIndependenceWrite({
        postType: 'post',
        visibility: 'public',
        text: authorialText,
        authorialExpressionIntent: true,
      })
    ).not.toThrow();
    expect(() =>
      assertSavePublishBoundaryWrite({
        postType: 'post',
        visibility: 'public',
        authorialExpressionIntent: true,
        repostTargetType: null,
        repostTargetId: null,
      })
    ).not.toThrow();
    expect(
      classifyAuthorialIndependence({
        postType: 'post',
        visibility: 'public',
        text: authorialText,
        authorialExpressionIntent: true,
      })
    ).not.toBeNull();
    expect(
      classifySavePublishBoundary({
        postType: 'post',
        visibility: 'public',
        authorialExpressionIntent: true,
      })
    ).not.toBeNull();
    expect(() => assertSourceReferenceBoundaryWrite(withSource)).not.toThrow();
  });
});

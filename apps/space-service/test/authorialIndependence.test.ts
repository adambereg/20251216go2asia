import { describe, expect, it } from 'vitest';
import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  AUTHORIAL_TEXT_ROLE,
  classifyAuthorialExpressionWriteIntent,
  classifyAuthorialTextRole,
} from '../src/domain/authorialExpression';
import {
  AUTHORIAL_INDEPENDENCE_CLASSIFIER,
  assertAuthorialIndependenceWrite,
  assertNoSavePublishFieldsOnAuthorialWrite,
  assertOpenApiTypeAloneNotIndependenceProof,
  buildAuthorialIndependenceProof,
  classifyAuthorialIndependence,
  passesSourceDisappearsTest,
} from '../src/domain/authorialIndependence';
import { applyFt5SurfaceLegacyGuards } from '../src/domain/perSurfaceLegacyMatrix';
import { classifyRepostTextRole, classifyRepostWriteIntent } from '../src/domain/retentionIntent';
import { assertDedupeScopeNotBlockingAuthorial } from '../src/domain/forbiddenTransformations';

describe('FT-3C authorial independence boundary', () => {
  const authorialWrite = {
    postType: 'post' as const,
    visibility: 'public' as const,
    text: 'I think Bangkok street food is underrated for travelers who plan longer stays.',
    authorialExpressionIntent: true,
    repostTargetType: null,
    repostTargetId: null,
  };

  it('T1: text-primary independence proof passes on explicit authorial write', () => {
    const proof = buildAuthorialIndependenceProof(authorialWrite);
    expect(proof.isTextPrimary).toBe(true);
    expect(proof.isAuthorialIndependenceProof).toBe(true);
    expect(classifyAuthorialIndependence(authorialWrite)).toBe(AUTHORIAL_INDEPENDENCE_CLASSIFIER);
  });

  it('T2: authorial write does not require postType repost', () => {
    expect(authorialWrite.postType).toBe('post');
    expect(buildAuthorialIndependenceProof(authorialWrite).isRepostIndependent).toBe(true);
  });

  it('T3: private repost path does not satisfy authorial independence (P1)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'owner retention',
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(classifyRepostWriteIntent(row)).toBe('private_repost_intent');
    expect(classifyAuthorialIndependence(row)).toBeNull();
  });

  it('T4: private note text does not satisfy authorial independence (P2)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'owner note',
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(classifyRepostTextRole(row)).toBe('private_note');
    expect(classifyAuthorialIndependence({ ...row, authorialExpressionIntent: true })).toBeNull();
  });

  it('T5: legacy repost commentary does not satisfy authorial independence (P6)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: 'legacy commentary on propagation',
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(classifyRepostTextRole(row)).toBe('propagation_commentary');
    expect(classifyAuthorialIndependence({ ...row, authorialExpressionIntent: true })).toBeNull();
  });

  it('T6: legacy row is not authorial post (P6)', () => {
    const proof = buildAuthorialIndependenceProof({
      postType: 'repost',
      visibility: 'public',
      text: null,
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    });
    expect(proof.isAuthorialIndependenceProof).toBe(false);
  });

  it('T7: authorial independence holds without Source Reference fields', () => {
    expect(passesSourceDisappearsTest(authorialWrite)).toBe(true);
    expect(buildAuthorialIndependenceProof(authorialWrite).isSourceReferenceOptional).toBe(true);
  });

  it('T8: weak or empty text fails independence (F19)', () => {
    expect(() =>
      assertAuthorialIndependenceWrite({
        ...authorialWrite,
        text: '   ',
      })
    ).toThrow(/text-primary/);
    expect(() =>
      assertAuthorialIndependenceWrite({
        ...authorialWrite,
        text: 'Authorial Post',
      })
    ).toThrow(/text-primary/);
  });

  it('T9: postType post without authorialExpressionIntent fails independence proof', () => {
    const proof = buildAuthorialIndependenceProof({
      postType: 'post',
      visibility: 'public',
      text: 'Generic carrier without explicit authorial intent flag on write.',
      authorialExpressionIntent: false,
    });
    expect(proof.isAuthorialIndependenceProof).toBe(false);
    expect(classifyAuthorialIndependence({
      postType: 'post',
      visibility: 'public',
      text: 'Generic carrier without explicit authorial intent flag on write.',
      authorialExpressionIntent: false,
    })).toBeNull();
  });

  it('T10: OpenAPI type presence alone does not satisfy independence (F5)', () => {
    assertOpenApiTypeAloneNotIndependenceProof();
    expect(
      buildAuthorialIndependenceProof({
        postType: 'post',
        visibility: 'public',
        text: 'Shape only',
        authorialExpressionIntent: false,
      }).isAuthorialIndependenceProof
    ).toBe(false);
  });

  it('T11: FT-3A expression intent still required and unchanged (regression)', () => {
    expect(
      classifyAuthorialExpressionWriteIntent({
        postType: 'post',
        authorialExpressionIntent: true,
      })
    ).toBe(AUTHORIAL_EXPRESSION_WRITE_INTENT);
    expect(classifyAuthorialTextRole(authorialWrite)).toBe(AUTHORIAL_TEXT_ROLE);
    expect(() => assertAuthorialIndependenceWrite(authorialWrite)).not.toThrow();
  });

  it('T12: WS-5 guards still apply on repost reads (regression)', () => {
    const legacyRow = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
      surface: null as const,
    };
    expect(() => applyFt5SurfaceLegacyGuards('home_feed', legacyRow)).not.toThrow();
  });

  it('T13: retention dedupe still does not block authorial post path (FT-1D)', () => {
    expect(() => assertDedupeScopeNotBlockingAuthorial('authorial', 'post')).not.toThrow();
  });

  it('T14: save/publish fields on authorial write rejected (FT-3D negative)', () => {
    expect(() =>
      assertNoSavePublishFieldsOnAuthorialWrite(
        { authorialExpressionIntent: true, publishIntent: true, text: 'hello' },
        true
      )
    ).toThrow(/save\/publish/);
    expect(() =>
      assertAuthorialIndependenceWrite(authorialWrite, { saveIntent: 'retention' })
    ).toThrow(/save\/publish/);
  });
});

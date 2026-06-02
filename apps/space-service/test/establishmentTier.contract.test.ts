/**
 * EST-TEST-1 — Establishment-tier evidence contract (Canon v1 EST-E1).
 *
 * Purpose: evidence layer for future Full Establishment Gates (FE-P4 / FE-P5).
 * Does NOT grant P4/P5 full ESTABLISHED, foundation_trio_ready, or ws2_authorized.
 *
 * Run: `pnpm --filter @go2asia/space-service test:establishment`
 * Full regression: `pnpm --filter @go2asia/space-service test`
 */
import { describe, expect, it } from 'vitest';

import type { SpacePostRow } from '../src/db/queries/space';
import {
  applyAuthorialExpressionReadGuards,
  assertAuthorialExpressionWrite,
  buildAuthorialP4ClassificationProof,
  buildAuthorialNegativesProof,
} from '../src/domain/authorialExpression';
import {
  assertAuthorialIndependenceWrite,
  buildAuthorialIndependenceProof,
  classifyAuthorialIndependence,
} from '../src/domain/authorialIndependence';
import {
  assertSavePublishBoundaryWrite,
  buildDualIntentBoundaryProof,
  classifySavePublishBoundary,
} from '../src/domain/savePublishBoundary';
import {
  assertSourceReferenceBoundaryWrite,
  buildSourceReferenceProof,
  classifySourceReference,
} from '../src/domain/sourceReferenceBoundary';
import { rehydrateAuthorialFieldsFromRow } from '../src/domain/persistenceRehydration';
import { applyFt5SurfaceLegacyGuards } from '../src/domain/perSurfaceLegacyMatrix';
import { classifyRepostWriteIntent } from '../src/domain/retentionIntent';

const AUTHORIAL_TEXT =
  'Bangkok street food deserves a longer planning horizon for curious travelers who write independently.';

const authorialWrite = {
  postType: 'post' as const,
  visibility: 'public' as const,
  text: AUTHORIAL_TEXT,
  authorialExpressionIntent: true,
  repostTargetType: null,
  repostTargetId: null,
  sourceReference: null as null,
};

const authorialWithSr = {
  ...authorialWrite,
  sourceReference: {
    sourceMaterialType: 'place' as const,
    sourceMaterialId: 'place_bkk',
  },
};

const authorialCarrierRow = {
  postType: 'post' as const,
  visibility: 'public' as const,
  text: AUTHORIAL_TEXT,
  repostTargetType: null,
  repostTargetId: null,
  surface: null as const,
};

function persistedRow(overrides: Partial<SpacePostRow> = {}): SpacePostRow {
  return {
    id: 'spost_est',
    author_id: 'user_1',
    author_display_name: 'User',
    author_avatar_url: null,
    author_role_label: 'Spacer',
    group_id: null,
    post_type: 'post',
    visibility: 'public',
    text: AUTHORIAL_TEXT,
    repost_target_type: null,
    repost_target_id: null,
    authorial_expression_intent: true,
    source_material_type: null,
    source_material_id: null,
    status: 'active',
    created_at: '2026-03-14T10:00:00.000Z',
    updated_at: '2026-03-14T10:00:00.000Z',
    published_at: '2026-03-14T10:00:00.000Z',
    ...overrides,
  };
}

const ROUTED_READ_SURFACES = [
  'home_feed',
  'profile_feed',
  'group_feed',
  'activity_feed',
  'post_detail',
] as const;

describe('EST-TEST-1 — P4 establishment tier', () => {
  it('E-P4-01: authorial post is independent object (post + intent, not repost)', () => {
    const proof = buildAuthorialP4ClassificationProof(authorialWrite);
    expect(proof.isP4ClassificationProof).toBe(true);
    expect(proof.isAuthorialExpressionWrite).toBe(true);
    expect(proof.isNotLegacyRow).toBe(true);
    expect(proof.isNotPrivateRepostIntent).toBe(true);
    expect(authorialWrite.postType).toBe('post');
    expect(classifyRepostWriteIntent({ postType: 'repost', visibility: 'private' })).toBe(
      'private_repost_intent'
    );
  });

  it('E-P4-02: P4 write is not private save (P1 path rejected)', () => {
    expect(() =>
      assertAuthorialExpressionWrite({
        postType: 'repost',
        visibility: 'private',
        text: 'retention',
        authorialExpressionIntent: true,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toThrow();
    const p1Proof = buildAuthorialP4ClassificationProof({
      postType: 'repost',
      visibility: 'private',
      text: 'retention',
      authorialExpressionIntent: true,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    });
    expect(p1Proof.isP4ClassificationProof).toBe(false);
    expect(p1Proof.isNotPrivateRepostIntent).toBe(false);
  });

  it('E-P4-03: P4 does not use legacy repost mechanics on write', () => {
    expect(() =>
      assertAuthorialExpressionWrite({
        ...authorialWrite,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toThrow(/repostTarget/);
  });

  it('E-P4-04: P4 establishment chain — expression + independence + save/publish', () => {
    expect(() => assertAuthorialExpressionWrite(authorialWrite)).not.toThrow();
    expect(() =>
      assertAuthorialIndependenceWrite({
        postType: authorialWrite.postType,
        visibility: authorialWrite.visibility,
        text: authorialWrite.text,
        authorialExpressionIntent: true,
      })
    ).not.toThrow();
    expect(() => assertSavePublishBoundaryWrite(authorialWrite)).not.toThrow();
    expect(buildAuthorialIndependenceProof(authorialWrite).isTextPrimary).toBe(true);
    expect(classifySavePublishBoundary(authorialWrite)).not.toBeNull();
  });

  it('E-P4-05: CO-13 literal remains false at establishment tier (not governance grant)', () => {
    const proof = buildAuthorialP4ClassificationProof(authorialWrite);
    expect(proof.isAuthorialPostRuntimePrimitiveEstablished).toBe(false);
    const dual = buildDualIntentBoundaryProof(authorialWrite);
    expect(dual.isFoundationTrioReady).toBe(false);
  });

  it('E-P4-06: P4 read-visible on routed HTTP-aligned surfaces (domain guards)', () => {
    for (const surface of ROUTED_READ_SURFACES) {
      expect(() => applyAuthorialExpressionReadGuards(surface, authorialCarrierRow)).not.toThrow();
    }
  });

  it('E-P4-07: publications surface — domain read guards accept authorial carrier', () => {
    expect(() => applyAuthorialExpressionReadGuards('publications', authorialCarrierRow)).not.toThrow();
  });

  it('E-P4-08: highlight surface — domain read guards accept authorial carrier', () => {
    expect(() => applyAuthorialExpressionReadGuards('highlight', authorialCarrierRow)).not.toThrow();
  });

  it('E-P4-08: legacy public repost on read surface is not authorial P4', () => {
    const legacy = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
      surface: null as const,
    };
    expect(() => applyFt5SurfaceLegacyGuards('home_feed', legacy)).not.toThrow();
    const negatives = buildAuthorialNegativesProof(legacy);
    expect(negatives.legacyRowNotAuthorialPost).toBe(true);
    expect(
      classifyAuthorialIndependence({
        ...legacy,
        authorialExpressionIntent: false,
      })
    ).toBeNull();
  });

  it('E-P4-09: save/publish fields rejected on authorial write (no P1 collapse)', () => {
    expect(() =>
      assertSavePublishBoundaryWrite({
        ...authorialWrite,
        repostTargetType: 'place',
        repostTargetId: 'x',
      })
    ).toThrow();
  });
});

describe('EST-TEST-1 — P5 establishment tier', () => {
  it('E-P5-01: Source Reference only on authorial post (0..1)', () => {
    expect(() => assertSourceReferenceBoundaryWrite(authorialWrite)).not.toThrow();
    const proof = buildSourceReferenceProof(authorialWrite);
    expect(proof.mode).toBe('optional');
    expect(proof.hopCount).toBe(0);
    expect(proof.isOptionalAttachment).toBe(true);
  });

  it('E-P5-02: one-hop Source Reference attached to P4', () => {
    const proof = buildSourceReferenceProof(authorialWithSr);
    expect(proof.mode).toBe('one_hop');
    expect(proof.hopCount).toBe(1);
    expect(proof.secondaryToAuthorText).toBe(true);
    expect(() => assertSourceReferenceBoundaryWrite(authorialWithSr)).not.toThrow();
  });

  it('E-P5-03: repostTarget is not Source Reference', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        ...authorialWrite,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toThrow(/repostTarget|CO-S2/i);
  });

  it('E-P5-04: non-authorial post cannot carry Source Reference', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        postType: 'post',
        visibility: 'public',
        text: 'generic',
        authorialExpressionIntent: false,
        sourceReference: { sourceMaterialType: 'place', sourceMaterialId: 'x' },
      })
    ).toThrow(/authorial-only/i);
  });

  it('E-P5-05: persist + rehydrate Source Reference with P4 intent', () => {
    const fields = rehydrateAuthorialFieldsFromRow(
      persistedRow({
        source_material_type: 'place',
        source_material_id: 'place_bkk',
      })
    );
    expect(fields.authorialExpressionIntent).toBe(true);
    expect(fields.sourceReference).toMatchObject({
      sourceMaterialType: 'place',
      sourceMaterialId: 'place_bkk',
      hopCount: 1,
    });
    expect(classifySourceReference(authorialWithSr)).not.toBeNull();
  });

  it('E-P5-06: legacy repost cannot carry Source Reference (not propagation replacement)', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        postType: 'repost',
        visibility: 'public',
        text: 'legacy',
        authorialExpressionIntent: false,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
        sourceReference: { sourceMaterialType: 'place', sourceMaterialId: 'place_bkk' },
      })
    ).toThrow(/repost|legacy/i);
  });

  it('E-P5-07: CO-S12 literal remains false at establishment tier', () => {
    const proof = buildSourceReferenceProof(authorialWithSr);
    expect(proof.isSourceReferenceRuntimePrimitiveEstablished).toBe(false);
    expect(proof.isWs2Authorized).toBe(false);
    expect(proof.isFoundationTrioReady).toBe(false);
  });

  it('E-P5-08: forbidden chain body keys rejected', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite(authorialWithSr, {
        sourceReferenceChain: [{ sourceMaterialType: 'place', sourceMaterialId: 'a' }],
      })
    ).toThrow(/forbidden|chain/i);
  });

  it('E-P5-09: P4+P5 combined establishment write path', () => {
    expect(() => assertAuthorialExpressionWrite(authorialWithSr)).not.toThrow();
    expect(() => assertSourceReferenceBoundaryWrite(authorialWithSr)).not.toThrow();
  });
});

describe('EST-TEST-1 — anti-collapse establishment tier', () => {
  it('E-AC-01: P4 does not collapse into P1 Private Repost', () => {
    const p1 = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'save',
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'p1',
    };
    expect(classifyRepostWriteIntent(p1)).toBe('private_repost_intent');
    expect(buildAuthorialP4ClassificationProof(p1).isP4ClassificationProof).toBe(false);
  });

  it('E-AC-02: P4 does not collapse into P2 Private Note', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'owner note only',
      authorialExpressionIntent: false,
      repostTargetType: 'place',
      repostTargetId: 'p1',
    };
    expect(buildAuthorialNegativesProof(row).privateNoteNotAuthorialText).toBe(true);
  });

  it('E-AC-03: P5 does not collapse into repostTarget binding', () => {
    const proof = buildSourceReferenceProof(authorialWithSr);
    expect(proof.isNotRepostTargetAlias).toBe(true);
    expect(proof.notRepost).toBe(true);
  });

  it('E-AC-04: P5 public repost path rejects Source Reference (not WS-2 semantics)', () => {
    expect(() =>
      assertSourceReferenceBoundaryWrite({
        postType: 'repost',
        visibility: 'public',
        text: 'propagation',
        authorialExpressionIntent: false,
        repostTargetType: 'space_post',
        repostTargetId: 'spost_x',
        sourceReference: { sourceMaterialType: 'space_post', sourceMaterialId: 'spost_x' },
      })
    ).toThrow(/repost/i);
    const srProof = buildSourceReferenceProof(authorialWithSr);
    expect(srProof.isWs2Authorized).toBe(false);
  });

  it('E-AC-05: legacy row rehydration does not become P4/P5 primitive', () => {
    const legacy = persistedRow({
      post_type: 'repost',
      visibility: 'public',
      text: 'legacy artifact',
      repost_target_type: 'place',
      repost_target_id: 'place_bkk',
      authorial_expression_intent: false,
    });
    expect(rehydrateAuthorialFieldsFromRow(legacy)).toEqual({});
  });
});

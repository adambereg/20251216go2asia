import { describe, expect, it } from 'vitest';
import {
  DISTINCTION_CATEGORIES,
  assertDistinctionPrimitiveBoundaries,
  assertDistinctionResolved,
  buildDistinctionPrimitiveProof,
  classifyArtifactDistinction,
  classifyRepostArtifactDistinction,
} from '../src/domain/legacyDistinction';
import { classifyLegacySpacePostRow } from '../src/domain/legacyTaxonomy';
import { classifyRepostTextRole } from '../src/domain/retentionIntent';

describe('FT-5B legacy distinction rule', () => {
  it('defines legacy, target, and regression distinction categories', () => {
    expect(DISTINCTION_CATEGORIES).toEqual([
      'legacy_carve_out',
      'target_behavior',
      'regression',
    ]);
  });

  it('classifies post-transition Private Repost as target behavior (P1 path)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'owner retention note',
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    const distinction = classifyRepostArtifactDistinction({ row });
    expect(distinction.category).toBe('target_behavior');
    expect(distinction.subkind).toBe('target_private_repost');
    expect(distinction.taxonomyClass).toBeNull();
    expect(distinction.isAmbiguous).toBe(false);
    expect(() => assertDistinctionPrimitiveBoundaries(distinction, row)).not.toThrow();
  });

  it('classifies legacy public repost as legacy carve-out', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    const distinction = classifyRepostArtifactDistinction({ row });
    expect(distinction.category).toBe('legacy_carve_out');
    expect(distinction.subkind).toBe('legacy_public_carve_out');
    expect(distinction.taxonomyClass).toBe('L_PUBLIC_REPOST');
    expect(() => assertDistinctionPrimitiveBoundaries(distinction, row)).not.toThrow();
  });

  it('classifies legacy followers repost as legacy_followers carve-out (FR-N3)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'followers' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(classifyLegacySpacePostRow(row)).toBe('L_PUBLIC_REPOST');
    const distinction = classifyRepostArtifactDistinction({ row });
    expect(distinction.category).toBe('legacy_carve_out');
    expect(distinction.subkind).toBe('legacy_followers_carve_out');
    expect(distinction.taxonomyClass).toBe('L_PUBLIC_REPOST');
    const proof = buildDistinctionPrimitiveProof(distinction, row);
    expect(proof.isHistoricalLegacyArtifact).toBe(true);
    expect(proof.isNotPrivateRepost).toBe(true);
    expect(proof.repostTargetBindingRole).toBe('historical_propagation');
    expect(() => assertDistinctionPrimitiveBoundaries(distinction, row)).not.toThrow();
  });

  it('classifies post-alignment followers propagation as regression (FR-N3)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'followers' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    const distinction = classifyRepostArtifactDistinction({
      row,
      isPostAlignmentRegression: true,
    });
    expect(distinction.category).toBe('regression');
    expect(distinction.subkind).toBe('regression_followers_propagation');
    expect(distinction.taxonomyClass).toBeNull();
    expect(() => assertDistinctionPrimitiveBoundaries(distinction, row)).not.toThrow();
  });

  it('classifies post-alignment public propagation as regression, not legacy carve-out', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: null,
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    const distinction = classifyRepostArtifactDistinction({
      row,
      isPostAlignmentRegression: true,
    });
    expect(distinction.category).toBe('regression');
    expect(distinction.subkind).toBe('regression_public_propagation');
    expect(distinction.taxonomyClass).toBeNull();
    expect(classifyLegacySpacePostRow(row)).toBe('L_PUBLIC_REPOST');
    expect(distinction.category).not.toBe('legacy_carve_out');
  });

  it('classifies post-alignment group propagation as regression', () => {
    const distinction = classifyRepostArtifactDistinction({
      row: {
        postType: 'repost',
        visibility: 'group',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      },
      isPostAlignmentRegression: true,
    });
    expect(distinction.category).toBe('regression');
    expect(distinction.subkind).toBe('regression_group_propagation');
  });

  it('uses substantive distinction proof for legacy carve-out (FR-N1)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: 'historical commentary lane',
      repostTargetType: 'space_post',
      repostTargetId: 'spost_legacy',
    };
    const distinction = classifyRepostArtifactDistinction({ row });
    const proof = buildDistinctionPrimitiveProof(distinction, row);
    expect(proof.isHistoricalLegacyArtifact).toBe(true);
    expect(proof.isNotPrivateRepost).toBe(true);
    expect(proof.isNotAuthorialPost).toBe(true);
    expect(proof.isNotSourceReference).toBe(true);
    expect(proof.textRole).toBe('historical_commentary');
    expect(proof.repostTargetBindingRole).toBe('historical_propagation');
    expect(classifyRepostTextRole(row)).toBe('propagation_commentary');
  });

  it('rejects legacy commentary conflated with private_note semantics (E7 T6)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: 'public legacy commentary',
      repostTargetType: 'place',
      repostTargetId: 'p1',
    };
    expect(classifyRepostTextRole(row)).toBe('propagation_commentary');
    const privateRow = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'private note',
      repostTargetType: 'place',
      repostTargetId: 'p1',
    };
    expect(classifyRepostTextRole(privateRow)).toBe('private_note');
  });

  it('proves repost target binding is not Source Reference on legacy path (P5 negative)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'public' as const,
      text: null,
      repostTargetType: 'space_post',
      repostTargetId: 'spost_chain',
    };
    const distinction = classifyRepostArtifactDistinction({ row });
    const proof = buildDistinctionPrimitiveProof(distinction, row);
    expect(proof.isNotSourceReference).toBe(true);
    expect(proof.repostTargetBindingRole).toBe('historical_propagation');
  });

  it('fails release-blocking distinction when category is ambiguous', () => {
    const ambiguous = {
      category: 'target_behavior' as const,
      subkind: 'target_non_repost' as const,
      taxonomyClass: null,
      isAmbiguous: true,
      ambiguityReason: 'fixture incomplete',
    };
    expect(() => assertDistinctionResolved(ambiguous)).toThrow(/FT-5B: distinction ambiguity/);
  });

  it('rejects regression carrying L_* taxonomy class', () => {
    const distinction = {
      category: 'regression' as const,
      subkind: 'regression_public_propagation' as const,
      taxonomyClass: 'L_PUBLIC_REPOST' as const,
      isAmbiguous: false,
    };
    expect(() =>
      assertDistinctionPrimitiveBoundaries(distinction, {
        postType: 'repost',
        visibility: 'public',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'p1',
      })
    ).toThrow(/regression must not be assigned/);
  });

  it('classifies legacy activity projection as legacy carve-out', () => {
    const distinction = classifyArtifactDistinction({
      kind: 'activity_projection',
      activity: { actionType: 'space.post_reposted_by_other' },
    });
    expect(distinction.category).toBe('legacy_carve_out');
    expect(distinction.subkind).toBe('legacy_activity_carve_out');
    expect(distinction.taxonomyClass).toBe('L_REPOST_ACTIVITY');
  });

  it('assigns exactly one distinction category per in-scope repost fixture (no ambiguity)', () => {
    const fixtures = [
      {
        postType: 'repost' as const,
        visibility: 'public' as const,
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'a',
      },
      {
        postType: 'repost' as const,
        visibility: 'group' as const,
        text: 'c',
        repostTargetType: 'place',
        repostTargetId: 'b',
      },
      {
        postType: 'repost' as const,
        visibility: 'private' as const,
        text: 'note',
        repostTargetType: 'place',
        repostTargetId: 'c',
      },
    ];

    for (const row of fixtures) {
      const distinction = classifyRepostArtifactDistinction({ row });
      expect(distinction.isAmbiguous).toBe(false);
      expect(DISTINCTION_CATEGORIES).toContain(distinction.category);
    }
  });
});

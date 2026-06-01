import { describe, expect, it } from 'vitest';
import {
  LEGACY_TAXONOMY_CLASSES,
  assertLegacyPrimitiveBoundaries,
  classifyLegacyArtifact,
  classifyLegacySpacePostRow,
  isLegacyRepostShapedRow,
  legacyPrimitiveProof,
} from '../src/domain/legacyTaxonomy';
import { isPrivateRepostIntent } from '../src/domain/retentionIntent';

describe('FT-5A legacy taxonomy', () => {
  it('defines all seven L_* taxonomy classes from 13B.3-C', () => {
    expect(LEGACY_TAXONOMY_CLASSES).toEqual([
      'L_PUBLIC_REPOST',
      'L_GROUP_REPOST',
      'L_REPOST_COMMENTARY',
      'L_SPACE_POST_CHAIN_ARTIFACT',
      'L_REPOST_ACTIVITY',
      'L_REPOST_HIGHLIGHT',
      'L_PROFILE_REPOST_ITEM',
    ]);
  });

  it('does not classify post-transition private repost as legacy (P1 ≠ P6)', () => {
    const row = {
      postType: 'repost' as const,
      visibility: 'private' as const,
      text: 'owner retention note',
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    };
    expect(isPrivateRepostIntent(row)).toBe(true);
    expect(isLegacyRepostShapedRow(row)).toBe(false);
    expect(classifyLegacySpacePostRow(row)).toBeNull();
    expect(
      classifyLegacyArtifact({
        kind: 'space_post',
        row,
      })
    ).toBeNull();
  });

  it('does not classify standard post shape as legacy repost taxonomy (P4 carrier ≠ P6)', () => {
    const row = {
      postType: 'post' as const,
      visibility: 'public' as const,
      text: 'author material',
      repostTargetType: null,
      repostTargetId: null,
    };
    expect(classifyLegacySpacePostRow(row)).toBeNull();
  });

  it('assigns L_PUBLIC_REPOST to legacy public repost without commentary', () => {
    expect(
      classifyLegacySpacePostRow({
        postType: 'repost',
        visibility: 'public',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toBe('L_PUBLIC_REPOST');
  });

  it('assigns L_GROUP_REPOST to legacy group repost without commentary', () => {
    expect(
      classifyLegacySpacePostRow({
        postType: 'repost',
        visibility: 'group',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toBe('L_GROUP_REPOST');
  });

  it('assigns L_REPOST_COMMENTARY when legacy repost has non-empty text', () => {
    expect(
      classifyLegacySpacePostRow({
        postType: 'repost',
        visibility: 'public',
        text: 'historical repost commentary lane',
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
      })
    ).toBe('L_REPOST_COMMENTARY');
  });

  it('assigns L_SPACE_POST_CHAIN_ARTIFACT for space_post repost target', () => {
    expect(
      classifyLegacySpacePostRow({
        postType: 'repost',
        visibility: 'public',
        text: 'chain commentary',
        repostTargetType: 'space_post',
        repostTargetId: 'spost_parent',
      })
    ).toBe('L_SPACE_POST_CHAIN_ARTIFACT');
  });

  it('assigns exactly one class per legacy space_post shape (single-class assignment)', () => {
    const samples = [
      {
        postType: 'repost' as const,
        visibility: 'public' as const,
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'p1',
      },
      {
        postType: 'repost' as const,
        visibility: 'group' as const,
        text: 'note',
        repostTargetType: 'place',
        repostTargetId: 'p2',
      },
      {
        postType: 'repost' as const,
        visibility: 'public' as const,
        text: null,
        repostTargetType: 'space_post',
        repostTargetId: 'spost_chain',
      },
    ];

    for (const row of samples) {
      const taxonomy = classifyLegacySpacePostRow(row);
      expect(taxonomy).not.toBeNull();
      expect(LEGACY_TAXONOMY_CLASSES).toContain(taxonomy);
      const second = classifyLegacySpacePostRow(row);
      expect(second).toBe(taxonomy);
    }
  });

  it('assigns L_PROFILE_REPOST_ITEM when surface is profile', () => {
    expect(
      classifyLegacySpacePostRow({
        postType: 'repost',
        visibility: 'public',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_bkk',
        surface: 'profile',
      })
    ).toBe('L_PROFILE_REPOST_ITEM');
  });

  it('assigns L_REPOST_ACTIVITY for legacy repost activity projection kinds', () => {
    expect(
      classifyLegacyArtifact({
        kind: 'activity_projection',
        activity: { actionType: 'space.repost_created' },
      })
    ).toBe('L_REPOST_ACTIVITY');
    expect(
      classifyLegacyArtifact({
        kind: 'activity_projection',
        activity: { actionType: 'space.post_reposted_by_other' },
      })
    ).toBe('L_REPOST_ACTIVITY');
  });

  it('assigns L_REPOST_HIGHLIGHT for highlight reference artifacts', () => {
    expect(
      classifyLegacyArtifact({
        kind: 'highlight_reference',
      })
    ).toBe('L_REPOST_HIGHLIGHT');
  });

  it('proves P6 ≠ P1, P4, P5 for classified legacy artifacts', () => {
    const taxonomy = classifyLegacySpacePostRow({
      postType: 'repost',
      visibility: 'public',
      text: 'legacy public repost artifact',
      repostTargetType: 'place',
      repostTargetId: 'place_bkk',
    });
    const proof = legacyPrimitiveProof(taxonomy);
    expect(proof.isHistoricalLegacyArtifact).toBe(true);
    expect(proof.isNotPrivateRepost).toBe(true);
    expect(proof.isNotAuthorialPost).toBe(true);
    expect(proof.isNotSourceReference).toBe(true);
    expect(() => assertLegacyPrimitiveBoundaries(taxonomy)).not.toThrow();
  });

  it('does not treat repost target binding as Source Reference proof (P5 negative)', () => {
    const taxonomy = classifyLegacySpacePostRow({
      postType: 'repost',
      visibility: 'public',
      text: null,
      repostTargetType: 'space_post',
      repostTargetId: 'spost_legacy',
    });
    expect(taxonomy).toBe('L_SPACE_POST_CHAIN_ARTIFACT');
    expect(legacyPrimitiveProof(taxonomy).isNotSourceReference).toBe(true);
  });
});

import {
  classifyRepostWriteIntent,
  type SpacePostType,
  type SpacePostVisibility,
} from './retentionIntent';

/**
 * WS-5 legacy artifact taxonomy (Stage 13B.3-C / FT-5A).
 * Classification only — does not change visibility, storage, or feed behavior.
 */
export type LegacyTaxonomyClass =
  | 'L_PUBLIC_REPOST'
  | 'L_GROUP_REPOST'
  | 'L_REPOST_COMMENTARY'
  | 'L_SPACE_POST_CHAIN_ARTIFACT'
  | 'L_REPOST_ACTIVITY'
  | 'L_REPOST_HIGHLIGHT'
  | 'L_PROFILE_REPOST_ITEM';

export const LEGACY_TAXONOMY_CLASSES: readonly LegacyTaxonomyClass[] = [
  'L_PUBLIC_REPOST',
  'L_GROUP_REPOST',
  'L_REPOST_COMMENTARY',
  'L_SPACE_POST_CHAIN_ARTIFACT',
  'L_REPOST_ACTIVITY',
  'L_REPOST_HIGHLIGHT',
  'L_PROFILE_REPOST_ITEM',
] as const;

export type LegacySpacePostRowInput = {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
  repostTargetType: string | null;
  repostTargetId: string | null;
  surface?: 'profile' | 'publications' | null;
};

export type LegacyActivityProjectionInput = {
  actionType: 'space.repost_created' | 'space.post_reposted_by_other';
};

export type ClassifyLegacyArtifactInput =
  | { kind: 'space_post'; row: LegacySpacePostRowInput }
  | { kind: 'activity_projection'; activity: LegacyActivityProjectionInput }
  | { kind: 'highlight_reference' }
  | { kind: 'profile_surface'; row: LegacySpacePostRowInput };

export type LegacyPrimitiveProof = {
  /** P6: classified legacy artifact */
  isHistoricalLegacyArtifact: boolean;
  /** P6 is not P1 Private Repost */
  isNotPrivateRepost: boolean;
  /** P6 is not P4 Authorial Post */
  isNotAuthorialPost: boolean;
  /** P6 is not P5 Source Reference */
  isNotSourceReference: boolean;
};

export function isLegacyRepostShapedRow(row: LegacySpacePostRowInput): boolean {
  if (row.postType !== 'repost') return false;
  return classifyRepostWriteIntent(row) !== 'private_repost_intent';
}

export function classifyLegacySpacePostRow(row: LegacySpacePostRowInput): LegacyTaxonomyClass | null {
  if (!isLegacyRepostShapedRow(row)) return null;

  if (row.surface === 'profile' || row.surface === 'publications') {
    return 'L_PROFILE_REPOST_ITEM';
  }

  if (row.repostTargetType === 'space_post' && row.repostTargetId) {
    return 'L_SPACE_POST_CHAIN_ARTIFACT';
  }

  if (row.text?.trim()) {
    return 'L_REPOST_COMMENTARY';
  }

  if (row.visibility === 'group') {
    return 'L_GROUP_REPOST';
  }

  return 'L_PUBLIC_REPOST';
}

export function classifyLegacyActivityProjection(
  activity: LegacyActivityProjectionInput
): LegacyTaxonomyClass | null {
  if (
    activity.actionType === 'space.repost_created' ||
    activity.actionType === 'space.post_reposted_by_other'
  ) {
    return 'L_REPOST_ACTIVITY';
  }
  return null;
}

export function classifyLegacyHighlightReference(): LegacyTaxonomyClass {
  return 'L_REPOST_HIGHLIGHT';
}

export function classifyLegacyArtifact(input: ClassifyLegacyArtifactInput): LegacyTaxonomyClass | null {
  switch (input.kind) {
    case 'highlight_reference':
      return classifyLegacyHighlightReference();
    case 'activity_projection':
      return classifyLegacyActivityProjection(input.activity);
    case 'profile_surface':
      return classifyLegacySpacePostRow({ ...input.row, surface: 'profile' });
    case 'space_post':
      return classifyLegacySpacePostRow(input.row);
    default:
      return null;
  }
}

/** FT-5A: taxonomy-only proof. Use `buildDistinctionPrimitiveProof` (FT-5B) for substantive distinction path. */
export function legacyPrimitiveProof(taxonomyClass: LegacyTaxonomyClass | null): LegacyPrimitiveProof {
  if (taxonomyClass === null) {
    return {
      isHistoricalLegacyArtifact: false,
      isNotPrivateRepost: true,
      isNotAuthorialPost: true,
      isNotSourceReference: true,
    };
  }

  return {
    isHistoricalLegacyArtifact: true,
    isNotPrivateRepost: true,
    isNotAuthorialPost: true,
    isNotSourceReference: true,
  };
}

export function assertLegacyPrimitiveBoundaries(taxonomyClass: LegacyTaxonomyClass | null): void {
  const proof = legacyPrimitiveProof(taxonomyClass);
  if (taxonomyClass === null) return;
  if (!proof.isHistoricalLegacyArtifact) {
    throw new Error('FT-5A: legacy taxonomy class must be historical artifact only');
  }
  if (!proof.isNotPrivateRepost || !proof.isNotAuthorialPost || !proof.isNotSourceReference) {
    throw new Error('FT-5A: legacy taxonomy must not collapse into P1, P4, or P5');
  }
}

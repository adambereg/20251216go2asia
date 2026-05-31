import {
  classifyLegacyArtifact,
  classifyLegacySpacePostRow,
  isLegacyRepostShapedRow,
  type ClassifyLegacyArtifactInput,
  type LegacyPrimitiveProof,
  type LegacySpacePostRowInput,
  type LegacyTaxonomyClass,
} from './legacyTaxonomy';
import {
  classifyRepostTextRole,
  classifyRepostWriteIntent,
  type SpacePostType,
  type SpacePostVisibility,
} from './retentionIntent';

/**
 * WS-5 legacy vs post-transition distinction (Stage 13B.3-C §5 / FT-5B).
 * Uses FT-5A taxonomy; does not change visibility, storage, or feed behavior.
 */
export const DISTINCTION_CATEGORIES = [
  'legacy_carve_out',
  'target_behavior',
  'regression',
] as const;

export type DistinctionCategory = (typeof DISTINCTION_CATEGORIES)[number];

/** Reviewer-facing subkinds; extensible, not new primitives. */
export type DistinctionSubkind =
  | 'legacy_public_carve_out'
  | 'legacy_followers_carve_out'
  | 'legacy_group_carve_out'
  | 'legacy_commentary_carve_out'
  | 'legacy_chain_carve_out'
  | 'legacy_profile_carve_out'
  | 'legacy_activity_carve_out'
  | 'legacy_highlight_carve_out'
  | 'target_private_repost'
  | 'target_standard_post_carrier'
  | 'target_non_repost'
  | 'regression_public_propagation'
  | 'regression_group_propagation'
  | 'regression_followers_propagation';

export type ClassifyRepostDistinctionInput = {
  row: LegacySpacePostRowInput;
  /**
   * Reviewer/fixture marker: propagation repost created after doctrine alignment.
   * Not persisted on read path — supplied by tests or future governance metadata only.
   */
  isPostAlignmentRegression?: boolean;
};

export type ClassifyArtifactDistinctionInput = ClassifyLegacyArtifactInput & {
  isPostAlignmentRegression?: boolean;
};

export type DistinctionResult = {
  category: DistinctionCategory;
  subkind: DistinctionSubkind;
  taxonomyClass: LegacyTaxonomyClass | null;
  isAmbiguous: boolean;
  ambiguityReason?: string;
};

export type DistinctionPrimitiveProof = LegacyPrimitiveProof & {
  distinctionCategory: DistinctionCategory;
  subkind: DistinctionSubkind;
  repostTargetBindingRole: 'historical_propagation' | 'not_applicable' | 'authorial_provenance_forbidden';
  textRole: 'historical_commentary' | 'private_note' | 'not_applicable' | 'none';
};

function mapTaxonomyToLegacySubkind(
  taxonomyClass: LegacyTaxonomyClass,
  visibility: SpacePostVisibility
): DistinctionSubkind {
  if (visibility === 'followers') {
    return 'legacy_followers_carve_out';
  }
  switch (taxonomyClass) {
    case 'L_PUBLIC_REPOST':
      return 'legacy_public_carve_out';
    case 'L_GROUP_REPOST':
      return 'legacy_group_carve_out';
    case 'L_REPOST_COMMENTARY':
      return 'legacy_commentary_carve_out';
    case 'L_SPACE_POST_CHAIN_ARTIFACT':
      return 'legacy_chain_carve_out';
    case 'L_PROFILE_REPOST_ITEM':
      return 'legacy_profile_carve_out';
    case 'L_REPOST_ACTIVITY':
      return 'legacy_activity_carve_out';
    case 'L_REPOST_HIGHLIGHT':
      return 'legacy_highlight_carve_out';
    default:
      return 'legacy_public_carve_out';
  }
}

function isPropagationRepostRow(row: LegacySpacePostRowInput): boolean {
  return row.postType === 'repost' && classifyRepostWriteIntent(row) === 'propagation_repost';
}

export function classifyRepostArtifactDistinction(
  input: ClassifyRepostDistinctionInput
): DistinctionResult {
  const { row, isPostAlignmentRegression = false } = input;

  if (row.postType !== 'repost') {
    return {
      category: 'target_behavior',
      subkind: 'target_standard_post_carrier',
      taxonomyClass: null,
      isAmbiguous: false,
    };
  }

  if (classifyRepostWriteIntent(row) === 'private_repost_intent') {
    return {
      category: 'target_behavior',
      subkind: 'target_private_repost',
      taxonomyClass: null,
      isAmbiguous: false,
    };
  }

  if (isPostAlignmentRegression) {
    const subkind: DistinctionSubkind =
      row.visibility === 'group'
        ? 'regression_group_propagation'
        : row.visibility === 'followers'
          ? 'regression_followers_propagation'
          : 'regression_public_propagation';
    return {
      category: 'regression',
      subkind,
      taxonomyClass: null,
      isAmbiguous: false,
    };
  }

  if (!isLegacyRepostShapedRow(row)) {
    return {
      category: 'target_behavior',
      subkind: 'target_non_repost',
      taxonomyClass: null,
      isAmbiguous: true,
      ambiguityReason:
        'repost-shaped row is neither legacy carve-out, post-transition private retention, nor marked regression',
    };
  }

  const taxonomyClass = classifyLegacySpacePostRow(row);
  if (taxonomyClass === null) {
    return {
      category: 'target_behavior',
      subkind: 'target_non_repost',
      taxonomyClass: null,
      isAmbiguous: true,
      ambiguityReason: 'legacy-shaped repost did not resolve to an L_* taxonomy class',
    };
  }

  return {
    category: 'legacy_carve_out',
    subkind: mapTaxonomyToLegacySubkind(taxonomyClass, row.visibility),
    taxonomyClass,
    isAmbiguous: false,
  };
}

export function classifyArtifactDistinction(
  input: ClassifyArtifactDistinctionInput
): DistinctionResult {
  switch (input.kind) {
    case 'highlight_reference':
      return {
        category: 'legacy_carve_out',
        subkind: 'legacy_highlight_carve_out',
        taxonomyClass: classifyLegacyArtifact({ kind: 'highlight_reference' }),
        isAmbiguous: false,
      };
    case 'activity_projection':
      return {
        category: 'legacy_carve_out',
        subkind: 'legacy_activity_carve_out',
        taxonomyClass: classifyLegacyArtifact({
          kind: 'activity_projection',
          activity: input.activity,
        }),
        isAmbiguous: false,
      };
    case 'profile_surface':
    case 'space_post':
      return classifyRepostArtifactDistinction({
        row: input.row,
        isPostAlignmentRegression: input.isPostAlignmentRegression,
      });
    default:
      return {
        category: 'target_behavior',
        subkind: 'target_non_repost',
        taxonomyClass: null,
        isAmbiguous: true,
        ambiguityReason: 'unknown artifact kind for distinction',
      };
  }
}

function repostTargetBindingRole(
  row: LegacySpacePostRowInput,
  category: DistinctionCategory
): DistinctionPrimitiveProof['repostTargetBindingRole'] {
  if (category !== 'legacy_carve_out' || row.postType !== 'repost') {
    return 'not_applicable';
  }
  return 'historical_propagation';
}

function distinctionTextRole(
  row: LegacySpacePostRowInput,
  category: DistinctionCategory
): DistinctionPrimitiveProof['textRole'] {
  if (row.postType !== 'repost' || !row.text?.trim()) {
    return 'none';
  }
  if (category === 'legacy_carve_out') {
    return classifyRepostTextRole(row) === 'propagation_commentary'
      ? 'historical_commentary'
      : 'none';
  }
  if (category === 'target_behavior' && row.visibility === 'private') {
    return 'private_note';
  }
  return 'not_applicable';
}

/** FT-5B: substantive P6 proof derived from distinction category (not tautology-only). */
export function buildDistinctionPrimitiveProof(
  distinction: DistinctionResult,
  row?: LegacySpacePostRowInput
): DistinctionPrimitiveProof {
  const category = distinction.category;
  const subkind = distinction.subkind;

  if (category === 'legacy_carve_out') {
    const spaceRow = row;
    const isLegacyShaped = spaceRow ? isLegacyRepostShapedRow(spaceRow) : distinction.taxonomyClass !== null;
    const isPropagation =
      spaceRow && spaceRow.postType === 'repost'
        ? classifyRepostWriteIntent(spaceRow) === 'propagation_repost'
        : true;
    const textRole = spaceRow ? distinctionTextRole(spaceRow, category) : 'historical_commentary';
    const bindingRole = spaceRow ? repostTargetBindingRole(spaceRow, category) : 'historical_propagation';

    return {
      distinctionCategory: category,
      subkind,
      isHistoricalLegacyArtifact: distinction.taxonomyClass !== null && isLegacyShaped,
      isNotPrivateRepost: isPropagation,
      isNotAuthorialPost: spaceRow ? spaceRow.postType === 'repost' : true,
      isNotSourceReference:
        bindingRole === 'historical_propagation' && distinction.taxonomyClass !== null,
      repostTargetBindingRole: bindingRole,
      textRole,
    };
  }

  if (category === 'regression') {
    return {
      distinctionCategory: category,
      subkind,
      isHistoricalLegacyArtifact: false,
      isNotPrivateRepost: true,
      isNotAuthorialPost: true,
      isNotSourceReference: true,
      repostTargetBindingRole: 'not_applicable',
      textRole: 'not_applicable',
    };
  }

  const isPrivateTarget = subkind === 'target_private_repost';
  return {
    distinctionCategory: category,
    subkind,
    isHistoricalLegacyArtifact: false,
    isNotPrivateRepost: !isPrivateTarget,
    isNotAuthorialPost: row?.postType !== 'post',
    isNotSourceReference: true,
    repostTargetBindingRole: 'not_applicable',
    textRole: isPrivateTarget && row ? distinctionTextRole(row, category) : 'not_applicable',
  };
}

export function distinctionPrimitiveProofFromRow(
  row: LegacySpacePostRowInput,
  taxonomyClass: LegacyTaxonomyClass | null
): LegacyPrimitiveProof {
  const distinction = classifyRepostArtifactDistinction({ row });
  const proof = buildDistinctionPrimitiveProof(distinction, row);
  if (taxonomyClass !== null && distinction.taxonomyClass !== taxonomyClass) {
    return {
      isHistoricalLegacyArtifact: false,
      isNotPrivateRepost: false,
      isNotAuthorialPost: false,
      isNotSourceReference: false,
    };
  }
  return {
    isHistoricalLegacyArtifact: proof.isHistoricalLegacyArtifact,
    isNotPrivateRepost: proof.isNotPrivateRepost,
    isNotAuthorialPost: proof.isNotAuthorialPost,
    isNotSourceReference: proof.isNotSourceReference,
  };
}

/** Release-blocking rule (13B.3-C §5): unresolved distinction fails verification. */
export function assertDistinctionResolved(distinction: DistinctionResult): void {
  if (distinction.isAmbiguous) {
    throw new Error(
      `FT-5B: distinction ambiguity — ${distinction.ambiguityReason ?? 'reviewer cannot classify legacy vs target vs regression'}`
    );
  }
}

export function assertDistinctionPrimitiveBoundaries(
  distinction: DistinctionResult,
  row?: LegacySpacePostRowInput
): void {
  assertDistinctionResolved(distinction);

  const proof = buildDistinctionPrimitiveProof(distinction, row);

  if (distinction.category === 'legacy_carve_out') {
    if (!proof.isHistoricalLegacyArtifact) {
      throw new Error('FT-5B: legacy carve-out requires historical legacy artifact proof');
    }
    if (!proof.isNotPrivateRepost) {
      throw new Error('FT-5B: legacy carve-out must not collapse into P1 Private Repost');
    }
    if (!proof.isNotAuthorialPost) {
      throw new Error('FT-5B: legacy carve-out must not collapse into P4 Authorial Post');
    }
    if (!proof.isNotSourceReference || proof.repostTargetBindingRole !== 'historical_propagation') {
      throw new Error('FT-5B: legacy repost target binding must not collapse into P5 Source Reference');
    }
    if (row?.text?.trim() && proof.textRole !== 'historical_commentary') {
      throw new Error('FT-5B: legacy commentary must remain historical commentary lane, not private note');
    }
    return;
  }

  if (distinction.category === 'regression') {
    if (distinction.taxonomyClass !== null) {
      throw new Error('FT-5B: regression must not be assigned an L_* legacy taxonomy class');
    }
    if (row && !isPropagationRepostRow(row)) {
      throw new Error('FT-5B: regression applies only to post-alignment propagation reposts');
    }
    return;
  }

  if (distinction.subkind === 'target_private_repost') {
    if (distinction.taxonomyClass !== null) {
      throw new Error('FT-5B: post-transition Private Repost must not carry L_* legacy class');
    }
    if (row && proof.textRole !== 'private_note' && row.text?.trim()) {
      throw new Error('FT-5B: private retention text must use private_note semantics');
    }
  }
}

export function rowFromSpacePostShape(shape: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
  repostTargetType: string | null;
  repostTargetId: string | null;
  surface?: 'profile' | 'publications' | null;
}): LegacySpacePostRowInput {
  return shape;
}

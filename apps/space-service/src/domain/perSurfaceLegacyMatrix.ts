import {
  assertForbiddenTransformationGuards,
  buildForbiddenGuardContext,
} from './forbiddenTransformations';
import {
  assertDistinctionPrimitiveBoundaries,
  classifyArtifactDistinction,
  classifyRepostArtifactDistinction,
  type DistinctionResult,
} from './legacyDistinction';
import {
  classifyLegacySpacePostRow,
  type LegacyActivityProjectionInput,
  type LegacySpacePostRowInput,
} from './legacyTaxonomy';

/**
 * WS-5 per-surface legacy matrix (Stage 13B.3-C / FT-5D).
 * Applies FT-5A taxonomy, FT-5B distinction, and FT-5C guards per read surface.
 * Does not implement visibility policy, hide/delete, or feed SQL redesign.
 */
export const MINIMUM_HANDSHAKE_SURFACES = [
  'home_feed',
  'group_feed',
  'profile_feed',
  'publications',
  'activity_feed',
  'highlight',
  'post_detail',
] as const;

export const LEGACY_SURFACE_IDS = [
  ...MINIMUM_HANDSHAKE_SURFACES,
  'followers_feed',
] as const;

export type LegacySurfaceId = (typeof LEGACY_SURFACE_IDS)[number];

export type SurfaceLegacyContext = {
  surface: LegacySurfaceId;
  row: LegacySpacePostRowInput;
  distinction: DistinctionResult;
  taxonomyClass: ReturnType<typeof classifyLegacySpacePostRow>;
};

export type SurfaceMatrixProof = {
  surface: LegacySurfaceId;
  distinctionCategory: DistinctionResult['category'];
  taxonomyClass: SurfaceLegacyContext['taxonomyClass'];
  legacyCarveOutOnSurface: boolean;
  targetPrivateRepostOnSurface: boolean;
  regressionOnSurface: boolean;
  notAuthorialPublicationOnSurface: boolean;
  notGroupQualityInputOnSurface: boolean;
  notPostTransitionHighlightDestination: boolean;
  notPostTransitionActivityDoctrine: boolean;
  hideDeleteEmptySurfaceAlignmentBlocked: boolean;
};

export type ApplySurfaceGuardsOptions = {
  isPostAlignmentRegression?: boolean;
};

export function surfaceToRowSurfaceHint(
  surface: LegacySurfaceId
): LegacySpacePostRowInput['surface'] {
  switch (surface) {
    case 'profile_feed':
      return 'profile';
    case 'publications':
      return 'publications';
    default:
      return null;
  }
}

export function rowInputForSurface(
  row: Omit<LegacySpacePostRowInput, 'surface'>,
  surface: LegacySurfaceId
): LegacySpacePostRowInput {
  return {
    ...row,
    surface: surfaceToRowSurfaceHint(surface),
  };
}

export function buildSurfaceLegacyContext(
  surface: LegacySurfaceId,
  row: LegacySpacePostRowInput,
  options: ApplySurfaceGuardsOptions = {}
): SurfaceLegacyContext {
  const distinction = classifyRepostArtifactDistinction({
    row,
    isPostAlignmentRegression: options.isPostAlignmentRegression,
  });
  const taxonomyClass =
    distinction.category === 'regression' ? null : classifyLegacySpacePostRow(row);
  return { surface, row, distinction, taxonomyClass };
}

/** E8: per-surface negative proof object (not API fields). */
export function buildSurfaceMatrixProof(ctx: SurfaceLegacyContext): SurfaceMatrixProof {
  const { surface, distinction, taxonomyClass } = ctx;
  const isLegacy = distinction.category === 'legacy_carve_out';
  const isTargetPrivate = distinction.subkind === 'target_private_repost';
  const isRegression = distinction.category === 'regression';

  return {
    surface,
    distinctionCategory: distinction.category,
    taxonomyClass,
    legacyCarveOutOnSurface: isLegacy,
    targetPrivateRepostOnSurface: isTargetPrivate,
    regressionOnSurface: isRegression,
    notAuthorialPublicationOnSurface:
      surface === 'profile_feed' || surface === 'publications'
        ? !isLegacy || taxonomyClass === 'L_PROFILE_REPOST_ITEM'
        : isLegacy
          ? distinction.subkind !== 'target_standard_post_carrier'
          : true,
    notGroupQualityInputOnSurface:
      surface === 'group_feed' ? isLegacy || taxonomyClass !== 'L_GROUP_REPOST' : true,
    notPostTransitionHighlightDestination: surface === 'highlight' ? isLegacy : true,
    notPostTransitionActivityDoctrine: surface === 'activity_feed' ? isLegacy : true,
    hideDeleteEmptySurfaceAlignmentBlocked: true,
  };
}

function assertProfileOrPublicationsSurface(ctx: SurfaceLegacyContext): void {
  if (ctx.surface !== 'profile_feed' && ctx.surface !== 'publications') return;
  if (ctx.distinction.category !== 'legacy_carve_out') return;

  if (ctx.taxonomyClass !== 'L_PROFILE_REPOST_ITEM') {
    throw new Error(
      `FT-5D: legacy on ${ctx.surface} must classify as L_PROFILE_REPOST_ITEM, not authorial publication (F12)`
    );
  }

  const proof = buildSurfaceMatrixProof(ctx);
  if (!proof.notAuthorialPublicationOnSurface) {
    throw new Error(`FT-5D: E8 failed — ${ctx.surface} legacy treated as authorial publication`);
  }
}

function assertGroupFeedSurface(ctx: SurfaceLegacyContext): void {
  if (ctx.surface !== 'group_feed') return;
  const proof = buildSurfaceMatrixProof(ctx);
  if (ctx.distinction.category === 'legacy_carve_out' && !proof.notGroupQualityInputOnSurface) {
    throw new Error('FT-5D: group_feed legacy must not be treated as group quality input (FT-07)');
  }
}

function assertHomeFeedSurface(ctx: SurfaceLegacyContext): void {
  if (ctx.surface !== 'home_feed') return;
  if (ctx.distinction.category === 'regression') {
    return;
  }
  if (ctx.distinction.category === 'legacy_carve_out' && ctx.taxonomyClass !== 'L_PUBLIC_REPOST') {
    if (ctx.row.visibility === 'followers') {
      return;
    }
    if (ctx.row.text?.trim() && ctx.taxonomyClass === 'L_REPOST_COMMENTARY') {
      return;
    }
    if (ctx.taxonomyClass === 'L_SPACE_POST_CHAIN_ARTIFACT') {
      return;
    }
  }
}

function assertFollowersFeedSurface(ctx: SurfaceLegacyContext): void {
  if (ctx.surface !== 'followers_feed') return;
  if (ctx.distinction.category === 'legacy_carve_out' && ctx.row.visibility !== 'followers') {
    throw new Error('FT-5D: followers_feed surface requires followers visibility for legacy carve-out');
  }
  if (ctx.distinction.category === 'legacy_carve_out' && ctx.distinction.subkind !== 'legacy_followers_carve_out') {
    throw new Error('FT-5D: followers_feed legacy must use legacy_followers_carve_out subkind');
  }
}

function assertRegressionNotLegacyOnSurface(ctx: SurfaceLegacyContext): void {
  if (ctx.distinction.category !== 'regression') return;
  if (ctx.distinction.subkind.startsWith('legacy_')) {
    throw new Error(`FT-5D: regression cannot present as legacy on ${ctx.surface} (FT-R2L)`);
  }
  if (ctx.distinction.taxonomyClass !== null || ctx.taxonomyClass !== null) {
    throw new Error(`FT-5D: regression on ${ctx.surface} must not carry L_* class`);
  }
}

/** Surface-specific matrix rules after FT-5B/5C core guards. */
export function assertSurfaceLegacyMatrix(ctx: SurfaceLegacyContext): void {
  const proof = buildSurfaceMatrixProof(ctx);
  if (!proof.hideDeleteEmptySurfaceAlignmentBlocked) {
    throw new Error('FT-5D: hide/delete/empty-surface alignment is forbidden (F9)');
  }

  assertRegressionNotLegacyOnSurface(ctx);
  assertProfileOrPublicationsSurface(ctx);
  assertGroupFeedSurface(ctx);
  assertHomeFeedSurface(ctx);
  assertFollowersFeedSurface(ctx);

  if (ctx.surface === 'post_detail' && ctx.distinction.category === 'legacy_carve_out') {
    if (!proof.legacyCarveOutOnSurface) {
      throw new Error('FT-5D: post_detail legacy carve-out proof failed');
    }
  }
}

/** Activity projection surface (no space_post row). */
export function assertActivityFeedSurfaceProjection(activity: LegacyActivityProjectionInput): void {
  const distinction = classifyArtifactDistinction({
    kind: 'activity_projection',
    activity,
  });
  assertDistinctionPrimitiveBoundaries(distinction);
  if (distinction.category !== 'legacy_carve_out' || distinction.taxonomyClass !== 'L_REPOST_ACTIVITY') {
    throw new Error('FT-5D: activity_feed repost projections must be legacy activity carve-out');
  }
  const proof: SurfaceMatrixProof = {
    surface: 'activity_feed',
    distinctionCategory: distinction.category,
    taxonomyClass: distinction.taxonomyClass,
    legacyCarveOutOnSurface: true,
    targetPrivateRepostOnSurface: false,
    regressionOnSurface: false,
    notAuthorialPublicationOnSurface: true,
    notGroupQualityInputOnSurface: true,
    notPostTransitionHighlightDestination: true,
    notPostTransitionActivityDoctrine: true,
    hideDeleteEmptySurfaceAlignmentBlocked: true,
  };
  if (!proof.notPostTransitionActivityDoctrine) {
    throw new Error('FT-5D: E8 failed — activity_feed legacy ≠ post-transition activity doctrine');
  }
}

/** Highlight deep-link surface (reference artifact, not post row). */
export function assertHighlightSurfaceMatrix(): void {
  const distinction = classifyArtifactDistinction({ kind: 'highlight_reference' });
  assertDistinctionPrimitiveBoundaries(distinction);
  if (distinction.subkind !== 'legacy_highlight_carve_out') {
    throw new Error('FT-5D: highlight surface must be legacy_highlight carve-out');
  }
}

/** F9 negative: empty surface cannot satisfy matrix PASS. */
export function assertNonEmptySurfaceId(surface: LegacySurfaceId | '' | null | undefined): void {
  if (!surface) {
    throw new Error('FT-5D: empty surface id cannot be used as matrix alignment proof (F9)');
  }
  if (!LEGACY_SURFACE_IDS.includes(surface as LegacySurfaceId)) {
    throw new Error(`FT-5D: unknown surface id "${surface}"`);
  }
}

/**
 * FT-5D read-path entry: taxonomy + distinction + forbidden guards + per-surface matrix.
 * Closes FR-N2 by requiring explicit surface on post-shaped reads.
 */
export function applyFt5SurfaceLegacyGuards(
  surface: LegacySurfaceId,
  row: LegacySpacePostRowInput,
  options: ApplySurfaceGuardsOptions = {}
): void {
  assertNonEmptySurfaceId(surface);
  if (row.postType !== 'repost') {
    return;
  }

  const ctx = buildSurfaceLegacyContext(surface, row, options);
  assertDistinctionPrimitiveBoundaries(ctx.distinction, ctx.row);
  assertForbiddenTransformationGuards(buildForbiddenGuardContext(ctx.row));
  assertSurfaceLegacyMatrix(ctx);
}

export function spacePostRowInput(
  post: {
    post_type: string;
    visibility: LegacySpacePostRowInput['visibility'];
    text: string | null;
    repost_target_type: string | null;
    repost_target_id: string | null;
  },
  surface: LegacySurfaceId
): LegacySpacePostRowInput {
  return rowInputForSurface(
    {
      postType: post.post_type as LegacySpacePostRowInput['postType'],
      visibility: post.visibility,
      text: post.text,
      repostTargetType: post.repost_target_type,
      repostTargetId: post.repost_target_id,
    },
    surface
  );
}

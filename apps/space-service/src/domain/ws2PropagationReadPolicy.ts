import type { SpacePostRow } from '../db/queries/space';

import {
  classifyRepostArtifactDistinction,
  type DistinctionResult,
} from './legacyDistinction';
import type { LegacySpacePostRowInput } from './legacyTaxonomy';
import type { LegacySurfaceId } from './perSurfaceLegacyMatrix';
import { rowInputForSurface } from './perSurfaceLegacyMatrix';
import { classifyRepostWriteIntent } from './retentionIntent';

/** Reviewer/governance marker on mocked rows only — not a persisted DB column. */
export type SpacePostRowReadMarker = SpacePostRow & {
  ws2_post_alignment_regression?: boolean;
};

export type Ws2PropagationReadOptions = {
  isPostAlignmentRegression?: boolean;
};

export const WS2_PUBLIC_TARGET_FEED_SURFACES = [
  'home_feed',
  'profile_feed',
  'publications',
] as const satisfies readonly LegacySurfaceId[];

export type Ws2PublicTargetFeedSurface = (typeof WS2_PUBLIC_TARGET_FEED_SURFACES)[number];

export type PublicFeedItemReason = 'author_post' | 'group_post' | 'system' | 'legacy_repost_carve_out';

export function isWs2PublicTargetFeedSurface(surface: LegacySurfaceId): surface is Ws2PublicTargetFeedSurface {
  return (WS2_PUBLIC_TARGET_FEED_SURFACES as readonly LegacySurfaceId[]).includes(surface);
}

export function ws2PropagationReadOptionsFromPost(post: SpacePostRow): Ws2PropagationReadOptions {
  const marked = (post as SpacePostRowReadMarker).ws2_post_alignment_regression;
  return marked === true ? { isPostAlignmentRegression: true } : {};
}

export function classifyPublicReadArtifact(
  row: LegacySpacePostRowInput,
  options: Ws2PropagationReadOptions = {}
): DistinctionResult {
  return classifyRepostArtifactDistinction({
    row,
    isPostAlignmentRegression: options.isPostAlignmentRegression,
  });
}

/**
 * WS-2 READ-PUB: post-transition propagation must not appear as target public feed expression.
 * Legacy carve-out rows remain visible (WS-5 / WS2-PD-3).
 */
export function shouldIncludeInPublicTargetFeed(
  row: LegacySpacePostRowInput,
  options: Ws2PropagationReadOptions = {}
): boolean {
  if (row.postType !== 'repost') return true;

  const distinction = classifyPublicReadArtifact(row, options);
  if (distinction.category === 'regression') return false;
  if (distinction.category === 'legacy_carve_out') return true;
  if (distinction.subkind === 'target_private_repost') return true;

  if (
    distinction.category === 'target_behavior' &&
    distinction.isAmbiguous &&
    classifyRepostWriteIntent(row) === 'propagation_repost'
  ) {
    return false;
  }

  return true;
}

export function resolvePublicFeedItemReason(
  row: LegacySpacePostRowInput,
  options: Ws2PropagationReadOptions = {},
  context: { groupId?: string | null } = {}
): PublicFeedItemReason {
  if (row.postType === 'repost') {
    const distinction = classifyPublicReadArtifact(row, options);
    if (distinction.category === 'legacy_carve_out') {
      return 'legacy_repost_carve_out';
    }
    if (distinction.subkind === 'target_private_repost') {
      return 'legacy_repost_carve_out';
    }
    return 'legacy_repost_carve_out';
  }
  if (row.postType === 'system') return 'system';
  if (context.groupId) return 'group_post';
  return 'author_post';
}

export function filterSpacePostsForWs2PublicTargetFeed(
  rows: SpacePostRow[],
  surface: Ws2PublicTargetFeedSurface
): SpacePostRow[] {
  return rows.filter((post) => {
    const rowInput = rowInputForSurface(
      {
        postType: post.post_type,
        visibility: post.visibility,
        text: post.text,
        repostTargetType: post.repost_target_type,
        repostTargetId: post.repost_target_id,
        authorialExpressionIntent: post.authorial_expression_intent,
      },
      surface
    );
    return shouldIncludeInPublicTargetFeed(rowInput, ws2PropagationReadOptionsFromPost(post));
  });
}

export function isLegacyCarveOutPublicRead(distinction: DistinctionResult): boolean {
  return distinction.category === 'legacy_carve_out';
}

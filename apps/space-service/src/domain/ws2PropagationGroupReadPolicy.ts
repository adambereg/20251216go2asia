import type { SpacePostRow } from '../db/queries/space';

import {
  classifyRepostArtifactDistinction,
  type DistinctionResult,
} from './legacyDistinction';
import type { LegacySpacePostRowInput } from './legacyTaxonomy';
import type { LegacySurfaceId } from './perSurfaceLegacyMatrix';
import { rowInputForSurface } from './perSurfaceLegacyMatrix';
import { classifyRepostWriteIntent } from './retentionIntent';
import {
  ws2PropagationReadOptionsFromPost,
  type Ws2PropagationReadOptions,
} from './ws2PropagationReadPolicy';

export const WS2_GROUP_TARGET_FEED_SURFACE = 'group_feed' as const satisfies LegacySurfaceId;

export type GroupFeedItemReason =
  | 'author_post'
  | 'group_post'
  | 'system'
  | 'legacy_group_repost_carve_out';

export function isWs2GroupTargetFeedSurface(
  surface: LegacySurfaceId
): surface is typeof WS2_GROUP_TARGET_FEED_SURFACE {
  return surface === WS2_GROUP_TARGET_FEED_SURFACE;
}

export function classifyGroupReadArtifact(
  row: LegacySpacePostRowInput,
  options: Ws2PropagationReadOptions = {}
): DistinctionResult {
  return classifyRepostArtifactDistinction({
    row,
    isPostAlignmentRegression: options.isPostAlignmentRegression,
  });
}

/**
 * WS-2 READ-GRP / WS-4: target group feed stream is authorial-only.
 * Legacy group repost remains visible as carve-out (WS-5 / WS2-PD-3).
 */
export function shouldIncludeInGroupTargetFeed(
  row: LegacySpacePostRowInput,
  options: Ws2PropagationReadOptions = {}
): boolean {
  if (row.postType !== 'repost') return true;

  const distinction = classifyGroupReadArtifact(row, options);
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

export function resolveGroupFeedItemReason(
  row: LegacySpacePostRowInput,
  options: Ws2PropagationReadOptions = {},
  context: { groupId?: string | null } = {}
): GroupFeedItemReason {
  if (row.postType === 'repost') {
    const distinction = classifyGroupReadArtifact(row, options);
    if (distinction.category === 'legacy_carve_out') {
      return 'legacy_group_repost_carve_out';
    }
    if (distinction.subkind === 'legacy_group_carve_out') {
      return 'legacy_group_repost_carve_out';
    }
    return 'legacy_group_repost_carve_out';
  }
  if (row.postType === 'system') return 'system';
  if (context.groupId) return 'group_post';
  return 'author_post';
}

export function filterSpacePostsForWs2GroupTargetFeed(rows: SpacePostRow[]): SpacePostRow[] {
  const surface = WS2_GROUP_TARGET_FEED_SURFACE;
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
    return shouldIncludeInGroupTargetFeed(rowInput, ws2PropagationReadOptionsFromPost(post));
  });
}

export function isLegacyGroupCarveOutRead(distinction: DistinctionResult): boolean {
  return distinction.category === 'legacy_carve_out' && distinction.subkind === 'legacy_group_carve_out';
}

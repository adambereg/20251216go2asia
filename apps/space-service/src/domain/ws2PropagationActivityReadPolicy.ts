import type { SpaceActivityRow } from '../db/queries/space';

import {
  classifyArtifactDistinction,
  type DistinctionResult,
} from './legacyDistinction';
import type { LegacyActivityProjectionInput } from './legacyTaxonomy';

/** Reviewer/governance marker on mocked rows only — not a persisted DB column. */
export type SpaceActivityRowReadMarker = SpaceActivityRow & {
  ws2_post_alignment_regression?: boolean;
};

export type Ws2ActivityReadOptions = {
  isPostAlignmentRegression?: boolean;
};

export const WS2_REPOST_ACTIVITY_ACTION_TYPES = [
  'space.repost_created',
  'space.post_reposted_by_other',
] as const;

export type Ws2RepostActivityActionType = (typeof WS2_REPOST_ACTIVITY_ACTION_TYPES)[number];

export type ActivityFeedItemType =
  | 'post_created'
  | 'group_joined'
  | 'post_liked_by_other'
  | 'post_reposted_by_other'
  | 'repost_created'
  | 'legacy_repost_activity_carve_out'
  | string;

export function isRepostActivityActionType(actionType: string): actionType is Ws2RepostActivityActionType {
  return (WS2_REPOST_ACTIVITY_ACTION_TYPES as readonly string[]).includes(actionType);
}

export function ws2ActivityReadOptionsFromRow(row: SpaceActivityRow): Ws2ActivityReadOptions {
  const marked = (row as SpaceActivityRowReadMarker).ws2_post_alignment_regression;
  return marked === true ? { isPostAlignmentRegression: true } : {};
}

export function classifyActivityReadArtifact(
  activity: LegacyActivityProjectionInput,
  options: Ws2ActivityReadOptions = {}
): DistinctionResult {
  return classifyArtifactDistinction({
    kind: 'activity_projection',
    activity,
    isPostAlignmentRegression: options.isPostAlignmentRegression,
  });
}

/**
 * WS-2 / WS-6: post-transition propagation activity must not be target social activity.
 * Legacy repost activity remains visible (WS-5 legacy activity carve-out).
 */
export function shouldIncludeInActivityTargetStream(
  row: SpaceActivityRow,
  options: Ws2ActivityReadOptions = {}
): boolean {
  if (!isRepostActivityActionType(row.action_type)) return true;
  if (options.isPostAlignmentRegression) return false;
  return true;
}

export function resolveActivityFeedItemType(
  row: SpaceActivityRow,
  options: Ws2ActivityReadOptions = {}
): ActivityFeedItemType {
  if (!isRepostActivityActionType(row.action_type)) {
    return row.type;
  }

  const distinction = classifyActivityReadArtifact(
    { actionType: row.action_type },
    options
  );
  if (distinction.category === 'legacy_carve_out') {
    return 'legacy_repost_activity_carve_out';
  }
  if (distinction.category === 'regression') {
    return 'legacy_repost_activity_carve_out';
  }

  return 'legacy_repost_activity_carve_out';
}

export function filterActivityRowsForWs2TargetStream(rows: SpaceActivityRow[]): SpaceActivityRow[] {
  return rows.filter((row) =>
    shouldIncludeInActivityTargetStream(row, ws2ActivityReadOptionsFromRow(row))
  );
}

export function isLegacyActivityCarveOut(distinction: DistinctionResult): boolean {
  return distinction.category === 'legacy_carve_out';
}

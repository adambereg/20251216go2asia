import { describe, expect, it } from 'vitest';

import { rowInputForSurface } from '../src/domain/perSurfaceLegacyMatrix';
import {
  filterSpacePostsForWs2GroupTargetFeed,
  resolveGroupFeedItemReason,
  shouldIncludeInGroupTargetFeed,
} from '../src/domain/ws2PropagationGroupReadPolicy';
import type { SpacePostRow } from '../src/db/queries/space';

function groupRepostRow(overrides: Partial<SpacePostRow> = {}): SpacePostRow {
  return {
    id: 'spost_grp_legacy',
    author_id: 'user_a',
    author_display_name: 'A',
    author_avatar_url: null,
    author_role_label: null,
    group_id: 'sgroup_1',
    post_type: 'repost',
    visibility: 'group',
    text: null,
    repost_target_type: 'place',
    repost_target_id: 'place_x',
    authorial_expression_intent: false,
    source_material_type: null,
    source_material_id: null,
    status: 'active',
    created_at: '2026-03-14T10:00:00.000Z',
    updated_at: '2026-03-14T10:00:00.000Z',
    published_at: '2026-03-14T10:00:00.000Z',
    ...overrides,
  };
}

describe('ws2PropagationGroupReadPolicy', () => {
  it('includes legacy group repost in group_feed target stream', () => {
    const row = rowInputForSurface(
      {
        postType: 'repost',
        visibility: 'group',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_x',
      },
      'group_feed'
    );
    expect(shouldIncludeInGroupTargetFeed(row)).toBe(true);
    expect(resolveGroupFeedItemReason(row, {}, { groupId: 'sgroup_1' })).toBe(
      'legacy_group_repost_carve_out'
    );
  });

  it('excludes post-alignment regression group propagation from group_feed', () => {
    const row = rowInputForSurface(
      {
        postType: 'repost',
        visibility: 'group',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_x',
      },
      'group_feed'
    );
    expect(shouldIncludeInGroupTargetFeed(row, { isPostAlignmentRegression: true })).toBe(false);
  });

  it('filterSpacePostsForWs2GroupTargetFeed drops regression-marked rows only', () => {
    const legacy = groupRepostRow({ id: 'spost_grp_keep' });
    const regression = {
      ...groupRepostRow({ id: 'spost_grp_drop' }),
      ws2_post_alignment_regression: true,
    } as SpacePostRow & { ws2_post_alignment_regression: boolean };

    const filtered = filterSpacePostsForWs2GroupTargetFeed([legacy, regression]);
    expect(filtered.map((r) => r.id)).toEqual(['spost_grp_keep']);
  });
});

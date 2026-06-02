import { describe, expect, it } from 'vitest';

import { rowInputForSurface } from '../src/domain/perSurfaceLegacyMatrix';
import {
  filterSpacePostsForWs2PublicTargetFeed,
  resolvePublicFeedItemReason,
  shouldIncludeInPublicTargetFeed,
} from '../src/domain/ws2PropagationReadPolicy';
import type { SpacePostRow } from '../src/db/queries/space';

function publicRepostRow(overrides: Partial<SpacePostRow> = {}): SpacePostRow {
  return {
    id: 'spost_legacy',
    author_id: 'user_a',
    author_display_name: 'A',
    author_avatar_url: null,
    author_role_label: null,
    group_id: null,
    post_type: 'repost',
    visibility: 'public',
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

describe('ws2PropagationReadPolicy', () => {
  it('includes legacy public repost in home_feed target stream', () => {
    const row = rowInputForSurface(
      {
        postType: 'repost',
        visibility: 'public',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_x',
      },
      'home_feed'
    );
    expect(shouldIncludeInPublicTargetFeed(row)).toBe(true);
    expect(resolvePublicFeedItemReason(row)).toBe('legacy_repost_carve_out');
  });

  it('excludes post-alignment regression propagation from home_feed', () => {
    const row = rowInputForSurface(
      {
        postType: 'repost',
        visibility: 'public',
        text: null,
        repostTargetType: 'place',
        repostTargetId: 'place_x',
      },
      'home_feed'
    );
    expect(shouldIncludeInPublicTargetFeed(row, { isPostAlignmentRegression: true })).toBe(false);
  });

  it('filterSpacePostsForWs2PublicTargetFeed drops regression-marked rows only', () => {
    const legacy = publicRepostRow({ id: 'spost_keep' });
    const regression = {
      ...publicRepostRow({ id: 'spost_drop' }),
      ws2_post_alignment_regression: true,
    } as SpacePostRow & { ws2_post_alignment_regression: boolean };

    const filtered = filterSpacePostsForWs2PublicTargetFeed([legacy, regression], 'home_feed');
    expect(filtered.map((r) => r.id)).toEqual(['spost_keep']);
  });
});

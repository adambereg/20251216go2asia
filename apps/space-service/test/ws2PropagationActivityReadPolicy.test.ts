import { describe, expect, it } from 'vitest';

import {
  filterActivityRowsForWs2TargetStream,
  resolveActivityFeedItemType,
  shouldIncludeInActivityTargetStream,
} from '../src/domain/ws2PropagationActivityReadPolicy';
import type { SpaceActivityRow } from '../src/db/queries/space';

function repostActivityRow(
  actionType: 'space.repost_created' | 'space.post_reposted_by_other',
  overrides: Partial<SpaceActivityRow> = {}
): SpaceActivityRow {
  return {
    id: `activity:${actionType}:fixture`,
    type: actionType === 'space.repost_created' ? 'repost_created' : 'post_reposted_by_other',
    action_type: actionType,
    direction: 'outgoing',
    category: 'social',
    actor_user_id: 'user_a',
    actor_display_name: 'A',
    actor_avatar_url: null,
    actor_role_label: null,
    title: 'Repost activity',
    description: null,
    related_post_id: 'spost_1',
    related_entity_type: 'space_post',
    related_entity_id: 'spost_2',
    occurred_at: '2026-03-14T10:00:00.000Z',
    ...overrides,
  };
}

describe('ws2PropagationActivityReadPolicy', () => {
  it('includes legacy repost activity in target stream with carve-out type', () => {
    const row = repostActivityRow('space.repost_created');
    expect(shouldIncludeInActivityTargetStream(row)).toBe(true);
    expect(resolveActivityFeedItemType(row)).toBe('legacy_repost_activity_carve_out');
  });

  it('excludes regression-marked repost activity from target stream', () => {
    const row = repostActivityRow('space.post_reposted_by_other');
    expect(shouldIncludeInActivityTargetStream(row, { isPostAlignmentRegression: true })).toBe(
      false
    );
  });

  it('filterActivityRowsForWs2TargetStream drops regression-marked rows only', () => {
    const legacy = repostActivityRow('space.repost_created', { id: 'activity:keep' });
    const regression = {
      ...repostActivityRow('space.post_reposted_by_other', { id: 'activity:drop' }),
      ws2_post_alignment_regression: true,
    } as SpaceActivityRow & { ws2_post_alignment_regression: boolean };

    const filtered = filterActivityRowsForWs2TargetStream([legacy, regression]);
    expect(filtered.map((r) => r.id)).toEqual(['activity:keep']);
  });

  it('preserves authorial post_created activity type', () => {
    const row: SpaceActivityRow = {
      id: 'activity:space.post_created:spost_1',
      type: 'post_created',
      action_type: 'space.post_created',
      direction: 'outgoing',
      category: 'social',
      actor_user_id: 'user_a',
      actor_display_name: 'A',
      actor_avatar_url: null,
      actor_role_label: null,
      title: 'You created a post',
      description: 'Hello',
      related_post_id: 'spost_1',
      related_entity_type: null,
      related_entity_id: null,
      occurred_at: '2026-03-14T10:00:00.000Z',
    };
    expect(shouldIncludeInActivityTargetStream(row)).toBe(true);
    expect(resolveActivityFeedItemType(row)).toBe('post_created');
  });
});

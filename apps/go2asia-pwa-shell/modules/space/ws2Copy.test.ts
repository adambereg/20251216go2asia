import { describe, expect, it } from 'vitest';
import {
  WS2_COPY,
  formatActivityFeedType,
  formatFeedReason,
  formatPublicationPostType,
  isLegacyRepostActivityType,
  isLegacyRepostFeedReason,
} from './ws2Copy';

describe('ws2Copy', () => {
  it('maps feed reasons to WS-2 doctrine labels', () => {
    expect(formatFeedReason('author_post')).toBe('Публикация');
    expect(formatFeedReason('legacy_repost_carve_out')).toBe('Исторический репост');
    expect(formatFeedReason('legacy_group_repost_carve_out')).toBe('Исторический групповой репост');
  });

  it('maps legacy activity types without new-repost pressure', () => {
    expect(formatActivityFeedType('legacy_repost_activity_carve_out')).toBe(
      'Историческая активность репоста'
    );
    expect(formatActivityFeedType('repost_created')).toBe('Историческая активность репоста');
    expect(isLegacyRepostActivityType('post_created')).toBe(false);
    expect(isLegacyRepostActivityType('legacy_repost_activity_carve_out')).toBe(true);
  });

  it('does not use Repost as active public action label', () => {
    expect(formatPublicationPostType('repost', 'legacy_repost_carve_out')).toBe('Исторический репост');
    expect(WS2_COPY.saveForMyself.action).not.toMatch(/^Репост$/i);
    expect(WS2_COPY.saveForMyself.actionInSpace).toContain('Сохранить для себя');
  });

  it('keeps Save vs Publish distinction in copy constants', () => {
    expect(WS2_COPY.saveForMyself.action).toContain('Сохранить');
    expect(WS2_COPY.publish.authorPost).toContain('Публикация');
    expect(isLegacyRepostFeedReason('author_post')).toBe(false);
  });

  it('frames source reference separately from repost target', () => {
    expect(WS2_COPY.sourceReference.label).toBe('Источник');
    expect(WS2_COPY.legacy.repostArtifact).not.toBe(WS2_COPY.sourceReference.label);
  });
});

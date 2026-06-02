import { describe, expect, it } from 'vitest';

import {
  assertWs2PropagationWriteAllowed,
  isWs2PropagationRepostWrite,
  Ws2PropagationRepostForbiddenError,
} from '../src/domain/ws2PropagationWritePolicy';

describe('ws2PropagationWritePolicy', () => {
  it('allows private repost writes', () => {
    expect(
      isWs2PropagationRepostWrite({ postType: 'repost', visibility: 'private' })
    ).toBe(false);
    expect(() =>
      assertWs2PropagationWriteAllowed({ postType: 'repost', visibility: 'private' })
    ).not.toThrow();
  });

  it('blocks public, group, and followers repost writes', () => {
    for (const visibility of ['public', 'group', 'followers'] as const) {
      expect(isWs2PropagationRepostWrite({ postType: 'repost', visibility })).toBe(true);
      expect(() =>
        assertWs2PropagationWriteAllowed({ postType: 'repost', visibility })
      ).toThrow(Ws2PropagationRepostForbiddenError);
    }
  });

  it('ignores non-repost post types', () => {
    expect(isWs2PropagationRepostWrite({ postType: 'post', visibility: 'public' })).toBe(false);
  });
});

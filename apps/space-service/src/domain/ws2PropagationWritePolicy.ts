import {
  classifyRepostWriteIntent,
  type SpacePostType,
  type SpacePostVisibility,
} from './retentionIntent';

export const WS2_PROPAGATION_REPOST_FORBIDDEN_CODE = 'WS2_PROPAGATION_REPOST_FORBIDDEN';

export class Ws2PropagationRepostForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Ws2PropagationRepostForbiddenError';
  }
}

export function isWs2PropagationRepostWrite(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
}): boolean {
  if (input.postType !== 'repost') return false;
  return classifyRepostWriteIntent(input) === 'propagation_repost';
}

/**
 * WS-2 write boundary: post-transition public/group/followers propagation reposts are forbidden.
 * Private retention reposts remain allowed under WS-1.
 */
export function assertWs2PropagationWriteAllowed(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
}): void {
  if (!isWs2PropagationRepostWrite(input)) return;
  throw new Ws2PropagationRepostForbiddenError(
    'Public and group repost propagation is not supported. Use visibility private to save for yourself, or publish an authorial post.'
  );
}

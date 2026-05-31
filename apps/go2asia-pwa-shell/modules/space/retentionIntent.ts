import type { generated } from '@go2asia/sdk';

export const PRIVATE_REPOST_INTENT_VISIBILITY = 'private' as const;

export function buildPrivateRepostIntentRequest(input: {
  targetType: generated.SpaceRepostTargetType;
  targetId: string;
  text: string | null;
}): generated.CreateSpacePostRequest {
  return {
    postType: 'repost',
    visibility: PRIVATE_REPOST_INTENT_VISIBILITY,
    repostTargetType: input.targetType,
    repostTargetId: input.targetId,
    text: input.text,
  };
}

export function isPrivateRepostIntentPost(post: generated.SpacePostResponse): boolean {
  return post.postType === 'repost' && post.visibility === PRIVATE_REPOST_INTENT_VISIBILITY;
}

export function getPrivateNoteText(post: generated.SpacePostResponse): string | null {
  if (!isPrivateRepostIntentPost(post)) return null;
  const text = post.text?.trim();
  return text ? text : null;
}

export function getOwnerRetentionUrl(postId: string): string {
  return `/space/posts?retention=${encodeURIComponent(postId)}`;
}

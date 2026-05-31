export type SpacePostType = 'post' | 'repost' | 'system';
export type SpacePostVisibility = 'public' | 'followers' | 'group' | 'private';

export type RepostWriteIntent = 'private_repost_intent' | 'propagation_repost';
export type RepostTextRole = 'private_note' | 'propagation_commentary';

export function classifyRepostWriteIntent(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
}): RepostWriteIntent | null {
  if (input.postType !== 'repost') return null;
  return input.visibility === 'private' ? 'private_repost_intent' : 'propagation_repost';
}

export function isPrivateRepostIntent(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
}): boolean {
  return classifyRepostWriteIntent(input) === 'private_repost_intent';
}

export function classifyRepostTextRole(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
}): RepostTextRole | null {
  if (input.postType !== 'repost' || !input.text?.trim()) return null;
  return isPrivateRepostIntent(input) ? 'private_note' : 'propagation_commentary';
}

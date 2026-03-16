export type SpaceDomainEventType =
  | 'space.post.created'
  | 'space.post.deleted'
  | 'space.post.reposted'
  | 'space.group.created'
  | 'space.group.member_joined'
  | 'space.group.member_left'
  | 'space.post.media_attached'
  | 'space.post.media_detached';

export type SpaceDomainEvent = {
  eventId: string;
  eventType: SpaceDomainEventType;
  occurredAt: string;
  payload: Record<string, unknown>;
};

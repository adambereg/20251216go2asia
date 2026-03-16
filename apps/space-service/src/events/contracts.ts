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
  eventVersion: number;
  occurredAt: string;
  producer: {
    service: 'space-service';
    environment?: string;
  };
  trace?: {
    requestId?: string;
    correlationId?: string;
    causationId?: string;
  };
  actor?: {
    userId?: string;
  };
  subject?: {
    targetType: string;
    targetId: string;
  };
  payload: Record<string, unknown>;
};

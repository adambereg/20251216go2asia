export type ReactionsDomainEventType = 'reaction.created' | 'reaction.deleted';

export type ReactionsDomainEvent = {
  eventId: string;
  eventType: ReactionsDomainEventType;
  eventVersion: number;
  occurredAt: string;
  producer: {
    service: 'reactions-service';
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
    targetType: 'space_post' | 'blog_post' | 'place' | 'event' | 'partner' | 'listing' | 'quest';
    targetId: string;
  };
  payload: {
    actorUserId: string;
    targetType: 'space_post' | 'blog_post' | 'place' | 'event' | 'partner' | 'listing' | 'quest';
    targetId: string;
    reactionType: 'like' | 'bookmark';
    requestId: string;
  };
};

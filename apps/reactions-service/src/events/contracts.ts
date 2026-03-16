export type ReactionsDomainEventType = 'reaction.created' | 'reaction.deleted';

export type ReactionsDomainEvent = {
  eventId: string;
  eventType: ReactionsDomainEventType;
  occurredAt: string;
  payload: {
    actorUserId: string;
    targetType: 'space_post' | 'blog_post' | 'place' | 'event' | 'partner' | 'listing' | 'quest';
    targetId: string;
    reactionType: 'like';
    requestId: string;
  };
};

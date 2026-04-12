export type QuestDomainEventType =
  | 'quest.created'
  | 'quest.draft.updated'
  | 'quest.step.created'
  | 'quest.step.updated'
  | 'quest.step.deleted'
  | 'quest.published'
  | 'quest.archived'
  | 'quest.started'
  | 'quest.step.completed'
  | 'quest.submission.created'
  | 'quest.submission.rejected'
  | 'quest.submission.approved'
  | 'quest.completed';

export type QuestDomainEvent = {
  eventId: string;
  eventType: QuestDomainEventType;
  eventVersion: number;
  occurredAt: string;
  producer: {
    service: 'quest-service';
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
    targetType: 'quest' | 'quest_progress' | 'quest_submission' | 'quest_step';
    targetId: string;
  };
  payload: Record<string, unknown>;
};

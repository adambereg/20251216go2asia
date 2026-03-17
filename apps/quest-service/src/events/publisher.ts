import { createLogger } from '@go2asia/logger';

import type { QuestDomainEvent } from './contracts';

export interface QuestEventPublisher {
  publish(event: QuestDomainEvent): Promise<void>;
}

export function createNoopQuestEventPublisher(logger: ReturnType<typeof createLogger>): QuestEventPublisher {
  return {
    async publish(event: QuestDomainEvent): Promise<void> {
      logger.info('Quest event staged', {
        eventType: event.eventType,
        eventId: event.eventId,
      });
    },
  };
}

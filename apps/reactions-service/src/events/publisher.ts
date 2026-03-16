import { createLogger } from '@go2asia/logger';

import type { ReactionsDomainEvent } from './contracts';

export interface ReactionsEventPublisher {
  publish(event: ReactionsDomainEvent): Promise<void>;
}

export function createNoopReactionsEventPublisher(
  logger: ReturnType<typeof createLogger>
): ReactionsEventPublisher {
  return {
    async publish(event: ReactionsDomainEvent): Promise<void> {
      logger.info('Reactions event staged', {
        eventType: event.eventType,
        eventId: event.eventId,
      });
    },
  };
}

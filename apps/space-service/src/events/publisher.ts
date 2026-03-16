import { createLogger } from '@go2asia/logger';

import type { SpaceDomainEvent } from './contracts';

export interface SpaceEventPublisher {
  publish(event: SpaceDomainEvent): Promise<void>;
}

export function createNoopSpaceEventPublisher(logger: ReturnType<typeof createLogger>): SpaceEventPublisher {
  return {
    async publish(event: SpaceDomainEvent): Promise<void> {
      logger.info('Space event staged', {
        eventType: event.eventType,
        eventId: event.eventId,
      });
    },
  };
}

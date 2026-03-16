import type { ReactionsEventPublisher } from '../events/publisher';
import type { GatewayPrincipal } from '../middleware/auth';
import { readJsonObject } from '../middleware/http';
import {
  getReactionSummaryBatch,
  getReactionSummarySingle,
  removeReactionById,
  upsertReaction,
} from '../services/reactionsService';

type Env = {
  DATABASE_URL?: string;
};

export async function handleReactionsRoute(
  request: Request,
  env: Env,
  requestId: string,
  publisher: ReactionsEventPublisher,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (path === '/v1/reactions' && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return upsertReaction(env, body, principal, requestId, publisher, request.headers.get('Idempotency-Key'));
  }

  const deleteMatch = path.match(/^\/v1\/reactions\/([^/]+)$/);
  if (deleteMatch && request.method === 'DELETE' && principal) {
    return removeReactionById(env, decodeURIComponent(deleteMatch[1]), principal, requestId, publisher);
  }

  const summaryMatch = path.match(/^\/v1\/reactions\/summary\/([^/]+)\/([^/]+)$/);
  if (summaryMatch && request.method === 'GET') {
    return getReactionSummarySingle(
      env,
      decodeURIComponent(summaryMatch[1]),
      decodeURIComponent(summaryMatch[2]),
      principal,
      requestId
    );
  }

  if (path === '/v1/reactions/summary:batch' && request.method === 'POST') {
    const body = await readJsonObject(request);
    return getReactionSummaryBatch(env, body, principal, requestId);
  }

  return null;
}

import type { GatewayPrincipal } from '../middleware/auth';
import type { QuestEventPublisher } from '../events/publisher';
import { getQuest, getQuestProgress, listQuests, startQuest } from '../services/questService';

type Env = {
  DATABASE_URL?: string;
  ENVIRONMENT?: string;
};

export async function handleQuestRoute(
  request: Request,
  env: Env,
  requestId: string,
  publisher: QuestEventPublisher,
  principal: GatewayPrincipal | null
): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/v1/quests' && request.method === 'GET') {
    return listQuests(env, requestId, url);
  }

  const questDetailMatch = path.match(/^\/v1\/quests\/([^/]+)$/);
  if (questDetailMatch && request.method === 'GET') {
    return getQuest(env, requestId, questDetailMatch[1]!);
  }

  const questStartMatch = path.match(/^\/v1\/quests\/([^/]+)\/start$/);
  if (questStartMatch && request.method === 'POST' && principal) {
    return startQuest(env, questStartMatch[1]!, principal, requestId, publisher);
  }

  const questProgressMatch = path.match(/^\/v1\/quests\/([^/]+)\/progress$/);
  if (questProgressMatch && request.method === 'GET' && principal) {
    return getQuestProgress(env, questProgressMatch[1]!, principal, requestId);
  }

  return null;
}

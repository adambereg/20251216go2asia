import { getQuest, listQuests } from '../services/questService';

type Env = {
  DATABASE_URL?: string;
  ENVIRONMENT?: string;
};

export async function handleQuestRoute(
  request: Request,
  env: Env,
  requestId: string
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

  return null;
}

import type { GatewayPrincipal } from '../middleware/auth';
import type { QuestEventPublisher } from '../events/publisher';
import { readJsonObject } from '../middleware/http';
import {
  addQuestStep,
  createQuestDraft,
  getQuest,
  getQuestProgress,
  getQuestSubmissions,
  listQuests,
  publishQuest,
  reviewQuestSubmission,
  startQuest,
  submitQuestStep,
} from '../services/questService';

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

  if (path === '/v1/quests' && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return createQuestDraft(env, body, principal, requestId);
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

  const questStepsMatch = path.match(/^\/v1\/quests\/([^/]+)\/steps$/);
  if (questStepsMatch && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return addQuestStep(env, questStepsMatch[1]!, body, principal, requestId);
  }

  const questPublishMatch = path.match(/^\/v1\/quests\/([^/]+)\/publish$/);
  if (questPublishMatch && request.method === 'POST' && principal) {
    return publishQuest(env, questPublishMatch[1]!, principal, requestId);
  }

  const questSubmitMatch = path.match(/^\/v1\/quests\/([^/]+)\/steps\/([^/]+)\/submit$/);
  if (questSubmitMatch && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return submitQuestStep(env, {
      questId: questSubmitMatch[1]!,
      stepId: questSubmitMatch[2]!,
      body,
      principal,
      requestId,
      publisher,
    });
  }

  const questSubmissionsMatch = path.match(/^\/v1\/quests\/([^/]+)\/submissions$/);
  if (questSubmissionsMatch && request.method === 'GET' && principal) {
    return getQuestSubmissions(env, questSubmissionsMatch[1]!, principal, requestId, url);
  }

  const submissionReviewMatch = path.match(/^\/v1\/submissions\/([^/]+)\/review$/);
  if (submissionReviewMatch && request.method === 'POST' && principal) {
    const body = await readJsonObject(request);
    return reviewQuestSubmission(env, submissionReviewMatch[1]!, body, principal, requestId, publisher);
  }

  return null;
}

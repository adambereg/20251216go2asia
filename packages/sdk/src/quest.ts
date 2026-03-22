/**
 * @go2asia/sdk/quest
 *
 * Thin Quest API client for frontend live adoption.
 */

import { customInstance } from './mutator';

import type { ListQuestsParams } from './generated/listQuestsParams';
import type { QuestDetailResponse } from './generated/questDetailResponse';
import type { QuestListResponse } from './generated/questListResponse';
import type { QuestProgressResponse } from './generated/questProgressResponse';
import type { QuestProofType } from './generated/questProofType';
import type { QuestSubmissionResponse } from './generated/questSubmissionResponse';
import type { QuestStepResponse } from './generated/questStepResponse';
import type { SubmitQuestStepRequest } from './generated/submitQuestStepRequest';

export type {
  ListQuestsParams,
  QuestDetailResponse,
  QuestListResponse,
  QuestProgressResponse,
  QuestProofType,
  QuestStepResponse,
  QuestSubmissionResponse,
  SubmitQuestStepRequest,
};

function toQuery(params?: ListQuestsParams): string {
  const sp = new URLSearchParams();
  if (params?.cityId) sp.set('cityId', params.cityId);
  if (params?.theme) sp.set('theme', params.theme);
  if (params?.difficulty) sp.set('difficulty', params.difficulty);
  if (params?.page != null) sp.set('page', String(params.page));
  if (params?.pageSize != null) sp.set('pageSize', String(params.pageSize));
  const query = sp.toString();
  return query ? `?${query}` : '';
}

export async function fetchQuests(params?: ListQuestsParams): Promise<QuestListResponse | null> {
  try {
    return await customInstance<QuestListResponse>({ method: 'GET' }, `/v1/quests${toQuery(params)}`);
  } catch {
    return null;
  }
}

export async function fetchQuest(questId: string): Promise<QuestDetailResponse | null> {
  try {
    return await customInstance<QuestDetailResponse>({ method: 'GET' }, `/v1/quests/${encodeURIComponent(questId)}`);
  } catch {
    return null;
  }
}

export async function startQuest(questId: string): Promise<QuestProgressResponse> {
  return customInstance<QuestProgressResponse>(
    {
      method: 'POST',
      body: JSON.stringify({}),
    },
    `/v1/quests/${encodeURIComponent(questId)}/start`
  );
}

export async function fetchQuestProgress(questId: string): Promise<QuestProgressResponse> {
  return customInstance<QuestProgressResponse>(
    { method: 'GET' },
    `/v1/quests/${encodeURIComponent(questId)}/progress`
  );
}

export async function submitQuestStep(
  questId: string,
  stepId: string,
  payload: SubmitQuestStepRequest
): Promise<QuestSubmissionResponse> {
  return customInstance<QuestSubmissionResponse>(
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    `/v1/quests/${encodeURIComponent(questId)}/steps/${encodeURIComponent(stepId)}/submit`
  );
}

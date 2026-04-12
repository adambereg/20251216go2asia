'use client';

import { customInstance, generated } from '@go2asia/sdk';

export type QuestProApiError = {
  status?: number;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

type OwnedQuestListParams = {
  page?: number;
  pageSize?: number;
  status?: generated.QuestStatus | 'all';
  visibility?: generated.QuestVisibility | 'all';
};

type ReviewQueueParams = {
  status?: generated.SubmissionStatusFilterParameter | 'all';
  stepId?: string | 'all';
  page?: number;
  pageSize?: number;
};

function buildQuery(params: OwnedQuestListParams): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('pageSize', String(params.pageSize ?? 20));
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.visibility && params.visibility !== 'all') search.set('visibility', params.visibility);
  const value = search.toString();
  return value ? `?${value}` : '';
}

function buildReviewQueueQuery(params: ReviewQueueParams): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('pageSize', String(params.pageSize ?? 20));
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.stepId && params.stepId !== 'all') search.set('stepId', params.stepId);
  const value = search.toString();
  return value ? `?${value}` : '';
}

export async function fetchOwnedQuests(
  params: OwnedQuestListParams
): Promise<{ data: generated.QuestListResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestListResponse>(
      { method: 'GET' },
      `/v1/quests/mine${buildQuery(params)}`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function fetchOwnedQuest(
  questId: string
): Promise<{ data: generated.QuestDetailResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestDetailResponse>(
      { method: 'GET' },
      `/v1/quests/mine/${encodeURIComponent(questId)}`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function fetchOwnedQuestStats(
  questId: string
): Promise<{ data: generated.QuestOperationalStatsResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestOperationalStatsResponse>(
      { method: 'GET' },
      `/v1/quests/mine/${encodeURIComponent(questId)}/stats`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export type DraftQuestUpdatePayload = {
  title?: string;
  description?: string | null;
  cityId?: string | null;
  type?: string | null;
  theme?: string | null;
  difficulty?: generated.QuestDifficulty | null;
  visibility?: generated.QuestVisibility;
  rewardPoints?: number | null;
};

export type DraftQuestStepPayload = {
  order: number;
  type: generated.QuestStepType;
  targetType?: generated.QuestStepTargetType | null;
  targetId?: string | null;
  verificationType: generated.QuestVerificationType;
  requirements?: Record<string, unknown>;
  rewardPoints?: number | null;
};

export type DraftQuestStepUpdatePayload = {
  type?: generated.QuestStepType;
  targetType?: generated.QuestStepTargetType | null;
  targetId?: string | null;
  verificationType?: generated.QuestVerificationType;
  requirements?: Record<string, unknown>;
  rewardPoints?: number | null;
};

export async function updateDraftQuest(
  questId: string,
  payload: DraftQuestUpdatePayload
): Promise<{ data: generated.QuestDetailResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestDetailResponse>(
      { method: 'PATCH', body: JSON.stringify(payload) },
      `/v1/quests/mine/${encodeURIComponent(questId)}`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function addDraftQuestStep(
  questId: string,
  payload: DraftQuestStepPayload
): Promise<{ data: generated.QuestStepResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestStepResponse>(
      { method: 'POST', body: JSON.stringify(payload) },
      `/v1/quests/${encodeURIComponent(questId)}/steps`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function updateDraftQuestStep(
  questId: string,
  stepId: string,
  payload: DraftQuestStepUpdatePayload
): Promise<{ data: generated.QuestStepResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestStepResponse>(
      { method: 'PATCH', body: JSON.stringify(payload) },
      `/v1/quests/mine/${encodeURIComponent(questId)}/steps/${encodeURIComponent(stepId)}`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function deleteDraftQuestStep(
  questId: string,
  stepId: string
): Promise<{ ok: boolean; error: QuestProApiError | null }> {
  try {
    await customInstance<unknown>(
      { method: 'DELETE' },
      `/v1/quests/mine/${encodeURIComponent(questId)}/steps/${encodeURIComponent(stepId)}`
    );
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: error as QuestProApiError };
  }
}

export async function publishManagedQuest(
  questId: string
): Promise<{ data: generated.QuestDetailResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestDetailResponse>(
      { method: 'POST' },
      `/v1/quests/${encodeURIComponent(questId)}/publish`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function archiveManagedQuest(
  questId: string
): Promise<{ data: generated.QuestDetailResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestDetailResponse>(
      { method: 'POST' },
      `/v1/quests/${encodeURIComponent(questId)}/archive`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function fetchQuestReviewQueue(
  questId: string,
  params: ReviewQueueParams
): Promise<{ data: generated.QuestSubmissionListResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestSubmissionListResponse>(
      { method: 'GET' },
      `/v1/quests/${encodeURIComponent(questId)}/submissions${buildReviewQueueQuery(params)}`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

export async function reviewQuestSubmissionByManager(
  submissionId: string,
  payload: generated.ReviewSubmissionRequest
): Promise<{ data: generated.QuestSubmissionResponse | null; error: QuestProApiError | null }> {
  try {
    const data = await customInstance<generated.QuestSubmissionResponse>(
      { method: 'POST', body: JSON.stringify(payload) },
      `/v1/submissions/${encodeURIComponent(submissionId)}/review`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as QuestProApiError };
  }
}

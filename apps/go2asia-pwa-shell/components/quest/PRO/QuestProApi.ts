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

function buildQuery(params: OwnedQuestListParams): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('pageSize', String(params.pageSize ?? 20));
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.visibility && params.visibility !== 'all') search.set('visibility', params.visibility);
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

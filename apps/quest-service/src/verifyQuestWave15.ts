import { getQuest, listQuests } from './services/questService';

const QUEST_IDS = ['quest_phuket_old_town_001', 'quest_sunset_viewpoint_002', 'quest_one_day_explorer_005'] as const;

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  return url;
}

async function readJson(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { raw: text };
  }
}

async function main() {
  const env = {
    DATABASE_URL: getDatabaseUrl(),
    ENVIRONMENT: process.env.ENVIRONMENT ?? 'staging',
  };

  const listResponse = await listQuests(env, 'quest-wave15-list', new URL('https://quest.local/v1/quests?page=1&pageSize=50'));
  const listJson = await readJson(listResponse);
  const listItems = Array.isArray((listJson as { items?: unknown[] }).items)
    ? ((listJson as { items?: Record<string, unknown>[] }).items ?? [])
    : [];

  const detailResults = [];
  for (const questId of QUEST_IDS) {
    const response = await getQuest(env, `quest-wave15-detail-${questId}`, questId);
    const json = await readJson(response);
    const typed = json as {
      id?: string;
      title?: string;
      status?: string;
      visibility?: string;
      steps?: Array<{
        id?: string;
        order?: number;
        type?: string;
        targetType?: string | null;
        targetId?: string | null;
        verificationType?: string;
        requirements?: Record<string, unknown>;
      }>;
    };
    const firstStep = typed.steps?.[0];
    const requirements = firstStep?.requirements ?? {};
    const contentV2 = (requirements.contentV2 ?? {}) as Record<string, unknown>;
    detailResults.push({
      httpStatus: response.status,
      id: typed.id ?? null,
      title: typed.title ?? null,
      status: typed.status ?? null,
      visibility: typed.visibility ?? null,
      stepsCount: typed.steps?.length ?? 0,
      firstStep: firstStep
        ? {
            id: firstStep.id ?? null,
            order: firstStep.order ?? null,
            type: firstStep.type ?? null,
            targetType: firstStep.targetType ?? null,
            targetId: firstStep.targetId ?? null,
            verificationType: firstStep.verificationType ?? null,
            requirementsKeys: Object.keys(requirements),
            contentV2Keys: Object.keys(contentV2),
          }
        : null,
    });
  }

  console.log(
    JSON.stringify(
      {
        listStatus: listResponse.status,
        matchedListItems: listItems
          .filter((item) => QUEST_IDS.includes(String(item.id) as (typeof QUEST_IDS)[number]))
          .map((item) => ({
            id: item.id ?? null,
            title: item.title ?? null,
            status: item.status ?? null,
            visibility: item.visibility ?? null,
            stepsCount: item.stepsCount ?? null,
            difficulty: item.difficulty ?? null,
            theme: item.theme ?? null,
          })),
        detailResults,
      },
      null,
      2
    )
  );
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

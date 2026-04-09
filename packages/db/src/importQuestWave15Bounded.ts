import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { Client } from 'pg';

type QuestDifficulty = 'easy' | 'medium' | 'hard';
type QuestStatus = 'draft' | 'published' | 'archived';
type QuestVisibility = 'public' | 'private';
type QuestStepType =
  | 'visit_place'
  | 'attend_event'
  | 'visit_partner'
  | 'challenge'
  | 'photo_proof'
  | 'geo_checkin'
  | 'qr_code'
  | 'space_action';
type QuestVerificationType = 'auto' | 'geo' | 'qr' | 'manual' | 'space_post';
type QuestTargetType = 'place' | 'event' | 'partner' | 'space_post';

type QuestContent = {
  filePath: string;
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  cityId: string | null;
  theme: string | null;
  difficulty: QuestDifficulty | null;
  rewardPoints: number | null;
  stepsCount: number;
  status: QuestStatus;
  visibility: QuestVisibility;
  steps: StepContent[];
};

type StepContent = {
  order: number;
  sourceStepId: string;
  title: string;
  shortInstruction: string;
  description: string;
  type: QuestStepType;
  verificationType: QuestVerificationType;
  rawTargetType: string | null;
  rawTargetId: string | null;
  proofExpectation: string | null;
  reviewMode: string | null;
  rewardPoints: number | null;
  userInstructionShort: string | null;
  submitHintShort: string | null;
  blockingNote: string | null;
  stepBadge: string | null;
  icon: string | null;
  emphasis: string | null;
  showMapHint: boolean | null;
  showPhotoHint: boolean | null;
  showReviewHint: boolean | null;
  stepImageKey: string | null;
  stepImageAlt: string | null;
  stepImageHint: string | null;
};

type QuestRow = {
  id: string;
  title: string;
  description: string | null;
  city_id: string | null;
  theme: string | null;
  difficulty: QuestDifficulty | null;
  reward_points: number | null;
  steps_count: number;
  status: QuestStatus;
  visibility: QuestVisibility;
  type: string | null;
  progress_count: number;
  submission_count: number;
};

type StepRow = {
  id: string;
  quest_id: string;
  order: number;
  type: QuestStepType;
  target_type: QuestTargetType | null;
  target_id: string | null;
  verification_type: QuestVerificationType;
  reward_points: number | null;
  requirements_json: Record<string, unknown>;
};

type NormalizedTarget = {
  targetType: QuestTargetType | null;
  targetId: string | null;
  note: string | null;
};

const QUEST_FILES = [
  'content/quest/q1–q6/Q1-Morning-Walk-Through-Old-Phuket.md',
  'content/quest/q1–q6/Q2-Sunset-Viewpoint-Photo-Mission.md',
  'content/quest/q1–q6/Q5-One-Day-Explorer-Route.md',
] as const;

const QUEST_STEP_TYPES: readonly QuestStepType[] = [
  'visit_place',
  'attend_event',
  'visit_partner',
  'challenge',
  'photo_proof',
  'geo_checkin',
  'qr_code',
  'space_action',
];

const QUEST_VERIFICATION_TYPES: readonly QuestVerificationType[] = ['auto', 'geo', 'qr', 'manual', 'space_post'];
const QUEST_DIFFICULTIES: readonly QuestDifficulty[] = ['easy', 'medium', 'hard'];
const QUEST_STATUSES: readonly QuestStatus[] = ['draft', 'published', 'archived'];
const QUEST_VISIBILITIES: readonly QuestVisibility[] = ['public', 'private'];

function getDatabaseUrl(): string {
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run with ENVIRONMENT=production');
  return url;
}

function stripInlineValue(raw: string): string {
  let value = raw.trim();
  if (value.endsWith('\r')) value = value.slice(0, -1);
  if ((value.startsWith('`') && value.endsWith('`')) || (value.startsWith('"') && value.endsWith('"'))) {
    value = value.slice(1, -1);
  }
  return value.trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractBulletValue(block: string, key: string): string | null {
  const pattern = new RegExp(`^-\\s+${escapeRegex(key)}:\\s+(.+)$`, 'm');
  const match = block.match(pattern);
  if (!match?.[1]) return null;
  return stripInlineValue(match[1]);
}

function extractRequiredBulletValue(block: string, key: string): string {
  const value = extractBulletValue(block, key);
  if (value === null) throw new Error(`Missing required field "${key}"`);
  return value;
}

function parseNullableString(value: string | null): string | null {
  if (value === null) return null;
  if (value === 'null') return null;
  return value;
}

function parseNullableInt(value: string | null): number | null {
  if (value === null || value === 'null') return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`Expected integer, got "${value}"`);
  return parsed;
}

function parseNullableBoolean(value: string | null): boolean | null {
  if (value === null || value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Expected boolean, got "${value}"`);
}

function parseQuestDifficulty(value: string | null): QuestDifficulty | null {
  if (value === null || value === 'null') return null;
  if (!QUEST_DIFFICULTIES.includes(value as QuestDifficulty)) throw new Error(`Invalid difficulty "${value}"`);
  return value as QuestDifficulty;
}

function parseQuestStatus(value: string): QuestStatus {
  if (!QUEST_STATUSES.includes(value as QuestStatus)) throw new Error(`Invalid status "${value}"`);
  return value as QuestStatus;
}

function parseQuestVisibility(value: string): QuestVisibility {
  if (!QUEST_VISIBILITIES.includes(value as QuestVisibility)) throw new Error(`Invalid visibility "${value}"`);
  return value as QuestVisibility;
}

function parseQuestStepType(value: string): QuestStepType {
  if (!QUEST_STEP_TYPES.includes(value as QuestStepType)) throw new Error(`Invalid step type "${value}"`);
  return value as QuestStepType;
}

function parseQuestVerificationType(value: string): QuestVerificationType {
  if (!QUEST_VERIFICATION_TYPES.includes(value as QuestVerificationType)) {
    throw new Error(`Invalid verification type "${value}"`);
  }
  return value as QuestVerificationType;
}

function readStepBlocks(markdown: string): string[] {
  const stepsIndex = markdown.indexOf('## Steps');
  if (stepsIndex === -1) throw new Error('Missing "## Steps" section');
  const stepsBody = markdown.slice(stepsIndex);
  const matches = Array.from(stepsBody.matchAll(/^### Step \d+\s*$/gm));
  if (matches.length === 0) throw new Error('No step headings found');
  const blocks: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i]!.index!;
    const end = i + 1 < matches.length ? matches[i + 1]!.index! : stepsBody.indexOf('## Progress Examples');
    const safeEnd = end === -1 ? stepsBody.length : end;
    blocks.push(stepsBody.slice(start, safeEnd).trim());
  }
  return blocks;
}

function parseStepBlock(block: string): StepContent {
  return {
    order: parseNullableInt(extractRequiredBulletValue(block, 'order')) ?? 0,
    sourceStepId: extractRequiredBulletValue(block, 'step_id'),
    title: extractRequiredBulletValue(block, 'title'),
    shortInstruction: extractRequiredBulletValue(block, 'short_instruction'),
    description: extractRequiredBulletValue(block, 'description'),
    type: parseQuestStepType(extractRequiredBulletValue(block, 'type')),
    verificationType: parseQuestVerificationType(extractRequiredBulletValue(block, 'verification_type')),
    rawTargetType: parseNullableString(extractBulletValue(block, 'target_type')),
    rawTargetId: parseNullableString(extractBulletValue(block, 'target_id')),
    proofExpectation: parseNullableString(extractBulletValue(block, 'proof_expectation')),
    reviewMode: parseNullableString(extractBulletValue(block, 'review_mode')),
    rewardPoints: parseNullableInt(extractBulletValue(block, 'reward_points')),
    userInstructionShort: parseNullableString(extractBulletValue(block, 'user_instruction_short')),
    submitHintShort: parseNullableString(extractBulletValue(block, 'submit_hint_short')),
    blockingNote: parseNullableString(extractBulletValue(block, 'blocking_note')),
    stepBadge: parseNullableString(extractBulletValue(block, 'step_badge')),
    icon: parseNullableString(extractBulletValue(block, 'icon')),
    emphasis: parseNullableString(extractBulletValue(block, 'emphasis')),
    showMapHint: parseNullableBoolean(extractBulletValue(block, 'show_map_hint')),
    showPhotoHint: parseNullableBoolean(extractBulletValue(block, 'show_photo_hint')),
    showReviewHint: parseNullableBoolean(extractBulletValue(block, 'show_review_hint')),
    stepImageKey: parseNullableString(extractBulletValue(block, 'step_image_key')),
    stepImageAlt: parseNullableString(extractBulletValue(block, 'step_image_alt')),
    stepImageHint: parseNullableString(extractBulletValue(block, 'step_image_hint')),
  };
}

function parseQuestFile(filePath: string): QuestContent {
  const markdown = readFileSync(filePath, 'utf8');
  const steps = readStepBlocks(markdown).map(parseStepBlock).sort((a, b) => a.order - b.order);
  return {
    filePath,
    id: extractRequiredBulletValue(markdown, 'id'),
    slug: extractRequiredBulletValue(markdown, 'slug'),
    title: extractRequiredBulletValue(markdown, 'title'),
    shortDescription: extractRequiredBulletValue(markdown, 'short_description'),
    fullDescription: extractRequiredBulletValue(markdown, 'full_description'),
    cityId: parseNullableString(extractBulletValue(markdown, 'city_id')),
    theme: parseNullableString(extractBulletValue(markdown, 'theme')),
    difficulty: parseQuestDifficulty(extractBulletValue(markdown, 'difficulty')),
    rewardPoints: parseNullableInt(extractBulletValue(markdown, 'reward_points')),
    stepsCount: parseNullableInt(extractRequiredBulletValue(markdown, 'steps_count')) ?? 0,
    status: parseQuestStatus(extractRequiredBulletValue(markdown, 'status')),
    visibility: parseQuestVisibility(extractRequiredBulletValue(markdown, 'visibility')),
    steps,
  };
}

function normalizeTarget(step: StepContent): NormalizedTarget {
  const rawTargetType = step.rawTargetType;
  if (rawTargetType === null) return { targetType: null, targetId: null, note: null };
  if (rawTargetType === 'custom') {
    if (step.type === 'space_action' && step.verificationType === 'space_post') {
      return {
        targetType: 'space_post',
        targetId: step.rawTargetId,
        note: 'Normalized custom space action target_type to space_post to match current enum/runtime contract.',
      };
    }
    return {
      targetType: null,
      targetId: null,
      note: 'Dropped custom target_type from DB because current enum only supports place/event/partner/space_post.',
    };
  }
  if (!['place', 'event', 'partner', 'space_post'].includes(rawTargetType)) {
    throw new Error(`Unsupported target_type "${rawTargetType}" in ${step.sourceStepId}`);
  }
  return { targetType: rawTargetType as QuestTargetType, targetId: step.rawTargetId, note: null };
}

function buildRequirements(existing: Record<string, unknown>, quest: QuestContent, step: StepContent, normalized: NormalizedTarget) {
  return {
    ...existing,
    contentV2: {
      wave: '1.5',
      importVersion: 'quest_wave_1_5_bounded_v1',
      sourceFile: basename(quest.filePath),
      sourceQuestId: quest.id,
      sourceQuestSlug: quest.slug,
      sourceStepId: step.sourceStepId,
      presentation: {
        title: step.title,
        shortInstruction: step.shortInstruction,
        description: step.description,
        userInstructionShort: step.userInstructionShort,
        submitHintShort: step.submitHintShort,
        blockingNote: step.blockingNote,
        stepBadge: step.stepBadge,
        icon: step.icon,
        emphasis: step.emphasis,
      },
      runtimeUx: {
        proofExpectation: step.proofExpectation,
        reviewMode: step.reviewMode,
        showMapHint: step.showMapHint,
        showPhotoHint: step.showPhotoHint,
        showReviewHint: step.showReviewHint,
      },
      media: {
        stepImageKey: step.stepImageKey,
        stepImageAlt: step.stepImageAlt,
        stepImageHint: step.stepImageHint,
      },
      normalizedTarget: {
        rawTargetType: step.rawTargetType,
        rawTargetId: step.rawTargetId,
        storedTargetType: normalized.targetType,
        storedTargetId: normalized.targetId,
        note: normalized.note,
      },
    },
  };
}

function buildQuestDescription(quest: QuestContent): string {
  return `${quest.shortDescription}\n\n${quest.fullDescription}`.trim();
}

function parseArgs(argv: string[]) {
  return {
    apply: argv.includes('--apply'),
  };
}

async function loadCurrentState(client: Client, questIds: string[]) {
  const questResult = await client.query<QuestRow>(
    `
      select
        q.id,
        q.title,
        q.description,
        q.city_id,
        q.theme,
        q.difficulty,
        q.reward_points,
        q.steps_count,
        q.status,
        q.visibility,
        q.type,
        count(distinct qp.id)::int as progress_count,
        count(distinct qs.id)::int as submission_count
      from quest q
      left join quest_progress qp on qp.quest_id = q.id
      left join quest_step st on st.quest_id = q.id
      left join quest_submission qs on qs.step_id = st.id
      where q.id = any($1::text[])
      group by q.id
      order by q.id
    `,
    [questIds]
  );

  const stepResult = await client.query<StepRow>(
    `
      select
        id,
        quest_id,
        "order",
        type,
        target_type,
        target_id,
        verification_type,
        reward_points,
        requirements_json
      from quest_step
      where quest_id = any($1::text[])
      order by quest_id, "order"
    `,
    [questIds]
  );

  return { quests: questResult.rows, steps: stepResult.rows };
}

function buildPlan(contents: QuestContent[], state: Awaited<ReturnType<typeof loadCurrentState>>) {
  const questById = new Map(state.quests.map((row) => [row.id, row]));
  const stepsByQuestId = new Map<string, StepRow[]>();
  for (const row of state.steps) {
    const list = stepsByQuestId.get(row.quest_id) ?? [];
    list.push(row);
    stepsByQuestId.set(row.quest_id, list);
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const questPlans = contents.map((quest) => {
    const currentQuest = questById.get(quest.id);
    if (!currentQuest) {
      errors.push(`Quest "${quest.id}" is missing in staging DB.`);
      return null;
    }
    const currentSteps = (stepsByQuestId.get(quest.id) ?? []).sort((a, b) => a.order - b.order);
    if (currentSteps.length !== quest.steps.length) {
      errors.push(
        `Quest "${quest.id}" has ${currentSteps.length} DB steps but ${quest.steps.length} content steps; bounded pass refuses to insert/delete steps.`
      );
      return null;
    }
    if (currentQuest.steps_count !== currentSteps.length) {
      warnings.push(
        `Quest "${quest.id}" has quest.steps_count=${currentQuest.steps_count} but ${currentSteps.length} actual DB steps; bounded pass will reset steps_count to content value ${quest.stepsCount}.`
      );
    }

    const stepPlans = quest.steps.map((contentStep) => {
      const currentStep = currentSteps.find((row) => row.order === contentStep.order);
      if (!currentStep) {
        errors.push(`Quest "${quest.id}" is missing DB step with order=${contentStep.order}.`);
        return null;
      }
      const normalizedTarget = normalizeTarget(contentStep);
      if (normalizedTarget.note) {
        warnings.push(`${quest.id} step ${contentStep.order}: ${normalizedTarget.note}`);
      }
      return {
        currentStep,
        contentStep,
        normalizedTarget,
        nextRequirements: buildRequirements(currentStep.requirements_json ?? {}, quest, contentStep, normalizedTarget),
      };
    });

    return {
      quest,
      currentQuest,
      nextQuestRow: {
        title: quest.title,
        description: buildQuestDescription(quest),
        cityId: quest.cityId,
        theme: quest.theme,
        difficulty: quest.difficulty,
        rewardPoints: quest.rewardPoints,
        stepsCount: quest.stepsCount,
        status: quest.status,
        visibility: quest.visibility,
      },
      stepPlans,
    };
  });

  return { questPlans: questPlans.filter(Boolean), errors, warnings };
}

async function applyPlan(client: Client, plan: ReturnType<typeof buildPlan>) {
  if (plan.errors.length > 0) throw new Error(`Cannot apply plan with ${plan.errors.length} error(s).`);

  await client.query('begin');
  try {
    for (const questPlan of plan.questPlans) {
      await client.query(
        `
          update quest
          set
            title = $2,
            description = $3,
            city_id = $4,
            theme = $5,
            difficulty = $6,
            reward_points = $7,
            steps_count = $8,
            status = $9,
            visibility = $10,
            updated_at = now()
          where id = $1
        `,
        [
          questPlan!.quest.id,
          questPlan!.nextQuestRow.title,
          questPlan!.nextQuestRow.description,
          questPlan!.nextQuestRow.cityId,
          questPlan!.nextQuestRow.theme,
          questPlan!.nextQuestRow.difficulty,
          questPlan!.nextQuestRow.rewardPoints,
          questPlan!.nextQuestRow.stepsCount,
          questPlan!.nextQuestRow.status,
          questPlan!.nextQuestRow.visibility,
        ]
      );

      for (const stepPlan of questPlan!.stepPlans) {
        if (!stepPlan) continue;
        await client.query(
          `
            update quest_step
            set
              type = $2,
              target_type = $3,
              target_id = $4,
              verification_type = $5,
              reward_points = $6,
              requirements_json = $7::jsonb
            where id = $1
          `,
          [
            stepPlan.currentStep.id,
            stepPlan.contentStep.type,
            stepPlan.normalizedTarget.targetType,
            stepPlan.normalizedTarget.targetId,
            stepPlan.contentStep.verificationType,
            stepPlan.contentStep.rewardPoints,
            JSON.stringify(stepPlan.nextRequirements),
          ]
        );
      }
    }

    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = resolve(__dirname, '..', '..', '..');
  const contents = QUEST_FILES.map((relativePath) => parseQuestFile(resolve(root, relativePath)));
  const databaseUrl = getDatabaseUrl();
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const questIds = contents.map((item) => item.id);
    const before = await loadCurrentState(client, questIds);
    const plan = buildPlan(contents, before);

    const report = {
      mode: args.apply ? 'apply' : 'dry-run',
      questIds,
      files: contents.map((item) => item.filePath),
      errors: plan.errors,
      warnings: plan.warnings,
      mapping: {
        questColumns: [
          'title',
          'description<=short_description + full_description',
          'city_id',
          'theme',
          'difficulty',
          'reward_points',
          'steps_count',
          'status',
          'visibility',
        ],
        stepColumns: ['type', 'target_type', 'target_id', 'verification_type', 'reward_points'],
        stepRequirementsJsonNamespace: 'contentV2',
      },
      before: {
        quests: before.quests,
        steps: before.steps,
      },
    };

    if (!args.apply || plan.errors.length > 0) {
      console.log(JSON.stringify(report, null, 2));
      if (plan.errors.length > 0) process.exitCode = 1;
      return;
    }

    await applyPlan(client, plan);
    const after = await loadCurrentState(client, questIds);
    console.log(
      JSON.stringify(
        {
          ...report,
          after: {
            quests: after.quests,
            steps: after.steps,
          },
        },
        null,
        2
      )
    );
  } finally {
    await client.end();
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

type DbExecutor = Pick<Db, 'execute'>;

export type QuestStatus = 'draft' | 'published' | 'archived';
export type QuestVisibility = 'public' | 'private';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type QuestStepType =
  | 'visit_place'
  | 'attend_event'
  | 'visit_partner'
  | 'challenge'
  | 'photo_proof'
  | 'geo_checkin'
  | 'qr_code'
  | 'space_action';
export type QuestVerificationType = 'auto' | 'geo' | 'qr' | 'manual' | 'space_post';
export type QuestTargetType = 'place' | 'event' | 'partner' | 'space_post';
export type QuestProgressStatus = 'not_started' | 'in_progress' | 'pending_review' | 'completed' | 'failed' | 'expired';
export type QuestSubmissionStatus = 'pending' | 'approved' | 'rejected';
export type QuestProofType = 'photo' | 'geo' | 'qr' | 'space_post' | 'text';

export type QuestRow = {
  id: string;
  title: string;
  description: string | null;
  creator_pro_id: string;
  city_id: string | null;
  geo_scope: Record<string, unknown> | null;
  type: string | null;
  theme: string | null;
  difficulty: QuestDifficulty | null;
  status: QuestStatus;
  visibility: QuestVisibility;
  reward_points: number | null;
  steps_count: number;
  published_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type QuestStepRow = {
  id: string;
  quest_id: string;
  order: number;
  type: QuestStepType;
  target_type: QuestTargetType | null;
  target_id: string | null;
  verification_type: QuestVerificationType;
  requirements_json: Record<string, unknown>;
  reward_points: number | null;
  created_at: string | Date;
};

export type QuestProgressRow = {
  id: string;
  quest_id: string;
  user_id: string;
  status: QuestProgressStatus;
  current_step: number | null;
  started_at: string | Date;
  completed_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type QuestSubmissionRow = {
  id: string;
  progress_id: string;
  step_id: string;
  user_id: string;
  proof_type: QuestProofType;
  proof_data: Record<string, unknown>;
  status: QuestSubmissionStatus;
  reviewed_by: string | null;
  reviewed_at: string | Date | null;
  rejection_reason: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type QuestRewardOutboxStatus = 'pending' | 'delivered' | 'failed';

export type QuestRewardOutboxRow = {
  id: string;
  quest_progress_id: string;
  quest_id: string;
  user_id: string;
  points_amount: number;
  action: string;
  external_id: string;
  source_event_id: string | null;
  metadata: Record<string, unknown>;
  status: QuestRewardOutboxStatus;
  attempt_count: number;
  last_attempt_at: string | Date | null;
  delivered_at: string | Date | null;
  last_error: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type QuestRewardOutboxStatsRow = {
  pending_count: number;
  delivered_count: number;
  failed_count: number;
  oldest_pending_created_at: string | Date | null;
  oldest_failed_created_at: string | Date | null;
};

export type SubmissionReviewRow = QuestSubmissionRow & {
  quest_id: string;
  creator_pro_id: string;
  progress_status: QuestProgressStatus;
  current_step: number | null;
  step_order: number;
};

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

export async function listPublishedQuests(
  db: DbExecutor,
  input: {
    cityId: string | null;
    theme: string | null;
    difficulty: QuestDifficulty | null;
    limit: number;
    offset: number;
  }
): Promise<QuestRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
    FROM quest
    WHERE status = 'published'
      AND visibility = 'public'
      AND (${input.cityId}::text IS NULL OR city_id = ${input.cityId})
      AND (${input.theme}::text IS NULL OR theme = ${input.theme})
      AND (${input.difficulty}::quest_difficulty IS NULL OR difficulty = ${input.difficulty})
    ORDER BY published_at DESC NULLS LAST, updated_at DESC, id DESC
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);
  return rowsOf<QuestRow>(result);
}

export async function countPublishedQuests(
  db: DbExecutor,
  input: {
    cityId: string | null;
    theme: string | null;
    difficulty: QuestDifficulty | null;
  }
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM quest
    WHERE status = 'published'
      AND visibility = 'public'
      AND (${input.cityId}::text IS NULL OR city_id = ${input.cityId})
      AND (${input.theme}::text IS NULL OR theme = ${input.theme})
      AND (${input.difficulty}::quest_difficulty IS NULL OR difficulty = ${input.difficulty})
  `);
  return rowsOf<{ total: number }>(result)[0]?.total ?? 0;
}

export async function listManagedQuests(
  db: DbExecutor,
  input: {
    ownerProId: string | null;
    status: QuestStatus | null;
    visibility: QuestVisibility | null;
    limit: number;
    offset: number;
  }
): Promise<QuestRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
    FROM quest
    WHERE (${input.ownerProId}::text IS NULL OR creator_pro_id = ${input.ownerProId})
      AND (${input.status}::quest_status IS NULL OR status = ${input.status})
      AND (${input.visibility}::quest_visibility IS NULL OR visibility = ${input.visibility})
    ORDER BY updated_at DESC, created_at DESC, id DESC
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);
  return rowsOf<QuestRow>(result);
}

export async function countManagedQuests(
  db: DbExecutor,
  input: {
    ownerProId: string | null;
    status: QuestStatus | null;
    visibility: QuestVisibility | null;
  }
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM quest
    WHERE (${input.ownerProId}::text IS NULL OR creator_pro_id = ${input.ownerProId})
      AND (${input.status}::quest_status IS NULL OR status = ${input.status})
      AND (${input.visibility}::quest_visibility IS NULL OR visibility = ${input.visibility})
  `);
  return rowsOf<{ total: number }>(result)[0]?.total ?? 0;
}

export async function getQuestById(db: DbExecutor, questId: string): Promise<QuestRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
    FROM quest
    WHERE id = ${questId}
    LIMIT 1
  `);
  return rowsOf<QuestRow>(result)[0] ?? null;
}

export async function getPublishedQuestById(db: DbExecutor, questId: string): Promise<QuestRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
    FROM quest
    WHERE id = ${questId}
      AND status = 'published'
      AND visibility = 'public'
    LIMIT 1
  `);
  return rowsOf<QuestRow>(result)[0] ?? null;
}

export async function listQuestSteps(db: DbExecutor, questId: string): Promise<QuestStepRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      quest_id,
      "order",
      type,
      target_type,
      target_id,
      verification_type,
      requirements_json,
      reward_points,
      created_at
    FROM quest_step
    WHERE quest_id = ${questId}
    ORDER BY "order" ASC, id ASC
  `);
  return rowsOf<QuestStepRow>(result);
}

export async function getQuestStepById(db: DbExecutor, questId: string, stepId: string): Promise<QuestStepRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      quest_id,
      "order",
      type,
      target_type,
      target_id,
      verification_type,
      requirements_json,
      reward_points,
      created_at
    FROM quest_step
    WHERE quest_id = ${questId}
      AND id = ${stepId}
    LIMIT 1
  `);
  return rowsOf<QuestStepRow>(result)[0] ?? null;
}

export async function insertQuest(
  db: DbExecutor,
  input: {
    id: string;
    title: string;
    description: string | null;
    creatorProId: string;
    cityId: string | null;
    geoScope: Record<string, unknown> | null;
    type: string | null;
    theme: string | null;
    difficulty: QuestDifficulty | null;
    visibility: QuestVisibility;
    rewardPoints: number | null;
  }
): Promise<QuestRow | null> {
  const result = await db.execute(sql`
    INSERT INTO quest (
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.title},
      ${input.description},
      ${input.creatorProId},
      ${input.cityId},
      ${input.geoScope},
      ${input.type},
      ${input.theme},
      ${input.difficulty},
      'draft',
      ${input.visibility},
      ${input.rewardPoints},
      0,
      now(),
      now()
    )
    RETURNING
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
  `);
  return rowsOf<QuestRow>(result)[0] ?? null;
}

export async function updateQuestDraft(
  db: DbExecutor,
  input: {
    questId: string;
    title: string;
    description: string | null;
    cityId: string | null;
    geoScope: Record<string, unknown> | null;
    type: string | null;
    theme: string | null;
    difficulty: QuestDifficulty | null;
    visibility: QuestVisibility;
    rewardPoints: number | null;
  }
): Promise<QuestRow | null> {
  const result = await db.execute(sql`
    UPDATE quest
    SET
      title = ${input.title},
      description = ${input.description},
      city_id = ${input.cityId},
      geo_scope = ${input.geoScope},
      type = ${input.type},
      theme = ${input.theme},
      difficulty = ${input.difficulty},
      visibility = ${input.visibility},
      reward_points = ${input.rewardPoints},
      updated_at = now()
    WHERE id = ${input.questId}
      AND status = 'draft'
    RETURNING
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
  `);
  return rowsOf<QuestRow>(result)[0] ?? null;
}

export async function insertQuestStep(
  db: DbExecutor,
  input: {
    id: string;
    questId: string;
    order: number;
    type: QuestStepType;
    targetType: QuestTargetType | null;
    targetId: string | null;
    verificationType: QuestVerificationType;
    requirementsJson: Record<string, unknown>;
    rewardPoints: number | null;
  }
): Promise<QuestStepRow | null> {
  const result = await db.execute(sql`
    INSERT INTO quest_step (
      id,
      quest_id,
      "order",
      type,
      target_type,
      target_id,
      verification_type,
      requirements_json,
      reward_points,
      created_at
    )
    VALUES (
      ${input.id},
      ${input.questId},
      ${input.order},
      ${input.type},
      ${input.targetType},
      ${input.targetId},
      ${input.verificationType},
      ${input.requirementsJson},
      ${input.rewardPoints},
      now()
    )
    RETURNING
      id,
      quest_id,
      "order",
      type,
      target_type,
      target_id,
      verification_type,
      requirements_json,
      reward_points,
      created_at
  `);
  return rowsOf<QuestStepRow>(result)[0] ?? null;
}

export async function updateQuestStep(
  db: DbExecutor,
  input: {
    questId: string;
    stepId: string;
    type: QuestStepType;
    targetType: QuestTargetType | null;
    targetId: string | null;
    verificationType: QuestVerificationType;
    requirementsJson: Record<string, unknown>;
    rewardPoints: number | null;
  }
): Promise<QuestStepRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_step
    SET
      type = ${input.type},
      target_type = ${input.targetType},
      target_id = ${input.targetId},
      verification_type = ${input.verificationType},
      requirements_json = ${input.requirementsJson},
      reward_points = ${input.rewardPoints}
    WHERE quest_id = ${input.questId}
      AND id = ${input.stepId}
    RETURNING
      id,
      quest_id,
      "order",
      type,
      target_type,
      target_id,
      verification_type,
      requirements_json,
      reward_points,
      created_at
  `);
  return rowsOf<QuestStepRow>(result)[0] ?? null;
}

export async function deleteQuestStep(
  db: DbExecutor,
  input: { questId: string; stepId: string }
): Promise<boolean> {
  const result = await db.execute(sql`
    DELETE FROM quest_step
    WHERE quest_id = ${input.questId}
      AND id = ${input.stepId}
    RETURNING id
  `);
  return rowsOf<{ id: string }>(result).length > 0;
}

export async function resequenceQuestSteps(db: DbExecutor, questId: string): Promise<void> {
  await db.execute(sql`
    WITH ranked AS (
      SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY "order" ASC, id ASC)::int AS next_order
      FROM quest_step
      WHERE quest_id = ${questId}
    )
    UPDATE quest_step qs
    SET "order" = ranked.next_order
    FROM ranked
    WHERE qs.id = ranked.id
      AND qs.quest_id = ${questId}
  `);
}

export async function syncQuestStepsCount(db: DbExecutor, questId: string): Promise<void> {
  await db.execute(sql`
    UPDATE quest q
    SET
      steps_count = sub.steps_count,
      updated_at = now()
    FROM (
      SELECT quest_id, COUNT(*)::int AS steps_count
      FROM quest_step
      WHERE quest_id = ${questId}
      GROUP BY quest_id
    ) sub
    WHERE q.id = sub.quest_id
  `);
}

export async function publishQuest(db: DbExecutor, questId: string): Promise<QuestRow | null> {
  const result = await db.execute(sql`
    UPDATE quest
    SET
      status = 'published',
      published_at = COALESCE(published_at, now()),
      updated_at = now()
    WHERE id = ${questId}
      AND status = 'draft'
    RETURNING
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
  `);
  return rowsOf<QuestRow>(result)[0] ?? null;
}

export async function archiveQuest(db: DbExecutor, questId: string): Promise<QuestRow | null> {
  const result = await db.execute(sql`
    UPDATE quest
    SET
      status = 'archived',
      updated_at = now()
    WHERE id = ${questId}
      AND status = 'published'
    RETURNING
      id,
      title,
      description,
      creator_pro_id,
      city_id,
      geo_scope,
      type,
      theme,
      difficulty,
      status,
      visibility,
      reward_points,
      steps_count,
      published_at,
      created_at,
      updated_at
  `);
  return rowsOf<QuestRow>(result)[0] ?? null;
}

export async function countActiveQuestProgress(
  db: DbExecutor,
  questId: string
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM quest_progress
    WHERE quest_id = ${questId}
      AND status IN ('not_started', 'in_progress', 'pending_review')
  `);
  return rowsOf<{ total: number }>(result)[0]?.total ?? 0;
}

export async function countPendingQuestSubmissions(
  db: DbExecutor,
  questId: string
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM quest_submission qs
    INNER JOIN quest_progress qp ON qp.id = qs.progress_id
    WHERE qp.quest_id = ${questId}
      AND qs.status = 'pending'
  `);
  return rowsOf<{ total: number }>(result)[0]?.total ?? 0;
}

export async function countQuestProgressStats(
  db: DbExecutor,
  questId: string
): Promise<{ startedCount: number; completedCount: number }> {
  const result = await db.execute(sql`
    SELECT
      COUNT(*) FILTER (WHERE status <> 'not_started')::int AS started_count,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_count
    FROM quest_progress
    WHERE quest_id = ${questId}
  `);
  const row = rowsOf<{ started_count: number; completed_count: number }>(result)[0];
  return {
    startedCount: row?.started_count ?? 0,
    completedCount: row?.completed_count ?? 0,
  };
}

export async function getQuestProgressByQuestAndUser(
  db: DbExecutor,
  questId: string,
  userId: string
): Promise<QuestProgressRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      quest_id,
      user_id,
      status,
      current_step,
      started_at,
      completed_at,
      created_at,
      updated_at
    FROM quest_progress
    WHERE quest_id = ${questId}
      AND user_id = ${userId}
    LIMIT 1
  `);
  return rowsOf<QuestProgressRow>(result)[0] ?? null;
}

export async function insertQuestProgress(
  db: DbExecutor,
  input: {
    id: string;
    questId: string;
    userId: string;
    currentStep: number | null;
  }
): Promise<QuestProgressRow | null> {
  const result = await db.execute(sql`
    INSERT INTO quest_progress (
      id,
      quest_id,
      user_id,
      status,
      current_step,
      started_at,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.questId},
      ${input.userId},
      'in_progress',
      ${input.currentStep},
      now(),
      now(),
      now()
    )
    ON CONFLICT (quest_id, user_id)
    DO NOTHING
    RETURNING
      id,
      quest_id,
      user_id,
      status,
      current_step,
      started_at,
      completed_at,
      created_at,
      updated_at
  `);
  return rowsOf<QuestProgressRow>(result)[0] ?? null;
}

export async function setProgressPendingReview(db: DbExecutor, progressId: string): Promise<QuestProgressRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_progress
    SET
      status = 'pending_review',
      updated_at = now()
    WHERE id = ${progressId}
    RETURNING
      id,
      quest_id,
      user_id,
      status,
      current_step,
      started_at,
      completed_at,
      created_at,
      updated_at
  `);
  return rowsOf<QuestProgressRow>(result)[0] ?? null;
}

export async function advanceQuestProgress(
  db: DbExecutor,
  input: {
    progressId: string;
    nextStep: number | null;
    completed: boolean;
  }
): Promise<QuestProgressRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_progress
    SET
      status = ${input.completed ? 'completed' : 'in_progress'},
      current_step = ${input.nextStep},
      completed_at = CASE WHEN ${input.completed} THEN now() ELSE completed_at END,
      updated_at = now()
    WHERE id = ${input.progressId}
    RETURNING
      id,
      quest_id,
      user_id,
      status,
      current_step,
      started_at,
      completed_at,
      created_at,
      updated_at
  `);
  return rowsOf<QuestProgressRow>(result)[0] ?? null;
}

export async function completeQuestProgressAndEnsureRewardOutbox(
  db: DbExecutor,
  input: {
    progressId: string;
    questId: string;
    userId: string;
    pointsAmount: number;
    action: string;
    externalId: string;
    sourceEventId: string | null;
    metadata: Record<string, unknown>;
  }
): Promise<{ progress: QuestProgressRow | null; outbox: QuestRewardOutboxRow | null }> {
  const result = await db.execute(sql`
    WITH progress AS (
      UPDATE quest_progress
      SET
        status = 'completed',
        current_step = NULL,
        completed_at = CASE WHEN completed_at IS NULL THEN now() ELSE completed_at END,
        updated_at = now()
      WHERE id = ${input.progressId}
      RETURNING
        id,
        quest_id,
        user_id,
        status,
        current_step,
        started_at,
        completed_at,
        created_at,
        updated_at
    ),
    outbox AS (
      INSERT INTO quest_reward_outbox (
        id,
        quest_progress_id,
        quest_id,
        user_id,
        points_amount,
        action,
        external_id,
        source_event_id,
        metadata,
        status,
        attempt_count,
        created_at,
        updated_at
      )
      SELECT
        ${`qreward_${crypto.randomUUID()}`},
        progress.id,
        ${input.questId},
        ${input.userId},
        ${input.pointsAmount},
        ${input.action},
        ${input.externalId},
        ${input.sourceEventId},
        ${JSON.stringify(input.metadata ?? {})}::jsonb,
        'pending',
        0,
        now(),
        now()
      FROM progress
      ON CONFLICT (external_id) DO UPDATE
      SET external_id = EXCLUDED.external_id
      RETURNING
        id,
        quest_progress_id,
        quest_id,
        user_id,
        points_amount,
        action,
        external_id,
        source_event_id,
        metadata,
        status,
        attempt_count,
        last_attempt_at,
        delivered_at,
        last_error,
        created_at,
        updated_at
    )
    SELECT
      progress.id AS progress_id,
      progress.quest_id AS progress_quest_id,
      progress.user_id AS progress_user_id,
      progress.status AS progress_status,
      progress.current_step AS progress_current_step,
      progress.started_at AS progress_started_at,
      progress.completed_at AS progress_completed_at,
      progress.created_at AS progress_created_at,
      progress.updated_at AS progress_updated_at,
      outbox.id AS outbox_id,
      outbox.quest_progress_id AS outbox_quest_progress_id,
      outbox.quest_id AS outbox_quest_id,
      outbox.user_id AS outbox_user_id,
      outbox.points_amount AS outbox_points_amount,
      outbox.action AS outbox_action,
      outbox.external_id AS outbox_external_id,
      outbox.source_event_id AS outbox_source_event_id,
      outbox.metadata AS outbox_metadata,
      outbox.status AS outbox_status,
      outbox.attempt_count AS outbox_attempt_count,
      outbox.last_attempt_at AS outbox_last_attempt_at,
      outbox.delivered_at AS outbox_delivered_at,
      outbox.last_error AS outbox_last_error,
      outbox.created_at AS outbox_created_at,
      outbox.updated_at AS outbox_updated_at
    FROM progress
    LEFT JOIN outbox ON true
  `);

  const row = rowsOf<{
    progress_id: string | null;
    progress_quest_id: string | null;
    progress_user_id: string | null;
    progress_status: QuestProgressStatus | null;
    progress_current_step: number | null;
    progress_started_at: string | Date | null;
    progress_completed_at: string | Date | null;
    progress_created_at: string | Date | null;
    progress_updated_at: string | Date | null;
    outbox_id: string | null;
    outbox_quest_progress_id: string | null;
    outbox_quest_id: string | null;
    outbox_user_id: string | null;
    outbox_points_amount: number | null;
    outbox_action: string | null;
    outbox_external_id: string | null;
    outbox_source_event_id: string | null;
    outbox_metadata: Record<string, unknown> | null;
    outbox_status: QuestRewardOutboxStatus | null;
    outbox_attempt_count: number | null;
    outbox_last_attempt_at: string | Date | null;
    outbox_delivered_at: string | Date | null;
    outbox_last_error: string | null;
    outbox_created_at: string | Date | null;
    outbox_updated_at: string | Date | null;
  }>(result)[0];

  if (!row?.progress_id) {
    return { progress: null, outbox: null };
  }

  return {
    progress: {
      id: row.progress_id,
      quest_id: row.progress_quest_id!,
      user_id: row.progress_user_id!,
      status: row.progress_status!,
      current_step: row.progress_current_step,
      started_at: row.progress_started_at!,
      completed_at: row.progress_completed_at,
      created_at: row.progress_created_at!,
      updated_at: row.progress_updated_at!,
    },
    outbox: row.outbox_id
      ? {
          id: row.outbox_id,
          quest_progress_id: row.outbox_quest_progress_id!,
          quest_id: row.outbox_quest_id!,
          user_id: row.outbox_user_id!,
          points_amount: row.outbox_points_amount!,
          action: row.outbox_action!,
          external_id: row.outbox_external_id!,
          source_event_id: row.outbox_source_event_id,
          metadata: row.outbox_metadata ?? {},
          status: row.outbox_status!,
          attempt_count: row.outbox_attempt_count ?? 0,
          last_attempt_at: row.outbox_last_attempt_at,
          delivered_at: row.outbox_delivered_at,
          last_error: row.outbox_last_error,
          created_at: row.outbox_created_at!,
          updated_at: row.outbox_updated_at!,
        }
      : null,
  };
}

export async function listQuestRewardOutboxByStatus(
  db: DbExecutor,
  input: {
    status: QuestRewardOutboxStatus;
    limit: number;
  }
): Promise<QuestRewardOutboxRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      quest_progress_id,
      quest_id,
      user_id,
      points_amount,
      action,
      external_id,
      source_event_id,
      metadata,
      status,
      attempt_count,
      last_attempt_at,
      delivered_at,
      last_error,
      created_at,
      updated_at
    FROM quest_reward_outbox
    WHERE status = ${input.status}
    ORDER BY created_at ASC, id ASC
    LIMIT ${input.limit}
  `);
  return rowsOf<QuestRewardOutboxRow>(result);
}

export async function markQuestRewardOutboxDelivered(db: DbExecutor, outboxId: string): Promise<QuestRewardOutboxRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_reward_outbox
    SET
      status = 'delivered',
      attempt_count = attempt_count + 1,
      last_attempt_at = now(),
      delivered_at = COALESCE(delivered_at, now()),
      last_error = NULL,
      updated_at = now()
    WHERE id = ${outboxId}
    RETURNING
      id,
      quest_progress_id,
      quest_id,
      user_id,
      points_amount,
      action,
      external_id,
      source_event_id,
      metadata,
      status,
      attempt_count,
      last_attempt_at,
      delivered_at,
      last_error,
      created_at,
      updated_at
  `);
  return rowsOf<QuestRewardOutboxRow>(result)[0] ?? null;
}

export async function markQuestRewardOutboxPending(
  db: DbExecutor,
  input: { outboxId: string; lastError: string | null }
): Promise<QuestRewardOutboxRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_reward_outbox
    SET
      status = 'pending',
      attempt_count = attempt_count + 1,
      last_attempt_at = now(),
      last_error = ${input.lastError},
      updated_at = now()
    WHERE id = ${input.outboxId}
    RETURNING
      id,
      quest_progress_id,
      quest_id,
      user_id,
      points_amount,
      action,
      external_id,
      source_event_id,
      metadata,
      status,
      attempt_count,
      last_attempt_at,
      delivered_at,
      last_error,
      created_at,
      updated_at
  `);
  return rowsOf<QuestRewardOutboxRow>(result)[0] ?? null;
}

export async function markQuestRewardOutboxFailed(
  db: DbExecutor,
  input: { outboxId: string; lastError: string | null }
): Promise<QuestRewardOutboxRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_reward_outbox
    SET
      status = 'failed',
      attempt_count = attempt_count + 1,
      last_attempt_at = now(),
      last_error = ${input.lastError},
      updated_at = now()
    WHERE id = ${input.outboxId}
    RETURNING
      id,
      quest_progress_id,
      quest_id,
      user_id,
      points_amount,
      action,
      external_id,
      source_event_id,
      metadata,
      status,
      attempt_count,
      last_attempt_at,
      delivered_at,
      last_error,
      created_at,
      updated_at
  `);
  return rowsOf<QuestRewardOutboxRow>(result)[0] ?? null;
}

export async function getQuestRewardOutboxStats(db: DbExecutor): Promise<QuestRewardOutboxStatsRow> {
  const result = await db.execute(sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_count,
      COUNT(*) FILTER (WHERE status = 'delivered')::int AS delivered_count,
      COUNT(*) FILTER (WHERE status = 'failed')::int AS failed_count,
      MIN(created_at) FILTER (WHERE status = 'pending') AS oldest_pending_created_at,
      MIN(created_at) FILTER (WHERE status = 'failed') AS oldest_failed_created_at
    FROM quest_reward_outbox
  `);
  return (
    rowsOf<QuestRewardOutboxStatsRow>(result)[0] ?? {
      pending_count: 0,
      delivered_count: 0,
      failed_count: 0,
      oldest_pending_created_at: null,
      oldest_failed_created_at: null,
    }
  );
}

export async function getBlockingSubmissionForProgressStep(
  db: DbExecutor,
  progressId: string,
  stepId: string
): Promise<QuestSubmissionRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      progress_id,
      step_id,
      user_id,
      proof_type,
      proof_data,
      status,
      reviewed_by,
      reviewed_at,
      rejection_reason,
      created_at,
      updated_at
    FROM quest_submission
    WHERE progress_id = ${progressId}
      AND step_id = ${stepId}
      AND status IN ('pending', 'approved')
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `);
  return rowsOf<QuestSubmissionRow>(result)[0] ?? null;
}

export async function insertQuestSubmission(
  db: DbExecutor,
  input: {
    id: string;
    progressId: string;
    stepId: string;
    userId: string;
    proofType: QuestProofType;
    proofData: Record<string, unknown>;
    status: QuestSubmissionStatus;
  }
): Promise<QuestSubmissionRow | null> {
  const result = await db.execute(sql`
    INSERT INTO quest_submission (
      id,
      progress_id,
      step_id,
      user_id,
      proof_type,
      proof_data,
      status,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.progressId},
      ${input.stepId},
      ${input.userId},
      ${input.proofType},
      ${input.proofData},
      ${input.status},
      now(),
      now()
    )
    RETURNING
      id,
      progress_id,
      step_id,
      user_id,
      proof_type,
      proof_data,
      status,
      reviewed_by,
      reviewed_at,
      rejection_reason,
      created_at,
      updated_at
  `);
  return rowsOf<QuestSubmissionRow>(result)[0] ?? null;
}

export async function listQuestSubmissions(
  db: DbExecutor,
  input: {
    questId: string;
    status: QuestSubmissionStatus | null;
    stepId: string | null;
    limit: number;
    offset: number;
  }
): Promise<QuestSubmissionRow[]> {
  const result = await db.execute(sql`
    SELECT
      qs.id,
      qs.progress_id,
      qs.step_id,
      qs.user_id,
      qs.proof_type,
      qs.proof_data,
      qs.status,
      qs.reviewed_by,
      qs.reviewed_at,
      qs.rejection_reason,
      qs.created_at,
      qs.updated_at
    FROM quest_submission qs
    INNER JOIN quest_progress qp ON qp.id = qs.progress_id
    WHERE qp.quest_id = ${input.questId}
      AND (${input.status}::quest_submission_status IS NULL OR qs.status = ${input.status}::quest_submission_status)
      AND (${input.stepId}::text IS NULL OR qs.step_id = ${input.stepId}::text)
    ORDER BY qs.created_at DESC, qs.id DESC
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);
  return rowsOf<QuestSubmissionRow>(result);
}

export async function countQuestSubmissions(
  db: DbExecutor,
  input: { questId: string; status: QuestSubmissionStatus | null; stepId: string | null }
): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM quest_submission qs
    INNER JOIN quest_progress qp ON qp.id = qs.progress_id
    WHERE qp.quest_id = ${input.questId}
      AND (${input.status}::quest_submission_status IS NULL OR qs.status = ${input.status}::quest_submission_status)
      AND (${input.stepId}::text IS NULL OR qs.step_id = ${input.stepId}::text)
  `);
  return rowsOf<{ total: number }>(result)[0]?.total ?? 0;
}

export async function getSubmissionForReview(db: DbExecutor, submissionId: string): Promise<SubmissionReviewRow | null> {
  const result = await db.execute(sql`
    SELECT
      qs.id,
      qs.progress_id,
      qs.step_id,
      qs.user_id,
      qs.proof_type,
      qs.proof_data,
      qs.status,
      qs.reviewed_by,
      qs.reviewed_at,
      qs.rejection_reason,
      qs.created_at,
      qs.updated_at,
      qp.quest_id,
      q.creator_pro_id,
      qp.status AS progress_status,
      qp.current_step,
      st."order" AS step_order
    FROM quest_submission qs
    INNER JOIN quest_progress qp ON qp.id = qs.progress_id
    INNER JOIN quest q ON q.id = qp.quest_id
    INNER JOIN quest_step st ON st.id = qs.step_id
    WHERE qs.id = ${submissionId}
    LIMIT 1
  `);
  return rowsOf<SubmissionReviewRow>(result)[0] ?? null;
}

export async function approveSubmission(
  db: DbExecutor,
  input: {
    submissionId: string;
    reviewerId: string;
  }
): Promise<QuestSubmissionRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_submission
    SET
      status = 'approved',
      reviewed_by = ${input.reviewerId},
      reviewed_at = now(),
      rejection_reason = NULL,
      updated_at = now()
    WHERE id = ${input.submissionId}
      AND status = 'pending'
    RETURNING
      id,
      progress_id,
      step_id,
      user_id,
      proof_type,
      proof_data,
      status,
      reviewed_by,
      reviewed_at,
      rejection_reason,
      created_at,
      updated_at
  `);
  return rowsOf<QuestSubmissionRow>(result)[0] ?? null;
}

export async function rejectSubmission(
  db: DbExecutor,
  input: {
    submissionId: string;
    reviewerId: string;
    reason: string | null;
  }
): Promise<QuestSubmissionRow | null> {
  const result = await db.execute(sql`
    UPDATE quest_submission
    SET
      status = 'rejected',
      reviewed_by = ${input.reviewerId},
      reviewed_at = now(),
      rejection_reason = ${input.reason},
      updated_at = now()
    WHERE id = ${input.submissionId}
      AND status = 'pending'
    RETURNING
      id,
      progress_id,
      step_id,
      user_id,
      proof_type,
      proof_data,
      status,
      reviewed_by,
      reviewed_at,
      rejection_reason,
      created_at,
      updated_at
  `);
  return rowsOf<QuestSubmissionRow>(result)[0] ?? null;
}

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
    ORDER BY qs.created_at DESC, qs.id DESC
    LIMIT ${input.limit}
    OFFSET ${input.offset}
  `);
  return rowsOf<QuestSubmissionRow>(result);
}

export async function countQuestSubmissions(db: DbExecutor, questId: string): Promise<number> {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS total
    FROM quest_submission qs
    INNER JOIN quest_progress qp ON qp.id = qs.progress_id
    WHERE qp.quest_id = ${questId}
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

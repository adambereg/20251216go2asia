import { createDb } from '@go2asia/db';
import { createLogger } from '@go2asia/logger';

import {
  archiveQuest as archiveQuestRow,
  advanceQuestProgress,
  approveSubmission,
  completeQuestProgressAndEnsureRewardOutbox,
  countActiveQuestProgress,
  countManagedQuests,
  countQuestProgressStats,
  countPendingQuestSubmissions,
  countPublishedQuests,
  countQuestSubmissions,
  getBlockingSubmissionForProgressStep,
  getPublishedQuestById,
  getQuestById,
  getQuestProgressByQuestAndUser,
  getQuestRewardOutboxStats,
  listQuestRewardOutboxByStatus,
  getQuestStepById,
  getSubmissionForReview,
  insertQuest,
  insertQuestProgress,
  insertQuestStep,
  insertQuestSubmission,
  deleteQuestStep as deleteQuestStepRow,
  listManagedQuests,
  listPublishedQuests,
  listQuestSteps,
  listQuestSubmissions,
  publishQuest as publishQuestRow,
  rejectSubmission,
  resequenceQuestSteps,
  setProgressPendingReview,
  syncQuestStepsCount,
  markQuestRewardOutboxDelivered,
  markQuestRewardOutboxFailed,
  markQuestRewardOutboxPending,
  type QuestDifficulty,
  type QuestRewardOutboxStatsRow,
  type QuestRewardOutboxRow,
  type QuestStatus,
  type QuestProgressRow,
  type QuestProofType,
  type QuestRow,
  type QuestStepRow,
  type QuestSubmissionStatus,
  type QuestTargetType,
  type QuestStepType,
  type QuestSubmissionRow,
  type QuestVerificationType,
  type QuestVisibility,
  updateQuestDraft as updateQuestDraftRow,
  updateQuestStep as updateQuestStepRow,
} from '../db/queries/quest';
import type { QuestDomainEvent, QuestDomainEventType } from '../events/contracts';
import type { QuestEventPublisher } from '../events/publisher';
import type { GatewayPrincipal, ServicePrincipal } from '../middleware/auth';
import { errorResponse, json, parseJsonObject } from '../middleware/http';

type Env = {
  DATABASE_URL?: string;
  ENVIRONMENT?: string;
  POINTS_SERVICE_URL?: string;
  SERVICE_JWT_SECRET?: string;
};

type CreateQuestInput = {
  title: string;
  description: string | null;
  cityId: string | null;
  geoScope: Record<string, unknown> | null;
  type: string | null;
  theme: string | null;
  difficulty: QuestDifficulty | null;
  visibility: QuestVisibility;
  rewardPoints: number | null;
};

type AddQuestStepInput = {
  order: number;
  type: QuestStepType;
  targetType: QuestTargetType | null;
  targetId: string | null;
  verificationType: QuestVerificationType;
  requirements: Record<string, unknown>;
  rewardPoints: number | null;
};

type SubmitQuestStepInput = {
  proofType: QuestProofType;
  proofData: Record<string, unknown>;
};

type ReviewSubmissionInput = {
  decision: 'approve' | 'reject';
  reason: string | null;
};

type UpdateQuestDraftInput = {
  title?: string;
  description?: string | null;
  cityId?: string | null;
  geoScope?: Record<string, unknown> | null;
  type?: string | null;
  theme?: string | null;
  difficulty?: QuestDifficulty | null;
  visibility?: QuestVisibility;
  rewardPoints?: number | null;
};

type UpdateQuestStepInput = {
  type?: QuestStepType;
  targetType?: QuestTargetType | null;
  targetId?: string | null;
  verificationType?: QuestVerificationType;
  requirements?: Record<string, unknown>;
  rewardPoints?: number | null;
};

const QUEST_DIFFICULTIES: QuestDifficulty[] = ['easy', 'medium', 'hard'];
const QUEST_STATUSES: QuestStatus[] = ['draft', 'published', 'archived'];
const QUEST_VISIBILITIES: QuestVisibility[] = ['public', 'private'];
const QUEST_STEP_TYPES: QuestStepType[] = [
  'visit_place',
  'attend_event',
  'visit_partner',
  'challenge',
  'photo_proof',
  'geo_checkin',
  'qr_code',
  'space_action',
];
const QUEST_VERIFICATION_TYPES: QuestVerificationType[] = ['auto', 'geo', 'qr', 'manual', 'space_post'];
const QUEST_PROOF_TYPES: QuestProofType[] = ['photo', 'geo', 'qr', 'space_post', 'text'];
const QUEST_TARGET_TYPES: QuestTargetType[] = ['place', 'event', 'partner', 'space_post'];
const QUEST_SUBMISSION_STATUSES: QuestSubmissionStatus[] = ['pending', 'approved', 'rejected'];
const QUEST_SERVICE_NAME = 'quest-service';
const POINTS_SERVICE_NAME = 'points-service';
const QUEST_REWARD_ACTION = 'quest_completed';
const REPLAY_PENDING_REWARDS_DEFAULT_LIMIT = 20;
const REPLAY_PENDING_REWARDS_MAX_LIMIT = 100;
const SCHEDULED_REPLAY_REQUESTED_BY = 'cf-cron';

function asIso(value: string | Date | null): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function normalizeQuestStep(step: QuestStepRow) {
  return {
    id: step.id,
    questId: step.quest_id,
    order: step.order,
    type: step.type,
    targetType: step.target_type,
    targetId: step.target_id,
    verificationType: step.verification_type,
    requirements: step.requirements_json ?? {},
    rewardPoints: step.reward_points,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim());
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function extractQuestMetadataProjection(geoScope: Record<string, unknown> | null) {
  if (!isRecord(geoScope)) return null;
  const raw = geoScope.questMetadataV1;
  if (!isRecord(raw)) return null;

  const identity = isRecord(raw.identity) ? raw.identity : null;
  const narrative = isRecord(raw.narrative) ? raw.narrative : null;
  const media = isRecord(raw.media) ? raw.media : null;
  const runtime = isRecord(raw.runtime) ? raw.runtime : null;

  return {
    contentSchemaVersion: toNullableString(raw.contentSchemaVersion),
    sourceWave: toNullableString(raw.sourceWave),
    slug: toNullableString(identity?.slug),
    countrySlug: toNullableString(identity?.countrySlug),
    citySlug: toNullableString(identity?.citySlug),
    summary: toNullableString(narrative?.summary),
    bodyMarkdown: toNullableString(narrative?.bodyMarkdown),
    mediaPrefix: toNullableString(media?.mediaPrefix),
    cardMediaKey: toNullableString(media?.cardMediaKey),
    cardMediaAlt: toNullableString(media?.cardMediaAlt),
    heroMediaKey: toNullableString(media?.heroMediaKey),
    heroMediaAlt: toNullableString(media?.heroMediaAlt),
    galleryMedia: Array.isArray(media?.galleryMedia)
      ? media.galleryMedia
          .map((item) => {
            if (!isRecord(item)) return null;
            const key = toNullableString(item.key);
            if (!key) return null;
            return {
              key,
              alt: toNullableString(item.alt),
            };
          })
          .filter((item): item is { key: string; alt: string | null } => item !== null)
      : [],
    cardBadge: toNullableString((isRecord(raw.presentation) ? raw.presentation : {}).cardBadge),
    cardTagline: toNullableString((isRecord(raw.presentation) ? raw.presentation : {}).cardTagline),
    estimatedMinutes: toNullableNumber((isRecord(raw.presentation) ? raw.presentation : {}).estimatedMinutes),
    detailHighlights: toStringArray((isRecord(raw.presentation) ? raw.presentation : {}).detailHighlights),
    presentationFlags: isRecord((isRecord(raw.presentation) ? raw.presentation : {}).presentationFlags)
      ? ((isRecord(raw.presentation) ? raw.presentation : {}).presentationFlags as Record<string, unknown>)
      : {},
    runtimeDifficulty: toNullableString(runtime?.difficulty),
    runtimeStepsCount: toNullableNumber(runtime?.stepsCount),
    runtimeStatus: toNullableString(runtime?.status),
    runtimeVisibility: toNullableString(runtime?.visibility),
  };
}

function normalizeQuestMetadata(quest: QuestRow) {
  const projected = extractQuestMetadataProjection(quest.geo_scope);
  const summary = projected?.summary ?? quest.description;
  const presentationFlags: Record<string, unknown> = {
    ...(projected?.presentationFlags ?? {}),
  };
  if (projected?.contentSchemaVersion) presentationFlags.contentSchemaVersion = projected.contentSchemaVersion;
  if (projected?.sourceWave) presentationFlags.sourceWave = projected.sourceWave;
  if (projected?.slug) presentationFlags.slug = projected.slug;
  if (projected?.countrySlug) presentationFlags.countrySlug = projected.countrySlug;
  if (projected?.citySlug) presentationFlags.citySlug = projected.citySlug;
  if (projected?.runtimeDifficulty) presentationFlags.runtimeDifficulty = projected.runtimeDifficulty;
  if (typeof projected?.runtimeStepsCount === 'number') presentationFlags.runtimeStepsCount = projected.runtimeStepsCount;
  if (projected?.runtimeStatus) presentationFlags.runtimeStatus = projected.runtimeStatus;
  if (projected?.runtimeVisibility) presentationFlags.runtimeVisibility = projected.runtimeVisibility;

  return {
    media: {
      mediaPrefix: projected?.mediaPrefix ?? null,
      cardMediaKey: projected?.cardMediaKey ?? null,
      cardMediaAlt: projected?.cardMediaAlt ?? null,
      heroMediaKey: projected?.heroMediaKey ?? null,
      heroMediaAlt: projected?.heroMediaAlt ?? null,
      galleryMedia: projected?.galleryMedia ?? [],
    },
    narrative: {
      summary,
      bodyMarkdown: projected?.bodyMarkdown ?? null,
    },
    presentation: {
      cardBadge: projected?.cardBadge ?? null,
      cardTagline: projected?.cardTagline ?? null,
      estimatedMinutes: projected?.estimatedMinutes ?? null,
      detailHighlights: projected?.detailHighlights ?? [],
      presentationFlags,
    },
  };
}

function normalizeQuest(quest: QuestRow, steps: QuestStepRow[] = [], options?: { includeSteps?: boolean }) {
  const base = {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    creatorProId: quest.creator_pro_id,
    cityId: quest.city_id,
    geoScope: quest.geo_scope,
    type: quest.type,
    theme: quest.theme,
    difficulty: quest.difficulty,
    status: quest.status,
    visibility: quest.visibility,
    rewardPoints: quest.reward_points,
    stepsCount: quest.steps_count,
    createdAt: asIso(quest.created_at),
    updatedAt: asIso(quest.updated_at),
    publishedAt: asIso(quest.published_at),
    metadata: normalizeQuestMetadata(quest),
  };

  if (options?.includeSteps === false) {
    return base;
  }

  return {
    ...base,
    steps: steps.map(normalizeQuestStep),
  };
}

function normalizeQuestProgress(progress: QuestProgressRow, totalSteps: number) {
  return {
    id: progress.id,
    questId: progress.quest_id,
    userId: progress.user_id,
    status: progress.status,
    currentStep: progress.current_step,
    totalSteps,
    startedAt: asIso(progress.started_at),
    completedAt: asIso(progress.completed_at),
  };
}

function normalizeQuestSubmission(submission: QuestSubmissionRow) {
  return {
    id: submission.id,
    progressId: submission.progress_id,
    stepId: submission.step_id,
    userId: submission.user_id,
    proofType: submission.proof_type,
    proofData: submission.proof_data ?? {},
    status: submission.status,
    reviewedBy: submission.reviewed_by,
    reviewedAt: asIso(submission.reviewed_at),
    rejectionReason: submission.rejection_reason,
    createdAt: asIso(submission.created_at),
  };
}

function requireDatabaseUrl(env: Env, requestId: string): string | Response {
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }
  return env.DATABASE_URL;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8ToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

async function signHs256Jwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = bytesToBase64Url(utf8ToBytes(JSON.stringify(header)));
  const payloadB64 = bytesToBase64Url(utf8ToBytes(JSON.stringify(payload)));
  const data = utf8ToBytes(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
  return `${headerB64}.${payloadB64}.${bytesToBase64Url(signature)}`;
}

async function createServiceJwt(env: Env, targetService: string, requestId: string): Promise<string | null> {
  if (!env.SERVICE_JWT_SECRET) return null;
  const now = Math.floor(Date.now() / 1000);
  return signHs256Jwt(
    {
      iss: 'go2asia-service-auth',
      aud: targetService,
      sub: QUEST_SERVICE_NAME,
      iat: now,
      exp: now + 300,
      rid: requestId,
    },
    env.SERVICE_JWT_SECRET
  );
}

type PointsAddPayload = {
  userId: string;
  amount: number;
  action: 'quest_completed';
  externalId: string;
  sourceEventId: string;
  metadata: Record<string, unknown>;
};

type RewardDeliveryResult =
  | { outcome: 'delivered'; detail: string; applied: boolean }
  | { outcome: 'pending'; detail: string }
  | { outcome: 'failed'; detail: string };

function buildQuestCompletionRewardPayload(input: {
  quest: QuestRow;
  progressId: string;
  userId: string;
  completedAt: string;
}): PointsAddPayload | null {
  const amount = input.quest.reward_points;
  if (typeof amount !== 'number' || amount < 1) return null;

  const metadata: Record<string, unknown> = {
    questId: input.quest.id,
    progressId: input.progressId,
    completedAt: input.completedAt,
    rewardSource: 'quest.reward_points',
  };
  const questMetadata = extractQuestMetadataProjection(input.quest.geo_scope);
  if (questMetadata?.slug) metadata.questSlug = questMetadata.slug;

  return {
    userId: input.userId,
    amount,
    action: QUEST_REWARD_ACTION,
    externalId: `quest:completed:${input.progressId}`,
    sourceEventId: `quest.completed:${input.progressId}`,
    metadata,
  };
}

async function interpretPointsDeliveryResponse(
  response: Response,
  logger: ReturnType<typeof createLogger>,
  input: PointsAddPayload
): Promise<RewardDeliveryResult> {
  const responseText = await response.text().catch(() => '');
  const parsed = responseText ? parseJsonObject(responseText) : null;

  if (response.ok) {
    const applied = parsed?.applied;
    const normalizedApplied = typeof applied === 'boolean' ? applied : true;
    logger.info('Quest reward delivery accepted by Points Service', {
      userId: input.userId,
      action: input.action,
      externalId: input.externalId,
      amount: input.amount,
      applied: normalizedApplied,
    });
    return {
      outcome: 'delivered',
      detail: normalizedApplied ? 'Points applied reward' : 'Points accepted duplicate reward',
      applied: normalizedApplied,
    };
  }

  if (response.status === 409) {
    logger.error('Quest reward delivery conflict', {
      userId: input.userId,
      action: input.action,
      externalId: input.externalId,
      status: response.status,
      body: responseText,
    });
    return { outcome: 'failed', detail: `Points conflict 409 for ${input.externalId}` };
  }

  if (response.status === 429 || response.status >= 500) {
    logger.warn('Quest reward delivery is retryable', {
      userId: input.userId,
      action: input.action,
      externalId: input.externalId,
      status: response.status,
      body: responseText,
    });
    return { outcome: 'pending', detail: `Points retryable response ${response.status}` };
  }

  logger.error('Quest reward delivery failed with non-retryable response', {
    userId: input.userId,
    action: input.action,
    externalId: input.externalId,
    status: response.status,
    body: responseText,
  });
  return { outcome: 'failed', detail: `Points non-retryable response ${response.status}` };
}

async function callPointsService(
  env: Env,
  requestId: string,
  input: PointsAddPayload
): Promise<RewardDeliveryResult> {
  const logger = createLogger(requestId, QUEST_SERVICE_NAME, { env: env.ENVIRONMENT });
  if (!env.POINTS_SERVICE_URL || !env.SERVICE_JWT_SECRET) {
    logger.warn('Points Service integration not configured', {
      userId: input.userId,
      action: input.action,
    });
    return { outcome: 'pending', detail: 'Points Service not configured' };
  }

  const token = await createServiceJwt(env, POINTS_SERVICE_NAME, requestId);
  if (!token) {
    logger.error('Failed to create service JWT for Points Service');
    return { outcome: 'pending', detail: 'Service auth failed' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${env.POINTS_SERVICE_URL}/internal/points/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return interpretPointsDeliveryResponse(response, logger, input);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      logger.warn('Quest reward delivery timed out', {
        userId: input.userId,
        action: input.action,
        externalId: input.externalId,
      });
      return { outcome: 'pending', detail: 'Timeout' };
    }

    logger.error('Quest reward delivery error', error, {
      userId: input.userId,
      action: input.action,
      externalId: input.externalId,
    });
    return { outcome: 'pending', detail: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function applyRewardDeliveryResult(
  db: ReturnType<typeof createDb>,
  outbox: QuestRewardOutboxRow,
  result: RewardDeliveryResult
): Promise<void> {
  if (result.outcome === 'delivered') {
    await markQuestRewardOutboxDelivered(db, outbox.id);
    return;
  }

  if (result.outcome === 'pending') {
    await markQuestRewardOutboxPending(db, { outboxId: outbox.id, lastError: result.detail });
    return;
  }

  await markQuestRewardOutboxFailed(db, { outboxId: outbox.id, lastError: result.detail });
}

async function deliverQuestRewardOutboxRow(
  env: Env,
  requestId: string,
  db: ReturnType<typeof createDb>,
  outbox: QuestRewardOutboxRow
): Promise<void> {
  const result = await callPointsService(env, requestId, {
    userId: outbox.user_id,
    amount: outbox.points_amount,
    action: QUEST_REWARD_ACTION,
    externalId: outbox.external_id,
    sourceEventId: outbox.source_event_id ?? `quest.completed:${outbox.quest_progress_id}`,
    metadata: outbox.metadata ?? {},
  });
  await applyRewardDeliveryResult(db, outbox, result);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getTrimmedString(value: unknown): string | null {
  return isNonEmptyString(value) ? value.trim() : null;
}

function parseOptionalString(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function parseOptionalOpaqueRef(value: unknown, maxLength: number): string | null | undefined {
  const parsed = parseOptionalString(value, maxLength);
  if (parsed === undefined || parsed === null) return parsed;
  if (!/^\S+$/.test(parsed)) return undefined;
  return parsed;
}

function parseOptionalNonNegativeInt(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) return undefined;
  return value;
}

function parseOptionalObject(value: unknown): Record<string, unknown> | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function parseReplayPendingRewardsInput(body: Record<string, unknown> | null): { limit: number } | null {
  if (body === null) return { limit: REPLAY_PENDING_REWARDS_DEFAULT_LIMIT };
  const parsedLimit = parseOptionalNonNegativeInt(body.limit);
  if (parsedLimit === undefined || parsedLimit === null) {
    return { limit: REPLAY_PENDING_REWARDS_DEFAULT_LIMIT };
  }
  return {
    limit: Math.min(REPLAY_PENDING_REWARDS_MAX_LIMIT, Math.max(1, parsedLimit)),
  };
}

async function completeQuestProgressWithRewardDelivery(
  env: Env,
  db: ReturnType<typeof createDb>,
  requestId: string,
  input: {
    quest: QuestRow;
    progressId: string;
    userId: string;
    completed: boolean;
    nextStep: number | null;
  }
): Promise<QuestProgressRow | null> {
  if (!input.completed) {
    return advanceQuestProgress(db, {
      progressId: input.progressId,
      nextStep: input.nextStep,
      completed: false,
    });
  }

  const completedAt = new Date().toISOString();
  const payload = buildQuestCompletionRewardPayload({
    quest: input.quest,
    progressId: input.progressId,
    userId: input.userId,
    completedAt,
  });

  if (!payload) {
    return advanceQuestProgress(db, {
      progressId: input.progressId,
      nextStep: null,
      completed: true,
    });
  }

  const completion = await completeQuestProgressAndEnsureRewardOutbox(db, {
    progressId: input.progressId,
    questId: input.quest.id,
    userId: input.userId,
    pointsAmount: payload.amount,
    action: payload.action,
    externalId: payload.externalId,
    sourceEventId: payload.sourceEventId,
    metadata: payload.metadata,
  });

  if (completion.outbox) {
    await deliverQuestRewardOutboxRow(env, requestId, db, completion.outbox);
  }

  return completion.progress;
}

type QuestRewardReplaySummary = {
  processed: number;
  delivered: number;
  stillPending: number;
  failed: number;
  skipped: number;
  limit: number;
  requestedBy: string;
};

async function runQuestRewardReplay(
  env: Env,
  requestId: string,
  input: {
    limit: number;
    requestedBy: string;
  }
): Promise<QuestRewardReplaySummary | Response> {
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;

  const db = createDb(databaseUrl);
  const rows = await listQuestRewardOutboxByStatus(db, {
    status: 'pending',
    limit: input.limit,
  });

  let delivered = 0;
  let stillPending = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of rows) {
    if (row.status !== 'pending') {
      skipped += 1;
      continue;
    }

    const result = await callPointsService(env, requestId, {
      userId: row.user_id,
      amount: row.points_amount,
      action: QUEST_REWARD_ACTION,
      externalId: row.external_id,
      sourceEventId: row.source_event_id ?? `quest.completed:${row.quest_progress_id}`,
      metadata: row.metadata ?? {},
    });
    await applyRewardDeliveryResult(db, row, result);

    if (result.outcome === 'delivered') {
      delivered += 1;
    } else if (result.outcome === 'pending') {
      stillPending += 1;
    } else {
      failed += 1;
    }
  }

  return {
    processed: rows.length,
    delivered,
    stillPending,
    failed,
    skipped,
    limit: input.limit,
    requestedBy: input.requestedBy,
  };
}

function hasRole(principal: GatewayPrincipal, role: string): boolean {
  return principal.roles.includes(role);
}

function canManageQuest(principal: GatewayPrincipal): boolean {
  return hasRole(principal, 'pro') || hasRole(principal, 'admin');
}

function canManageOwnedQuest(principal: GatewayPrincipal, quest: QuestRow): boolean {
  return hasRole(principal, 'admin') || quest.creator_pro_id === principal.userId;
}

function requireManagementPrincipal(principal: GatewayPrincipal, requestId: string): Response | null {
  if (!canManageQuest(principal)) {
    return errorResponse('FORBIDDEN', 'PRO or admin role is required', requestId, 403);
  }
  return null;
}

function requireManagedQuestOwnership(
  principal: GatewayPrincipal,
  quest: QuestRow,
  requestId: string,
  message: string
): Response | null {
  if (!canManageOwnedQuest(principal, quest)) {
    return errorResponse('FORBIDDEN', message, requestId, 403);
  }
  return null;
}

function requireDraftQuest(quest: QuestRow, requestId: string): Response | null {
  if (quest.status !== 'draft') {
    return errorResponse('CONFLICT', 'Only draft quests can be modified', requestId, 409);
  }
  return null;
}

function canTransitionQuestStatus(from: QuestStatus, to: QuestStatus): boolean {
  if (from === 'draft' && to === 'published') return true;
  if (from === 'published' && to === 'archived') return true;
  return false;
}

function getTransitionConflictMessage(from: QuestStatus, to: QuestStatus): string {
  if (from === to) return `Quest is already ${to}`;
  if (to === 'published' && from === 'archived') return 'Archived quest cannot be published';
  if (to === 'archived' && from === 'draft') return 'Draft quest cannot be archived before publish';
  if (to === 'archived' && from === 'archived') return 'Quest is already archived';
  return `Quest status transition ${from} -> ${to} is not supported`;
}

function assertQuestStatusTransition(quest: QuestRow, to: QuestStatus, requestId: string): Response | null {
  if (canTransitionQuestStatus(quest.status, to)) return null;
  return errorResponse('CONFLICT', getTransitionConflictMessage(quest.status, to), requestId, 409);
}

function getPublishReadinessError(steps: QuestStepRow[]): string | null {
  if (steps.length === 0) return 'Quest must have at least one step before publish';
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]?.order !== i + 1) {
      return 'Quest steps must be sequential without gaps';
    }
  }
  return null;
}

function parsePage(searchParams: URLSearchParams): { page: number; pageSize: number } | null {
  const rawPage = searchParams.get('page');
  const rawPageSize = searchParams.get('pageSize');
  const page = rawPage ? Number(rawPage) : 1;
  const pageSize = rawPageSize ? Number(rawPageSize) : 20;
  if (!Number.isInteger(page) || page < 1) return null;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return null;
  return { page, pageSize };
}

function parseDifficulty(value: string | null): QuestDifficulty | null | undefined {
  if (value === null) return null;
  if (!QUEST_DIFFICULTIES.includes(value as QuestDifficulty)) return undefined;
  return value as QuestDifficulty;
}

function parseQuestStatus(value: string | null): QuestStatus | null | undefined {
  if (value === null) return null;
  if (!QUEST_STATUSES.includes(value as QuestStatus)) return undefined;
  return value as QuestStatus;
}

function parseQuestVisibility(value: string | null): QuestVisibility | null | undefined {
  if (value === null) return null;
  if (!QUEST_VISIBILITIES.includes(value as QuestVisibility)) return undefined;
  return value as QuestVisibility;
}

function parseSubmissionStatus(value: string | null): QuestSubmissionStatus | null | undefined {
  if (value === null) return null;
  if (!QUEST_SUBMISSION_STATUSES.includes(value as QuestSubmissionStatus)) return undefined;
  return value as QuestSubmissionStatus;
}

function parseCreateQuestInput(body: Record<string, unknown> | null): CreateQuestInput | null {
  if (!body) return null;
  const title = parseOptionalString(body.title, 160);
  if (!title) return null;
  const description = body.description === undefined ? null : parseOptionalString(body.description, 2000);
  const cityId = body.cityId === undefined ? null : parseOptionalString(body.cityId, 128);
  const geoScope = body.geoScope === undefined ? null : parseOptionalObject(body.geoScope);
  const type = body.type === undefined ? null : parseOptionalString(body.type, 80);
  const theme = body.theme === undefined ? null : parseOptionalString(body.theme, 80);
  const difficultyRaw = body.difficulty === undefined ? null : body.difficulty;
  const difficulty =
    difficultyRaw === null ? null : typeof difficultyRaw === 'string' ? parseDifficulty(difficultyRaw) : undefined;
  const visibilityRaw = body.visibility === undefined ? 'public' : body.visibility;
  const visibility =
    typeof visibilityRaw === 'string' && QUEST_VISIBILITIES.includes(visibilityRaw as QuestVisibility)
      ? (visibilityRaw as QuestVisibility)
      : undefined;
  const rewardPoints = body.rewardPoints === undefined ? null : parseOptionalNonNegativeInt(body.rewardPoints);
  if (description === undefined || cityId === undefined || geoScope === undefined || type === undefined || theme === undefined) {
    return null;
  }
  if (difficulty === undefined || visibility === undefined || rewardPoints === undefined) return null;
  return {
    title,
    description,
    cityId,
    geoScope,
    type,
    theme,
    difficulty,
    visibility,
    rewardPoints,
  };
}

function parseUpdateQuestDraftInput(body: Record<string, unknown> | null): UpdateQuestDraftInput | null {
  if (!body) return null;
  const hasAnyKnownField =
    body.title !== undefined ||
    body.description !== undefined ||
    body.cityId !== undefined ||
    body.geoScope !== undefined ||
    body.type !== undefined ||
    body.theme !== undefined ||
    body.difficulty !== undefined ||
    body.visibility !== undefined ||
    body.rewardPoints !== undefined;
  if (!hasAnyKnownField) return null;

  const parsed: UpdateQuestDraftInput = {};

  if (body.title !== undefined) {
    const title = parseOptionalString(body.title, 160);
    if (!title) return null;
    parsed.title = title;
  }
  if (body.description !== undefined) {
    const description = parseOptionalString(body.description, 2000);
    if (description === undefined) return null;
    parsed.description = description;
  }
  if (body.cityId !== undefined) {
    const cityId = parseOptionalString(body.cityId, 128);
    if (cityId === undefined) return null;
    parsed.cityId = cityId;
  }
  if (body.geoScope !== undefined) {
    const geoScope = parseOptionalObject(body.geoScope);
    if (geoScope === undefined) return null;
    parsed.geoScope = geoScope;
  }
  if (body.type !== undefined) {
    const type = parseOptionalString(body.type, 80);
    if (type === undefined) return null;
    parsed.type = type;
  }
  if (body.theme !== undefined) {
    const theme = parseOptionalString(body.theme, 80);
    if (theme === undefined) return null;
    parsed.theme = theme;
  }
  if (body.difficulty !== undefined) {
    const difficultyRaw = body.difficulty;
    const difficulty =
      difficultyRaw === null ? null : typeof difficultyRaw === 'string' ? parseDifficulty(difficultyRaw) : undefined;
    if (difficulty === undefined) return null;
    parsed.difficulty = difficulty;
  }
  if (body.visibility !== undefined) {
    const visibilityRaw = body.visibility;
    if (typeof visibilityRaw !== 'string' || !QUEST_VISIBILITIES.includes(visibilityRaw as QuestVisibility)) return null;
    parsed.visibility = visibilityRaw as QuestVisibility;
  }
  if (body.rewardPoints !== undefined) {
    const rewardPoints = parseOptionalNonNegativeInt(body.rewardPoints);
    if (rewardPoints === undefined) return null;
    parsed.rewardPoints = rewardPoints;
  }

  return parsed;
}

function parseAddQuestStepInput(body: Record<string, unknown> | null): AddQuestStepInput | null {
  if (!body) return null;
  if (typeof body.order !== 'number' || !Number.isInteger(body.order) || body.order < 1) return null;
  if (typeof body.type !== 'string' || !QUEST_STEP_TYPES.includes(body.type as QuestStepType)) return null;
  if (
    typeof body.verificationType !== 'string' ||
    !QUEST_VERIFICATION_TYPES.includes(body.verificationType as QuestVerificationType)
  ) {
    return null;
  }
  const targetTypeRaw = parseOptionalString(body.targetType, 80);
  const targetType =
    targetTypeRaw === null || targetTypeRaw === undefined
      ? targetTypeRaw
      : QUEST_TARGET_TYPES.includes(targetTypeRaw as QuestTargetType)
        ? (targetTypeRaw as QuestTargetType)
        : undefined;
  const targetId = parseOptionalOpaqueRef(body.targetId, 80);
  const requirements = body.requirements === undefined ? {} : parseOptionalObject(body.requirements);
  const rewardPoints = body.rewardPoints === undefined ? null : parseOptionalNonNegativeInt(body.rewardPoints);
  if (targetType === undefined || targetId === undefined || requirements === undefined || requirements === null || rewardPoints === undefined) {
    return null;
  }
  return {
    order: body.order,
    type: body.type as QuestStepType,
    targetType,
    targetId,
    verificationType: body.verificationType as QuestVerificationType,
    requirements,
    rewardPoints,
  };
}

function parseUpdateQuestStepInput(body: Record<string, unknown> | null): UpdateQuestStepInput | null {
  if (!body) return null;
  if (body.order !== undefined) return null;
  const hasAnyKnownField =
    body.type !== undefined ||
    body.targetType !== undefined ||
    body.targetId !== undefined ||
    body.verificationType !== undefined ||
    body.requirements !== undefined ||
    body.rewardPoints !== undefined;
  if (!hasAnyKnownField) return null;

  const parsed: UpdateQuestStepInput = {};
  if (body.type !== undefined) {
    if (typeof body.type !== 'string' || !QUEST_STEP_TYPES.includes(body.type as QuestStepType)) return null;
    parsed.type = body.type as QuestStepType;
  }
  if (body.targetType !== undefined) {
    const targetTypeRaw = parseOptionalString(body.targetType, 80);
    const targetType =
      targetTypeRaw === null
        ? null
        : targetTypeRaw === undefined
          ? undefined
          : QUEST_TARGET_TYPES.includes(targetTypeRaw as QuestTargetType)
            ? (targetTypeRaw as QuestTargetType)
            : undefined;
    if (targetType === undefined) return null;
    parsed.targetType = targetType;
  }
  if (body.targetId !== undefined) {
    const targetId = parseOptionalOpaqueRef(body.targetId, 80);
    if (targetId === undefined) return null;
    parsed.targetId = targetId;
  }
  if (body.verificationType !== undefined) {
    if (
      typeof body.verificationType !== 'string' ||
      !QUEST_VERIFICATION_TYPES.includes(body.verificationType as QuestVerificationType)
    ) {
      return null;
    }
    parsed.verificationType = body.verificationType as QuestVerificationType;
  }
  if (body.requirements !== undefined) {
    const requirements = parseOptionalObject(body.requirements);
    if (!requirements) return null;
    parsed.requirements = requirements;
  }
  if (body.rewardPoints !== undefined) {
    const rewardPoints = parseOptionalNonNegativeInt(body.rewardPoints);
    if (rewardPoints === undefined) return null;
    parsed.rewardPoints = rewardPoints;
  }
  return parsed;
}

function parseSubmitQuestStepInput(body: Record<string, unknown> | null): SubmitQuestStepInput | null {
  if (!body) return null;
  if (typeof body.proofType !== 'string' || !QUEST_PROOF_TYPES.includes(body.proofType as QuestProofType)) return null;
  const proofData = parseOptionalObject(body.proofData);
  if (!proofData) return null;
  return {
    proofType: body.proofType as QuestProofType,
    proofData,
  };
}

function parseReviewSubmissionInput(body: Record<string, unknown> | null): ReviewSubmissionInput | null {
  if (!body) return null;
  if (body.decision !== 'approve' && body.decision !== 'reject') return null;
  const reason = body.reason === undefined ? null : parseOptionalString(body.reason, 500);
  if (reason === undefined) return null;
  return {
    decision: body.decision,
    reason,
  };
}

function validateStepDefinition(input: AddQuestStepInput): string | null {
  const targetPairOk = (input.targetType === null && input.targetId === null) || (input.targetType !== null && input.targetId !== null);
  if (!targetPairOk) return 'targetType and targetId must be provided together';

  if (input.type === 'visit_place' && input.targetType !== 'place') return 'visit_place step requires targetType=place';
  if (input.type === 'attend_event' && input.targetType !== 'event') return 'attend_event step requires targetType=event';
  if (input.type === 'visit_partner' && input.targetType !== 'partner') return 'visit_partner step requires targetType=partner';
  if (input.type === 'visit_partner' && !input.targetId) return 'visit_partner step requires targetId as stable RF partner reference';
  if (input.type === 'space_action' && input.targetType !== 'space_post') return 'space_action step requires targetType=space_post';

  if (input.type === 'space_action' && input.verificationType !== 'space_post') {
    return 'space_action step requires verificationType=space_post';
  }
  if (input.type === 'geo_checkin' && input.verificationType !== 'geo') return 'geo_checkin step requires verificationType=geo';
  if (input.type === 'qr_code' && input.verificationType !== 'qr') return 'qr_code step requires verificationType=qr';
  if (input.type === 'photo_proof' && input.verificationType === 'space_post') {
    return 'photo_proof step does not support verificationType=space_post';
  }

  return null;
}

function parseNumericField(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function parseStringField(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const earthRadius = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const a = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function validateProof(step: QuestStepRow, input: SubmitQuestStepInput): string | null {
  const proofData = input.proofData;

  if (step.type === 'photo_proof') {
    if (input.proofType !== 'photo') return 'photo_proof step requires proofType=photo';
    if (!parseStringField(proofData.mediaId)) return 'photo proof requires proofData.mediaId';
    return null;
  }

  if (step.type === 'geo_checkin' || step.verification_type === 'geo') {
    if (input.proofType !== 'geo') return 'geo step requires proofType=geo';
    const lat = parseNumericField(proofData.lat);
    const lng = parseNumericField(proofData.lng);
    if (lat === null || lng === null) return 'geo proof requires proofData.lat and proofData.lng';
    const expectedLat = parseNumericField(step.requirements_json.lat);
    const expectedLng = parseNumericField(step.requirements_json.lng);
    const radiusMeters = parseNumericField(step.requirements_json.radiusMeters);
    if (expectedLat !== null && expectedLng !== null && radiusMeters !== null) {
      const actualDistance = distanceMeters(lat, lng, expectedLat, expectedLng);
      if (actualDistance > radiusMeters) return 'geo proof is outside the allowed radius';
    }
    return null;
  }

  if (step.type === 'qr_code' || step.verification_type === 'qr') {
    if (input.proofType !== 'qr') return 'qr step requires proofType=qr';
    const code = parseStringField(proofData.code);
    if (!code) return 'qr proof requires proofData.code';
    const expectedCode = parseStringField(step.requirements_json.expectedCode);
    if (expectedCode && code !== expectedCode) return 'qr proof does not match expected code';
    return null;
  }

  if (step.type === 'space_action' || step.verification_type === 'space_post') {
    if (input.proofType !== 'space_post') return 'space action step requires proofType=space_post';
    if (!parseStringField(proofData.postId)) return 'space action proof requires proofData.postId';
    return null;
  }

  if (input.proofType === 'text' && !parseStringField(proofData.text)) {
    return 'text proof requires proofData.text';
  }
  if (input.proofType === 'photo' && !parseStringField(proofData.mediaId)) {
    return 'photo proof requires proofData.mediaId';
  }
  if (input.proofType === 'space_post' && !parseStringField(proofData.postId)) {
    return 'space_post proof requires proofData.postId';
  }

  return null;
}

function isPendingReviewVerification(step: QuestStepRow): boolean {
  return step.verification_type === 'manual' || step.verification_type === 'space_post';
}

function isTerminalProgressStatus(status: QuestProgressRow['status']): boolean {
  return status === 'completed' || status === 'failed' || status === 'expired';
}

function buildQuestEvent(
  env: Env,
  requestId: string,
  principal: GatewayPrincipal,
  input: {
    eventType: QuestDomainEventType;
    subjectType: 'quest' | 'quest_progress' | 'quest_submission' | 'quest_step';
    subjectId: string;
    payload: Record<string, unknown>;
  }
): QuestDomainEvent {
  return {
    eventId: `evt_${crypto.randomUUID()}`,
    eventType: input.eventType,
    eventVersion: 1,
    occurredAt: new Date().toISOString(),
    producer: {
      service: 'quest-service',
      environment: env.ENVIRONMENT,
    },
    trace: {
      requestId,
    },
    actor: {
      userId: principal.userId,
    },
    subject: {
      targetType: input.subjectType,
      targetId: input.subjectId,
    },
    payload: input.payload,
  };
}

async function publishSubmissionApprovedSequence(
  env: Env,
  requestId: string,
  publisher: QuestEventPublisher,
  principal: GatewayPrincipal,
  input: {
    quest: QuestRow;
    progressId: string;
    step: QuestStepRow;
    submission: QuestSubmissionRow;
    completed: boolean;
  }
): Promise<void> {
  await publisher.publish(
    buildQuestEvent(env, requestId, principal, {
      eventType: 'quest.submission.approved',
      subjectType: 'quest_submission',
      subjectId: input.submission.id,
      payload: {
        questId: input.quest.id,
        progressId: input.progressId,
        stepId: input.step.id,
        submissionId: input.submission.id,
        userId: input.submission.user_id,
      },
    })
  );
  await publisher.publish(
    buildQuestEvent(env, requestId, principal, {
      eventType: 'quest.step.completed',
      subjectType: 'quest_step',
      subjectId: input.step.id,
      payload: {
        questId: input.quest.id,
        progressId: input.progressId,
        stepId: input.step.id,
        stepOrder: input.step.order,
        submissionId: input.submission.id,
        userId: input.submission.user_id,
      },
    })
  );
  if (input.completed) {
    await publisher.publish(
      buildQuestEvent(env, requestId, principal, {
        eventType: 'quest.completed',
        subjectType: 'quest_progress',
        subjectId: input.progressId,
        payload: {
          questId: input.quest.id,
          progressId: input.progressId,
          userId: input.submission.user_id,
          rewardPoints: input.quest.reward_points,
        },
      })
    );
  }
}

async function publishManagementEvent(
  env: Env,
  requestId: string,
  publisher: QuestEventPublisher,
  principal: GatewayPrincipal,
  input: {
    eventType: QuestDomainEventType;
    subjectType: 'quest' | 'quest_step';
    subjectId: string;
    payload: Record<string, unknown>;
  }
): Promise<void> {
  await publisher.publish(
    buildQuestEvent(env, requestId, principal, {
      eventType: input.eventType,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      payload: input.payload,
    })
  );
}

export async function listQuests(env: Env, requestId: string, url: URL): Promise<Response> {
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const pagination = parsePage(url.searchParams);
  if (!pagination) return errorResponse('VALIDATION_ERROR', 'Invalid pagination parameters', requestId, 400);
  const difficultyRaw = url.searchParams.get('difficulty');
  const difficulty = difficultyRaw === null ? null : parseDifficulty(difficultyRaw);
  if (difficulty === undefined) return errorResponse('VALIDATION_ERROR', 'Invalid difficulty filter', requestId, 400);

  const db = createDb(databaseUrl);
  const cityId = getTrimmedString(url.searchParams.get('cityId'));
  const theme = getTrimmedString(url.searchParams.get('theme'));
  const quests = await listPublishedQuests(db, {
    cityId,
    theme,
    difficulty,
    limit: pagination.pageSize,
    offset: (pagination.page - 1) * pagination.pageSize,
  });
  const total = await countPublishedQuests(db, { cityId, theme, difficulty });

  return json(
    {
      items: quests.map((quest) => normalizeQuest(quest, [], { includeSteps: false })),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
    },
    200
  );
}

export async function getQuest(env: Env, requestId: string, questId: string): Promise<Response> {
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getPublishedQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const steps = await listQuestSteps(db, questId);
  return json(normalizeQuest(quest, steps), 200);
}

export async function listOwnedQuests(
  env: Env,
  principal: GatewayPrincipal,
  requestId: string,
  url: URL
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const pagination = parsePage(url.searchParams);
  if (!pagination) return errorResponse('VALIDATION_ERROR', 'Invalid pagination parameters', requestId, 400);

  const statusRaw = url.searchParams.get('status');
  const status = parseQuestStatus(statusRaw);
  if (status === undefined) return errorResponse('VALIDATION_ERROR', 'Invalid status filter', requestId, 400);

  const visibilityRaw = url.searchParams.get('visibility');
  const visibility = parseQuestVisibility(visibilityRaw);
  if (visibility === undefined) return errorResponse('VALIDATION_ERROR', 'Invalid visibility filter', requestId, 400);

  const db = createDb(databaseUrl);
  const ownerProId = hasRole(principal, 'admin') ? null : principal.userId;
  const items = await listManagedQuests(db, {
    ownerProId,
    status,
    visibility,
    limit: pagination.pageSize,
    offset: (pagination.page - 1) * pagination.pageSize,
  });
  const total = await countManagedQuests(db, { ownerProId, status, visibility });

  return json(
    {
      items: items.map((quest) => normalizeQuest(quest, [], { includeSteps: false })),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
    },
    200
  );
}

export async function getOwnedQuest(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot access this quest');
  if (ownedQuestError) return ownedQuestError;
  const steps = await listQuestSteps(db, questId);
  return json(normalizeQuest(quest, steps), 200);
}

export async function getOwnedQuestOperationalStats(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot access this quest');
  if (ownedQuestError) return ownedQuestError;

  const progressStats = await countQuestProgressStats(db, questId);
  const pendingReviewCount = await countPendingQuestSubmissions(db, questId);
  return json(
    {
      questId,
      startedCount: progressStats.startedCount,
      completedCount: progressStats.completedCount,
      pendingReviewCount,
    },
    200
  );
}

export async function createQuestDraft(
  env: Env,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const parsed = parseCreateQuestInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid quest payload', requestId, 400);

  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const created = await insertQuest(db, {
    id: `quest_${crypto.randomUUID()}`,
    title: parsed.title,
    description: parsed.description,
    creatorProId: principal.userId,
    cityId: parsed.cityId,
    geoScope: parsed.geoScope,
    type: parsed.type,
    theme: parsed.theme,
    difficulty: parsed.difficulty,
    visibility: parsed.visibility,
    rewardPoints: parsed.rewardPoints,
  });
  if (!created) return errorResponse('INTERNAL_ERROR', 'Failed to create quest', requestId, 500);
  await publishManagementEvent(env, requestId, publisher, principal, {
    eventType: 'quest.created',
    subjectType: 'quest',
    subjectId: created.id,
    payload: {
      questId: created.id,
      status: created.status,
      creatorProId: created.creator_pro_id,
    },
  });
  return json(normalizeQuest(created, []), 201);
}

export async function updateQuestDraftByOwner(
  env: Env,
  questId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const parsed = parseUpdateQuestDraftInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid draft update payload', requestId, 400);

  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot modify this quest');
  if (ownedQuestError) return ownedQuestError;
  const draftQuestError = requireDraftQuest(quest, requestId);
  if (draftQuestError) return draftQuestError;

  const updated = await updateQuestDraftRow(db, {
    questId,
    title: parsed.title ?? quest.title,
    description: parsed.description !== undefined ? parsed.description : quest.description,
    cityId: parsed.cityId !== undefined ? parsed.cityId : quest.city_id,
    geoScope: parsed.geoScope !== undefined ? parsed.geoScope : quest.geo_scope,
    type: parsed.type !== undefined ? parsed.type : quest.type,
    theme: parsed.theme !== undefined ? parsed.theme : quest.theme,
    difficulty: parsed.difficulty !== undefined ? parsed.difficulty : quest.difficulty,
    visibility: parsed.visibility ?? quest.visibility,
    rewardPoints: parsed.rewardPoints !== undefined ? parsed.rewardPoints : quest.reward_points,
  });
  if (!updated) return errorResponse('CONFLICT', 'Quest could not be updated', requestId, 409);
  await publishManagementEvent(env, requestId, publisher, principal, {
    eventType: 'quest.draft.updated',
    subjectType: 'quest',
    subjectId: updated.id,
    payload: {
      questId: updated.id,
      status: updated.status,
    },
  });
  const steps = await listQuestSteps(db, questId);
  return json(normalizeQuest(updated, steps), 200);
}

export async function addQuestStep(
  env: Env,
  questId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const parsed = parseAddQuestStepInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid quest step payload', requestId, 400);
  const validationError = validateStepDefinition(parsed);
  if (validationError) return errorResponse('VALIDATION_ERROR', validationError, requestId, 400);

  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot modify this quest');
  if (ownedQuestError) return ownedQuestError;
  const draftQuestError = requireDraftQuest(quest, requestId);
  if (draftQuestError) return draftQuestError;

  const steps = await listQuestSteps(db, questId);
  if (steps.some((step) => step.order === parsed.order)) {
    return errorResponse('CONFLICT', 'Step order already exists', requestId, 409);
  }

  const created = await insertQuestStep(db, {
    id: `qstep_${crypto.randomUUID()}`,
    questId,
    order: parsed.order,
    type: parsed.type,
    targetType: parsed.targetType,
    targetId: parsed.targetId,
    verificationType: parsed.verificationType,
    requirementsJson: parsed.requirements,
    rewardPoints: parsed.rewardPoints,
  });
  if (!created) return errorResponse('INTERNAL_ERROR', 'Failed to create quest step', requestId, 500);
  await syncQuestStepsCount(db, questId);
  await publishManagementEvent(env, requestId, publisher, principal, {
    eventType: 'quest.step.created',
    subjectType: 'quest_step',
    subjectId: created.id,
    payload: {
      questId,
      stepId: created.id,
      stepOrder: created.order,
    },
  });
  return json(normalizeQuestStep(created), 201);
}

export async function updateQuestStepByOwner(
  env: Env,
  questId: string,
  stepId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const parsed = parseUpdateQuestStepInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid draft step update payload', requestId, 400);

  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot modify this quest');
  if (ownedQuestError) return ownedQuestError;
  const draftQuestError = requireDraftQuest(quest, requestId);
  if (draftQuestError) return draftQuestError;

  const existingStep = await getQuestStepById(db, questId, stepId);
  if (!existingStep) return errorResponse('NOT_FOUND', 'Quest step not found', requestId, 404);

  const merged: AddQuestStepInput = {
    order: existingStep.order,
    type: parsed.type ?? existingStep.type,
    targetType: parsed.targetType !== undefined ? parsed.targetType : existingStep.target_type,
    targetId: parsed.targetId !== undefined ? parsed.targetId : existingStep.target_id,
    verificationType: parsed.verificationType ?? existingStep.verification_type,
    requirements: parsed.requirements ?? (existingStep.requirements_json ?? {}),
    rewardPoints: parsed.rewardPoints !== undefined ? parsed.rewardPoints : existingStep.reward_points,
  };
  const validationError = validateStepDefinition(merged);
  if (validationError) return errorResponse('VALIDATION_ERROR', validationError, requestId, 400);

  const updated = await updateQuestStepRow(db, {
    questId,
    stepId,
    type: merged.type,
    targetType: merged.targetType,
    targetId: merged.targetId,
    verificationType: merged.verificationType,
    requirementsJson: merged.requirements,
    rewardPoints: merged.rewardPoints,
  });
  if (!updated) return errorResponse('CONFLICT', 'Quest step could not be updated', requestId, 409);
  await publishManagementEvent(env, requestId, publisher, principal, {
    eventType: 'quest.step.updated',
    subjectType: 'quest_step',
    subjectId: updated.id,
    payload: {
      questId,
      stepId: updated.id,
      stepOrder: updated.order,
    },
  });
  return json(normalizeQuestStep(updated), 200);
}

export async function deleteQuestStepByOwner(
  env: Env,
  questId: string,
  stepId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot modify this quest');
  if (ownedQuestError) return ownedQuestError;
  const draftQuestError = requireDraftQuest(quest, requestId);
  if (draftQuestError) return draftQuestError;

  const deleted = await deleteQuestStepRow(db, { questId, stepId });
  if (!deleted) return errorResponse('NOT_FOUND', 'Quest step not found', requestId, 404);
  await resequenceQuestSteps(db, questId);
  await syncQuestStepsCount(db, questId);
  await publishManagementEvent(env, requestId, publisher, principal, {
    eventType: 'quest.step.deleted',
    subjectType: 'quest_step',
    subjectId: stepId,
    payload: {
      questId,
      stepId,
    },
  });
  return new Response(null, { status: 204 });
}

export async function publishQuest(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot publish this quest');
  if (ownedQuestError) return ownedQuestError;
  const transitionError = assertQuestStatusTransition(quest, 'published', requestId);
  if (transitionError) return transitionError;

  const steps = await listQuestSteps(db, questId);
  const publishReadinessError = getPublishReadinessError(steps);
  if (publishReadinessError) return errorResponse('CONFLICT', publishReadinessError, requestId, 409);

  const published = await publishQuestRow(db, questId);
  if (!published) return errorResponse('CONFLICT', 'Quest could not be published', requestId, 409);
  await publishManagementEvent(env, requestId, publisher, principal, {
    eventType: 'quest.published',
    subjectType: 'quest',
    subjectId: published.id,
    payload: {
      questId: published.id,
      status: published.status,
      publishedAt: asIso(published.published_at),
      stepsCount: published.steps_count,
    },
  });
  return json(normalizeQuest(published, steps), 200);
}

export async function archiveQuest(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot archive this quest');
  if (ownedQuestError) return ownedQuestError;

  const transitionError = assertQuestStatusTransition(quest, 'archived', requestId);
  if (transitionError) return transitionError;

  const activeProgressTotal = await countActiveQuestProgress(db, questId);
  if (activeProgressTotal > 0) {
    return errorResponse(
      'CONFLICT',
      'Quest cannot be archived while active progress exists',
      requestId,
      409
    );
  }

  const pendingSubmissionsTotal = await countPendingQuestSubmissions(db, questId);
  if (pendingSubmissionsTotal > 0) {
    return errorResponse(
      'CONFLICT',
      'Quest cannot be archived while pending submissions exist',
      requestId,
      409
    );
  }

  const archived = await archiveQuestRow(db, questId);
  if (!archived) return errorResponse('CONFLICT', 'Quest could not be archived', requestId, 409);
  await publishManagementEvent(env, requestId, publisher, principal, {
    eventType: 'quest.archived',
    subjectType: 'quest',
    subjectId: archived.id,
    payload: {
      questId: archived.id,
      status: archived.status,
    },
  });
  const steps = await listQuestSteps(db, questId);
  return json(normalizeQuest(archived, steps), 200);
}

export async function startQuest(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getPublishedQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  if (quest.steps_count < 1) return errorResponse('CONFLICT', 'Quest has no steps', requestId, 409);

  const existing = await getQuestProgressByQuestAndUser(db, questId, principal.userId);
  if (existing) {
    if (isTerminalProgressStatus(existing.status)) {
      return errorResponse('CONFLICT', 'Quest progress is already in terminal state', requestId, 409);
    }

    if (existing.status === 'not_started') {
      const reactivated = await advanceQuestProgress(db, {
        progressId: existing.id,
        nextStep: existing.current_step ?? 1,
        completed: false,
      });
      if (!reactivated) return errorResponse('INTERNAL_ERROR', 'Failed to reactivate quest progress', requestId, 500);

      await publisher.publish(
        buildQuestEvent(env, requestId, principal, {
          eventType: 'quest.started',
          subjectType: 'quest_progress',
          subjectId: reactivated.id,
          payload: {
            questId,
            progressId: reactivated.id,
            userId: principal.userId,
            currentStep: reactivated.current_step,
          },
        })
      );

      return json(normalizeQuestProgress(reactivated, quest.steps_count), 200);
    }

    return json(normalizeQuestProgress(existing, quest.steps_count), 200);
  }

  const inserted = await insertQuestProgress(db, {
    id: `qprog_${crypto.randomUUID()}`,
    questId,
    userId: principal.userId,
    currentStep: 1,
  });
  const progress = inserted ?? (await getQuestProgressByQuestAndUser(db, questId, principal.userId));
  if (!progress) return errorResponse('INTERNAL_ERROR', 'Failed to start quest', requestId, 500);

  await publisher.publish(
    buildQuestEvent(env, requestId, principal, {
      eventType: 'quest.started',
      subjectType: 'quest_progress',
      subjectId: progress.id,
      payload: {
        questId,
        progressId: progress.id,
        userId: principal.userId,
        currentStep: progress.current_step,
      },
    })
  );

  return json(normalizeQuestProgress(progress, quest.steps_count), 200);
}

export async function getQuestProgress(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getPublishedQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const progress = await getQuestProgressByQuestAndUser(db, questId, principal.userId);
  if (!progress) return errorResponse('NOT_FOUND', 'Quest progress not found', requestId, 404);
  return json(normalizeQuestProgress(progress, quest.steps_count), 200);
}

export async function submitQuestStep(
  env: Env,
  input: {
    questId: string;
    stepId: string;
    body: Record<string, unknown> | null;
    principal: GatewayPrincipal;
    requestId: string;
    publisher: QuestEventPublisher;
  }
): Promise<Response> {
  const parsed = parseSubmitQuestStepInput(input.body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid submission payload', input.requestId, 400);

  const databaseUrl = requireDatabaseUrl(env, input.requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getPublishedQuestById(db, input.questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', input.requestId, 404);
  const step = await getQuestStepById(db, input.questId, input.stepId);
  if (!step) return errorResponse('NOT_FOUND', 'Quest step not found', input.requestId, 404);
  const progress = await getQuestProgressByQuestAndUser(db, input.questId, input.principal.userId);
  if (!progress) return errorResponse('NOT_FOUND', 'Quest progress not found', input.requestId, 404);
  if (progress.status === 'not_started') {
    return errorResponse('CONFLICT', 'Quest progress is not started', input.requestId, 409);
  }
  if (progress.status === 'pending_review') {
    return errorResponse('CONFLICT', 'Quest progress is waiting for manual review', input.requestId, 409);
  }
  if (progress.status === 'completed') {
    return errorResponse('CONFLICT', 'Quest is already completed', input.requestId, 409);
  }
  if (progress.status === 'failed' || progress.status === 'expired') {
    return errorResponse('CONFLICT', 'Quest progress is not active', input.requestId, 409);
  }
  if (progress.current_step !== step.order) {
    return errorResponse('CONFLICT', 'Quest step order violation', input.requestId, 409);
  }

  const existingSubmission = await getBlockingSubmissionForProgressStep(db, progress.id, step.id);
  if (existingSubmission) {
    return errorResponse('CONFLICT', 'Submission already exists for this progress step', input.requestId, 409);
  }

  const proofError = validateProof(step, parsed);
  if (proofError) return errorResponse('VALIDATION_ERROR', proofError, input.requestId, 400);

  const submissionStatus = isPendingReviewVerification(step) ? 'pending' : 'approved';
  const created = await insertQuestSubmission(db, {
    id: `qsub_${crypto.randomUUID()}`,
    progressId: progress.id,
    stepId: step.id,
    userId: input.principal.userId,
    proofType: parsed.proofType,
    proofData: parsed.proofData,
    status: submissionStatus,
  });
  if (!created) return errorResponse('INTERNAL_ERROR', 'Failed to create submission', input.requestId, 500);

  await input.publisher.publish(
    buildQuestEvent(env, input.requestId, input.principal, {
      eventType: 'quest.submission.created',
      subjectType: 'quest_submission',
      subjectId: created.id,
      payload: {
        questId: input.questId,
        progressId: progress.id,
        stepId: step.id,
        submissionId: created.id,
        userId: input.principal.userId,
        status: created.status,
        proofType: created.proof_type,
      },
    })
  );

  if (submissionStatus === 'pending') {
    await setProgressPendingReview(db, progress.id);
    return json(normalizeQuestSubmission(created), 201);
  }

  const completed = step.order >= quest.steps_count;
  await completeQuestProgressWithRewardDelivery(env, db, input.requestId, {
    quest,
    progressId: progress.id,
    userId: input.principal.userId,
    completed,
    nextStep: completed ? null : step.order + 1,
  });
  await publishSubmissionApprovedSequence(env, input.requestId, input.publisher, input.principal, {
    quest,
    progressId: progress.id,
    step,
    submission: created,
    completed,
  });
  return json(normalizeQuestSubmission(created), 201);
}

export async function getQuestSubmissions(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string,
  url: URL
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const pagination = parsePage(url.searchParams);
  if (!pagination) return errorResponse('VALIDATION_ERROR', 'Invalid pagination parameters', requestId, 400);
  const status = parseSubmissionStatus(url.searchParams.get('status'));
  if (status === undefined) return errorResponse('VALIDATION_ERROR', 'Invalid submission status filter', requestId, 400);
  const stepId = parseOptionalOpaqueRef(url.searchParams.get('stepId'), 80);
  if (stepId === undefined) return errorResponse('VALIDATION_ERROR', 'Invalid stepId filter', requestId, 400);
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(
    principal,
    quest,
    requestId,
    'Cannot access submissions for this quest'
  );
  if (ownedQuestError) return ownedQuestError;

  const items = await listQuestSubmissions(db, {
    questId,
    status,
    stepId,
    limit: pagination.pageSize,
    offset: (pagination.page - 1) * pagination.pageSize,
  });
  const total = await countQuestSubmissions(db, { questId, status, stepId });
  return json(
    {
      items: items.map(normalizeQuestSubmission),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
    },
    200
  );
}

export async function reviewQuestSubmission(
  env: Env,
  submissionId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string,
  publisher: QuestEventPublisher
): Promise<Response> {
  const managePrincipalError = requireManagementPrincipal(principal, requestId);
  if (managePrincipalError) return managePrincipalError;
  const parsed = parseReviewSubmissionInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid review payload', requestId, 400);
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);

  const existing = await getSubmissionForReview(db, submissionId);
  if (!existing) return errorResponse('NOT_FOUND', 'Submission not found', requestId, 404);
  const quest = await getQuestById(db, existing.quest_id);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  const ownedQuestError = requireManagedQuestOwnership(principal, quest, requestId, 'Cannot review this submission');
  if (ownedQuestError) return ownedQuestError;
  if (existing.status !== 'pending') return errorResponse('CONFLICT', 'Submission is already reviewed', requestId, 409);

  if (parsed.decision === 'reject') {
    const rejected = await rejectSubmission(db, {
      submissionId,
      reviewerId: principal.userId,
      reason: parsed.reason,
    });
    if (!rejected) return errorResponse('CONFLICT', 'Submission is already reviewed', requestId, 409);
    await advanceQuestProgress(db, {
      progressId: existing.progress_id,
      nextStep: existing.current_step ?? existing.step_order,
      completed: false,
    });
    await publisher.publish(
      buildQuestEvent(env, requestId, principal, {
        eventType: 'quest.submission.rejected',
        subjectType: 'quest_submission',
        subjectId: rejected.id,
        payload: {
          questId: existing.quest_id,
          progressId: existing.progress_id,
          stepId: existing.step_id,
          submissionId: rejected.id,
          userId: rejected.user_id,
          reason: rejected.rejection_reason,
        },
      })
    );
    return json(normalizeQuestSubmission(rejected), 200);
  }

  const approved = await approveSubmission(db, {
    submissionId,
    reviewerId: principal.userId,
  });
  if (!approved) return errorResponse('CONFLICT', 'Submission is already reviewed', requestId, 409);
  const step = await getQuestStepById(db, existing.quest_id, existing.step_id);
  if (!step) return errorResponse('NOT_FOUND', 'Quest step not found', requestId, 404);
  const completed = existing.step_order >= quest.steps_count;
  await completeQuestProgressWithRewardDelivery(env, db, requestId, {
    quest,
    progressId: existing.progress_id,
    userId: approved.user_id,
    completed,
    nextStep: completed ? null : existing.step_order + 1,
  });
  await publishSubmissionApprovedSequence(env, requestId, publisher, principal, {
    quest,
    progressId: existing.progress_id,
    step,
    submission: approved,
    completed,
  });
  return json(normalizeQuestSubmission(approved), 200);
}

export async function replayPendingQuestRewardDeliveries(
  env: Env,
  requestId: string,
  body: Record<string, unknown> | null,
  principal: ServicePrincipal
): Promise<Response> {
  const parsed = parseReplayPendingRewardsInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid replay payload', requestId, 400);
  const summary = await runQuestRewardReplay(env, requestId, {
    limit: parsed.limit,
    requestedBy: principal.service,
  });
  if (summary instanceof Response) return summary;
  return json(summary, 200);
}

export async function getQuestRewardOutboxStatsResponse(
  env: Env,
  requestId: string,
  principal: ServicePrincipal
): Promise<Response> {
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;

  const db = createDb(databaseUrl);
  const stats: QuestRewardOutboxStatsRow = await getQuestRewardOutboxStats(db);
  return json(
    {
      counts: {
        pending: stats.pending_count,
        delivered: stats.delivered_count,
        failed: stats.failed_count,
      },
      oldestPending: stats.oldest_pending_created_at
        ? {
            createdAt: asIso(stats.oldest_pending_created_at)!,
          }
        : null,
      oldestFailed: stats.oldest_failed_created_at
        ? {
            createdAt: asIso(stats.oldest_failed_created_at)!,
          }
        : null,
      requestedBy: principal.service,
    },
    200
  );
}

export async function runScheduledQuestRewardReplay(
  env: Env,
  requestId: string,
  limit = REPLAY_PENDING_REWARDS_DEFAULT_LIMIT
): Promise<QuestRewardReplaySummary | Response> {
  return runQuestRewardReplay(env, requestId, {
    limit: Math.min(REPLAY_PENDING_REWARDS_MAX_LIMIT, Math.max(1, limit)),
    requestedBy: SCHEDULED_REPLAY_REQUESTED_BY,
  });
}

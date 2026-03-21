import { createDb } from '@go2asia/db';

import {
  advanceQuestProgress,
  approveSubmission,
  countPublishedQuests,
  countQuestSubmissions,
  getBlockingSubmissionForProgressStep,
  getPublishedQuestById,
  getQuestById,
  getQuestProgressByQuestAndUser,
  getQuestStepById,
  getSubmissionForReview,
  insertQuest,
  insertQuestProgress,
  insertQuestStep,
  insertQuestSubmission,
  listPublishedQuests,
  listQuestSteps,
  listQuestSubmissions,
  publishQuest as publishQuestRow,
  rejectSubmission,
  setProgressPendingReview,
  syncQuestStepsCount,
  type QuestDifficulty,
  type QuestProgressRow,
  type QuestProofType,
  type QuestRow,
  type QuestStepRow,
  type QuestStepType,
  type QuestSubmissionRow,
  type QuestVerificationType,
  type QuestVisibility,
} from '../db/queries/quest';
import type { QuestDomainEvent, QuestDomainEventType } from '../events/contracts';
import type { QuestEventPublisher } from '../events/publisher';
import type { GatewayPrincipal } from '../middleware/auth';
import { errorResponse, json } from '../middleware/http';

type Env = {
  DATABASE_URL?: string;
  ENVIRONMENT?: string;
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
  targetType: string | null;
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

const QUEST_DIFFICULTIES: QuestDifficulty[] = ['easy', 'medium', 'hard'];
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

function normalizeQuest(quest: QuestRow, steps: QuestStepRow[] = []) {
  return {
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
    createdAt: asIso(submission.created_at),
  };
}

function requireDatabaseUrl(env: Env, requestId: string): string | Response {
  if (!env.DATABASE_URL) {
    return errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503);
  }
  return env.DATABASE_URL;
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

function hasRole(principal: GatewayPrincipal, role: string): boolean {
  return principal.roles.includes(role);
}

function canManageQuest(principal: GatewayPrincipal): boolean {
  return hasRole(principal, 'pro') || hasRole(principal, 'admin');
}

function canManageOwnedQuest(principal: GatewayPrincipal, quest: QuestRow): boolean {
  return hasRole(principal, 'admin') || quest.creator_pro_id === principal.userId;
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
  const targetType = parseOptionalString(body.targetType, 80);
  const targetId = parseOptionalString(body.targetId, 160);
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
      items: quests.map((quest) => normalizeQuest(quest, [])),
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

export async function createQuestDraft(
  env: Env,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  if (!canManageQuest(principal)) return errorResponse('FORBIDDEN', 'PRO or admin role is required', requestId, 403);
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
  return json(normalizeQuest(created, []), 201);
}

export async function addQuestStep(
  env: Env,
  questId: string,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  if (!canManageQuest(principal)) return errorResponse('FORBIDDEN', 'PRO or admin role is required', requestId, 403);
  const parsed = parseAddQuestStepInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid quest step payload', requestId, 400);
  const validationError = validateStepDefinition(parsed);
  if (validationError) return errorResponse('VALIDATION_ERROR', validationError, requestId, 400);

  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  if (!canManageOwnedQuest(principal, quest)) return errorResponse('FORBIDDEN', 'Cannot modify this quest', requestId, 403);
  if (quest.status !== 'draft') return errorResponse('CONFLICT', 'Only draft quests can be modified', requestId, 409);

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
  return json(normalizeQuestStep(created), 201);
}

export async function publishQuest(
  env: Env,
  questId: string,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  if (!canManageQuest(principal)) return errorResponse('FORBIDDEN', 'PRO or admin role is required', requestId, 403);
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  if (!canManageOwnedQuest(principal, quest)) return errorResponse('FORBIDDEN', 'Cannot publish this quest', requestId, 403);
  if (quest.status !== 'draft') return errorResponse('CONFLICT', 'Quest is already published or archived', requestId, 409);

  const steps = await listQuestSteps(db, questId);
  if (steps.length === 0) return errorResponse('CONFLICT', 'Quest must have at least one step before publish', requestId, 409);
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]?.order !== i + 1) {
      return errorResponse('CONFLICT', 'Quest steps must be sequential without gaps', requestId, 409);
    }
  }

  const published = await publishQuestRow(db, questId);
  if (!published) return errorResponse('CONFLICT', 'Quest could not be published', requestId, 409);
  return json(normalizeQuest(published, steps), 200);
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
  if (existing) return json(normalizeQuestProgress(existing, quest.steps_count), 200);

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
  if (progress.status === 'pending_review') {
    return errorResponse('CONFLICT', 'Quest progress is waiting for manual review', input.requestId, 409);
  }
  if (progress.status === 'completed') {
    return errorResponse('CONFLICT', 'Quest is already completed', input.requestId, 409);
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
  await advanceQuestProgress(db, {
    progressId: progress.id,
    nextStep: completed ? null : step.order + 1,
    completed,
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
  if (!canManageQuest(principal)) return errorResponse('FORBIDDEN', 'PRO or admin role is required', requestId, 403);
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const pagination = parsePage(url.searchParams);
  if (!pagination) return errorResponse('VALIDATION_ERROR', 'Invalid pagination parameters', requestId, 400);
  const db = createDb(databaseUrl);
  const quest = await getQuestById(db, questId);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  if (!canManageOwnedQuest(principal, quest)) return errorResponse('FORBIDDEN', 'Cannot access submissions for this quest', requestId, 403);

  const items = await listQuestSubmissions(db, {
    questId,
    limit: pagination.pageSize,
    offset: (pagination.page - 1) * pagination.pageSize,
  });
  const total = await countQuestSubmissions(db, questId);
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
  if (!canManageQuest(principal)) return errorResponse('FORBIDDEN', 'PRO or admin role is required', requestId, 403);
  const parsed = parseReviewSubmissionInput(body);
  if (!parsed) return errorResponse('VALIDATION_ERROR', 'Invalid review payload', requestId, 400);
  const databaseUrl = requireDatabaseUrl(env, requestId);
  if (databaseUrl instanceof Response) return databaseUrl;
  const db = createDb(databaseUrl);

  const existing = await getSubmissionForReview(db, submissionId);
  if (!existing) return errorResponse('NOT_FOUND', 'Submission not found', requestId, 404);
  const quest = await getQuestById(db, existing.quest_id);
  if (!quest) return errorResponse('NOT_FOUND', 'Quest not found', requestId, 404);
  if (!canManageOwnedQuest(principal, quest)) return errorResponse('FORBIDDEN', 'Cannot review this submission', requestId, 403);
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
  await advanceQuestProgress(db, {
    progressId: existing.progress_id,
    nextStep: completed ? null : existing.step_order + 1,
    completed,
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

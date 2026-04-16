import { createDb } from '@go2asia/db';

import {
  getTripByIdForUser,
  insertTrip,
  insertTripItem,
  insertTripNote,
  insertTripTask,
  listTripItems,
  listTripNotes,
  listTripsByUser,
  listTripTasks,
  type OrganizerTripItemStatus,
  type OrganizerTripStatus,
  type OrganizerTripTaskStatus,
  updateTripTaskStatus,
} from '../db/queries/organizer';
import type { GatewayPrincipal } from '../middleware/auth';
import { errorResponse, json } from '../middleware/http';

type Env = {
  DATABASE_URL?: string;
};

type TripCreateInput = {
  title: string;
  destinationLabel: string | null;
  summary: string | null;
  status: OrganizerTripStatus;
  startDate: string | null;
  endDate: string | null;
};

type TripItemCreateInput = {
  title: string;
  note: string | null;
  status: OrganizerTripItemStatus;
};

type TripTaskCreateInput = {
  title: string;
  status: OrganizerTripTaskStatus;
};

type TripTaskUpdateInput = {
  status: OrganizerTripTaskStatus;
};

type TripNoteCreateInput = {
  body: string;
};

function ensureDb(env: Env, requestId: string) {
  if (!env.DATABASE_URL) {
    return { ok: false as const, response: errorResponse('SERVICE_NOT_CONFIGURED', 'DATABASE_URL is missing', requestId, 503) };
  }

  return { ok: true as const, db: createDb(env.DATABASE_URL) };
}

function trimString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeIsoDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function serializeDate(value: string | Date | null): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function normalizeTripSummaryRow(row: Awaited<ReturnType<typeof listTripsByUser>>[number]) {
  return {
    id: row.id,
    title: row.title,
    destinationLabel: row.destination_label,
    summary: row.summary,
    status: row.status,
    startDate: serializeDate(row.start_date),
    endDate: serializeDate(row.end_date),
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
    itemCount: row.item_count,
    pendingTaskCount: row.pending_task_count,
    noteCount: row.note_count,
  };
}

function normalizeTripDetailRow(row: NonNullable<Awaited<ReturnType<typeof getTripByIdForUser>>>) {
  return {
    id: row.id,
    title: row.title,
    destinationLabel: row.destination_label,
    summary: row.summary,
    status: row.status,
    startDate: serializeDate(row.start_date),
    endDate: serializeDate(row.end_date),
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

function normalizeTripItem(row: Awaited<ReturnType<typeof listTripItems>>[number]) {
  return {
    id: row.id,
    tripId: row.trip_id,
    title: row.title,
    note: row.note,
    status: row.status,
    sourceModule: row.source_module,
    sourceEntityType: row.source_entity_type,
    sourceEntityId: row.source_entity_id,
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

function normalizeTripTask(row: Awaited<ReturnType<typeof listTripTasks>>[number]) {
  return {
    id: row.id,
    tripId: row.trip_id,
    title: row.title,
    status: row.status,
    completedAt: serializeDate(row.completed_at),
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

function normalizeTripNote(row: Awaited<ReturnType<typeof listTripNotes>>[number]) {
  return {
    id: row.id,
    tripId: row.trip_id,
    body: row.body,
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

function parseTripCreateInput(body: Record<string, unknown> | null): TripCreateInput | null {
  if (!body) return null;
  const title = trimString(body.title);
  if (!title || title.length > 120) return null;
  const destinationLabel = trimString(body.destinationLabel);
  if (destinationLabel && destinationLabel.length > 120) return null;
  const summary = trimString(body.summary);
  if (summary && summary.length > 400) return null;

  const rawStatus = trimString(body.status);
  const status: OrganizerTripStatus =
    rawStatus === 'active' || rawStatus === 'completed' || rawStatus === 'archived' ? rawStatus : 'draft';

  const startDateRaw = trimString(body.startDate);
  const endDateRaw = trimString(body.endDate);
  const startDate = startDateRaw ? normalizeIsoDate(startDateRaw) : null;
  const endDate = endDateRaw ? normalizeIsoDate(endDateRaw) : null;
  if (startDateRaw && !startDate) return null;
  if (endDateRaw && !endDate) return null;
  if (startDate && endDate && startDate > endDate) return null;

  return {
    title,
    destinationLabel,
    summary,
    status,
    startDate,
    endDate,
  };
}

function parseTripItemCreateInput(body: Record<string, unknown> | null): TripItemCreateInput | null {
  if (!body) return null;
  const title = trimString(body.title);
  if (!title || title.length > 160) return null;
  const note = trimString(body.note);
  if (note && note.length > 400) return null;
  const rawStatus = trimString(body.status);
  const status: OrganizerTripItemStatus = rawStatus === 'booked' || rawStatus === 'done' ? rawStatus : 'planned';
  return { title, note, status };
}

function parseTripTaskCreateInput(body: Record<string, unknown> | null): TripTaskCreateInput | null {
  if (!body) return null;
  const title = trimString(body.title);
  if (!title || title.length > 160) return null;
  const rawStatus = trimString(body.status);
  const status: OrganizerTripTaskStatus = rawStatus === 'done' ? 'done' : 'pending';
  return { title, status };
}

function parseTripTaskUpdateInput(body: Record<string, unknown> | null): TripTaskUpdateInput | null {
  if (!body) return null;
  const rawStatus = trimString(body.status);
  if (rawStatus !== 'pending' && rawStatus !== 'done') return null;
  return { status: rawStatus };
}

function parseTripNoteCreateInput(body: Record<string, unknown> | null): TripNoteCreateInput | null {
  if (!body) return null;
  const bodyText = trimString(body.body);
  if (!bodyText || bodyText.length > 1200) return null;
  return { body: bodyText };
}

async function ensureTripOwned(env: Env, principal: GatewayPrincipal, tripId: string, requestId: string) {
  const dbResult = ensureDb(env, requestId);
  if (!dbResult.ok) return dbResult;

  const trip = await getTripByIdForUser(dbResult.db, tripId, principal.userId);
  if (!trip) {
    return { ok: false as const, response: errorResponse('NOT_FOUND', 'Trip not found', requestId, 404) };
  }

  return { ok: true as const, db: dbResult.db, trip };
}

export async function listTrips(env: Env, principal: GatewayPrincipal, requestId: string): Promise<Response> {
  const dbResult = ensureDb(env, requestId);
  if (!dbResult.ok) return dbResult.response;

  const trips = await listTripsByUser(dbResult.db, principal.userId);
  return json({
    trips: trips.map(normalizeTripSummaryRow),
  });
}

export async function createTrip(
  env: Env,
  body: Record<string, unknown> | null,
  principal: GatewayPrincipal,
  requestId: string
): Promise<Response> {
  const parsed = parseTripCreateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip payload', requestId, 400);
  }

  const dbResult = ensureDb(env, requestId);
  if (!dbResult.ok) return dbResult.response;

  const created = await insertTrip(dbResult.db, {
    id: `trip_${crypto.randomUUID()}`,
    userId: principal.userId,
    title: parsed.title,
    destinationLabel: parsed.destinationLabel,
    summary: parsed.summary,
    status: parsed.status,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
  });

  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip', requestId, 500);
  }

  return json(
    {
      trip: normalizeTripDetailRow(created),
    },
    201
  );
}

export async function getTripDetail(env: Env, principal: GatewayPrincipal, tripId: string, requestId: string): Promise<Response> {
  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const [items, tasks, notes] = await Promise.all([
    listTripItems(tripResult.db, tripId, principal.userId),
    listTripTasks(tripResult.db, tripId, principal.userId),
    listTripNotes(tripResult.db, tripId, principal.userId),
  ]);

  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const whatMattersNow =
    items.length === 0
      ? 'Добавьте первый trip item, чтобы поездка перестала быть пустым контейнером.'
      : pendingTasks > 0
        ? `Сейчас важно закрыть ${pendingTasks} незавершённых задач.`
        : notes.length === 0
          ? 'Добавьте заметку с ключевым контекстом поездки.'
          : 'Базовый trip context собран. Можно продолжать точечно наполнять поездку.';

  return json({
    trip: normalizeTripDetailRow(tripResult.trip),
    items: items.map(normalizeTripItem),
    tasks: tasks.map(normalizeTripTask),
    notes: notes.map(normalizeTripNote),
    insight: {
      whatMattersNow,
    },
  });
}

export async function createTripItem(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const parsed = parseTripItemCreateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip item payload', requestId, 400);
  }

  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const created = await insertTripItem(tripResult.db, {
    id: `titem_${crypto.randomUUID()}`,
    tripId,
    userId: principal.userId,
    title: parsed.title,
    note: parsed.note,
    sourceModule: null,
    sourceEntityType: null,
    sourceEntityId: null,
    status: parsed.status,
  });

  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip item', requestId, 500);
  }

  return json({ item: normalizeTripItem(created) }, 201);
}

export async function createTripTask(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const parsed = parseTripTaskCreateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip task payload', requestId, 400);
  }

  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const created = await insertTripTask(tripResult.db, {
    id: `ttask_${crypto.randomUUID()}`,
    tripId,
    userId: principal.userId,
    title: parsed.title,
    status: parsed.status,
  });

  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip task', requestId, 500);
  }

  return json({ task: normalizeTripTask(created) }, 201);
}

export async function patchTripTask(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  taskId: string,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const parsed = parseTripTaskUpdateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip task update payload', requestId, 400);
  }

  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const updated = await updateTripTaskStatus(tripResult.db, {
    tripId,
    taskId,
    userId: principal.userId,
    status: parsed.status,
  });

  if (!updated) {
    return errorResponse('NOT_FOUND', 'Task not found', requestId, 404);
  }

  return json({ task: normalizeTripTask(updated) });
}

export async function createTripNote(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const parsed = parseTripNoteCreateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip note payload', requestId, 400);
  }

  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const created = await insertTripNote(tripResult.db, {
    id: `tnote_${crypto.randomUUID()}`,
    tripId,
    userId: principal.userId,
    body: parsed.body,
  });

  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip note', requestId, 500);
  }

  return json({ note: normalizeTripNote(created) }, 201);
}

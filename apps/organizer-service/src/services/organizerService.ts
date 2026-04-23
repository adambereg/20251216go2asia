import { createDb } from '@go2asia/db';

import {
  deleteTripItemByIdForUser,
  getTripByIdForUser,
  getTripItemByIdForUser,
  getTripItemBySourceRef,
  insertTrip,
  insertTripItemNote,
  insertTripItem,
  insertTripNote,
  insertTripTask,
  listTripDays,
  listTripItemNotesByTrip,
  listTripItems,
  listTripNotes,
  listTripsByUser,
  listTripTasks,
  type OrganizerTripDatesConfidence,
  type OrganizerTripLifecycleMode,
  type OrganizerTripItemStatus,
  type OrganizerTripStatus,
  type OrganizerTripTaskStatus,
  updateTripByIdForUser,
  updateTripItemByIdForUser,
  updateTripTaskByIdForUser,
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
  datesConfidence: OrganizerTripDatesConfidence | null;
  lifecycleOverride: OrganizerTripLifecycleMode | null;
};

type TripItemCreateInput = {
  title: string;
  note: string | null;
  category: string | null;
  pinned: boolean;
  dayDate: string | null;
  status: OrganizerTripItemStatus;
  sourceModule: string | null;
  sourceEntityType: string | null;
  sourceEntityId: string | null;
};

type TripTaskCreateInput = {
  title: string;
  status: OrganizerTripTaskStatus;
  dayDate: string | null;
  sortOrder: number;
  whyItMatters: string | null;
};

type TripTaskUpdateInput = {
  status?: OrganizerTripTaskStatus;
  dayDate?: string | null;
  sortOrder?: number | null;
  whyItMatters?: string | null;
};

type TripItemUpdateInput = {
  title?: string | null;
  note?: string | null;
  category?: string | null;
  pinned?: boolean;
  dayDate?: string | null;
  status?: OrganizerTripItemStatus;
};

type TripUpdateInput = {
  title?: string | null;
  destinationLabel?: string | null;
  summary?: string | null;
  status?: OrganizerTripStatus;
  startDate?: string | null;
  endDate?: string | null;
  datesConfidence?: OrganizerTripDatesConfidence | null;
  lifecycleOverride?: OrganizerTripLifecycleMode | null;
};

type TripNoteCreateInput = {
  body: string;
  dayDate: string | null;
  noteType: string | null;
};

type TripItemNoteCreateInput = {
  body: string;
  sortOrder: number;
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

function normalizeDayDate(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return trimmed;
}

function parseBooleanField(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return null;
}

function parseNonNegativeInteger(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isInteger(parsed) && parsed >= 0) return parsed;
  }
  return null;
}

function parseDatesConfidence(value: unknown): OrganizerTripDatesConfidence | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const normalized = trimString(value);
  if (!normalized) return null;
  if (normalized === 'none' || normalized === 'rough' || normalized === 'confirmed') return normalized;
  return undefined;
}

function parseLifecycleOverride(value: unknown): OrganizerTripLifecycleMode | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const normalized = trimString(value);
  if (!normalized) return null;
  if (normalized === 'preparation' || normalized === 'in_trip' || normalized === 'post_trip') return normalized;
  return undefined;
}

function serializeDate(value: string | Date | null): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function serializeDayDate(value: string | Date | null): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
    return null;
  }
  return value.toISOString().slice(0, 10);
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
    datesConfidence: row.dates_confidence,
    lifecycleOverride: row.lifecycle_override,
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
    itemCount: row.item_count,
    bookedItemCount: row.booked_item_count,
    pinnedItemCount: row.pinned_item_count,
    linkedItemCount: row.linked_item_count,
    pendingTaskCount: row.pending_task_count,
    firstPendingTaskTitle: row.first_pending_task_title,
    noteCount: row.note_count,
    dayCount: row.day_count,
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
    datesConfidence: row.dates_confidence,
    lifecycleOverride: row.lifecycle_override,
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
    category: row.category,
    pinned: row.pinned,
    dayDate: serializeDayDate(row.day_date),
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
    dayDate: serializeDayDate(row.day_date),
    sortOrder: row.sort_order,
    whyItMatters: row.why_it_matters,
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
    dayDate: serializeDayDate(row.day_date),
    noteType: row.note_type,
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

function normalizeTripDay(row: Awaited<ReturnType<typeof listTripDays>>[number]) {
  return {
    id: row.id,
    tripId: row.trip_id,
    dayDate: serializeDayDate(row.day_date) ?? '',
    theme: row.theme,
    focus: row.focus,
    plannedHighlights: row.planned_highlights,
    sortOrder: row.sort_order,
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

function normalizeTripItemNote(row: Awaited<ReturnType<typeof listTripItemNotesByTrip>>[number]) {
  return {
    id: row.id,
    itemId: row.item_id,
    tripId: row.trip_id,
    body: row.body,
    sortOrder: row.sort_order,
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

  const datesConfidence = parseDatesConfidence(body.datesConfidence);
  if (body.datesConfidence !== undefined && datesConfidence === undefined) return null;
  const lifecycleOverride = parseLifecycleOverride(body.lifecycleOverride);
  if (body.lifecycleOverride !== undefined && lifecycleOverride === undefined) return null;

  return {
    title,
    destinationLabel,
    summary,
    status,
    startDate,
    endDate,
    datesConfidence: datesConfidence ?? null,
    lifecycleOverride: lifecycleOverride ?? null,
  };
}

function parseTripItemCreateInput(body: Record<string, unknown> | null): TripItemCreateInput | null {
  if (!body) return null;
  const title = trimString(body.title);
  if (!title || title.length > 160) return null;
  const note = trimString(body.note);
  if (note && note.length > 400) return null;
  const category = trimString(body.category);
  if (category && category.length > 40) return null;
  const pinned = parseBooleanField(body.pinned);
  if (body.pinned !== undefined && pinned === null) return null;
  const dayDateRaw = trimString(body.dayDate);
  const dayDate = dayDateRaw ? normalizeDayDate(dayDateRaw) : null;
  if (dayDateRaw && !dayDate) return null;
  const rawStatus = trimString(body.status);
  const status: OrganizerTripItemStatus = rawStatus === 'booked' || rawStatus === 'done' ? rawStatus : 'planned';
  const nestedSource =
    body.source && typeof body.source === 'object' && !Array.isArray(body.source)
      ? (body.source as Record<string, unknown>)
      : null;

  const sourceModule = trimString(nestedSource?.module ?? body.sourceModule);
  const sourceEntityType = trimString(nestedSource?.entityType ?? body.sourceEntityType);
  const sourceEntityId = trimString(nestedSource?.entityId ?? body.sourceEntityId);

  const hasSomeSource = Boolean(sourceModule || sourceEntityType || sourceEntityId);
  const hasFullSource = Boolean(sourceModule && sourceEntityType && sourceEntityId);
  if (hasSomeSource && !hasFullSource) return null;

  return {
    title,
    note,
    category,
    pinned: pinned ?? false,
    dayDate,
    status,
    sourceModule,
    sourceEntityType,
    sourceEntityId,
  };
}

function parseTripTaskCreateInput(body: Record<string, unknown> | null): TripTaskCreateInput | null {
  if (!body) return null;
  const title = trimString(body.title);
  if (!title || title.length > 160) return null;
  const rawStatus = trimString(body.status);
  const status: OrganizerTripTaskStatus = rawStatus === 'done' ? 'done' : 'pending';
  const dayDateRaw = trimString(body.dayDate);
  const dayDate = dayDateRaw ? normalizeDayDate(dayDateRaw) : null;
  if (dayDateRaw && !dayDate) return null;
  const sortOrder = parseNonNegativeInteger(body.sortOrder);
  if (body.sortOrder !== undefined && sortOrder === null) return null;
  const whyItMatters = trimString(body.whyItMatters);
  if (whyItMatters && whyItMatters.length > 240) return null;
  return { title, status, dayDate, sortOrder: sortOrder ?? 0, whyItMatters };
}

function parseTripTaskUpdateInput(body: Record<string, unknown> | null): TripTaskUpdateInput | null {
  if (!body) return null;
  const next: TripTaskUpdateInput = {};
  let hasAnyField = false;

  if ('status' in body) {
    const rawStatus = trimString(body.status);
    if (rawStatus !== 'pending' && rawStatus !== 'done') return null;
    next.status = rawStatus;
    hasAnyField = true;
  }

  if ('dayDate' in body) {
    if (body.dayDate === null) {
      next.dayDate = null;
    } else {
      const dayDate = normalizeDayDate(trimString(body.dayDate));
      if (!dayDate) return null;
      next.dayDate = dayDate;
    }
    hasAnyField = true;
  }

  if ('sortOrder' in body) {
    if (body.sortOrder === null) {
      next.sortOrder = null;
    } else {
      const sortOrder = parseNonNegativeInteger(body.sortOrder);
      if (sortOrder === null) return null;
      next.sortOrder = sortOrder;
    }
    hasAnyField = true;
  }

  if ('whyItMatters' in body) {
    const whyItMatters = trimString(body.whyItMatters);
    if (whyItMatters && whyItMatters.length > 240) return null;
    next.whyItMatters = whyItMatters;
    hasAnyField = true;
  }

  return hasAnyField ? next : null;
}

function parseTripItemUpdateInput(body: Record<string, unknown> | null): TripItemUpdateInput | null {
  if (!body) return null;
  const next: TripItemUpdateInput = {};
  let hasAnyField = false;

  if ('title' in body) {
    const title = trimString(body.title);
    if (!title || title.length > 160) return null;
    next.title = title;
    hasAnyField = true;
  }

  if ('note' in body) {
    const note = trimString(body.note);
    if (note && note.length > 400) return null;
    next.note = note;
    hasAnyField = true;
  }

  if ('category' in body) {
    const category = trimString(body.category);
    if (category && category.length > 40) return null;
    next.category = category;
    hasAnyField = true;
  }

  if ('pinned' in body) {
    const pinned = parseBooleanField(body.pinned);
    if (pinned === null) return null;
    next.pinned = pinned;
    hasAnyField = true;
  }

  if ('dayDate' in body) {
    if (body.dayDate === null) {
      next.dayDate = null;
    } else {
      const dayDate = normalizeDayDate(trimString(body.dayDate));
      if (!dayDate) return null;
      next.dayDate = dayDate;
    }
    hasAnyField = true;
  }

  if ('status' in body) {
    const rawStatus = trimString(body.status);
    if (rawStatus !== 'planned' && rawStatus !== 'booked' && rawStatus !== 'done') return null;
    next.status = rawStatus;
    hasAnyField = true;
  }

  return hasAnyField ? next : null;
}

function parseTripUpdateInput(body: Record<string, unknown> | null): TripUpdateInput | null {
  if (!body) return null;
  const next: TripUpdateInput = {};
  let hasAnyField = false;

  if ('title' in body) {
    const title = trimString(body.title);
    if (!title || title.length > 120) return null;
    next.title = title;
    hasAnyField = true;
  }

  if ('destinationLabel' in body) {
    const destinationLabel = trimString(body.destinationLabel);
    if (destinationLabel && destinationLabel.length > 120) return null;
    next.destinationLabel = destinationLabel;
    hasAnyField = true;
  }

  if ('summary' in body) {
    const summary = trimString(body.summary);
    if (summary && summary.length > 400) return null;
    next.summary = summary;
    hasAnyField = true;
  }

  if ('status' in body) {
    const rawStatus = trimString(body.status);
    if (rawStatus !== 'draft' && rawStatus !== 'active' && rawStatus !== 'completed' && rawStatus !== 'archived') {
      return null;
    }
    next.status = rawStatus;
    hasAnyField = true;
  }

  if ('startDate' in body) {
    const rawStart = body.startDate;
    if (rawStart === null) {
      next.startDate = null;
    } else {
      const normalized = normalizeIsoDate(trimString(rawStart));
      if (!normalized) return null;
      next.startDate = normalized;
    }
    hasAnyField = true;
  }

  if ('endDate' in body) {
    const rawEnd = body.endDate;
    if (rawEnd === null) {
      next.endDate = null;
    } else {
      const normalized = normalizeIsoDate(trimString(rawEnd));
      if (!normalized) return null;
      next.endDate = normalized;
    }
    hasAnyField = true;
  }

  if ('datesConfidence' in body) {
    const datesConfidence = parseDatesConfidence(body.datesConfidence);
    if (datesConfidence === undefined) return null;
    next.datesConfidence = datesConfidence ?? null;
    hasAnyField = true;
  }

  if ('lifecycleOverride' in body) {
    const lifecycleOverride = parseLifecycleOverride(body.lifecycleOverride);
    if (lifecycleOverride === undefined) return null;
    next.lifecycleOverride = lifecycleOverride ?? null;
    hasAnyField = true;
  }

  const nextStart = next.startDate;
  const nextEnd = next.endDate;
  if (nextStart && nextEnd && nextStart > nextEnd) return null;

  return hasAnyField ? next : null;
}

function parseTripNoteCreateInput(body: Record<string, unknown> | null): TripNoteCreateInput | null {
  if (!body) return null;
  const bodyText = trimString(body.body);
  if (!bodyText || bodyText.length > 1200) return null;
  const dayDateRaw = trimString(body.dayDate);
  const dayDate = dayDateRaw ? normalizeDayDate(dayDateRaw) : null;
  if (dayDateRaw && !dayDate) return null;
  const noteType = trimString(body.noteType);
  if (noteType && noteType.length > 40) return null;
  return { body: bodyText, dayDate, noteType };
}

function parseTripItemNoteCreateInput(body: Record<string, unknown> | null): TripItemNoteCreateInput | null {
  if (!body) return null;
  const bodyText = trimString(body.body);
  if (!bodyText || bodyText.length > 800) return null;
  const sortOrder = parseNonNegativeInteger(body.sortOrder);
  if (body.sortOrder !== undefined && sortOrder === null) return null;
  return {
    body: bodyText,
    sortOrder: sortOrder ?? 0,
  };
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
    datesConfidence: parsed.datesConfidence,
    lifecycleOverride: parsed.lifecycleOverride,
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

  const [items, tasks, notes, days, itemNotes] = await Promise.all([
    listTripItems(tripResult.db, tripId, principal.userId),
    listTripTasks(tripResult.db, tripId, principal.userId),
    listTripNotes(tripResult.db, tripId, principal.userId),
    listTripDays(tripResult.db, tripId, principal.userId),
    listTripItemNotesByTrip(tripResult.db, tripId, principal.userId),
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
    days: days.map(normalizeTripDay),
    itemNotes: itemNotes.map(normalizeTripItemNote),
    insight: {
      whatMattersNow,
    },
  });
}

export async function patchTrip(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const parsed = parseTripUpdateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip update payload', requestId, 400);
  }

  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const currentStart = tripResult.trip.start_date ? new Date(tripResult.trip.start_date).toISOString() : null;
  const currentEnd = tripResult.trip.end_date ? new Date(tripResult.trip.end_date).toISOString() : null;
  const nextStart = Object.prototype.hasOwnProperty.call(parsed, 'startDate') ? parsed.startDate ?? null : currentStart;
  const nextEnd = Object.prototype.hasOwnProperty.call(parsed, 'endDate') ? parsed.endDate ?? null : currentEnd;
  if (nextStart && nextEnd && nextStart > nextEnd) {
    return errorResponse('VALIDATION_ERROR', 'Trip dates are out of order', requestId, 400);
  }

  const updated = await updateTripByIdForUser(tripResult.db, {
    tripId,
    userId: principal.userId,
    hasTitle: Object.prototype.hasOwnProperty.call(parsed, 'title'),
    title: parsed.title,
    hasDestinationLabel: Object.prototype.hasOwnProperty.call(parsed, 'destinationLabel'),
    destinationLabel: parsed.destinationLabel,
    hasSummary: Object.prototype.hasOwnProperty.call(parsed, 'summary'),
    summary: parsed.summary,
    hasStatus: Object.prototype.hasOwnProperty.call(parsed, 'status'),
    status: parsed.status,
    hasStartDate: Object.prototype.hasOwnProperty.call(parsed, 'startDate'),
    startDate: parsed.startDate,
    hasEndDate: Object.prototype.hasOwnProperty.call(parsed, 'endDate'),
    endDate: parsed.endDate,
    hasDatesConfidence: Object.prototype.hasOwnProperty.call(parsed, 'datesConfidence'),
    datesConfidence: parsed.datesConfidence,
    hasLifecycleOverride: Object.prototype.hasOwnProperty.call(parsed, 'lifecycleOverride'),
    lifecycleOverride: parsed.lifecycleOverride,
  });

  if (!updated) {
    return errorResponse('NOT_FOUND', 'Trip not found', requestId, 404);
  }

  return json({ trip: normalizeTripDetailRow(updated) });
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

  if (parsed.sourceModule && parsed.sourceEntityType && parsed.sourceEntityId) {
    const existing = await getTripItemBySourceRef(tripResult.db, {
      tripId,
      userId: principal.userId,
      sourceModule: parsed.sourceModule,
      sourceEntityType: parsed.sourceEntityType,
      sourceEntityId: parsed.sourceEntityId,
    });
    if (existing) {
      return json({ item: normalizeTripItem(existing), applied: false });
    }
  }

  const created = await insertTripItem(tripResult.db, {
    id: `titem_${crypto.randomUUID()}`,
    tripId,
    userId: principal.userId,
    title: parsed.title,
    note: parsed.note,
    category: parsed.category,
    pinned: parsed.pinned,
    dayDate: parsed.dayDate,
    sourceModule: parsed.sourceModule,
    sourceEntityType: parsed.sourceEntityType,
    sourceEntityId: parsed.sourceEntityId,
    status: parsed.status,
  });

  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip item', requestId, 500);
  }

  return json({ item: normalizeTripItem(created), applied: true }, 201);
}

export async function removeTripItem(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  itemId: string,
  requestId: string
): Promise<Response> {
  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const removed = await deleteTripItemByIdForUser(tripResult.db, {
    tripId,
    itemId,
    userId: principal.userId,
  });

  if (!removed) {
    return errorResponse('NOT_FOUND', 'Trip item not found', requestId, 404);
  }

  return json({
    removed: true,
    tripId,
    itemId,
  });
}

export async function patchTripItem(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  itemId: string,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const parsed = parseTripItemUpdateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip item update payload', requestId, 400);
  }

  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const updated = await updateTripItemByIdForUser(tripResult.db, {
    tripId,
    itemId,
    userId: principal.userId,
    hasTitle: Object.prototype.hasOwnProperty.call(parsed, 'title'),
    title: parsed.title,
    hasNote: Object.prototype.hasOwnProperty.call(parsed, 'note'),
    note: parsed.note,
    hasCategory: Object.prototype.hasOwnProperty.call(parsed, 'category'),
    category: parsed.category,
    hasPinned: Object.prototype.hasOwnProperty.call(parsed, 'pinned'),
    pinned: parsed.pinned,
    hasDayDate: Object.prototype.hasOwnProperty.call(parsed, 'dayDate'),
    dayDate: parsed.dayDate,
    hasStatus: Object.prototype.hasOwnProperty.call(parsed, 'status'),
    status: parsed.status,
  });

  if (!updated) {
    return errorResponse('NOT_FOUND', 'Trip item not found', requestId, 404);
  }

  return json({ item: normalizeTripItem(updated) });
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
    dayDate: parsed.dayDate,
    sortOrder: parsed.sortOrder,
    whyItMatters: parsed.whyItMatters,
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

  const updated = await updateTripTaskByIdForUser(tripResult.db, {
    tripId,
    taskId,
    userId: principal.userId,
    hasStatus: Object.prototype.hasOwnProperty.call(parsed, 'status'),
    status: parsed.status,
    hasDayDate: Object.prototype.hasOwnProperty.call(parsed, 'dayDate'),
    dayDate: parsed.dayDate,
    hasSortOrder: Object.prototype.hasOwnProperty.call(parsed, 'sortOrder'),
    sortOrder: parsed.sortOrder,
    hasWhyItMatters: Object.prototype.hasOwnProperty.call(parsed, 'whyItMatters'),
    whyItMatters: parsed.whyItMatters,
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
    dayDate: parsed.dayDate,
    noteType: parsed.noteType,
  });

  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip note', requestId, 500);
  }

  return json({ note: normalizeTripNote(created) }, 201);
}

export async function createTripItemNote(
  env: Env,
  principal: GatewayPrincipal,
  tripId: string,
  itemId: string,
  body: Record<string, unknown> | null,
  requestId: string
): Promise<Response> {
  const parsed = parseTripItemNoteCreateInput(body);
  if (!parsed) {
    return errorResponse('VALIDATION_ERROR', 'Invalid trip item note payload', requestId, 400);
  }

  const tripResult = await ensureTripOwned(env, principal, tripId, requestId);
  if (!tripResult.ok) return tripResult.response;

  const item = await getTripItemByIdForUser(tripResult.db, {
    tripId,
    itemId,
    userId: principal.userId,
  });
  if (!item) {
    return errorResponse('NOT_FOUND', 'Trip item not found', requestId, 404);
  }

  const created = await insertTripItemNote(tripResult.db, {
    id: `tinote_${crypto.randomUUID()}`,
    itemId,
    tripId,
    userId: principal.userId,
    body: parsed.body,
    sortOrder: parsed.sortOrder,
  });

  if (!created) {
    return errorResponse('INTERNAL_ERROR', 'Failed to create trip item note', requestId, 500);
  }

  return json({ itemNote: normalizeTripItemNote(created) }, 201);
}

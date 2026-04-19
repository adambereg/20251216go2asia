import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

type DbExecutor = Pick<Db, 'execute'>;

export type OrganizerTripStatus = 'draft' | 'active' | 'completed' | 'archived';
export type OrganizerTripItemStatus = 'planned' | 'booked' | 'done';
export type OrganizerTripTaskStatus = 'pending' | 'done';
export type OrganizerTripDatesConfidence = 'none' | 'rough' | 'confirmed';
export type OrganizerTripLifecycleMode = 'preparation' | 'in_trip' | 'post_trip';

export type TripRow = {
  id: string;
  user_id: string;
  title: string;
  destination_label: string | null;
  summary: string | null;
  status: OrganizerTripStatus;
  start_date: string | Date | null;
  end_date: string | Date | null;
  dates_confidence: OrganizerTripDatesConfidence | null;
  lifecycle_override: OrganizerTripLifecycleMode | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type TripSummaryRow = TripRow & {
  item_count: number;
  booked_item_count: number;
  pinned_item_count: number;
  linked_item_count: number;
  pending_task_count: number;
  first_pending_task_title: string | null;
  note_count: number;
  day_count: number;
};

export type TripItemRow = {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  note: string | null;
  category: string | null;
  pinned: boolean;
  day_date: string | Date | null;
  source_module: string | null;
  source_entity_type: string | null;
  source_entity_id: string | null;
  status: OrganizerTripItemStatus;
  created_at: string | Date;
  updated_at: string | Date;
};

export type TripTaskRow = {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  status: OrganizerTripTaskStatus;
  day_date: string | Date | null;
  sort_order: number;
  why_it_matters: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  completed_at: string | Date | null;
};

export type TripNoteRow = {
  id: string;
  trip_id: string;
  user_id: string;
  body: string;
  day_date: string | Date | null;
  note_type: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type TripDayRow = {
  id: string;
  trip_id: string;
  user_id: string;
  day_date: string | Date;
  theme: string | null;
  focus: string | null;
  planned_highlights: string | null;
  sort_order: number;
  created_at: string | Date;
  updated_at: string | Date;
};

export type TripItemNoteRow = {
  id: string;
  item_id: string;
  trip_id: string;
  user_id: string;
  body: string;
  sort_order: number;
  created_at: string | Date;
  updated_at: string | Date;
};

function rowsOf<T>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

export async function listTripsByUser(db: DbExecutor, userId: string): Promise<TripSummaryRow[]> {
  const result = await db.execute(sql`
    SELECT
      t.id,
      t.user_id,
      t.title,
      t.destination_label,
      t.summary,
      t.status,
      t.start_date,
      t.end_date,
      t.dates_confidence,
      t.lifecycle_override,
      t.created_at,
      t.updated_at,
      COALESCE(items.item_count, 0)::int AS item_count,
      COALESCE(items.booked_item_count, 0)::int AS booked_item_count,
      COALESCE(items.pinned_item_count, 0)::int AS pinned_item_count,
      COALESCE(items.linked_item_count, 0)::int AS linked_item_count,
      COALESCE(tasks.pending_task_count, 0)::int AS pending_task_count,
      tasks.first_pending_task_title,
      COALESCE(notes.note_count, 0)::int AS note_count,
      COALESCE(days.day_count, 0)::int AS day_count
    FROM organizer_trip t
    LEFT JOIN (
      SELECT
        trip_id,
        COUNT(*)::int AS item_count,
        COUNT(*) FILTER (WHERE status = 'booked')::int AS booked_item_count,
        COUNT(*) FILTER (WHERE pinned = true)::int AS pinned_item_count,
        COUNT(*) FILTER (
          WHERE source_module IS NOT NULL
            AND source_entity_type IS NOT NULL
            AND source_entity_id IS NOT NULL
        )::int AS linked_item_count
      FROM organizer_trip_item
      WHERE user_id = ${userId}
      GROUP BY trip_id
    ) items ON items.trip_id = t.id
    LEFT JOIN (
      SELECT
        trip_id,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_task_count,
        (
          ARRAY_AGG(title ORDER BY sort_order ASC, day_date ASC NULLS LAST, created_at ASC, id ASC)
          FILTER (WHERE status = 'pending')
        )[1] AS first_pending_task_title
      FROM organizer_trip_task
      WHERE user_id = ${userId}
      GROUP BY trip_id
    ) tasks ON tasks.trip_id = t.id
    LEFT JOIN (
      SELECT trip_id, COUNT(*)::int AS note_count
      FROM organizer_trip_note
      WHERE user_id = ${userId}
      GROUP BY trip_id
    ) notes ON notes.trip_id = t.id
    LEFT JOIN (
      SELECT trip_id, COUNT(*)::int AS day_count
      FROM organizer_trip_day
      WHERE user_id = ${userId}
      GROUP BY trip_id
    ) days ON days.trip_id = t.id
    WHERE t.user_id = ${userId}
    ORDER BY t.created_at DESC, t.id DESC
  `);
  return rowsOf<TripSummaryRow>(result);
}

export async function getTripByIdForUser(db: DbExecutor, tripId: string, userId: string): Promise<TripRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      user_id,
      title,
      destination_label,
      summary,
      status,
      start_date,
      end_date,
      dates_confidence,
      lifecycle_override,
      created_at,
      updated_at
    FROM organizer_trip
    WHERE id = ${tripId}
      AND user_id = ${userId}
    LIMIT 1
  `);
  return rowsOf<TripRow>(result)[0] ?? null;
}

export async function insertTrip(
  db: DbExecutor,
  input: {
    id: string;
    userId: string;
    title: string;
    destinationLabel: string | null;
    summary: string | null;
    status: OrganizerTripStatus;
    startDate: string | null;
    endDate: string | null;
    datesConfidence: OrganizerTripDatesConfidence | null;
    lifecycleOverride: OrganizerTripLifecycleMode | null;
  }
): Promise<TripRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip (
      id,
      user_id,
      title,
      destination_label,
      summary,
      status,
      start_date,
      end_date,
      dates_confidence,
      lifecycle_override,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.userId},
      ${input.title},
      ${input.destinationLabel},
      ${input.summary},
      ${input.status},
      ${input.startDate},
      ${input.endDate},
      ${input.datesConfidence},
      ${input.lifecycleOverride},
      now(),
      now()
    )
    RETURNING
      id,
      user_id,
      title,
      destination_label,
      summary,
      status,
      start_date,
      end_date,
      dates_confidence,
      lifecycle_override,
      created_at,
      updated_at
  `);
  return rowsOf<TripRow>(result)[0] ?? null;
}

export async function updateTripByIdForUser(
  db: DbExecutor,
  input: {
    tripId: string;
    userId: string;
    hasTitle: boolean;
    title?: string | null;
    hasDestinationLabel: boolean;
    destinationLabel?: string | null;
    hasSummary: boolean;
    summary?: string | null;
    hasStatus: boolean;
    status?: OrganizerTripStatus;
    hasStartDate: boolean;
    startDate?: string | null;
    hasEndDate: boolean;
    endDate?: string | null;
    hasDatesConfidence: boolean;
    datesConfidence?: OrganizerTripDatesConfidence | null;
    hasLifecycleOverride: boolean;
    lifecycleOverride?: OrganizerTripLifecycleMode | null;
  }
): Promise<TripRow | null> {
  const result = await db.execute(sql`
    UPDATE organizer_trip
    SET
      title = CASE
        WHEN ${input.hasTitle} THEN COALESCE(${input.title}, title)
        ELSE title
      END,
      destination_label = CASE
        WHEN ${input.hasDestinationLabel} THEN ${input.destinationLabel}
        ELSE destination_label
      END,
      summary = CASE
        WHEN ${input.hasSummary} THEN ${input.summary}
        ELSE summary
      END,
      status = CASE
        WHEN ${input.hasStatus} THEN COALESCE(${input.status}, status)
        ELSE status
      END,
      start_date = CASE
        WHEN ${input.hasStartDate} THEN ${input.startDate}
        ELSE start_date
      END,
      end_date = CASE
        WHEN ${input.hasEndDate} THEN ${input.endDate}
        ELSE end_date
      END,
      dates_confidence = CASE
        WHEN ${input.hasDatesConfidence} THEN ${input.datesConfidence}
        ELSE dates_confidence
      END,
      lifecycle_override = CASE
        WHEN ${input.hasLifecycleOverride} THEN ${input.lifecycleOverride}
        ELSE lifecycle_override
      END,
      updated_at = now()
    WHERE id = ${input.tripId}
      AND user_id = ${input.userId}
    RETURNING
      id,
      user_id,
      title,
      destination_label,
      summary,
      status,
      start_date,
      end_date,
      dates_confidence,
      lifecycle_override,
      created_at,
      updated_at
  `);
  return rowsOf<TripRow>(result)[0] ?? null;
}

export async function listTripItems(db: DbExecutor, tripId: string, userId: string): Promise<TripItemRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      trip_id,
      user_id,
      title,
      note,
      category,
      pinned,
      day_date,
      source_module,
      source_entity_type,
      source_entity_id,
      status,
      created_at,
      updated_at
    FROM organizer_trip_item
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY pinned DESC, day_date ASC NULLS LAST, created_at ASC, id ASC
  `);
  return rowsOf<TripItemRow>(result);
}

export async function getTripItemByIdForUser(
  db: DbExecutor,
  input: {
    tripId: string;
    itemId: string;
    userId: string;
  }
): Promise<TripItemRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      trip_id,
      user_id,
      title,
      note,
      category,
      pinned,
      day_date,
      source_module,
      source_entity_type,
      source_entity_id,
      status,
      created_at,
      updated_at
    FROM organizer_trip_item
    WHERE id = ${input.itemId}
      AND trip_id = ${input.tripId}
      AND user_id = ${input.userId}
    LIMIT 1
  `);
  return rowsOf<TripItemRow>(result)[0] ?? null;
}

export async function insertTripItem(
  db: DbExecutor,
  input: {
    id: string;
    tripId: string;
    userId: string;
    title: string;
    note: string | null;
    category: string | null;
    pinned: boolean;
    dayDate: string | null;
    sourceModule: string | null;
    sourceEntityType: string | null;
    sourceEntityId: string | null;
    status: OrganizerTripItemStatus;
  }
): Promise<TripItemRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip_item (
      id,
      trip_id,
      user_id,
      title,
      note,
      category,
      pinned,
      day_date,
      source_module,
      source_entity_type,
      source_entity_id,
      status,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.tripId},
      ${input.userId},
      ${input.title},
      ${input.note},
      ${input.category},
      ${input.pinned},
      ${input.dayDate},
      ${input.sourceModule},
      ${input.sourceEntityType},
      ${input.sourceEntityId},
      ${input.status},
      now(),
      now()
    )
    RETURNING
      id,
      trip_id,
      user_id,
      title,
      note,
      category,
      pinned,
      day_date,
      source_module,
      source_entity_type,
      source_entity_id,
      status,
      created_at,
      updated_at
  `);
  return rowsOf<TripItemRow>(result)[0] ?? null;
}

export async function getTripItemBySourceRef(
  db: DbExecutor,
  input: {
    tripId: string;
    userId: string;
    sourceModule: string;
    sourceEntityType: string;
    sourceEntityId: string;
  }
): Promise<TripItemRow | null> {
  const result = await db.execute(sql`
    SELECT
      id,
      trip_id,
      user_id,
      title,
      note,
      category,
      pinned,
      day_date,
      source_module,
      source_entity_type,
      source_entity_id,
      status,
      created_at,
      updated_at
    FROM organizer_trip_item
    WHERE trip_id = ${input.tripId}
      AND user_id = ${input.userId}
      AND source_module = ${input.sourceModule}
      AND source_entity_type = ${input.sourceEntityType}
      AND source_entity_id = ${input.sourceEntityId}
    LIMIT 1
  `);
  return rowsOf<TripItemRow>(result)[0] ?? null;
}

export async function deleteTripItemByIdForUser(
  db: DbExecutor,
  input: {
    tripId: string;
    itemId: string;
    userId: string;
  }
): Promise<boolean> {
  const result = await db.execute(sql`
    DELETE FROM organizer_trip_item
    WHERE id = ${input.itemId}
      AND trip_id = ${input.tripId}
      AND user_id = ${input.userId}
    RETURNING id
  `);
  return rowsOf<{ id: string }>(result).length > 0;
}

export async function updateTripItemByIdForUser(
  db: DbExecutor,
  input: {
    tripId: string;
    itemId: string;
    userId: string;
    hasTitle: boolean;
    title?: string | null;
    hasNote: boolean;
    note?: string | null;
    hasCategory: boolean;
    category?: string | null;
    hasPinned: boolean;
    pinned?: boolean;
    hasDayDate: boolean;
    dayDate?: string | null;
    hasStatus: boolean;
    status?: OrganizerTripItemStatus;
  }
): Promise<TripItemRow | null> {
  const result = await db.execute(sql`
    UPDATE organizer_trip_item
    SET
      title = CASE
        WHEN ${input.hasTitle} THEN COALESCE(${input.title}, title)
        ELSE title
      END,
      note = CASE
        WHEN ${input.hasNote} THEN ${input.note}
        ELSE note
      END,
      category = CASE
        WHEN ${input.hasCategory} THEN ${input.category}
        ELSE category
      END,
      pinned = CASE
        WHEN ${input.hasPinned} THEN COALESCE(${input.pinned}, pinned)
        ELSE pinned
      END,
      day_date = CASE
        WHEN ${input.hasDayDate} THEN ${input.dayDate}
        ELSE day_date
      END,
      status = CASE
        WHEN ${input.hasStatus} THEN COALESCE(${input.status}, status)
        ELSE status
      END,
      updated_at = now()
    WHERE id = ${input.itemId}
      AND trip_id = ${input.tripId}
      AND user_id = ${input.userId}
    RETURNING
      id,
      trip_id,
      user_id,
      title,
      note,
      category,
      pinned,
      day_date,
      source_module,
      source_entity_type,
      source_entity_id,
      status,
      created_at,
      updated_at
  `);
  return rowsOf<TripItemRow>(result)[0] ?? null;
}

export async function listTripTasks(db: DbExecutor, tripId: string, userId: string): Promise<TripTaskRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      trip_id,
      user_id,
      title,
      status,
      day_date,
      sort_order,
      why_it_matters,
      created_at,
      updated_at,
      completed_at
    FROM organizer_trip_task
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY
      CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
      sort_order ASC,
      day_date ASC NULLS LAST,
      created_at ASC,
      id ASC
  `);
  return rowsOf<TripTaskRow>(result);
}

export async function insertTripTask(
  db: DbExecutor,
  input: {
    id: string;
    tripId: string;
    userId: string;
    title: string;
    status: OrganizerTripTaskStatus;
    dayDate: string | null;
    sortOrder: number;
    whyItMatters: string | null;
  }
): Promise<TripTaskRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip_task (
      id,
      trip_id,
      user_id,
      title,
      status,
      day_date,
      sort_order,
      why_it_matters,
      created_at,
      updated_at,
      completed_at
    )
    VALUES (
      ${input.id},
      ${input.tripId},
      ${input.userId},
      ${input.title},
      ${input.status},
      ${input.dayDate},
      ${input.sortOrder},
      ${input.whyItMatters},
      now(),
      now(),
      ${input.status === 'done' ? sql`now()` : null}
    )
    RETURNING
      id,
      trip_id,
      user_id,
      title,
      status,
      day_date,
      sort_order,
      why_it_matters,
      created_at,
      updated_at,
      completed_at
  `);
  return rowsOf<TripTaskRow>(result)[0] ?? null;
}

export async function updateTripTaskByIdForUser(
  db: DbExecutor,
  input: {
    tripId: string;
    taskId: string;
    userId: string;
    hasStatus: boolean;
    status?: OrganizerTripTaskStatus;
    hasDayDate: boolean;
    dayDate?: string | null;
    hasSortOrder: boolean;
    sortOrder?: number | null;
    hasWhyItMatters: boolean;
    whyItMatters?: string | null;
  }
): Promise<TripTaskRow | null> {
  const result = await db.execute(sql`
    UPDATE organizer_trip_task
    SET
      status = CASE
        WHEN ${input.hasStatus} THEN COALESCE(${input.status}, status)
        ELSE status
      END,
      day_date = CASE
        WHEN ${input.hasDayDate} THEN ${input.dayDate}
        ELSE day_date
      END,
      sort_order = CASE
        WHEN ${input.hasSortOrder} THEN COALESCE(${input.sortOrder}, sort_order)
        ELSE sort_order
      END,
      why_it_matters = CASE
        WHEN ${input.hasWhyItMatters} THEN ${input.whyItMatters}
        ELSE why_it_matters
      END,
      updated_at = now(),
      completed_at = CASE
        WHEN ${input.hasStatus} AND ${input.status} = 'done' THEN now()
        WHEN ${input.hasStatus} AND ${input.status} = 'pending' THEN NULL
        ELSE completed_at
      END
    WHERE id = ${input.taskId}
      AND trip_id = ${input.tripId}
      AND user_id = ${input.userId}
    RETURNING
      id,
      trip_id,
      user_id,
      title,
      status,
      day_date,
      sort_order,
      why_it_matters,
      created_at,
      updated_at,
      completed_at
  `);
  return rowsOf<TripTaskRow>(result)[0] ?? null;
}

export async function listTripNotes(db: DbExecutor, tripId: string, userId: string): Promise<TripNoteRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      trip_id,
      user_id,
      body,
      day_date,
      note_type,
      created_at,
      updated_at
    FROM organizer_trip_note
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY day_date ASC NULLS LAST, created_at DESC, id DESC
  `);
  return rowsOf<TripNoteRow>(result);
}

export async function insertTripNote(
  db: DbExecutor,
  input: {
    id: string;
    tripId: string;
    userId: string;
    body: string;
    dayDate: string | null;
    noteType: string | null;
  }
): Promise<TripNoteRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip_note (
      id,
      trip_id,
      user_id,
      body,
      day_date,
      note_type,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.tripId},
      ${input.userId},
      ${input.body},
      ${input.dayDate},
      ${input.noteType},
      now(),
      now()
    )
    RETURNING
      id,
      trip_id,
      user_id,
      body,
      day_date,
      note_type,
      created_at,
      updated_at
  `);
  return rowsOf<TripNoteRow>(result)[0] ?? null;
}

export async function listTripDays(db: DbExecutor, tripId: string, userId: string): Promise<TripDayRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      trip_id,
      user_id,
      day_date,
      theme,
      focus,
      planned_highlights,
      sort_order,
      created_at,
      updated_at
    FROM organizer_trip_day
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY sort_order ASC, day_date ASC, id ASC
  `);
  return rowsOf<TripDayRow>(result);
}

export async function insertTripDay(
  db: DbExecutor,
  input: {
    id: string;
    tripId: string;
    userId: string;
    dayDate: string;
    theme: string | null;
    focus: string | null;
    plannedHighlights: string | null;
    sortOrder: number;
  }
): Promise<TripDayRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip_day (
      id,
      trip_id,
      user_id,
      day_date,
      theme,
      focus,
      planned_highlights,
      sort_order,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.tripId},
      ${input.userId},
      ${input.dayDate},
      ${input.theme},
      ${input.focus},
      ${input.plannedHighlights},
      ${input.sortOrder},
      now(),
      now()
    )
    RETURNING
      id,
      trip_id,
      user_id,
      day_date,
      theme,
      focus,
      planned_highlights,
      sort_order,
      created_at,
      updated_at
  `);
  return rowsOf<TripDayRow>(result)[0] ?? null;
}

export async function listTripItemNotesByTrip(db: DbExecutor, tripId: string, userId: string): Promise<TripItemNoteRow[]> {
  const result = await db.execute(sql`
    SELECT
      id,
      item_id,
      trip_id,
      user_id,
      body,
      sort_order,
      created_at,
      updated_at
    FROM organizer_trip_item_note
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY sort_order ASC, created_at ASC, id ASC
  `);
  return rowsOf<TripItemNoteRow>(result);
}

export async function insertTripItemNote(
  db: DbExecutor,
  input: {
    id: string;
    itemId: string;
    tripId: string;
    userId: string;
    body: string;
    sortOrder: number;
  }
): Promise<TripItemNoteRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip_item_note (
      id,
      item_id,
      trip_id,
      user_id,
      body,
      sort_order,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.itemId},
      ${input.tripId},
      ${input.userId},
      ${input.body},
      ${input.sortOrder},
      now(),
      now()
    )
    RETURNING
      id,
      item_id,
      trip_id,
      user_id,
      body,
      sort_order,
      created_at,
      updated_at
  `);
  return rowsOf<TripItemNoteRow>(result)[0] ?? null;
}

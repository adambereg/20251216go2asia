import type { Db } from '@go2asia/db';
import { sql } from '@go2asia/db';

type DbExecutor = Pick<Db, 'execute'>;

export type OrganizerTripStatus = 'draft' | 'active' | 'completed' | 'archived';
export type OrganizerTripItemStatus = 'planned' | 'booked' | 'done';
export type OrganizerTripTaskStatus = 'pending' | 'done';

export type TripRow = {
  id: string;
  user_id: string;
  title: string;
  destination_label: string | null;
  summary: string | null;
  status: OrganizerTripStatus;
  start_date: string | Date | null;
  end_date: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

export type TripSummaryRow = TripRow & {
  item_count: number;
  pending_task_count: number;
  note_count: number;
};

export type TripItemRow = {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  note: string | null;
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
  created_at: string | Date;
  updated_at: string | Date;
  completed_at: string | Date | null;
};

export type TripNoteRow = {
  id: string;
  trip_id: string;
  user_id: string;
  body: string;
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
      t.created_at,
      t.updated_at,
      COALESCE(items.item_count, 0)::int AS item_count,
      COALESCE(tasks.pending_task_count, 0)::int AS pending_task_count,
      COALESCE(notes.note_count, 0)::int AS note_count
    FROM organizer_trip t
    LEFT JOIN (
      SELECT trip_id, COUNT(*)::int AS item_count
      FROM organizer_trip_item
      WHERE user_id = ${userId}
      GROUP BY trip_id
    ) items ON items.trip_id = t.id
    LEFT JOIN (
      SELECT trip_id, COUNT(*)::int AS pending_task_count
      FROM organizer_trip_task
      WHERE user_id = ${userId}
        AND status = 'pending'
      GROUP BY trip_id
    ) tasks ON tasks.trip_id = t.id
    LEFT JOIN (
      SELECT trip_id, COUNT(*)::int AS note_count
      FROM organizer_trip_note
      WHERE user_id = ${userId}
      GROUP BY trip_id
    ) notes ON notes.trip_id = t.id
    WHERE t.user_id = ${userId}
    ORDER BY t.created_at DESC, t.id DESC
  `);
  return rowsOf<TripSummaryRow>(result);
}

export async function getTripByIdForUser(db: DbExecutor, tripId: string, userId: string): Promise<TripRow | null> {
  const result = await db.execute(sql`
    SELECT id, user_id, title, destination_label, summary, status, start_date, end_date, created_at, updated_at
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
      now(),
      now()
    )
    RETURNING id, user_id, title, destination_label, summary, status, start_date, end_date, created_at, updated_at
  `);
  return rowsOf<TripRow>(result)[0] ?? null;
}

export async function listTripItems(db: DbExecutor, tripId: string, userId: string): Promise<TripItemRow[]> {
  const result = await db.execute(sql`
    SELECT id, trip_id, user_id, title, note, source_module, source_entity_type, source_entity_id, status, created_at, updated_at
    FROM organizer_trip_item
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY created_at DESC, id DESC
  `);
  return rowsOf<TripItemRow>(result);
}

export async function insertTripItem(
  db: DbExecutor,
  input: {
    id: string;
    tripId: string;
    userId: string;
    title: string;
    note: string | null;
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
      ${input.sourceModule},
      ${input.sourceEntityType},
      ${input.sourceEntityId},
      ${input.status},
      now(),
      now()
    )
    RETURNING id, trip_id, user_id, title, note, source_module, source_entity_type, source_entity_id, status, created_at, updated_at
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
    SELECT id, trip_id, user_id, title, note, source_module, source_entity_type, source_entity_id, status, created_at, updated_at
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

export async function listTripTasks(db: DbExecutor, tripId: string, userId: string): Promise<TripTaskRow[]> {
  const result = await db.execute(sql`
    SELECT id, trip_id, user_id, title, status, created_at, updated_at, completed_at
    FROM organizer_trip_task
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY
      CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
      created_at DESC,
      id DESC
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
  }
): Promise<TripTaskRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip_task (
      id,
      trip_id,
      user_id,
      title,
      status,
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
      now(),
      now(),
      ${input.status === 'done' ? sql`now()` : null}
    )
    RETURNING id, trip_id, user_id, title, status, created_at, updated_at, completed_at
  `);
  return rowsOf<TripTaskRow>(result)[0] ?? null;
}

export async function updateTripTaskStatus(
  db: DbExecutor,
  input: {
    tripId: string;
    taskId: string;
    userId: string;
    status: OrganizerTripTaskStatus;
  }
): Promise<TripTaskRow | null> {
  const result = await db.execute(sql`
    UPDATE organizer_trip_task
    SET
      status = ${input.status},
      updated_at = now(),
      completed_at = CASE WHEN ${input.status} = 'done' THEN now() ELSE NULL END
    WHERE id = ${input.taskId}
      AND trip_id = ${input.tripId}
      AND user_id = ${input.userId}
    RETURNING id, trip_id, user_id, title, status, created_at, updated_at, completed_at
  `);
  return rowsOf<TripTaskRow>(result)[0] ?? null;
}

export async function listTripNotes(db: DbExecutor, tripId: string, userId: string): Promise<TripNoteRow[]> {
  const result = await db.execute(sql`
    SELECT id, trip_id, user_id, body, created_at, updated_at
    FROM organizer_trip_note
    WHERE trip_id = ${tripId}
      AND user_id = ${userId}
    ORDER BY created_at DESC, id DESC
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
  }
): Promise<TripNoteRow | null> {
  const result = await db.execute(sql`
    INSERT INTO organizer_trip_note (
      id,
      trip_id,
      user_id,
      body,
      created_at,
      updated_at
    )
    VALUES (
      ${input.id},
      ${input.tripId},
      ${input.userId},
      ${input.body},
      now(),
      now()
    )
    RETURNING id, trip_id, user_id, body, created_at, updated_at
  `);
  return rowsOf<TripNoteRow>(result)[0] ?? null;
}

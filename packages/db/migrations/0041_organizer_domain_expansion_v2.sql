DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organizer_trip_dates_confidence') THEN
    CREATE TYPE organizer_trip_dates_confidence AS ENUM ('none', 'rough', 'confirmed');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organizer_trip_lifecycle_mode') THEN
    CREATE TYPE organizer_trip_lifecycle_mode AS ENUM ('preparation', 'in_trip', 'post_trip');
  END IF;
END $$;

ALTER TABLE organizer_trip
  ADD COLUMN IF NOT EXISTS dates_confidence organizer_trip_dates_confidence,
  ADD COLUMN IF NOT EXISTS lifecycle_override organizer_trip_lifecycle_mode;

ALTER TABLE organizer_trip_item
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS day_date date;

ALTER TABLE organizer_trip_task
  ADD COLUMN IF NOT EXISTS day_date date,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS why_it_matters text;

ALTER TABLE organizer_trip_note
  ADD COLUMN IF NOT EXISTS day_date date,
  ADD COLUMN IF NOT EXISTS note_type text;

CREATE TABLE IF NOT EXISTS organizer_trip_day (
  id text PRIMARY KEY,
  trip_id text NOT NULL REFERENCES organizer_trip(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  day_date date NOT NULL,
  theme text,
  focus text,
  planned_highlights text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT organizer_trip_day_trip_date_unique UNIQUE (trip_id, day_date)
);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_day_trip_day_date
  ON organizer_trip_day(trip_id, day_date, sort_order, id);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_day_user_trip
  ON organizer_trip_day(user_id, trip_id, day_date);

CREATE TABLE IF NOT EXISTS organizer_trip_item_note (
  id text PRIMARY KEY,
  item_id text NOT NULL REFERENCES organizer_trip_item(id) ON DELETE CASCADE,
  trip_id text NOT NULL REFERENCES organizer_trip(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  body text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_item_note_item_sort
  ON organizer_trip_item_note(item_id, sort_order, created_at, id);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_item_note_trip_created
  ON organizer_trip_item_note(trip_id, created_at DESC, id DESC);

WITH ordered_tasks AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY trip_id ORDER BY created_at ASC, id ASC) * 10 AS next_sort_order
  FROM organizer_trip_task
)
UPDATE organizer_trip_task task
SET sort_order = ordered_tasks.next_sort_order
FROM ordered_tasks
WHERE task.id = ordered_tasks.id
  AND COALESCE(task.sort_order, 0) = 0;

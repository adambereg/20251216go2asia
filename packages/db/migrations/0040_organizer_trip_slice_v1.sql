DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organizer_trip_status') THEN
    CREATE TYPE organizer_trip_status AS ENUM ('draft', 'active', 'completed', 'archived');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organizer_trip_item_status') THEN
    CREATE TYPE organizer_trip_item_status AS ENUM ('planned', 'booked', 'done');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organizer_trip_task_status') THEN
    CREATE TYPE organizer_trip_task_status AS ENUM ('pending', 'done');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS organizer_trip (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  title text NOT NULL,
  destination_label text,
  summary text,
  status organizer_trip_status NOT NULL DEFAULT 'draft',
  start_date timestamp,
  end_date timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT organizer_trip_date_order_check
    CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_user_created_at
  ON organizer_trip(user_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_user_status
  ON organizer_trip(user_id, status);

CREATE TABLE IF NOT EXISTS organizer_trip_item (
  id text PRIMARY KEY,
  trip_id text NOT NULL REFERENCES organizer_trip(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  title text NOT NULL,
  note text,
  source_module text,
  source_entity_type text,
  source_entity_id text,
  status organizer_trip_item_status NOT NULL DEFAULT 'planned',
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_item_trip_created_at
  ON organizer_trip_item(trip_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_item_user_status
  ON organizer_trip_item(user_id, status);

CREATE TABLE IF NOT EXISTS organizer_trip_task (
  id text PRIMARY KEY,
  trip_id text NOT NULL REFERENCES organizer_trip(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  title text NOT NULL,
  status organizer_trip_task_status NOT NULL DEFAULT 'pending',
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  completed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_task_trip_created_at
  ON organizer_trip_task(trip_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_task_user_status
  ON organizer_trip_task(user_id, status);

CREATE TABLE IF NOT EXISTS organizer_trip_note (
  id text PRIMARY KEY,
  trip_id text NOT NULL REFERENCES organizer_trip(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  body text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_note_trip_created_at
  ON organizer_trip_note(trip_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_organizer_trip_note_user_created_at
  ON organizer_trip_note(user_id, created_at DESC, id DESC);

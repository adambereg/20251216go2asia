DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_type')
    AND NOT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'reaction_type'
        AND e.enumlabel = 'bookmark'
    ) THEN
    ALTER TYPE "reaction_type" ADD VALUE 'bookmark';
  END IF;
END $$;

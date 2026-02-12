CREATE TABLE IF NOT EXISTS "city_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_id" text NOT NULL,
	"alias_slug" varchar(255) NOT NULL,
	"city_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "city_aliases_country_alias_unique" UNIQUE("country_id","alias_slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"tab_key" text NOT NULL,
	"lang" text NOT NULL,
	"title" text,
	"body_markdown" text NOT NULL,
	"source" text DEFAULT 'seed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_blocks_unique" UNIQUE("entity_type","entity_id","tab_key","lang")
);
--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN IF NOT EXISTS "names" jsonb;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "place_kind" text DEFAULT 'showplace' NOT NULL;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "category" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "tags" jsonb;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "website" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "phone" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "instagram" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "price_level" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_city_aliases_alias_slug" ON "city_aliases" ("alias_slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_city_aliases_city_id" ON "city_aliases" ("city_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_blocks_entity" ON "content_blocks" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_blocks_tab_lang" ON "content_blocks" ("tab_key","lang");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "city_aliases" ADD CONSTRAINT "city_aliases_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "city_aliases" ADD CONSTRAINT "city_aliases_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

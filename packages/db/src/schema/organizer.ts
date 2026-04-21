import { boolean, check, date, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const organizerTripStatusEnum = pgEnum('organizer_trip_status', [
  'draft',
  'active',
  'completed',
  'archived',
]);

export const organizerTripItemStatusEnum = pgEnum('organizer_trip_item_status', [
  'planned',
  'booked',
  'done',
]);

export const organizerTripTaskStatusEnum = pgEnum('organizer_trip_task_status', ['pending', 'done']);
export const organizerTripDatesConfidenceEnum = pgEnum('organizer_trip_dates_confidence', ['none', 'rough', 'confirmed']);
export const organizerTripLifecycleModeEnum = pgEnum('organizer_trip_lifecycle_mode', [
  'preparation',
  'in_trip',
  'post_trip',
]);

export const organizerTrips = pgTable(
  'organizer_trip',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    destinationLabel: text('destination_label'),
    summary: text('summary'),
    status: organizerTripStatusEnum('status').notNull().default('draft'),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    datesConfidence: organizerTripDatesConfidenceEnum('dates_confidence'),
    lifecycleOverride: organizerTripLifecycleModeEnum('lifecycle_override'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tripDateOrderCheck: check(
      'organizer_trip_date_order_check',
      sql`(${table.startDate} IS NULL OR ${table.endDate} IS NULL OR ${table.startDate} <= ${table.endDate})`
    ),
    idxUserCreatedAt: index('idx_organizer_trip_user_created_at').on(table.userId, table.createdAt, table.id),
    idxUserStatus: index('idx_organizer_trip_user_status').on(table.userId, table.status),
  })
);

export const organizerTripItems = pgTable(
  'organizer_trip_item',
  {
    id: text('id').primaryKey(),
    tripId: text('trip_id')
      .notNull()
      .references(() => organizerTrips.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    note: text('note'),
    category: text('category'),
    pinned: boolean('pinned').notNull().default(false),
    dayDate: date('day_date'),
    sourceModule: text('source_module'),
    sourceEntityType: text('source_entity_type'),
    sourceEntityId: text('source_entity_id'),
    status: organizerTripItemStatusEnum('status').notNull().default('planned'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxTripCreatedAt: index('idx_organizer_trip_item_trip_created_at').on(table.tripId, table.createdAt, table.id),
    idxUserStatus: index('idx_organizer_trip_item_user_status').on(table.userId, table.status),
    idxTripDay: index('idx_organizer_trip_item_trip_day_date').on(table.tripId, table.dayDate, table.id),
  })
);

export const organizerTripTasks = pgTable(
  'organizer_trip_task',
  {
    id: text('id').primaryKey(),
    tripId: text('trip_id')
      .notNull()
      .references(() => organizerTrips.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    status: organizerTripTaskStatusEnum('status').notNull().default('pending'),
    dayDate: date('day_date'),
    sortOrder: integer('sort_order').notNull().default(0),
    whyItMatters: text('why_it_matters'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    idxTripCreatedAt: index('idx_organizer_trip_task_trip_created_at').on(table.tripId, table.createdAt, table.id),
    idxUserStatus: index('idx_organizer_trip_task_user_status').on(table.userId, table.status),
    idxTripDay: index('idx_organizer_trip_task_trip_day_date').on(table.tripId, table.dayDate, table.sortOrder, table.id),
  })
);

export const organizerTripNotes = pgTable(
  'organizer_trip_note',
  {
    id: text('id').primaryKey(),
    tripId: text('trip_id')
      .notNull()
      .references(() => organizerTrips.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    body: text('body').notNull(),
    dayDate: date('day_date'),
    noteType: text('note_type'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxTripCreatedAt: index('idx_organizer_trip_note_trip_created_at').on(table.tripId, table.createdAt, table.id),
    idxUserCreatedAt: index('idx_organizer_trip_note_user_created_at').on(table.userId, table.createdAt, table.id),
    idxTripDay: index('idx_organizer_trip_note_trip_day_date').on(table.tripId, table.dayDate, table.id),
  })
);

export const organizerTripDays = pgTable(
  'organizer_trip_day',
  {
    id: text('id').primaryKey(),
    tripId: text('trip_id')
      .notNull()
      .references(() => organizerTrips.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    dayDate: date('day_date').notNull(),
    theme: text('theme'),
    focus: text('focus'),
    plannedHighlights: text('planned_highlights'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    tripDateUnique: uniqueIndex('idx_organizer_trip_day_trip_date_unique').on(table.tripId, table.dayDate),
    idxTripDate: index('idx_organizer_trip_day_trip_day_date').on(table.tripId, table.dayDate, table.sortOrder, table.id),
    idxUserTrip: index('idx_organizer_trip_day_user_trip').on(table.userId, table.tripId, table.dayDate),
  })
);

export const organizerTripItemNotes = pgTable(
  'organizer_trip_item_note',
  {
    id: text('id').primaryKey(),
    itemId: text('item_id')
      .notNull()
      .references(() => organizerTripItems.id, { onDelete: 'cascade' }),
    tripId: text('trip_id')
      .notNull()
      .references(() => organizerTrips.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    body: text('body').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxItemSort: index('idx_organizer_trip_item_note_item_sort').on(table.itemId, table.sortOrder, table.createdAt, table.id),
    idxTripCreatedAt: index('idx_organizer_trip_item_note_trip_created').on(table.tripId, table.createdAt, table.id),
  })
);

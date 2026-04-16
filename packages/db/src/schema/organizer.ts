import { check, index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
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
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    idxTripCreatedAt: index('idx_organizer_trip_task_trip_created_at').on(table.tripId, table.createdAt, table.id),
    idxUserStatus: index('idx_organizer_trip_task_user_status').on(table.userId, table.status),
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
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    idxTripCreatedAt: index('idx_organizer_trip_note_trip_created_at').on(table.tripId, table.createdAt, table.id),
    idxUserCreatedAt: index('idx_organizer_trip_note_user_created_at').on(table.userId, table.createdAt, table.id),
  })
);

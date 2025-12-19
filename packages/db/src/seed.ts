/**
 * Seed data for Go2Asia MVP (staging only)
 *
 * Milestone 4: Pulse demo events
 * - Idempotent: re-run does not create duplicates
 * - Staging only: requires STAGING_DATABASE_URL (preferred) or DATABASE_URL with ENVIRONMENT=staging
 */

import { createDb } from './client';
import { events } from './schema/content';

type SeedEvent = typeof events.$inferInsert;

const DEMO_EVENTS: SeedEvent[] = [
  {
    id: 'e7f8b7d4-6f6a-4f1e-9aa0-2d4dbaac7b10',
    title: 'Pulse Demo: Bangkok Sunset Run',
    slug: 'pulse-demo-bangkok-sunset-run',
    description:
      'Демо-событие для проверки регистрации (staging). Беговой клуб на закате, дружелюбно к новичкам.',
    category: 'demo',
    startDate: new Date('2026-01-10T11:00:00.000Z'),
    endDate: new Date('2026-01-10T13:00:00.000Z'),
    location: 'Bangkok, Thailand',
    imageUrl: null,
    isActive: true,
  },
  {
    id: '5b531b8d-8c7a-4fe8-b389-62e2f8d1d8a3',
    title: 'Pulse Demo: Phuket Beach Meetup',
    slug: 'pulse-demo-phuket-beach-meetup',
    description:
      'Демо-событие для проверки регистрации (staging). Неформальная встреча на пляже.',
    category: 'demo',
    startDate: new Date('2026-01-17T09:00:00.000Z'),
    endDate: new Date('2026-01-17T11:00:00.000Z'),
    location: 'Phuket, Thailand',
    imageUrl: null,
    isActive: true,
  },
  {
    id: '0a4b18e5-3c2d-4a06-8c42-93a8a2c84b67',
    title: 'Pulse Demo: Chiang Mai Coffee Walk',
    slug: 'pulse-demo-chiang-mai-coffee-walk',
    description:
      'Демо-событие для проверки регистрации (staging). Прогулка по кофейням и знакомство.',
    category: 'demo',
    startDate: new Date('2026-01-24T08:00:00.000Z'),
    endDate: new Date('2026-01-24T10:00:00.000Z'),
    location: 'Chiang Mai, Thailand',
    imageUrl: null,
    isActive: true,
  },
];

function getDatabaseUrl(): string {
  const stagingUrl = process.env.STAGING_DATABASE_URL;
  if (stagingUrl) return stagingUrl;

  const dbUrl = process.env.DATABASE_URL;
  const env = process.env.ENVIRONMENT;

  if (dbUrl && env === 'staging') return dbUrl;

  throw new Error(
    [
      'Seed is allowed for STAGING only.',
      'Provide STAGING_DATABASE_URL (recommended), or DATABASE_URL with ENVIRONMENT=staging.',
    ].join(' ')
  );
}

async function seedPulseEvents() {
  const databaseUrl = getDatabaseUrl();
  const db = createDb(databaseUrl);

  // Idempotent seed (stable IDs): ON CONFLICT DO NOTHING
  await db.insert(events).values(DEMO_EVENTS).onConflictDoNothing();

  // Intentionally do NOT log DB URL or secrets.
  // Only print stable IDs for manual verification.
  // eslint-disable-next-line no-console
  console.log('✅ Seeded Pulse demo events (idempotent). Available event IDs:');
  for (const ev of DEMO_EVENTS) {
    // eslint-disable-next-line no-console
    console.log(`- ${ev.id} (${ev.title})`);
  }
}

seedPulseEvents().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Seed failed:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});

/**
 * Import bounded Organizer demo seed from markdown content pack.
 *
 * Safety:
 * - Applies only in non-production environments.
 * - Requires an explicit target user (`--user-id` or `--user-email`) for apply mode.
 * - Treats the markdown content pack as a demo/QA source, not runtime truth.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

type ImportMode = 'dry-run' | 'apply';

type Args = {
  mode: ImportMode;
  targetUserId: string | null;
  targetUserEmail: string | null;
  sourcePath: string;
};

type ParsedExample = {
  code: string;
  stateLabel: string;
  title: string;
  destination: string | null;
  purpose: string | null;
  itemsRaw: string | null;
  tasksRaw: string | null;
  notesRaw: string | null;
  whatMattersNow: string | null;
  nextStep: string | null;
};

type SeedTrip = {
  id: string;
  userId: string;
  title: string;
  destinationLabel: string | null;
  summary: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type SeedTripItem = {
  id: string;
  tripId: string;
  userId: string;
  title: string;
  note: string | null;
  status: 'planned' | 'booked' | 'done';
  sourceModule: string | null;
  sourceEntityType: string | null;
  sourceEntityId: string | null;
  createdAt: string;
  updatedAt: string;
};

type SeedTripTask = {
  id: string;
  tripId: string;
  userId: string;
  title: string;
  status: 'pending' | 'done';
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type SeedTripNote = {
  id: string;
  tripId: string;
  userId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type MaterializedSeed = {
  trips: SeedTrip[];
  items: SeedTripItem[];
  tasks: SeedTripTask[];
  notes: SeedTripNote[];
};

const DEFAULT_SOURCE_PATH = resolve(process.cwd(), '../../content/space/Personal-Organizer-Content-Pack-v1.md');

function parseArgs(argv: string[]): Args {
  let targetUserId: string | null = null;
  let targetUserEmail: string | null = null;
  let sourcePath = DEFAULT_SOURCE_PATH;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]!;
    if (arg === '--user-id') {
      targetUserId = argv[index + 1]?.trim() ?? null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--user-id=')) {
      targetUserId = arg.slice('--user-id='.length).trim() || null;
      continue;
    }
    if (arg === '--user-email') {
      targetUserEmail = argv[index + 1]?.trim().toLowerCase() ?? null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--user-email=')) {
      targetUserEmail = arg.slice('--user-email='.length).trim().toLowerCase() || null;
      continue;
    }
    if (arg === '--source') {
      sourcePath = resolve(process.cwd(), argv[index + 1] ?? sourcePath);
      index += 1;
      continue;
    }
    if (arg.startsWith('--source=')) {
      sourcePath = resolve(process.cwd(), arg.slice('--source='.length));
      continue;
    }
  }

  return {
    mode: argv.includes('--apply') ? 'apply' : 'dry-run',
    targetUserId,
    targetUserEmail,
    sourcePath,
  };
}

function getDatabaseUrl(mode: ImportMode): string | null {
  if (mode === 'dry-run') return null;
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run organizer seed with ENVIRONMENT=production');
  return url;
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function hashShort(input: string): string {
  return createHash('sha1').update(input).digest('hex').slice(0, 8);
}

function toNullableString(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function splitCsvLike(raw: string | null): string[] {
  const value = toNullableString(raw);
  if (!value || value.toLowerCase() === 'нет') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseExamples(markdown: string): ParsedExample[] {
  const headingPattern = /^Example ([A-Z]) — ([^\n]+)$/gm;
  const matches = Array.from(markdown.matchAll(headingPattern));
  if (matches.length === 0) {
    throw new Error('No organizer examples found in content pack');
  }

  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(start, end);
    const readField = (label: string) => {
      const field = block.match(new RegExp(`^${label}:\\s*(.+)$`, 'm'));
      return toNullableString(field?.[1] ?? null);
    };

    return {
      code: match[1]!,
      stateLabel: match[2]!.trim(),
      title: readField('Title') ?? `Organizer Example ${match[1]}`,
      destination: readField('Destination'),
      purpose: readField('Purpose'),
      itemsRaw: readField('Items'),
      tasksRaw: readField('Tasks'),
      notesRaw: readField('Notes'),
      whatMattersNow: readField('What matters now'),
      nextStep: readField('Next step'),
    };
  });
}

function buildStableTripId(targetUserId: string, code: string, title: string): string {
  return `seed_org_trip_${code.toLowerCase()}_${slugify(title)}_${hashShort(targetUserId)}`.slice(0, 120);
}

function buildStableChildId(prefix: string, tripId: string, ordinal: number): string {
  return `${prefix}_${tripId}_${String(ordinal + 1).padStart(2, '0')}`.slice(0, 160);
}

function atUtc(year: number, monthIndex: number, day: number, hour: number, minute: number): string {
  return new Date(Date.UTC(year, monthIndex, day, hour, minute, 0)).toISOString();
}

function makeNoteBodies(example: ParsedExample): string[] {
  const noteBodies: string[] = [];
  const primaryNote = toNullableString(example.notesRaw);
  if (primaryNote && primaryNote.toLowerCase() !== 'нет') {
    noteBodies.push(primaryNote);
  }

  if (example.code === 'C' && example.nextStep) {
    noteBodies.push(`Фокус поездки: ${example.nextStep}`);
  }
  if (example.code === 'D' && example.purpose) {
    noteBodies.push(`Цель поездки: ${example.purpose}`);
  }
  if (example.code === 'E') {
    noteBodies.push('Один свободный день лучше оставить без жёсткой программы.');
  }

  return noteBodies;
}

function materializeExample(
  example: ParsedExample,
  targetUserId: string,
  order: number
): { trip: SeedTrip; items: SeedTripItem[]; tasks: SeedTripTask[]; notes: SeedTripNote[] } {
  const tripId = buildStableTripId(targetUserId, example.code, example.title);
  const baseCreatedAt = atUtc(2026, 3, 10 + order, 9 + order, 0);
  const statusMap: Record<string, SeedTrip['status']> = {
    A: 'draft',
    B: 'draft',
    C: 'active',
    D: 'active',
    E: 'active',
  };

  const trip: SeedTrip = {
    id: tripId,
    userId: targetUserId,
    title: example.title,
    destinationLabel: example.destination,
    summary: example.purpose,
    status: statusMap[example.code] ?? 'draft',
    startDate: null,
    endDate: null,
    createdAt: baseCreatedAt,
    updatedAt: baseCreatedAt,
  };

  const items: SeedTripItem[] = [];
  const tasks: SeedTripTask[] = [];
  const notes: SeedTripNote[] = [];

  if (example.code === 'B') {
    const sourceItems = splitCsvLike(example.itemsRaw);
    sourceItems.forEach((title, index) => {
      items.push({
        id: buildStableChildId('seed_org_item', tripId, index),
        tripId,
        userId: targetUserId,
        title,
        note: index === 0 ? 'Пока без подтверждения района.' : 'Добавлено как ориентир из контент-пака.',
        status: 'planned',
        sourceModule: index === 1 ? 'space' : null,
        sourceEntityType: index === 1 ? 'space_post' : null,
        sourceEntityId: index === 1 ? 'seed_space_post_fukuok_market' : null,
        createdAt: atUtc(2026, 3, 11, 10, 10 + index),
        updatedAt: atUtc(2026, 3, 11, 10, 10 + index),
      });
    });
  }

  if (example.code === 'C') {
    const curatedItems: Array<Pick<SeedTripItem, 'title' | 'note' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'>> = [
      {
        title: 'Rooftop в Бангкоке',
        note: 'Хороший вариант для первого вечера.',
        status: 'planned',
        sourceModule: 'space',
        sourceEntityType: 'space_post',
        sourceEntityId: 'seed_space_post_bkk_rooftop',
      },
      {
        title: 'Кафе на Пхукете',
        note: 'Потенциальная точка для спокойного утра.',
        status: 'planned',
        sourceModule: 'space',
        sourceEntityType: 'space_post',
        sourceEntityId: 'seed_space_post_phuket_cafe',
      },
      {
        title: 'Отель в центре Бангкока',
        note: 'Нужна финальная проверка района.',
        status: 'booked',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Публикация про Sukhumvit',
        note: 'Используется как городской ориентир.',
        status: 'planned',
        sourceModule: 'space',
        sourceEntityType: 'space_post',
        sourceEntityId: 'seed_space_post_sukhumvit',
      },
    ];
    curatedItems.forEach((item, index) => {
      items.push({
        id: buildStableChildId('seed_org_item', tripId, index),
        tripId,
        userId: targetUserId,
        ...item,
        createdAt: atUtc(2026, 3, 12, 10, 10 + index),
        updatedAt: atUtc(2026, 3, 12, 10, 10 + index),
      });
    });
  }

  if (example.code === 'D') {
    const curatedItems: Array<Pick<SeedTripItem, 'title' | 'note' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'>> = [
      {
        title: 'Хошимин как первая точка входа',
        note: 'Пока основной кандидат на старт поездки.',
        status: 'planned',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Жильё в Дананге',
        note: 'Вариант для середины маршрута.',
        status: 'planned',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Городской квест на старт',
        note: 'Можно использовать как мягкий вход в поездку.',
        status: 'booked',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Ваучер на дорогу между городами',
        note: 'Пока в роли вспомогательного ориентира.',
        status: 'planned',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
    ];
    curatedItems.forEach((item, index) => {
      items.push({
        id: buildStableChildId('seed_org_item', tripId, index),
        tripId,
        userId: targetUserId,
        ...item,
        createdAt: atUtc(2026, 3, 13, 11, 10 + index),
        updatedAt: atUtc(2026, 3, 13, 11, 10 + index),
      });
    });
  }

  if (example.code === 'E') {
    const curatedItems: Array<Pick<SeedTripItem, 'title' | 'note' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'>> = [
      { title: 'Отель рядом с BTS', note: 'Базовое жильё уже подтверждено.', status: 'booked', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Встреча в центре', note: 'Нужно только подтвердить время.', status: 'planned', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Утреннее кафе в Phrom Phong', note: 'Локация уже проверена в прошлую поездку.', status: 'done', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Вечерний rooftop', note: 'Подходит для свободного вечера.', status: 'planned', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Свободный день без программы', note: 'Оставлен как резерв для спокойного ритма.', status: 'planned', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Район у реки для прогулки', note: 'Хороший спокойный вариант на финал.', status: 'booked', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
    ];
    curatedItems.forEach((item, index) => {
      items.push({
        id: buildStableChildId('seed_org_item', tripId, index),
        tripId,
        userId: targetUserId,
        ...item,
        createdAt: atUtc(2026, 3, 14, 12, 10 + index),
        updatedAt: atUtc(2026, 3, 14, 12, 10 + index),
      });
    });
  }

  if (
    example.code !== 'A' &&
    example.code !== 'B' &&
    example.code !== 'C' &&
    example.code !== 'D' &&
    example.code !== 'E'
  ) {
    splitCsvLike(example.itemsRaw).forEach((title, index) => {
      items.push({
        id: buildStableChildId('seed_org_item', tripId, index),
        tripId,
        userId: targetUserId,
        title,
        note: null,
        status: 'planned',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
        createdAt: atUtc(2026, 3, 11, 10, 20 + index),
        updatedAt: atUtc(2026, 3, 11, 10, 20 + index),
      });
    });
  }

  if (example.code === 'A') {
    // Empty trip stays empty by design.
  } else if (example.code === 'C') {
    [
      { title: 'Выбрать район в Бангкоке', status: 'pending' as const },
      { title: 'Решить трансфер между городом и морем', status: 'pending' as const },
    ].forEach((task, index) => {
      tasks.push({
        id: buildStableChildId('seed_org_task', tripId, index),
        tripId,
        userId: targetUserId,
        title: task.title,
        status: task.status,
        completedAt: null,
        createdAt: atUtc(2026, 3, 12, 14, 0 + index),
        updatedAt: atUtc(2026, 3, 12, 14, 0 + index),
      });
    });
  } else if (example.code === 'D') {
    [
      { title: 'Выбрать первый город', status: 'pending' as const },
      { title: 'Подтвердить первое жильё', status: 'pending' as const },
      { title: 'Продумать логистику между городами', status: 'pending' as const },
    ].forEach((task, index) => {
      tasks.push({
        id: buildStableChildId('seed_org_task', tripId, index),
        tripId,
        userId: targetUserId,
        title: task.title,
        status: task.status,
        completedAt: null,
        createdAt: atUtc(2026, 3, 13, 14, 0 + index),
        updatedAt: atUtc(2026, 3, 13, 14, 0 + index),
      });
    });
  } else if (example.code === 'E') {
    [
      { title: 'Подтвердить ближайшую встречу', status: 'pending' as const },
      { title: 'Проверить район для свободного дня', status: 'done' as const },
    ].forEach((task, index) => {
      const completedAt = task.status === 'done' ? atUtc(2026, 3, 14, 16, 30) : null;
      tasks.push({
        id: buildStableChildId('seed_org_task', tripId, index),
        tripId,
        userId: targetUserId,
        title: task.title,
        status: task.status,
        completedAt,
        createdAt: atUtc(2026, 3, 14, 15, 0 + index),
        updatedAt: completedAt ?? atUtc(2026, 3, 14, 15, 0 + index),
      });
    });
  } else {
    splitCsvLike(example.tasksRaw).forEach((title, index) => {
      tasks.push({
        id: buildStableChildId('seed_org_task', tripId, index),
        tripId,
        userId: targetUserId,
        title,
        status: 'pending',
        completedAt: null,
        createdAt: atUtc(2026, 3, 11 + order, 14, 0 + index),
        updatedAt: atUtc(2026, 3, 11 + order, 14, 0 + index),
      });
    });
  }

  makeNoteBodies(example).forEach((body, index) => {
    notes.push({
      id: buildStableChildId('seed_org_note', tripId, index),
      tripId,
      userId: targetUserId,
      body,
      createdAt: atUtc(2026, 3, 11 + order, 17, index * 5),
      updatedAt: atUtc(2026, 3, 11 + order, 17, index * 5),
    });
  });

  return { trip, items, tasks, notes };
}

function materializeSeed(examples: ParsedExample[], targetUserId: string): MaterializedSeed {
  const preferredOrder = ['C', 'D', 'E', 'B', 'A'];
  const ordered = preferredOrder
    .map((code) => examples.find((example) => example.code === code))
    .filter((example): example is ParsedExample => Boolean(example));

  const trips: SeedTrip[] = [];
  const items: SeedTripItem[] = [];
  const tasks: SeedTripTask[] = [];
  const notes: SeedTripNote[] = [];

  ordered.forEach((example, index) => {
    const materialized = materializeExample(example, targetUserId, index);
    trips.push(materialized.trip);
    items.push(...materialized.items);
    tasks.push(...materialized.tasks);
    notes.push(...materialized.notes);
  });

  return { trips, items, tasks, notes };
}

async function resolveTargetUserId(args: Args, databaseUrl: string | null): Promise<string> {
  if (args.targetUserId) return args.targetUserId;

  if (!args.targetUserEmail) {
    throw new Error('Apply mode requires --user-id or --user-email');
  }

  if (!databaseUrl) {
    console.warn('[organizer-seed] dry-run uses preview-only email-derived id; apply mode resolves canonical id from users');
    return `preview_${slugify(args.targetUserEmail)}`;
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const result = await client.query<{ id: string; email: string }>(
      `
        SELECT id, email
        FROM users
        WHERE lower(email) = lower($1)
      `,
      [args.targetUserEmail]
    );

    if (result.rows.length === 0) {
      throw new Error(
        `Organizer seed importer requires a canonical auth-linked user. Email not found in users: ${args.targetUserEmail}`
      );
    }
    if (result.rows.length > 1) {
      throw new Error(
        `Organizer seed importer found ambiguous user rows for email ${args.targetUserEmail} and refuses to guess canonical id`
      );
    }

    return result.rows[0]!.id;
  } finally {
    await client.end();
  }
}

async function applySeed(data: MaterializedSeed, databaseUrl: string): Promise<void> {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `
        DELETE FROM organizer_trip
        WHERE user_id = $1
          AND id = ANY($2::text[])
      `,
      [data.trips[0]?.userId ?? null, data.trips.map((trip) => trip.id)]
    );

    for (const trip of data.trips) {
      await client.query(
        `
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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          trip.id,
          trip.userId,
          trip.title,
          trip.destinationLabel,
          trip.summary,
          trip.status,
          trip.startDate,
          trip.endDate,
          trip.createdAt,
          trip.updatedAt,
        ]
      );
    }

    for (const item of data.items) {
      await client.query(
        `
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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          item.id,
          item.tripId,
          item.userId,
          item.title,
          item.note,
          item.sourceModule,
          item.sourceEntityType,
          item.sourceEntityId,
          item.status,
          item.createdAt,
          item.updatedAt,
        ]
      );
    }

    for (const task of data.tasks) {
      await client.query(
        `
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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          task.id,
          task.tripId,
          task.userId,
          task.title,
          task.status,
          task.createdAt,
          task.updatedAt,
          task.completedAt,
        ]
      );
    }

    for (const note of data.notes) {
      await client.query(
        `
          INSERT INTO organizer_trip_note (
            id,
            trip_id,
            user_id,
            body,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [note.id, note.tripId, note.userId, note.body, note.createdAt, note.updatedAt]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

async function verifySeed(data: MaterializedSeed, databaseUrl: string): Promise<void> {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const counts = await client.query<{
      trip_count: number;
      item_count: number;
      task_count: number;
      note_count: number;
    }>(
      `
        SELECT
          (SELECT count(*)::int FROM organizer_trip WHERE id = ANY($1::text[])) AS trip_count,
          (SELECT count(*)::int FROM organizer_trip_item WHERE trip_id = ANY($1::text[])) AS item_count,
          (SELECT count(*)::int FROM organizer_trip_task WHERE trip_id = ANY($1::text[])) AS task_count,
          (SELECT count(*)::int FROM organizer_trip_note WHERE trip_id = ANY($1::text[])) AS note_count
      `,
      [data.trips.map((trip) => trip.id)]
    );
    const row = counts.rows[0]!;
    console.log(`[organizer-seed] verify trips=${row.trip_count} items=${row.item_count} tasks=${row.task_count} notes=${row.note_count}`);
  } finally {
    await client.end();
  }
}

function printSummary(args: Args, targetUserId: string, examples: ParsedExample[], data: MaterializedSeed): void {
  console.log(`[organizer-seed] mode=${args.mode}`);
  console.log(`[organizer-seed] source=${args.sourcePath}`);
  console.log(`[organizer-seed] target_user_id=${targetUserId}`);
  if (args.targetUserEmail) {
    console.log(`[organizer-seed] target_user_email=${args.targetUserEmail}`);
  }
  console.log(`[organizer-seed] examples=${examples.map((example) => `${example.code}:${example.stateLabel}`).join(', ')}`);
  console.log(`[organizer-seed] trips=${data.trips.length}`);
  console.log(`[organizer-seed] items=${data.items.length}`);
  console.log(`[organizer-seed] tasks=${data.tasks.length}`);
  console.log(`[organizer-seed] notes=${data.notes.length}`);
  console.log(
    `[organizer-seed] sample_trips=${data.trips
      .slice(0, 3)
      .map((trip) => trip.title)
      .join(' | ')}`
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseUrl = getDatabaseUrl(args.mode);
  const markdown = readFileSync(args.sourcePath, 'utf8');
  const examples = parseExamples(markdown);
  const targetUserId = await resolveTargetUserId(args, databaseUrl);
  const data = materializeSeed(examples, targetUserId);

  printSummary(args, targetUserId, examples, data);

  if (args.mode === 'dry-run' || !databaseUrl) {
    console.log('[organizer-seed] dry-run complete');
    return;
  }

  await applySeed(data, databaseUrl);
  await verifySeed(data, databaseUrl);
  console.log('[organizer-seed] apply complete');
}

void main().catch((error) => {
  console.error('[organizer-seed] failed');
  console.error(error);
  process.exit(1);
});

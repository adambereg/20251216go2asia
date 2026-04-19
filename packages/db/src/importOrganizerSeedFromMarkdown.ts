/**
 * Import bounded Organizer demo seed from markdown content pack.
 *
 * Safety:
 * - Applies only in non-production environments.
 * - Requires an explicit target user (`--user-id` or `--user-email`) for apply mode.
 * - Treats the markdown content pack as a demo/QA source, not runtime truth.
 * - Supports both legacy v1 examples and richer v2 trip blocks.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

type ImportMode = 'dry-run' | 'apply';
type SeedFormat = 'v1' | 'v2';

type Args = {
  mode: ImportMode;
  targetUserId: string | null;
  targetUserEmail: string | null;
  sourcePath: string;
};

type SeedTripStatus = 'draft' | 'active' | 'completed' | 'archived';
type SeedTripItemStatus = 'planned' | 'booked' | 'done';
type SeedTripTaskStatus = 'pending' | 'done';

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

type V2SavedSource = {
  code: string;
  type: string | null;
  title: string;
  shortSummary: string | null;
  reasonToSave: string | null;
  suggestedTripFit: string | null;
};

type V2TripItem = {
  code: string;
  title: string;
  category: string | null;
  status: SeedTripItemStatus;
  pinned: boolean | null;
  source: string | null;
  savedRef: string | null;
  dayDate: string | null;
  shortNote: string | null;
};

type V2TripStep = {
  code: string;
  title: string;
  status: SeedTripTaskStatus;
  dayDate: string | null;
  sortOrder: number | null;
  whyItMatters: string | null;
};

type V2TripNote = {
  code: string;
  body: string;
  dayDate: string | null;
  noteType: string | null;
};

type V2ItemNote = {
  code: string;
  parentItem: string;
  body: string;
};

type V2DayLayerEntry = {
  code: string;
  date: string | null;
  theme: string | null;
  focus: string | null;
  plannedHighlights: string | null;
};

type V2Trip = {
  code: string;
  title: string;
  destination: string | null;
  summary: string | null;
  lifecycleTarget: string | null;
  stageTarget: string | null;
  startDate: string | null;
  endDate: string | null;
  datesConfidence: string | null;
  lifecycleOverride: string | null;
  focus: string | null;
  nextStep: string | null;
  linkedSavedItems: string[];
  suggestedSavedItems: string[];
  items: V2TripItem[];
  steps: V2TripStep[];
  tripNotes: V2TripNote[];
  itemNotes: V2ItemNote[];
  dayLayer: V2DayLayerEntry[];
};

type SeedTrip = {
  id: string;
  userId: string;
  title: string;
  destinationLabel: string | null;
  summary: string | null;
  status: SeedTripStatus;
  startDate: string | null;
  endDate: string | null;
  datesConfidence: string | null;
  lifecycleOverride: string | null;
  createdAt: string;
  updatedAt: string;
};

type SeedTripItem = {
  id: string;
  tripId: string;
  userId: string;
  title: string;
  note: string | null;
  category: string | null;
  pinned: boolean;
  dayDate: string | null;
  status: SeedTripItemStatus;
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
  status: SeedTripTaskStatus;
  dayDate: string | null;
  sortOrder: number;
  whyItMatters: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type SeedTripNote = {
  id: string;
  tripId: string;
  userId: string;
  body: string;
  dayDate: string | null;
  noteType: string | null;
  createdAt: string;
  updatedAt: string;
};

type SeedTripDay = {
  id: string;
  tripId: string;
  userId: string;
  dayDate: string;
  theme: string | null;
  focus: string | null;
  plannedHighlights: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type SeedTripItemNote = {
  id: string;
  itemId: string;
  tripId: string;
  userId: string;
  body: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type SeedSavedPost = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  publishedAt: string;
};

type SeedBookmark = {
  id: string;
  userId: string;
  targetId: string;
  createdAt: string;
};

type MaterializedSeed = {
  format: SeedFormat;
  trips: SeedTrip[];
  items: SeedTripItem[];
  tasks: SeedTripTask[];
  notes: SeedTripNote[];
  days: SeedTripDay[];
  itemNotes: SeedTripItemNote[];
  posts: SeedSavedPost[];
  bookmarks: SeedBookmark[];
};

type ParsedSeedSource =
  | {
      format: 'v1';
      examples: ParsedExample[];
    }
  | {
      format: 'v2';
      savedSources: V2SavedSource[];
      trips: V2Trip[];
    };

const DEFAULT_SOURCE_PATH = resolve(process.cwd(), '../../content/space/Organizer-Content-Pack-v2.md');

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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toNullableString(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function cleanMarkdownScalar(value: string | null): string | null {
  const normalized = toNullableString(value);
  if (!normalized) return null;
  const withoutTicks =
    normalized.startsWith('`') && normalized.endsWith('`') ? normalized.slice(1, -1).trim() : normalized;
  const lowered = withoutTicks.toLowerCase();
  if (
    lowered === 'null' ||
    lowered === 'none' ||
    lowered === 'none yet' ||
    lowered === 'optional only' ||
    lowered === 'нет'
  ) {
    return null;
  }
  return withoutTicks;
}

function truncate(value: string | null, maxLength: number): string | null {
  const normalized = toNullableString(value);
  if (!normalized) return null;
  return normalized.length > maxLength ? normalized.slice(0, maxLength - 1).trimEnd() : normalized;
}

function readPlainField(block: string, label: string): string | null {
  const field = block.match(new RegExp(`^${escapeRegex(label)}:\\s*(.+)$`, 'm'));
  return cleanMarkdownScalar(field?.[1] ?? null);
}

function readBulletField(block: string, label: string): string | null {
  const field = block.match(new RegExp(`^- ${escapeRegex(label)}:\\s*(.+)$`, 'm'));
  return cleanMarkdownScalar(field?.[1] ?? null);
}

function splitCsvLike(raw: string | null): string[] {
  const value = cleanMarkdownScalar(raw);
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBooleanLike(value: string | null): boolean | null {
  const normalized = cleanMarkdownScalar(value)?.toLowerCase();
  if (!normalized) return null;
  if (normalized === 'yes') return true;
  if (normalized === 'no') return false;
  return null;
}

function parseIntegerLike(value: string | null): number | null {
  const normalized = cleanMarkdownScalar(value);
  if (!normalized) return null;
  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function detectSeedFormat(markdown: string): SeedFormat {
  if (/^## Trip T\d+ — /m.test(markdown)) return 'v2';
  if (/^Example [A-Z] — /m.test(markdown)) return 'v1';
  throw new Error('Unsupported organizer content pack format');
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
    return {
      code: match[1]!,
      stateLabel: match[2]!.trim(),
      title: readPlainField(block, 'Title') ?? `Organizer Example ${match[1]}`,
      destination: readPlainField(block, 'Destination'),
      purpose: readPlainField(block, 'Purpose'),
      itemsRaw: readPlainField(block, 'Items'),
      tasksRaw: readPlainField(block, 'Tasks'),
      notesRaw: readPlainField(block, 'Notes'),
      whatMattersNow: readPlainField(block, 'What matters now'),
      nextStep: readPlainField(block, 'Next step'),
    };
  });
}

function extractSection(block: string, heading: string): string | null {
  const match = block.match(new RegExp(`^### ${escapeRegex(heading)}\\n([\\s\\S]*?)(?=^### |(?![\\s\\S]))`, 'm'));
  return match?.[1] ?? null;
}

function extractSubBlocks(section: string | null, headingPrefix: string): Array<{ code: string; block: string }> {
  if (!section || /^\s*-\s+(none|none yet|optional only)\s*$/im.test(section)) return [];
  const pattern = new RegExp(
    `^#### ${escapeRegex(headingPrefix)} ([^\\n]+)\\n([\\s\\S]*?)(?=^#### ${escapeRegex(headingPrefix)} |(?![\\s\\S]))`,
    'gm'
  );
  return Array.from(section.matchAll(pattern)).map((match) => ({
    code: match[1]!.trim(),
    block: match[2]!.trim(),
  }));
}

function parseV2SavedSources(markdown: string): V2SavedSource[] {
  const section = markdown.match(/^## 4\. Saved source pool\n([\s\S]*?)(?=^## 5\. )/m)?.[1];
  if (!section) return [];
  const pattern = /^### Saved item (S\d+)\n([\s\S]*?)(?=^### Saved item |^---|(?![\s\S]))/gm;
  return Array.from(section.matchAll(pattern)).map((match) => {
    const block = match[2] ?? '';
    return {
      code: match[1]!,
      type: readBulletField(block, 'type'),
      title: readBulletField(block, 'title') ?? match[1]!,
      shortSummary: readBulletField(block, 'short_summary'),
      reasonToSave: readBulletField(block, 'reason_to_save'),
      suggestedTripFit: readBulletField(block, 'suggested_trip_fit'),
    };
  });
}

function parseV2Trips(markdown: string): V2Trip[] {
  const pattern = /^## Trip (T\d+) — ([^\n]+)\n([\s\S]*?)(?=^## Trip |(?![\s\S]))/gm;
  const matches = Array.from(markdown.matchAll(pattern));
  if (matches.length === 0) {
    throw new Error('No organizer v2 trip blocks found in content pack');
  }

  return matches.map((match) => {
    const block = match[3] ?? '';
    const core = extractSection(block, 'Core') ?? '';
    const savedLinks = extractSection(block, 'Saved links') ?? '';
    const itemsSection = extractSection(block, 'Items');
    const stepsSection = extractSection(block, 'Steps');
    const tripNotesSection = extractSection(block, 'Trip notes');
    const itemNotesSection = extractSection(block, 'Item notes');
    const dayLayerSection = extractSection(block, 'Day layer');

    const items = extractSubBlocks(itemsSection, 'Item').map(({ code, block: itemBlock }) => ({
      code,
      title: readBulletField(itemBlock, 'title') ?? code,
      category: readBulletField(itemBlock, 'category'),
      status: (readBulletField(itemBlock, 'status') as SeedTripItemStatus) ?? 'planned',
      pinned: parseBooleanLike(readBulletField(itemBlock, 'pinned')),
      source: readBulletField(itemBlock, 'source'),
      savedRef: readBulletField(itemBlock, 'saved_ref'),
      dayDate: readBulletField(itemBlock, 'day_date'),
      shortNote: readBulletField(itemBlock, 'short_note'),
    }));

    const steps = extractSubBlocks(stepsSection, 'Step').map(({ code, block: stepBlock }) => ({
      code,
      title: readBulletField(stepBlock, 'title') ?? code,
      status: (readBulletField(stepBlock, 'status') as SeedTripTaskStatus) ?? 'pending',
      dayDate: readBulletField(stepBlock, 'day_date'),
      sortOrder: parseIntegerLike(readBulletField(stepBlock, 'sort_order')),
      whyItMatters: readBulletField(stepBlock, 'why_it_matters'),
    }));

    const tripNotes = extractSubBlocks(tripNotesSection, 'Note').map(({ code, block: noteBlock }) => ({
      code,
      body: readBulletField(noteBlock, 'body') ?? code,
      dayDate: readBulletField(noteBlock, 'day_date'),
      noteType: readBulletField(noteBlock, 'type'),
    }));

    const itemNotes = extractSubBlocks(itemNotesSection, 'Item note').map(({ code, block: itemNoteBlock }) => ({
      code,
      parentItem: readBulletField(itemNoteBlock, 'parent_item') ?? '',
      body: readBulletField(itemNoteBlock, 'body') ?? code,
    }));

    const dayLayer = extractSubBlocks(dayLayerSection, 'Day').map(({ code, block: dayBlock }) => ({
      code,
      date: readBulletField(dayBlock, 'date'),
      theme: readBulletField(dayBlock, 'theme'),
      focus: readBulletField(dayBlock, 'focus'),
      plannedHighlights: readBulletField(dayBlock, 'planned_highlights'),
    }));

    return {
      code: match[1]!,
      title: readBulletField(core, 'title') ?? match[2]!.trim(),
      destination: readBulletField(core, 'destination'),
      summary: readBulletField(core, 'summary'),
      lifecycleTarget: readBulletField(core, 'lifecycle_target'),
      stageTarget: readBulletField(core, 'stage_target'),
      startDate: readBulletField(core, 'start_date'),
      endDate: readBulletField(core, 'end_date'),
      datesConfidence: readBulletField(core, 'dates_confidence'),
      lifecycleOverride: readBulletField(core, 'lifecycle_override'),
      focus: readBulletField(core, 'focus'),
      nextStep: readBulletField(core, 'next_step'),
      linkedSavedItems: splitCsvLike(readBulletField(savedLinks, 'linked_saved_items')),
      suggestedSavedItems: splitCsvLike(readBulletField(savedLinks, 'suggested_saved_items_not_yet_linked')),
      items,
      steps,
      tripNotes,
      itemNotes,
      dayLayer,
    };
  });
}

function parseSeedSource(markdown: string): ParsedSeedSource {
  const format = detectSeedFormat(markdown);
  if (format === 'v1') {
    return {
      format,
      examples: parseExamples(markdown),
    };
  }
  return {
    format,
    savedSources: parseV2SavedSources(markdown),
    trips: parseV2Trips(markdown),
  };
}

function buildStableTripId(targetUserId: string, code: string, title: string): string {
  return `seed_org_trip_${code.toLowerCase()}_${slugify(title)}_${hashShort(targetUserId)}`.slice(0, 120);
}

function buildStableChildId(prefix: string, tripId: string, ordinal: number): string {
  return `${prefix}_${tripId}_${String(ordinal + 1).padStart(2, '0')}`.slice(0, 160);
}

function buildSavedPostId(code: string): string {
  return `seed_org_v2_post_${code.toLowerCase()}`;
}

function buildBookmarkId(targetUserId: string, code: string): string {
  return `seed_org_v2_bookmark_${code.toLowerCase()}_${hashShort(targetUserId)}`.slice(0, 120);
}

function atUtc(year: number, monthIndex: number, day: number, hour: number, minute: number): string {
  return new Date(Date.UTC(year, monthIndex, day, hour, minute, 0)).toISOString();
}

function toSeedDateTimestamp(value: string | null): string | null {
  const normalized = cleanMarkdownScalar(value);
  if (!normalized) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return null;
  return `${normalized}T12:00:00.000Z`;
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
  const statusMap: Record<string, SeedTripStatus> = {
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
    summary: truncate(example.purpose, 400),
    status: statusMap[example.code] ?? 'draft',
    startDate: null,
    endDate: null,
    datesConfidence: null,
    lifecycleOverride: null,
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
        category: null,
        pinned: false,
        dayDate: null,
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
    const curatedItems: Array<
      Pick<
        SeedTripItem,
        'title' | 'note' | 'category' | 'pinned' | 'dayDate' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'
      >
    > = [
      {
        title: 'Rooftop в Бангкоке',
        note: 'Хороший вариант для первого вечера.',
        category: null,
        pinned: false,
        dayDate: null,
        status: 'planned',
        sourceModule: 'space',
        sourceEntityType: 'space_post',
        sourceEntityId: 'seed_space_post_bkk_rooftop',
      },
      {
        title: 'Кафе на Пхукете',
        note: 'Потенциальная точка для спокойного утра.',
        category: null,
        pinned: false,
        dayDate: null,
        status: 'planned',
        sourceModule: 'space',
        sourceEntityType: 'space_post',
        sourceEntityId: 'seed_space_post_phuket_cafe',
      },
      {
        title: 'Отель в центре Бангкока',
        note: 'Нужна финальная проверка района.',
        category: null,
        pinned: false,
        dayDate: null,
        status: 'booked',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Публикация про Sukhumvit',
        note: 'Используется как городской ориентир.',
        category: null,
        pinned: false,
        dayDate: null,
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
    const curatedItems: Array<
      Pick<
        SeedTripItem,
        'title' | 'note' | 'category' | 'pinned' | 'dayDate' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'
      >
    > = [
      {
        title: 'Хошимин как первая точка входа',
        note: 'Пока основной кандидат на старт поездки.',
        category: null,
        pinned: false,
        dayDate: null,
        status: 'planned',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Жильё в Дананге',
        note: 'Вариант для середины маршрута.',
        category: null,
        pinned: false,
        dayDate: null,
        status: 'planned',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Городской квест на старт',
        note: 'Можно использовать как мягкий вход в поездку.',
        category: null,
        pinned: false,
        dayDate: null,
        status: 'booked',
        sourceModule: null,
        sourceEntityType: null,
        sourceEntityId: null,
      },
      {
        title: 'Ваучер на дорогу между городами',
        note: 'Пока в роли вспомогательного ориентира.',
        category: null,
        pinned: false,
        dayDate: null,
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
    const curatedItems: Array<
      Pick<
        SeedTripItem,
        'title' | 'note' | 'category' | 'pinned' | 'dayDate' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'
      >
    > = [
      { title: 'Отель рядом с BTS', note: 'Базовое жильё уже подтверждено.', category: null, pinned: false, dayDate: null, status: 'booked', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Встреча в центре', note: 'Нужно только подтвердить время.', category: null, pinned: false, dayDate: null, status: 'planned', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Утреннее кафе в Phrom Phong', note: 'Локация уже проверена в прошлую поездку.', category: null, pinned: false, dayDate: null, status: 'done', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Вечерний rooftop', note: 'Подходит для свободного вечера.', category: null, pinned: false, dayDate: null, status: 'planned', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Свободный день без программы', note: 'Оставлен как резерв для спокойного ритма.', category: null, pinned: false, dayDate: null, status: 'planned', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
      { title: 'Район у реки для прогулки', note: 'Хороший спокойный вариант на финал.', category: null, pinned: false, dayDate: null, status: 'booked', sourceModule: null, sourceEntityType: null, sourceEntityId: null },
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

  if (!['A', 'B', 'C', 'D', 'E'].includes(example.code)) {
    splitCsvLike(example.itemsRaw).forEach((title, index) => {
      items.push({
        id: buildStableChildId('seed_org_item', tripId, index),
        tripId,
        userId: targetUserId,
        title,
        note: null,
        category: null,
        pinned: false,
        dayDate: null,
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
        dayDate: null,
        sortOrder: index + 1,
        whyItMatters: null,
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
        dayDate: null,
        sortOrder: index + 1,
        whyItMatters: null,
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
        dayDate: null,
        sortOrder: index + 1,
        whyItMatters: null,
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
        dayDate: null,
        sortOrder: index + 1,
        whyItMatters: null,
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
      dayDate: null,
      noteType: null,
      createdAt: atUtc(2026, 3, 11 + order, 17, index * 5),
      updatedAt: atUtc(2026, 3, 11 + order, 17, index * 5),
    });
  });

  return { trip, items, tasks, notes };
}

function materializeSeedV1(examples: ParsedExample[], targetUserId: string): MaterializedSeed {
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

  return {
    format: 'v1',
    trips,
    items,
    tasks,
    notes,
    days: [],
    itemNotes: [],
    posts: [],
    bookmarks: [],
  };
}

function mapV2Status(lifecycleTarget: string | null, stageTarget: string | null): SeedTripStatus {
  const lifecycle = lifecycleTarget?.toLowerCase();
  const stage = stageTarget?.toLowerCase();
  if (lifecycle === 'post_trip') return 'completed';
  if (lifecycle === 'in_trip') return 'active';
  if (stage === 'booked' || stage === 'ready') return 'active';
  return 'draft';
}

function composeSavedPostText(source: V2SavedSource): string {
  return [
    source.title,
    source.shortSummary,
    source.reasonToSave ? `Почему сохранить: ${source.reasonToSave}` : null,
    source.suggestedTripFit ? `Подходит для: ${source.suggestedTripFit}` : null,
  ]
    .filter(Boolean)
    .join('. ');
}

function buildSavedPostsV2(savedSources: V2SavedSource[]): SeedSavedPost[] {
  return savedSources.map((source, index) => ({
    id: buildSavedPostId(source.code),
    title: source.title,
    text: composeSavedPostText(source),
    createdAt: atUtc(2026, 3, 15, 9, index),
    publishedAt: atUtc(2026, 3, 15, 9, index),
  }));
}

function buildBookmarksV2(savedSources: V2SavedSource[], targetUserId: string): SeedBookmark[] {
  return savedSources.map((source, index) => ({
    id: buildBookmarkId(targetUserId, source.code),
    userId: targetUserId,
    targetId: buildSavedPostId(source.code),
    createdAt: atUtc(2026, 3, 16, 9, index),
  }));
}

function buildV2ItemNote(base: V2TripItem): string | null {
  return truncate(base.shortNote, 500);
}

function buildLinkedSavedItems(
  trip: V2Trip,
  explicitSavedRefs: Set<string>,
  savedSourceMap: Map<string, V2SavedSource>
): Array<Pick<SeedTripItem, 'title' | 'note' | 'category' | 'pinned' | 'dayDate' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'>> {
  return trip.linkedSavedItems
    .filter((savedRef) => !explicitSavedRefs.has(savedRef))
    .map((savedRef) => savedSourceMap.get(savedRef))
    .filter((source): source is V2SavedSource => Boolean(source))
    .map((source) => ({
      title: truncate(source.title, 200) ?? source.code,
      note: truncate(source.shortSummary ?? source.reasonToSave, 500),
      category: null,
      pinned: false,
      dayDate: null,
      status: 'planned',
      sourceModule: source.type === 'space_post' ? 'space' : null,
      sourceEntityType: source.type === 'space_post' ? 'space_post' : null,
      sourceEntityId: source.type === 'space_post' ? buildSavedPostId(source.code) : null,
    }));
}

function buildV2TripNotes(trip: V2Trip): Array<Pick<SeedTripNote, 'body' | 'dayDate' | 'noteType'>> {
  const notes: Array<Pick<SeedTripNote, 'body' | 'dayDate' | 'noteType'>> = [];
  if (trip.focus) {
    notes.push({
      body: truncate(`Фокус поездки: ${trip.focus}`, 1000) ?? `Фокус поездки: ${trip.focus}`,
      dayDate: null,
      noteType: 'context',
    });
  }
  if (trip.nextStep) {
    notes.push({
      body: truncate(`Следующий шаг: ${trip.nextStep}`, 1000) ?? `Следующий шаг: ${trip.nextStep}`,
      dayDate: null,
      noteType: 'context',
    });
  }
  trip.tripNotes.forEach((note) => {
    const body = truncate(note.body, 1000);
    if (!body) return;
    notes.push({
      body,
      dayDate: note.dayDate,
      noteType: note.noteType,
    });
  });
  return notes;
}

function materializeSeedV2(savedSources: V2SavedSource[], tripsV2: V2Trip[], targetUserId: string): MaterializedSeed {
  const savedSourceMap = new Map(savedSources.map((source) => [source.code, source] as const));
  const posts = buildSavedPostsV2(savedSources);
  const bookmarks = buildBookmarksV2(savedSources, targetUserId);
  const trips: SeedTrip[] = [];
  const items: SeedTripItem[] = [];
  const tasks: SeedTripTask[] = [];
  const notes: SeedTripNote[] = [];
  const days: SeedTripDay[] = [];
  const itemNotes: SeedTripItemNote[] = [];

  tripsV2.forEach((tripSource, index) => {
    const tripId = buildStableTripId(targetUserId, tripSource.code, tripSource.title);
    const tripCreatedAt = atUtc(2026, 3, 20 + index, 9, 0);
    const trip: SeedTrip = {
      id: tripId,
      userId: targetUserId,
      title: truncate(tripSource.title, 120) ?? tripSource.code,
      destinationLabel: truncate(tripSource.destination, 120),
      summary: truncate(tripSource.summary, 400),
      status: mapV2Status(tripSource.lifecycleTarget, tripSource.stageTarget),
      startDate: toSeedDateTimestamp(tripSource.startDate),
      endDate: toSeedDateTimestamp(tripSource.endDate),
      datesConfidence: cleanMarkdownScalar(tripSource.datesConfidence),
      lifecycleOverride:
        tripSource.lifecycleOverride && tripSource.lifecycleOverride.toLowerCase() !== 'null'
          ? cleanMarkdownScalar(tripSource.lifecycleOverride)
          : null,
      createdAt: tripCreatedAt,
      updatedAt: tripCreatedAt,
    };
    trips.push(trip);

    const explicitSavedRefs = new Set(
      tripSource.items
        .map((item) => item.savedRef)
        .filter((savedRef): savedRef is string => Boolean(savedRef))
    );

    const materializedItems: Array<
      Pick<
        SeedTripItem,
        'title' | 'note' | 'category' | 'pinned' | 'dayDate' | 'status' | 'sourceModule' | 'sourceEntityType' | 'sourceEntityId'
      >
    > = [
      ...tripSource.items.map((item) => {
        const linkedSaved = item.savedRef ? savedSourceMap.get(item.savedRef) : null;
        return {
          title: truncate(item.title, 200) ?? item.code,
          note: buildV2ItemNote(item),
          category: cleanMarkdownScalar(item.category),
          pinned: item.pinned ?? false,
          dayDate: cleanMarkdownScalar(item.dayDate),
          status: item.status,
          sourceModule: item.source === 'saved' && linkedSaved?.type === 'space_post' ? 'space' : null,
          sourceEntityType: item.source === 'saved' && linkedSaved?.type === 'space_post' ? 'space_post' : null,
          sourceEntityId: item.source === 'saved' && linkedSaved?.type === 'space_post' ? buildSavedPostId(linkedSaved.code) : null,
        };
      }),
      ...buildLinkedSavedItems(tripSource, explicitSavedRefs, savedSourceMap),
    ];

    materializedItems.forEach((item, itemIndex) => {
      const createdAt = atUtc(2026, 3, 20 + index, 10, itemIndex);
      items.push({
        id: buildStableChildId('seed_org_item', tripId, itemIndex),
        tripId,
        userId: targetUserId,
        title: item.title,
        note: item.note,
        category: item.category,
        pinned: item.pinned,
        dayDate: item.dayDate,
        status: item.status,
        sourceModule: item.sourceModule,
        sourceEntityType: item.sourceEntityType,
        sourceEntityId: item.sourceEntityId,
        createdAt,
        updatedAt: createdAt,
      });
    });

    const orderedSteps = [...tripSource.steps].sort((left, right) => {
      if (left.sortOrder !== null && right.sortOrder !== null) return left.sortOrder - right.sortOrder;
      if (left.sortOrder !== null) return -1;
      if (right.sortOrder !== null) return 1;
      return left.code.localeCompare(right.code);
    });

    orderedSteps.forEach((step, taskIndex) => {
      const createdAt = atUtc(2026, 3, 20 + index, 11, 59 - taskIndex);
      const completedAt = step.status === 'done' ? atUtc(2026, 3, 20 + index, 12, 30 + taskIndex) : null;
      tasks.push({
        id: buildStableChildId('seed_org_task', tripId, taskIndex),
        tripId,
        userId: targetUserId,
        title: truncate(step.title, 200) ?? step.code,
        status: step.status,
        dayDate: cleanMarkdownScalar(step.dayDate),
        sortOrder: step.sortOrder ?? (taskIndex + 1) * 10,
        whyItMatters: truncate(step.whyItMatters, 400),
        completedAt,
        createdAt,
        updatedAt: completedAt ?? createdAt,
      });
    });

    buildV2TripNotes(tripSource).forEach((note, noteIndex) => {
      const createdAt = atUtc(2026, 3, 20 + index, 13, noteIndex);
      notes.push({
        id: buildStableChildId('seed_org_note', tripId, noteIndex),
        tripId,
        userId: targetUserId,
        body: note.body,
        dayDate: cleanMarkdownScalar(note.dayDate),
        noteType: cleanMarkdownScalar(note.noteType),
        createdAt,
        updatedAt: createdAt,
      });
    });

    tripSource.dayLayer.forEach((day, dayIndex) => {
      const dayDate = cleanMarkdownScalar(day.date);
      if (!dayDate) return;
      const createdAt = atUtc(2026, 3, 20 + index, 8, dayIndex);
      days.push({
        id: buildStableChildId('seed_org_day', tripId, dayIndex),
        tripId,
        userId: targetUserId,
        dayDate,
        theme: truncate(day.theme, 40),
        focus: truncate(day.focus, 400),
        plannedHighlights: truncate(day.plannedHighlights, 500),
        sortOrder: (dayIndex + 1) * 10,
        createdAt,
        updatedAt: createdAt,
      });
    });

    const explicitItemIdByTitle = new Map<string, string>();
    tripSource.items.forEach((item, itemIndex) => {
      const itemId = items.find((seedItem) => seedItem.tripId === tripId && seedItem.id === buildStableChildId('seed_org_item', tripId, itemIndex))?.id;
      if (itemId) explicitItemIdByTitle.set(item.title, itemId);
    });

    tripSource.itemNotes.forEach((note, noteIndex) => {
      const itemId = explicitItemIdByTitle.get(note.parentItem);
      const body = truncate(note.body, 800);
      if (!itemId || !body) return;
      const createdAt = atUtc(2026, 3, 20 + index, 14, noteIndex);
      itemNotes.push({
        id: buildStableChildId('seed_org_item_note', tripId, noteIndex),
        itemId,
        tripId,
        userId: targetUserId,
        body,
        sortOrder: (noteIndex + 1) * 10,
        createdAt,
        updatedAt: createdAt,
      });
    });
  });

  return {
    format: 'v2',
    trips,
    items,
    tasks,
    notes,
    days,
    itemNotes,
    posts,
    bookmarks,
  };
}

function materializeSeed(source: ParsedSeedSource, targetUserId: string): MaterializedSeed {
  if (source.format === 'v1') {
    return materializeSeedV1(source.examples, targetUserId);
  }
  return materializeSeedV2(source.savedSources, source.trips, targetUserId);
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

async function resolveSeedPostAuthorId(client: Client): Promise<string> {
  const result = await client.query<{ author_id: string }>(
    `
      SELECT author_id
      FROM space_post
      WHERE id = 'post-001'
        AND status = 'active'
        AND visibility = 'public'
      LIMIT 1
    `
  );
  const row = result.rows[0];
  if (!row) {
    throw new Error('Expected public anchor post post-001 to exist before organizer v2 saved seed apply');
  }
  return row.author_id;
}

async function upsertSavedPost(client: Client, authorId: string, post: SeedSavedPost): Promise<void> {
  await client.query(
    `
      INSERT INTO space_post (
        id,
        author_id,
        group_id,
        post_type,
        visibility,
        text,
        repost_target_type,
        repost_target_id,
        status,
        created_at,
        updated_at,
        published_at,
        deleted_at
      )
      VALUES (
        $1,
        $2,
        NULL,
        'post',
        'public',
        $3,
        NULL,
        NULL,
        'active',
        $4::timestamptz,
        $4::timestamptz,
        $5::timestamptz,
        NULL
      )
      ON CONFLICT (id)
      DO UPDATE SET
        author_id = EXCLUDED.author_id,
        group_id = NULL,
        post_type = 'post',
        visibility = 'public',
        text = EXCLUDED.text,
        repost_target_type = NULL,
        repost_target_id = NULL,
        status = 'active',
        updated_at = EXCLUDED.updated_at,
        published_at = EXCLUDED.published_at,
        deleted_at = NULL
    `,
    [post.id, authorId, post.text, post.createdAt, post.publishedAt]
  );
}

async function upsertBookmark(client: Client, bookmark: SeedBookmark): Promise<void> {
  await client.query(
    `
      INSERT INTO reactions (
        id,
        user_id,
        target_type,
        target_id,
        reaction_type,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        'space_post',
        $3,
        'bookmark',
        'active',
        $4::timestamptz,
        $4::timestamptz
      )
      ON CONFLICT (user_id, target_type, target_id, reaction_type)
      DO UPDATE SET
        status = 'active',
        updated_at = EXCLUDED.updated_at
    `,
    [bookmark.id, bookmark.userId, bookmark.targetId, bookmark.createdAt]
  );
}

async function applySeed(data: MaterializedSeed, databaseUrl: string): Promise<void> {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query('BEGIN');

    const targetUserId = data.trips[0]?.userId ?? data.bookmarks[0]?.userId ?? null;
    if (!targetUserId) {
      throw new Error('Organizer seed apply requires a target user id');
    }

    await client.query(
      `
        DELETE FROM reactions
        WHERE user_id = $1
          AND id LIKE 'seed_org_v2_bookmark_%'
      `,
      [targetUserId]
    );

    await client.query(
      `
        DELETE FROM organizer_trip
        WHERE user_id = $1
          AND id LIKE 'seed_org_%'
      `,
      [targetUserId]
    );

    if (data.posts.length > 0) {
      const authorId = await resolveSeedPostAuthorId(client);
      for (const post of data.posts) {
        await upsertSavedPost(client, authorId, post);
      }
    }

    for (const bookmark of data.bookmarks) {
      await upsertBookmark(client, bookmark);
    }

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
            dates_confidence,
            lifecycle_override,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
          trip.datesConfidence,
          trip.lifecycleOverride,
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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `,
        [
          item.id,
          item.tripId,
          item.userId,
          item.title,
          item.note,
          item.category,
          item.pinned,
          item.dayDate,
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
            day_date,
            sort_order,
            why_it_matters,
            created_at,
            updated_at,
            completed_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          task.id,
          task.tripId,
          task.userId,
          task.title,
          task.status,
          task.dayDate,
          task.sortOrder,
          task.whyItMatters,
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
            day_date,
            note_type,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [note.id, note.tripId, note.userId, note.body, note.dayDate, note.noteType, note.createdAt, note.updatedAt]
      );
    }

    for (const day of data.days) {
      await client.query(
        `
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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [day.id, day.tripId, day.userId, day.dayDate, day.theme, day.focus, day.plannedHighlights, day.sortOrder, day.createdAt, day.updatedAt]
      );
    }

    for (const itemNote of data.itemNotes) {
      await client.query(
        `
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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          itemNote.id,
          itemNote.itemId,
          itemNote.tripId,
          itemNote.userId,
          itemNote.body,
          itemNote.sortOrder,
          itemNote.createdAt,
          itemNote.updatedAt,
        ]
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
    const targetUserId = data.trips[0]?.userId ?? data.bookmarks[0]?.userId ?? null;
    const counts = await client.query<{
      trip_count: number;
      item_count: number;
      task_count: number;
      note_count: number;
      day_count: number;
      item_note_count: number;
      bookmark_count: number;
      post_count: number;
    }>(
      `
        SELECT
          (SELECT count(*)::int FROM organizer_trip WHERE id = ANY($1::text[])) AS trip_count,
          (SELECT count(*)::int FROM organizer_trip_item WHERE trip_id = ANY($1::text[])) AS item_count,
          (SELECT count(*)::int FROM organizer_trip_task WHERE trip_id = ANY($1::text[])) AS task_count,
          (SELECT count(*)::int FROM organizer_trip_note WHERE trip_id = ANY($1::text[])) AS note_count,
          (SELECT count(*)::int FROM organizer_trip_day WHERE trip_id = ANY($1::text[])) AS day_count,
          (SELECT count(*)::int FROM organizer_trip_item_note WHERE trip_id = ANY($1::text[])) AS item_note_count,
          (SELECT count(*)::int FROM reactions WHERE user_id = $2 AND id LIKE 'seed_org_v2_bookmark_%' AND status = 'active') AS bookmark_count,
          (SELECT count(*)::int FROM space_post WHERE id = ANY($3::text[]) AND status = 'active') AS post_count
      `,
      [data.trips.map((trip) => trip.id), targetUserId, data.posts.map((post) => post.id)]
    );
    const row = counts.rows[0]!;
    console.log(
      `[organizer-seed] verify trips=${row.trip_count} items=${row.item_count} tasks=${row.task_count} notes=${row.note_count} days=${row.day_count} item_notes=${row.item_note_count} bookmarks=${row.bookmark_count} posts=${row.post_count}`
    );
  } finally {
    await client.end();
  }
}

function printSummary(args: Args, targetUserId: string, source: ParsedSeedSource, data: MaterializedSeed): void {
  console.log(`[organizer-seed] mode=${args.mode}`);
  console.log(`[organizer-seed] source=${args.sourcePath}`);
  console.log(`[organizer-seed] format=${source.format}`);
  console.log(`[organizer-seed] target_user_id=${targetUserId}`);
  if (args.targetUserEmail) {
    console.log(`[organizer-seed] target_user_email=${args.targetUserEmail}`);
  }
  if (source.format === 'v1') {
    console.log(`[organizer-seed] examples=${source.examples.map((example) => `${example.code}:${example.stateLabel}`).join(', ')}`);
  } else {
    console.log(`[organizer-seed] saved_sources=${source.savedSources.length}`);
    console.log(`[organizer-seed] trip_codes=${source.trips.map((trip) => trip.code).join(', ')}`);
  }
  console.log(`[organizer-seed] trips=${data.trips.length}`);
  console.log(`[organizer-seed] items=${data.items.length}`);
  console.log(`[organizer-seed] tasks=${data.tasks.length}`);
  console.log(`[organizer-seed] notes=${data.notes.length}`);
  console.log(`[organizer-seed] days=${data.days.length}`);
  console.log(`[organizer-seed] item_notes=${data.itemNotes.length}`);
  console.log(`[organizer-seed] posts=${data.posts.length}`);
  console.log(`[organizer-seed] bookmarks=${data.bookmarks.length}`);
  console.log(
    `[organizer-seed] sample_trips=${data.trips
      .slice(0, 4)
      .map((trip) => trip.title)
      .join(' | ')}`
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseUrl = getDatabaseUrl(args.mode);
  const markdown = readFileSync(args.sourcePath, 'utf8').replace(/\r\n/g, '\n');
  const source = parseSeedSource(markdown);
  const targetUserId = await resolveTargetUserId(args, databaseUrl);
  const data = materializeSeed(source, targetUserId);

  printSummary(args, targetUserId, source, data);

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

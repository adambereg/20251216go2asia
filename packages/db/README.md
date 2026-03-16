# @go2asia/db

Database schema and migrations for Go2Asia MVP.

Uses Drizzle ORM with Neon PostgreSQL.

## Usage

```typescript
import { createDb } from '@go2asia/db';
import * as schema from '@go2asia/db/schema';

const db = createDb(process.env.DATABASE_URL);
const users = await db.select().from(schema.users);
```

## Migrations (SSOT)

SQL files in `packages/db/migrations/*.sql` are the source of truth.

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply DDL migrations (preferred for staging/prod)
pnpm db:ddl:apply
pnpm db:ddl:apply:staging

# Legacy Drizzle commands (local/dev only)
pnpm db:migrate
pnpm db:push
```

`src/ddlApply.ts` verifies that `migrations/meta/_journal.json` matches migration SQL files before applying DDL.

## Schema Structure

- `auth` - Users and profiles
- `content` - Countries, cities, places, events, articles
- `points` - Points transactions, balances, badges
- `referral` - Referral links and relations








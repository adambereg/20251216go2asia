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

## Migrations

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema directly (dev only)
pnpm db:push
```

## Schema Structure

- `auth` - Users and profiles
- `content` - Countries, cities, places, events, articles
- `points` - Points transactions, balances, badges
- `referral` - Referral links and relations








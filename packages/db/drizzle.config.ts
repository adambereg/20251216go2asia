import type { Config } from 'drizzle-kit';

/**
 * Drizzle Kit configuration for database migrations
 */
export default {
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config;






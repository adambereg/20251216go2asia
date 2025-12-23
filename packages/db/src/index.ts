/**
 * @go2asia/db
 * 
 * Database schema and migrations for Go2Asia MVP.
 * Uses Drizzle ORM with Neon PostgreSQL.
 */

export * from './schema';
export * from './client';
export * from './queries/content';

// Re-export minimal Drizzle helpers for worker services.
// This avoids each Worker app depending directly on drizzle-orm (and pulling duplicate copies/types).
export { sql } from 'drizzle-orm';
export type { SQL } from 'drizzle-orm';








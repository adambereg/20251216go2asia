/**
 * Database client for Go2Asia MVP
 * 
 * Uses Neon Serverless driver for Cloudflare Workers compatibility.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Creates a database client
 */
export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  // @ts-expect-error - Drizzle types issue with Neon, but works at runtime
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof createDb>;


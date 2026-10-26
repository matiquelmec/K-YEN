import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import '@/lib/env-validator';

const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_CONNECTION_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const config: { url: string; authToken?: string } = { url };
if (authToken && !url.startsWith('file:')) {
  config.authToken = authToken;
}

export const client = createClient(config);

export const db = drizzle(client, { schema });

export type Database = typeof db;
export { client as turso };

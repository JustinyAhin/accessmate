import { SQLITE_DB_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({ url: SQLITE_DB_URL, authToken: TURSO_AUTH_TOKEN });

const db = drizzle(client);

export { client, db };

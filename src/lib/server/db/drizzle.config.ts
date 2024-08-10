import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: './src/lib/server/db/schema.ts',
	driver: 'turso',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.SQLITE_DB_URL as string,
		authToken: process.env.TURSO_AUTH_TOKEN as string
	},
	out: './src/lib/server/db/migrations'
} satisfies Config;

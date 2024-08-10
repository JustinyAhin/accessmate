import { dev } from '$app/environment';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { Lucia } from 'lucia';
import { client } from '../db/client';

interface DatabaseUserAttributes {
	email: string;
}

interface DatabaseSessionAttributes {
	created_at: Date;
	updated_at: Date;
}

const adapter = new LibSQLAdapter(client, {
	user: 'users',
	session: 'sessions'
});

const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email
		};
	},
	getSessionAttributes: (attributes) => {
		return {
			created_at: attributes.created_at,
			updated_at: attributes.updated_at
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

export { lucia };

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateIdFromEntropySize } from 'lucia';

const timestamp = {
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
};

const users = sqliteTable('users', {
	...timestamp,
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateIdFromEntropySize(10)),
	email: text('email').unique().notNull().unique(),
	hashedPassword: text('hashed_password').notNull()
});

const sessions = sqliteTable('sessions', {
	...timestamp,
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateIdFromEntropySize(10)),
	expiresAt: integer('expires_at').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id)
});

const codes = sqliteTable('codes', {
	...timestamp,
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateIdFromEntropySize(10)),
	code: integer('code').notNull().unique(),
	isActive: integer('is_active', { mode: 'boolean' }).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id)
});

export { codes, sessions, users };

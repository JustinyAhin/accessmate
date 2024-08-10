import { eq } from 'drizzle-orm';
import { db } from './client';
import { users } from './schema';

const getUserByEmail = async (email: string) => {
	return await db.select().from(users).where(eq(users.email, email)).get();
};

const createNewUser = async (email: string, hashedPassword: string) => {
	return await db
		.insert(users)
		.values({
			email,
			hashedPassword
		})
		.returning()
		.get();
};

export { createNewUser, getUserByEmail };


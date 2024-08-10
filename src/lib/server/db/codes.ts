import { desc, eq } from 'drizzle-orm';
import { db } from './client';
import { codes } from './schema';

const getExistingCodes = async (userId: string) => {
	return await db
		.select()
		.from(codes)
		.where(eq(codes.userId, userId))
		.orderBy(desc(codes.createdAt));
};

const getActiveCode = async () => {
	return await db.select().from(codes).where(eq(codes.isActive, true)).get();
};

const createNewCode = async (data: typeof codes.$inferInsert) => {
	return await db.insert(codes).values(data).returning().get();
};

const setNewCodeAsActive = async (
	data: typeof codes.$inferInsert,
	existingCodes: (typeof codes.$inferSelect)[]
) => {
	await db.transaction(async (tsx) => {
		// Set all existing codes as inactive
		for (const code of existingCodes) {
			if (code.isActive) {
				await tsx
					.update(codes)
					.set({
						...code,
						isActive: false
					})
					.where(eq(codes.id, code.id));
			}
		}

		// Create new code
		await tsx.insert(codes).values(data);
	});
};

export { createNewCode, getActiveCode, getExistingCodes, setNewCodeAsActive };

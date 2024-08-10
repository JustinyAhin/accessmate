import { isLoggedIn } from '$lib/server/auth/authorization.js';
import { lucia } from '$lib/server/auth/lucia.js';
import { getUserByEmail } from '$lib/server/db/users';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';

export const load = async ({ locals }) => {
	if (isLoggedIn(locals)) {
		return redirect(302, '/');
	}
};

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { email, password } = formData as {
			email: string | undefined;
			password: string | undefined;
		};

		if (!email || !password) {
			return fail(400, { type: 'error', message: 'Email and password are required' });
		}

		const user = await getUserByEmail(email);

		if (!user) {
			return fail(400, { type: 'error', message: 'Invalid email or password' });
		}

		const validPassword = await new Argon2id().verify(user.hashedPassword, password);

		if (!validPassword) {
			return fail(400, { type: 'error', message: 'Invalid email or password' });
		}

		const session = await lucia.createSession(user.id, {
			created_at: new Date(),
			updated_at: new Date()
		});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};

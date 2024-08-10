import { isLoggedIn } from '$lib/server/auth/authorization';
import { lucia } from '$lib/server/auth/lucia';
import { getExistingCodes, setNewCodeAsActive } from '$lib/server/db/codes';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!isLoggedIn(locals)) {
		redirect(302, '/login');
	}

	const userId = locals.user!.id;
	const existingCodes = await getExistingCodes(userId);

	return {
		user: locals.user!,
		existingCodes
	};
};

export const actions = {
	setNewCode: async ({ locals, request }) => {
		if (!isLoggedIn(locals)) {
			redirect(302, '/login');
		}

		const formData = Object.fromEntries(await request.formData());
		const { code } = formData as {
			code: string | undefined;
		};

		if (!code) {
			return fail(400, { type: 'error', message: 'Code is required' });
		}

		const userId = locals.user!.id;

		const existingCodes = await getExistingCodes(userId);
		await setNewCodeAsActive({ code: parseInt(code), isActive: true, userId }, existingCodes);

		return {
			success: true
		};
	},

	logout: async ({ cookies, locals }) => {
		if (!isLoggedIn(locals)) {
			redirect(302, '/login');
		}

		await lucia.invalidateSession(locals.session!.id);
		const sessionCookie = lucia.createBlankSessionCookie();

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/login');
	}
};

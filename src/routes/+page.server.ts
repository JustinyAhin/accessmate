import { isLoggedIn } from '$lib/server/auth/authorization';
import { getExistingCodes, setNewCodeAsActive } from '$lib/server/db/codes';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!isLoggedIn(locals)) {
		redirect(302, '/login');
	}

	const userId = locals.user!.id;
	const existingCodes = await getExistingCodes(userId);

	return {
		existingCodes
	};
};

export const actions = {
	default: async ({ locals, request }) => {
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
	}
};

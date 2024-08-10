import { isWithinExpirationDate } from 'oslo';

const isLoggedIn = (locals: App.Locals) => {
	if (!locals.session?.expiresAt) {
		return false;
	}

	if (!isWithinExpirationDate(locals.session.expiresAt)) {
		return false;
	}

	if (!locals.user) {
		return false;
	}

	return true;
};
export { isLoggedIn };

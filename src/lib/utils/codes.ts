const generateUniqueFourDigitNumber = (existingNumbers: Set<number>): number => {
	let candidate: number;
	do {
		candidate = Math.floor(Math.random() * 10000);
	} while (existingNumbers.has(candidate) || candidate < 1000);

	return candidate;
};

export { generateUniqueFourDigitNumber };

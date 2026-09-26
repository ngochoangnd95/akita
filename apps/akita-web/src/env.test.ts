import { describe, expect, test } from 'bun:test';
import { parseEnv } from './env';

const validSource = {
	PORT: '3000',
	API_URL: 'http://localhost:4000',
	BETTER_AUTH_URL: 'http://localhost:3000',
	BETTER_AUTH_SECRET: 'a-local-development-secret-of-32-chars',
};

describe('parseEnv', () => {
	test('returns typed config from a complete environment', () => {
		expect(parseEnv(validSource)).toEqual({
			PORT: 3000,
			API_URL: 'http://localhost:4000',
			BETTER_AUTH_URL: 'http://localhost:3000',
			BETTER_AUTH_SECRET: 'a-local-development-secret-of-32-chars',
		});
	});

	test('throws one error naming every missing or invalid variable', () => {
		const { API_URL: _, ...rest } = validSource;
		const source = { ...rest, BETTER_AUTH_SECRET: 'too-short' };

		expect(() => parseEnv(source)).toThrow(
			[
				'Invalid environment variables:',
				'  - API_URL: is required',
				'  - BETTER_AUTH_SECRET: must be at least 32 characters',
			].join('\n'),
		);
	});
});

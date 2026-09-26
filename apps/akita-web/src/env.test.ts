import { describe, expect, test } from 'bun:test';
import { parseDotenv, parseEnv } from '@repo/utils/env';
import { envSchema } from './env';

describe('envSchema', () => {
	test('.env.example documents a valid configuration', async () => {
		const example = parseDotenv(
			await Bun.file(`${import.meta.dir}/../.env.example`).text(),
		);

		expect(parseEnv(envSchema, example)).toMatchObject({
			PORT: 3000,
			API_URL: 'http://localhost:4000',
		});
	});
});

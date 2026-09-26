import { describe, expect, test } from 'bun:test';
import { z } from 'zod';
import { parseDotenv, parseEnv } from './env';

describe('parseDotenv', () => {
	test('reads KEY=VALUE lines and skips comments and blank lines', () => {
		const text = [
			'# Port the API listens on.',
			'PORT=4000',
			'',
			'MAIL_FROM=Akita <no-reply@akita.local>',
			'DATABASE_URL=postgresql://akita:akita@localhost:5432/akita?schema=a=b',
		].join('\n');

		expect(parseDotenv(text)).toEqual({
			PORT: '4000',
			MAIL_FROM: 'Akita <no-reply@akita.local>',
			DATABASE_URL: 'postgresql://akita:akita@localhost:5432/akita?schema=a=b',
		});
	});
});

const schema = z.object({
	PORT: z.coerce.number().int(),
	API_URL: z.url(),
	SECRET: z.string().min(32),
});

describe('parseEnv', () => {
	test('returns typed config from a complete environment', () => {
		const env = parseEnv(schema, {
			PORT: '4000',
			API_URL: 'http://localhost:4000',
			SECRET: 'a-local-development-secret-of-32-chars',
		});

		expect(env).toEqual({
			PORT: 4000,
			API_URL: 'http://localhost:4000',
			SECRET: 'a-local-development-secret-of-32-chars',
		});
	});

	test('throws one error naming every missing or invalid variable', () => {
		expect(() =>
			parseEnv(schema, { API_URL: 'not-a-url', SECRET: 'too-short' }),
		).toThrow(
			[
				'Invalid environment variables:',
				'  - PORT: is required',
				'  - API_URL: must be a valid URL',
				'  - SECRET: must be at least 32 characters',
			].join('\n'),
		);
	});

	test('treats an empty value as missing', () => {
		const bucketSchema = z.object({ S3_BUCKET: z.string() });

		expect(() => parseEnv(bucketSchema, { S3_BUCKET: '' })).toThrow(
			'Invalid environment variables:\n  - S3_BUCKET: is required',
		);
	});
});

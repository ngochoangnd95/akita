import { describe, expect, test } from 'bun:test';
import { parseEnv } from './env';

const validSource = {
	PORT: '4000',
	WEB_ORIGIN: 'http://localhost:3000',
	DATABASE_URL: 'postgresql://akita:akita@localhost:5432/akita',
	S3_ENDPOINT: 'http://localhost:9000',
	S3_REGION: 'us-east-1',
	S3_ACCESS_KEY_ID: 'akita',
	S3_SECRET_ACCESS_KEY: 'akita-secret',
	S3_BUCKET: 'akita',
	SMTP_URL: 'smtp://localhost:1025',
	MAIL_FROM: 'Akita <no-reply@akita.local>',
};

describe('parseEnv', () => {
	test('returns typed config from a complete environment', () => {
		expect(parseEnv(validSource)).toEqual({
			PORT: 4000,
			WEB_ORIGIN: 'http://localhost:3000',
			DATABASE_URL: 'postgresql://akita:akita@localhost:5432/akita',
			S3_ENDPOINT: 'http://localhost:9000',
			S3_REGION: 'us-east-1',
			S3_ACCESS_KEY_ID: 'akita',
			S3_SECRET_ACCESS_KEY: 'akita-secret',
			S3_BUCKET: 'akita',
			SMTP_URL: 'smtp://localhost:1025',
			MAIL_FROM: 'Akita <no-reply@akita.local>',
		});
	});

	test('throws one error naming every missing or invalid variable', () => {
		const { DATABASE_URL: _, S3_BUCKET: __, ...rest } = validSource;
		const source = { ...rest, WEB_ORIGIN: 'not-a-url' };

		expect(() => parseEnv(source)).toThrow(
			[
				'Invalid environment variables:',
				'  - WEB_ORIGIN: must be a valid URL',
				'  - DATABASE_URL: is required',
				'  - S3_BUCKET: is required',
			].join('\n'),
		);
	});
});

import { z } from 'zod';

/** Configuration read from the environment; documented in `.env.example`. */
export const envSchema = z.object({
	PORT: z.coerce.number().int(),
	WEB_ORIGIN: z.url(),
	DATABASE_URL: z.url(),
	S3_ENDPOINT: z.url(),
	S3_REGION: z.string(),
	S3_ACCESS_KEY_ID: z.string(),
	S3_SECRET_ACCESS_KEY: z.string(),
	S3_BUCKET: z.string(),
	SMTP_URL: z.url(),
	MAIL_FROM: z.string(),
});

export type Env = z.infer<typeof envSchema>;

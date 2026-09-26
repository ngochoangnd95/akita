import { z } from 'zod';

/**
 * Server-side configuration, documented in `.env.example`. Never read it at
 * module scope in isomorphic code: call `getServerEnv` from `env.server.ts`.
 */
export const envSchema = z.object({
	PORT: z.coerce.number().int(),
	API_URL: z.url(),
	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(32),
});

export type Env = z.infer<typeof envSchema>;

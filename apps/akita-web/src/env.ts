import { z } from 'zod';

// Server-side configuration. Never read it at module scope in isomorphic code:
// call `getServerEnv` from `env.server.ts` inside server-only code instead.
const envSchema = z.object({
	PORT: z.coerce.number().int(),
	API_URL: z.url(),
	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(32),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
	const result = envSchema.safeParse(source);
	if (result.success) return result.data;

	const lines = result.error.issues.map((issue) => {
		const name = String(issue.path[0]);
		return `  - ${name}: ${describeIssue(issue, source[name])}`;
	});
	throw new Error(['Invalid environment variables:', ...lines].join('\n'));
}

function describeIssue(issue: z.core.$ZodIssue, value: string | undefined) {
	if (value === undefined || value === '') return 'is required';
	if (issue.code === 'invalid_format' && issue.format === 'url')
		return 'must be a valid URL';
	if (issue.code === 'too_small' && issue.origin === 'string')
		return `must be at least ${issue.minimum} characters`;
	return issue.message;
}

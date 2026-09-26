import type { z } from 'zod';

type EnvSource = Record<string, string | undefined>;

/**
 * Validates environment variables against a Zod object schema.
 * Throws one error that lists every missing or invalid variable.
 */
export function parseEnv<Schema extends z.ZodObject>(
	schema: Schema,
	source: EnvSource,
): z.infer<Schema> {
	// `KEY=` in a .env file means "not set", not "set to an empty string".
	const present = Object.fromEntries(
		Object.entries(source).filter(([, value]) => value !== ''),
	);
	const result = schema.safeParse(present);
	if (result.success) return result.data;

	const lines = result.error.issues.map((issue) => {
		const name = String(issue.path[0]);
		return `  - ${name}: ${describeIssue(issue, present[name])}`;
	});
	throw new Error(['Invalid environment variables:', ...lines].join('\n'));
}

function describeIssue(issue: z.core.$ZodIssue, value: string | undefined) {
	if (value === undefined) return 'is required';
	if (issue.code === 'invalid_format' && issue.format === 'url')
		return 'must be a valid URL';
	if (issue.code === 'too_small' && issue.origin === 'string')
		return `must be at least ${issue.minimum} characters`;
	return issue.message;
}

/**
 * Parses the simple `KEY=VALUE` format used by `.env.example` files.
 * Comments and blank lines are skipped; values are taken literally.
 */
export function parseDotenv(text: string): Record<string, string> {
	const entries = text
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line !== '' && !line.startsWith('#'))
		.map((line) => {
			const separator = line.indexOf('=');
			return [line.slice(0, separator), line.slice(separator + 1)];
		});
	return Object.fromEntries(entries);
}

/**
 * Validates the environment at process startup. On failure, prints the list of
 * bad variables and exits, so the app never runs with a broken configuration.
 */
export function loadEnvOrExit<Schema extends z.ZodObject>(
	schema: Schema,
	source: EnvSource,
): z.infer<Schema> {
	try {
		return parseEnv(schema, source);
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

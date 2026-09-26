import { parseEnv } from '@repo/utils/env';
import { createServerOnlyFn } from '@tanstack/react-start';
import { type Env, envSchema } from './env';

let cached: Env | undefined;

/** Validated server configuration. Throws a message listing every bad variable. */
export const getServerEnv = createServerOnlyFn((): Env => {
	cached ??= parseEnv(envSchema, process.env);
	return cached;
});

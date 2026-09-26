import { createServerOnlyFn } from '@tanstack/react-start';
import { type Env, parseEnv } from './env';

let cached: Env | undefined;

/** Validated server configuration. Throws a message listing every bad variable. */
export const getServerEnv = createServerOnlyFn((): Env => {
	cached ??= parseEnv(process.env);
	return cached;
});

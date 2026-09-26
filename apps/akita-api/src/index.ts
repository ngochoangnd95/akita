import { Elysia } from 'elysia';
import { type Env, parseEnv } from './env';

let env: Env;
try {
	env = parseEnv(Bun.env);
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}

const app = new Elysia().get('/', () => 'Hello Elysia').listen(env.PORT);

console.log(`Akita API running at ${app.server?.url}`);

import { loadEnvOrExit } from '@repo/utils/env';
import { Elysia } from 'elysia';
import { envSchema } from './env';

const env = loadEnvOrExit(envSchema, Bun.env);

const app = new Elysia().get('/', () => 'Hello Elysia').listen(env.PORT);

console.log(`Akita API running at ${app.server?.url}`);

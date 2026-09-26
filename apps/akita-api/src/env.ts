import { getSchemaValidator, t } from 'elysia';

const envSchema = t.Object({
	PORT: t.Integer(),
});

export const env = getSchemaValidator(envSchema, {
	additionalProperties: true,
}).parse(Bun.env);

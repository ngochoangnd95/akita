import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { loadEnvOrExit } from '@repo/utils/env';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, loadEnv } from 'vite';
import { envSchema } from './src/env.ts';

const config = defineConfig(({ mode, command }) => {
	const env = loadEnv(mode, import.meta.dirname, '');

	// Fail fast when the dev server starts with a missing or invalid .env.
	// Production servers validate at runtime through `getServerEnv`.
	if (command === 'serve') loadEnvOrExit(envSchema, { ...process.env, ...env });

	return {
		resolve: { tsconfigPaths: true },
		plugins: [
			devtools(),
			paraglideVitePlugin({
				project: './project.inlang',
				outdir: './src/paraglide',
				strategy: ['url', 'baseLocale'],
			}),
			nitro({ rollupConfig: { external: [/^@sentry\//] } }),
			tailwindcss(),
			tanstackStart(),
			viteReact(),
			babel({ presets: [reactCompilerPreset()] }),
		],
		server: {
			port: env.PORT ? Number(env.PORT) : 3000,
		},
	};
});

export default config;

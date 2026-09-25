import { defineConfig, type OxfmtConfig } from 'oxfmt';

import baseConfig from './base';

export default defineConfig({
	...baseConfig,
	jsxSingleQuote: true,
	sortTailwindcss: true,
}) as OxfmtConfig;

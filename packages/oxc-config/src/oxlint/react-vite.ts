import { defineConfig, type OxlintConfig } from 'oxlint';

import baseConfig from './base';

export default defineConfig({
	extends: [baseConfig],
	plugins: ['react'],
	rules: {
		'react/rules-of-hooks': 'error',
		'react/only-export-components': ['warn', { allowConstantExport: true }],
	},
}) as OxlintConfig;

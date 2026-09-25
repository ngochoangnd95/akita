import { defineConfig, type OxfmtConfig } from 'oxfmt';

export default defineConfig({
	singleQuote: true,
	useTabs: true,
	tabWidth: 2,
	printWidth: 100,
	semi: true,
	trailingComma: 'all',
	sortImports: true,
	sortPackageJson: true,
}) as OxfmtConfig;

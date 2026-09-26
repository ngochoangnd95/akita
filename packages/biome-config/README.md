# @repo/biome-config

## Introduction

Shared [Biome](https://biomejs.dev) configuration for every Akita workspace, so linting and formatting rules are defined once. It exports one preset, `@repo/biome-config/base`.

## Getting started

Add it to a workspace:

```jsonc
// package.json
"devDependencies": {
  "@biomejs/biome": "catalog:",
  "@repo/biome-config": "workspace:*"
}
```

```jsonc
// biome.json
{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@repo/biome-config/base"]
}
```

```bash
bun run check              # biome check: lint + format + import sorting
bunx biome check --write   # apply safe fixes
```

There is nothing to build or deploy; the package ships a JSON file.

## Primary framework and concepts

- **Biome** is one tool for linting, formatting and import organising, and replaces ESLint and Prettier.
- **The base preset:**
  - tab indentation and single quotes
  - the `recommended` lint rules
  - import sorting and sorted `package.json`
  - Git-aware ignores, using `.gitignore`
- **Overrides:** a workspace extends the base and adds only what it needs. For example, akita-web adds Tailwind directives, sorted classes in `cn` and `cva`, and ignores the generated `routeTree.gen.ts` and `src/components/ui`.
- **Versioning:** the Biome version is pinned in the root catalog, so every workspace uses the same one.

## References

- [Biome getting started](https://biomejs.dev/guides/getting-started/)
- [Configuration reference](https://biomejs.dev/reference/configuration/)
- [Sharing a configuration](https://biomejs.dev/guides/configure-biome/#share-a-configuration-file)
- [Lint rules](https://biomejs.dev/linter/rules/)

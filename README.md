# Akita

## Introduction

Akita is a collaborative web design editor, inspired by Canva, for banners, posters, book covers, presentations and, in a later phase, short videos for TikTok and Facebook ads. Members of a Workspace edit the same Design in real time, and Guests view published Snapshots through a Public link.

This is the monorepo root. It holds the Bun workspace configuration, shared tooling and the project documentation.

| Workspace | Role |
|---|---|
| [apps/akita-web](apps/akita-web) | Web app: server-rendered public pages and the client-only editor |
| [apps/akita-api](apps/akita-api) | Backend: REST API, authentication, real-time collaboration |
| [packages/biome-config](packages/biome-config) | Shared Biome lint and format config |

More packages are planned: `contracts`, `utils`, `design-model`, `design-renderer` and the `akita-renderer` worker. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Getting started

Requirements: [Bun](https://bun.sh) 1.4.2 or later. Docker is needed later for PostgreSQL, MinIO and Mailpit (issue #34).

```bash
bun install                      # install every workspace
bun run check                    # Biome lint + format check in every workspace
bun --filter akita-api dev       # API on http://localhost:$PORT
bun --filter akita-web dev       # web app on http://localhost:3000
bun --filter akita-web build     # production build of the web app
```

Each app needs a `.env`; see its README. Deployment is described per app. There is no shared deploy pipeline yet.

## Primary tools and concepts

- **Bun** is the runtime, package manager, workspace manager and test runner. Shared dependency versions live in the `workspaces.catalog` of the root `package.json`; workspaces reference them as `"catalog:"`.
- **Workspaces**: `apps/*` are deployable apps and `packages/*` are shared libraries. Packages never import from apps.
- **Biome** lints and formats everything, and every workspace extends `@repo/biome-config/base`.
- **Domain language**: use the terms in [CONTEXT.md](CONTEXT.md) (Design, Page, Element, Workspace, Snapshot and so on) in code, UI and issues.
- **Documentation**:
  - [TECH-STACK.md](docs/TECH-STACK.md), [ARCHITECTURE.md](docs/ARCHITECTURE.md) and [DATABASE.md](docs/DATABASE.md)
  - [DESIGN.md](DESIGN.md) (design system)
  - [docs/adr/](docs/adr) (decisions)
  - Work is tracked in GitHub Issues; the v1 spec is issue #2.

## References

- [Bun documentation](https://bun.sh/docs)
- [Bun workspaces](https://bun.sh/docs/install/workspaces) and [catalogs](https://bun.sh/docs/install/catalogs)
- [Biome documentation](https://biomejs.dev/guides/getting-started/)
- [Yjs documentation](https://docs.yjs.dev/)

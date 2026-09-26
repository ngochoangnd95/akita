# akita-api

## Introduction

The Akita backend, a single Elysia process on Bun. It serves the REST API, hosts Better Auth (sign-in, Workspaces, Members, Invitations), enforces permissions, Plans and rate limits, and runs the real-time collaboration WebSocket that syncs each Design's Yjs document. It is the only component that writes to PostgreSQL. See [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) and [DATABASE.md](../../docs/DATABASE.md).

## Getting started

Create a `.env` in this folder:

```bash
PORT=4000
```

More variables (database, MinIO, auth, mail) arrive with issues #34–#36 and are validated at startup in `src/env.ts`.

```bash
bun install      # from the repo root
bun run dev      # start with file watching on http://localhost:$PORT
bun run check    # Biome lint + format check
```

**Build and deploy:** there is no build step yet, because Bun runs the TypeScript directly. For production, run `bun src/index.ts`, or bundle it with `bun build src/index.ts --target bun --outdir dist` or compile a single binary with `bun build --compile`. Ship it in a Bun container next to PostgreSQL and MinIO. Run database migrations (`bunx prisma migrate deploy`) before starting a new version, never on startup.

## Primary framework and concepts

- **Elysia** is a Bun-first web framework.
  - **One plugin per feature** (designs, workspaces, snapshots and so on). Each plugin has a route → service → repository layering.
  - **Validation** uses the Zod schemas from `@repo/contracts`, through Elysia's Standard Schema support.
  - **Eden:** the app type is exported so akita-web gets a typed client without code generation.
  - **WebSocket:** Elysia's built-in WebSocket support (Bun's uWebSocket) carries Yjs sync, presence and Soft locks.
- **Better Auth** provides magic-link and Google sign-in, plus its organization plugin (organization = Workspace) with owner, admin, editor and Viewer roles. The same session cookie covers REST and WebSocket.
- **Prisma** is the ORM for PostgreSQL. Design content is stored as Yjs updates, not as tables.
- **MinIO:** the API hands out presigned URLs, and browsers upload directly.
- **Tests:** `bun test`, end to end over HTTP against real PostgreSQL and MinIO, plus collaboration tests with simulated Yjs clients.

## References

- [Elysia](https://elysiajs.com/at-glance.html), [Eden Treaty](https://elysiajs.com/eden/overview.html) and [Elysia WebSocket](https://elysiajs.com/patterns/websocket.html)
- [Better Auth](https://www.better-auth.com/docs) and its [organization plugin](https://www.better-auth.com/docs/plugins/organization)
- [Prisma ORM](https://www.prisma.io/docs/orm)
- [Bun runtime](https://bun.sh/docs) and [bun test](https://bun.sh/docs/cli/test)
- [Yjs](https://docs.yjs.dev/) and [y-protocols](https://github.com/yjs/y-protocols)
- [MinIO JavaScript SDK](https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html)

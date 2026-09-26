# akita-web

## Introduction

The Akita web app. It server-renders the public pages (home, product, about) and the Public link view for SEO and speed, and it serves the Design editor and the signed-in app as client-rendered routes. It talks to [akita-api](../akita-api) for data, authentication and real-time collaboration.

## Getting started

Create a `.env` in this folder:

```bash
PORT=3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<random 32+ character string>
```

```bash
bun install              # from the repo root
bun run dev              # dev server with HMR on http://localhost:$PORT
bun run check            # Biome lint + format check
bun run generate-routes  # regenerate src/routeTree.gen.ts
bun run build            # production build with Nitro, into .output/
bun run preview          # serve the production build locally
```

**Deploy:** `bun run build` produces a Nitro server in `.output/`. Run it with `bun .output/server/index.mjs` on any host or container that runs Bun, with the same environment variables set. The hosting target is not chosen yet.

## Primary framework and concepts

- **TanStack Start** runs on Vite with Nitro as the server.
  - Routes are files in `src/routes/` (TanStack Router, file-based). `routeTree.gen.ts` is generated, so don't edit it.
  - Public routes render on the server. The editor route (`/app/design/:id`) is client-only, because Moveable, Selecto and Tiptap need the browser DOM.
  - Server functions and API routes run on the web server. Business logic belongs in akita-api.
- **Data and state:**
  - **TanStack Query** holds server data.
  - **TanStack Store** holds UI-only state (tool, selection, viewport, panels).
  - **Yjs** holds Design content.
  - **TanStack Form** handles forms, validated with schemas from `@repo/contracts`.
- **UI:**
  - shadcn/ui components on Base UI live in `src/components/ui`, and Tailwind CSS v4 styles them with the tokens in [DESIGN.md](../../DESIGN.md).
  - Add components with `bunx shadcn add <component>`, run in this folder. Never import `@base-ui/react` directly in app code (see `.claude/rules/shadcn.md`).
- **i18n:**
  - Paraglide compiles the messages in `messages/*.json` into `src/paraglide`.
  - The target languages are en, vi, zh-Hans, zh-Hant, ja and ko. The template's `de` still has to be replaced.
- **Auth:** the Better Auth client lives in `src/integrations/better-auth`. The auth server will move to akita-api (see [ARCHITECTURE.md](../../docs/ARCHITECTURE.md)).
- **React Compiler** runs through Babel, so manual `useMemo` and `useCallback` are rarely needed.

## References

- [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview)
- [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Store](https://tanstack.com/store/latest/docs/overview)
- [TanStack Form](https://tanstack.com/form/latest/docs/overview)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Base UI](https://base-ui.com/react/overview/quick-start)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
- [Better Auth](https://www.better-auth.com/docs)
- [Nitro](https://nitro.build/guide)
- [react-moveable](https://daybrush.com/moveable/), [Selecto](https://daybrush.com/selecto/) and [Tiptap](https://tiptap.dev/docs)

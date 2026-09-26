# Tech stack

## Tooling

| Concern | Choice |
|---|---|
| Runtime (backend and frontend) | Bun |
| Package manager and monorepo | Bun workspaces, with a Bun catalog for shared versions |
| Test runner | `bun test` |
| Lint and format | Biome (shared config in `packages/biome-config`) |
| Language | TypeScript |

## Frontend (`apps/akita-web`)

| Concern | Choice |
|---|---|
| App framework | TanStack Start (TanStack Router + TanStack Query on Vite) |
| UI components | shadcn/ui on Base UI primitives |
| Styling | Tailwind CSS |
| Global client state | TanStack Store |
| Forms | TanStack Form |
| Element move, resize, rotate, snap | react-moveable |
| Marquee / multi-selection | Selecto |
| Rich text editing | Tiptap |
| Live Design state | Yjs (see ADR 0001) |

The editor renders Designs as DOM elements (HTML/SVG), not on an HTML canvas. The editor route renders on the client only.

TanStack Store holds UI state only (selection, tool, viewport, panels). Design content lives in Yjs.

## Backend (`apps/akita-api`)

| Concern | Choice |
|---|---|
| Server framework | Elysia on Bun |
| Authentication | Better Auth |
| ORM | Prisma |
| Database | PostgreSQL |
| Object storage | MinIO (S3-compatible API) |

Elysia also hosts the real-time collaboration WebSocket that syncs each Design's Yjs document.

## Payments

Billing arrives after v1, which launches on the free Plan only.

| Market | Provider |
|---|---|
| International | Paddle |
| Vietnam | payOS |

Mainland China payments are not planned.

## Rendering

Exports and video run on the server, not in the browser, so the result is the same on every device.

## Background

`docs/research/tech-stack-tradeoffs.md` reviews the earlier canvas-based stack (Konva, Elysia on Cloudflare Workers, D1, R2) and explains why it was dropped.

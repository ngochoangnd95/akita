# Tech stack

## Frontend

| Concern | Choice |
|---|---|
| UI framework | React |
| Element move, resize, rotate, snap | react-moveable |
| Marquee / multi-selection | Selecto |
| Rich text editing | Tiptap |
| Client state | Zustand |

The editor renders designs as DOM elements (HTML/SVG), not on an HTML canvas.

## Backend

| Concern | Choice |
|---|---|
| Server framework | Nest.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Object storage | MinIO (S3-compatible API) |

## Payments

Billing arrives after v1, which launches on the free Plan only.

| Market | Provider |
|---|---|
| International | Paddle |
| Vietnam | payOS |

Mainland China payments are not planned.

## Rendering

Video export runs on the server, not in the browser, so it works the same on mobile devices.

## Background

`docs/research/tech-stack-tradeoffs.md` reviews the earlier canvas-based stack (Konva, Elysia on Cloudflare Workers, D1, R2) and explains why it was dropped.

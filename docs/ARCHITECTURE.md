# Architecture

This document explains how Akita is put together. It uses the terms defined in [CONTEXT.md](../CONTEXT.md), the stack in [TECH-STACK.md](TECH-STACK.md), the decisions in [adr/](adr/) and the tables in [DATABASE.md](DATABASE.md).

## 1. System

```mermaid
flowchart LR
  subgraph Clients
    M[Member browser]
    G[Guest browser]
  end
  subgraph Akita
    WEB["akita-web<br/>TanStack Start on Bun"]
    API["akita-api<br/>Elysia on Bun<br/>REST + Better Auth + collaboration WS"]
    RW["akita-renderer<br/>headless Chrome worker"]
  end
  PG[(PostgreSQL)]
  S3[(MinIO)]
  MAIL[Mail server]
  STOCK[Unsplash / Pexels]

  M -->|HTML, SSR + client| WEB
  G -->|SSR pages, Public link| WEB
  M -->|REST via Eden| API
  M <-->|WebSocket: Yjs sync, presence, Soft locks| API
  M -->|presigned PUT/GET| S3
  WEB -->|server functions| API
  API --> PG
  API --> S3
  API --> MAIL
  API --> STOCK
  API -->|enqueue Export jobs| PG
  RW -->|claim jobs| PG
  RW -->|read Snapshots, Fonts, Assets; write files| S3
```

| Unit | Responsibility |
|---|---|
| **akita-web** | Server-renders public pages (home, product, about) and the Public link view. Serves the editor as a client-only single-page app. Talks to the API through a typed Eden client. |
| **akita-api** | The single backend process: REST, Better Auth, Plan checks, rate limiting, and the collaboration WebSocket. It is the only component that writes to the database. |
| **akita-renderer** | Claims Export jobs, renders Snapshots with the shared Design renderer in headless Chrome, and writes the files to MinIO. Runs on Bun, falling back to Node if Chrome automation misbehaves under Bun. |
| **PostgreSQL** | Relational data, Yjs update logs and the job queue. |
| **MinIO** | Assets, Fonts, Snapshots, Template versions, thumbnails and Export files. |

## 2. Project structure

```
akita/
├── apps/
│   ├── akita-web/          TanStack Start app (public pages + editor)
│   ├── akita-api/          Elysia API, Better Auth, collaboration WebSocket
│   └── akita-renderer/     Export worker (headless Chrome)
├── packages/
│   ├── contracts/          @repo/contracts: constants, Zod schemas, API types, Plan entitlements
│   ├── utils/              @repo/utils: pure helpers (units, colors, ids, dates)
│   ├── design-model/       @repo/design-model: Design document on Yjs, operations, rules
│   ├── design-renderer/    @repo/design-renderer: React renderer, Design state → DOM
│   └── biome-config/       shared Biome config
├── docs/                   TECH-STACK, ARCHITECTURE, DATABASE, adr/, research/, agents/
├── CONTEXT.md              domain glossary
└── DESIGN.md               design system
```

### Package dependencies

```mermaid
flowchart TD
  WEB[akita-web] --> CON[contracts]
  WEB --> DM[design-model]
  WEB --> DR[design-renderer]
  WEB -.->|Eden types only| API
  API[akita-api] --> CON
  API --> DM
  RW[akita-renderer] --> DR
  RW --> CON
  DR --> DM
  DM --> CON
  CON --> UT[utils]
  DM --> UT
  API --> UT
```

Rules:
- Packages never import from apps.
- `contracts` depends only on Zod and `utils`.
- `design-model` has no React code; `design-renderer` has no network code.
- The web app imports the API's **types** only, never its runtime code.

## 3. Backend (akita-api)

```mermaid
flowchart LR
  subgraph HTTP
    R[Route plugin<br/>validates with contracts schemas] --> SV[Service<br/>domain rules, permissions, Plan checks] --> RP[Repository<br/>Prisma]
  end
  subgraph CC[Cross-cutting plugins]
    AU[auth: Better Auth session → user, Workspace role]
    RL[rate limit: per user, per IP for Guests]
    ER[errors: contracts error codes → HTTP]
  end
  subgraph Realtime
    WS[collab plugin<br/>Yjs sync, awareness, Soft locks] --> PS[Yjs persistence<br/>updates → PostgreSQL, compaction]
  end
  AU --> R
  AU --> WS
```

- **One Elysia plugin per feature:** auth, workspaces, folders, designs, snapshots, public-links, comments, notifications, assets, fonts, stock, templates, exports, plans. Each plugin owns its routes, service and repository.
- **Validation:** Elysia validates requests with the Zod schemas from `contracts`, through its Standard Schema support. Response types come from the same schemas, so Eden stays in sync.
- **Permissions:** checked in services from the caller's Workspace role. Routes never query the database directly.
- **Background jobs:** a Postgres-backed queue handles Export jobs, the Trash and Snapshot purges, Invitation expiry and the notification email summary.

## 4. Frontend (akita-web)

```mermaid
flowchart TD
  subgraph Routes
    PUB["/ , /product, /about<br/>SSR"]
    SHARE["/s/:token<br/>SSR (Public link)"]
    APP["/app/...<br/>client: dashboard, Folders, Templates"]
    ED["/app/design/:id<br/>client only: editor"]
  end
  subgraph State
    Q[TanStack Query<br/>server data]
    ST[TanStack Store<br/>UI state: tool, selection, viewport, panels]
    Y[Yjs doc<br/>Design content]
    F[TanStack Form<br/>forms, contracts schemas]
  end
  APP --> Q
  APP --> F
  ED --> Y
  ED --> ST
  ED --> Q
  SHARE --> Q
```

Folder layout inside `src/`:
- `routes/`: file-based routes, kept thin.
- `features/<feature>/`: components, queries and forms for each feature, for example `features/workspaces`.
- `editor/`: the stage, tools, panels, Layers panel, and the Moveable, Selecto and Tiptap adapters.
- `components/ui/`: shadcn/ui components, styled by [DESIGN.md](../DESIGN.md).
- `integrations/`: the Better Auth client, the Eden client and the Query client.

State rules:
- Design content changes only through `design-model` operations on the Yjs doc.
- TanStack Store never holds a copy of Design content.
- While dragging or transforming, the editor updates the DOM directly and commits to Yjs once when the gesture ends.

## 5. Key flows

### Open a Design and co-edit

```mermaid
sequenceDiagram
  participant A as Member A
  participant B as Member B
  participant API as akita-api (collab)
  participant PG as PostgreSQL
  A->>API: WS connect /collab/:designId (session cookie)
  API->>API: check Workspace role (Viewer → read-only)
  API->>PG: load compacted state + pending updates
  API-->>A: sync step 1/2 (full state)
  A->>API: select Element → Soft lock request
  API-->>B: awareness: Element locked by A
  A->>API: Yjs update (on gesture end)
  API->>API: reject if Element soft-locked by someone else
  API->>PG: append update
  API-->>B: broadcast update
```

### Export

```mermaid
sequenceDiagram
  participant U as Member
  participant API as akita-api
  participant PG as PostgreSQL (queue)
  participant RW as akita-renderer
  participant S3 as MinIO
  U->>API: POST /exports {designId, format, options}
  API->>API: take a Snapshot of the current state
  API->>PG: insert ExportJob (queued)
  RW->>PG: claim job
  RW->>S3: read Snapshot, Fonts, Assets
  RW->>RW: render in headless Chrome (PNG/JPG/PDF/Print PDF)
  RW->>S3: write file
  RW->>PG: job done + output key
  API-->>U: status by polling or notification → presigned download URL
```

### Guest opens a Public link

```mermaid
sequenceDiagram
  participant G as Guest
  participant WEB as akita-web (SSR)
  participant API as akita-api
  G->>WEB: GET /s/:token
  WEB->>API: resolve link (enabled, expiry, password)
  API-->>WEB: Publishable Snapshots (latest first) or an empty list
  WEB-->>G: server-rendered page of the latest Publishable Snapshot
  Note over G,API: Guests never open the collaboration WebSocket
```

## 6. Cross-cutting concerns

| Concern | Approach |
|---|---|
| Auth | Better Auth in the API, with magic link, Google, and the organization plugin for Workspaces. The same session cookie covers REST and WebSocket. |
| Authorization | Workspace role checks in services. Viewers get read-only collaboration. Guests only reach the Public link endpoints. |
| Plans | Entitlements are defined in `contracts`, checked in services and shown in the UI. |
| i18n | Paraglide messages in six languages. The UI language also sets the default Text language. |
| Uploads | The API issues presigned PUT URLs; the browser uploads straight to MinIO; the API records the metadata. |
| Rendering parity | The editor, Public link view and renderer all use `design-renderer` with the same Fonts from MinIO. |
| Testing | `bun test` covers `design-model`, the API end to end (real PostgreSQL and MinIO) and collaboration with simulated clients. Playwright runs under Node for the browser journeys. |
| Local development | Docker Compose for PostgreSQL, MinIO and Mailpit. Everything else runs with `bun run dev`. |

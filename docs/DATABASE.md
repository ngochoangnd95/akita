# Database

This document describes the data model: PostgreSQL through Prisma. Terms follow [CONTEXT.md](../CONTEXT.md), and system context is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Principles

- **Design content is not stored in tables.** Pages, Elements and Backgrounds live in each Design's Yjs document (ADR 0001). PostgreSQL stores the Yjs update log and a compacted state. A few fields (title, Format, thumbnail) are mirrored on `Design` for listing and search.
- **Large binaries live in MinIO.** Tables hold only object keys: Snapshots, Assets, Fonts, thumbnails and Export files.
- **Better Auth owns identity tables.** `User`, `Session`, `Account` and `Verification` come from Better Auth, and `Organization`, `Member` and `Invitation` from its organization plugin. In code and in the UI, an organization is called a **Workspace**.
- IDs are `cuid2` strings. Timestamps are `timestamptz`. Deletion is soft only where the glossary requires it (Trash).

## 1. Identity and Workspaces

```mermaid
erDiagram
  User ||--o{ Session : has
  User ||--o{ Account : "signs in with"
  User ||--o{ Member : "belongs via"
  Organization ||--o{ Member : has
  Organization ||--o{ Invitation : sends
  User ||--o{ Invitation : "invited by"

  User {
    string id PK
    string email UK
    boolean emailVerified
    string name
    string image
    string locale
    boolean isStaff
  }
  Organization {
    string id PK
    string name
    string slug UK
    boolean isPersonal
    enum plan "free | pro"
    boolean viewersCanComment
    bigint storageUsedBytes
  }
  Member {
    string id PK
    string organizationId FK
    string userId FK
    enum role "owner | admin | editor | viewer"
  }
  Invitation {
    string id PK
    string organizationId FK
    string email
    enum role
    enum status "pending | accepted | revoked | expired"
    datetime expiresAt
    string inviterId FK
  }
```

- `Organization` is the **Workspace**. `plan`, `isPersonal`, `viewersCanComment` and `storageUsedBytes` are extra fields on the Better Auth model.
- There is exactly one `owner` Member per Workspace, enforced in the service layer.
- `Session`, `Account` and `Verification` follow Better Auth's schema unchanged. Magic links use `Verification`, and Google uses `Account`.

## 2. Designs and history

```mermaid
erDiagram
  Organization ||--o{ Folder : has
  Organization ||--o{ Design : owns
  Folder |o--o{ Design : contains
  Design ||--|| DesignDocument : "live state"
  Design ||--o{ DesignUpdate : "update log"
  Design ||--o{ Snapshot : history
  Design ||--o| PublicLink : "shared by"

  Folder {
    string id PK
    string organizationId FK
    string name
  }
  Design {
    string id PK
    string organizationId FK
    string folderId FK "nullable"
    string title
    string formatKey
    float width
    float height
    enum unit "px | mm | cm | in"
    int dpi
    float bleed
    string thumbnailKey
    string createdById FK
    datetime deletedAt "Trash"
    datetime updatedAt
  }
  DesignDocument {
    string designId PK
    bytes state "compacted Yjs state"
    bigint lastUpdateId
  }
  DesignUpdate {
    bigint id PK
    string designId FK
    bytes update
    string userId FK
    datetime createdAt
  }
  Snapshot {
    string id PK
    string designId FK
    string storageKey
    string name "nullable, Named version"
    boolean publishable
    enum trigger "interval | session_end | pre_restore | manual | export"
    string createdById FK
    datetime createdAt
  }
  PublicLink {
    string id PK
    string designId FK "unique"
    string token UK
    boolean enabled
    boolean allowDownload
    string passwordHash "Pro"
    datetime expiresAt "Pro"
  }
```

- **Yjs persistence:** the collaboration server appends each update to `DesignUpdate`. A compaction job folds old updates into `DesignDocument.state` and deletes them.
- **Constraints:**
  - `CHECK (publishable = false OR name IS NOT NULL)`: only Named versions can be publishable.
  - A Named version is a `Snapshot` with a `name`; there is no separate table.
- **Retention:**
  - Unnamed Snapshots older than 30 days are deleted, together with their MinIO objects.
  - Designs with `deletedAt` older than 30 days are deleted, which cascades to their Snapshots, Comments and Public link.
- **Indexes:**
  - `Design(organizationId, deletedAt, updatedAt DESC)`
  - `Design(folderId)`
  - trigram index on `Design.title` for search
  - `DesignUpdate(designId, id)`
  - `Snapshot(designId, createdAt DESC)`
  - partial index `Snapshot(designId) WHERE publishable`

## 3. Collaboration

```mermaid
erDiagram
  Design ||--o{ CommentThread : has
  CommentThread ||--o{ Comment : contains
  Comment ||--o{ Mention : mentions
  User ||--o{ Comment : writes
  User ||--o{ Notification : receives

  CommentThread {
    string id PK
    string designId FK
    string pageId "Yjs id"
    string elementId "Yjs id, nullable"
    datetime resolvedAt
    string resolvedById FK
  }
  Comment {
    string id PK
    string threadId FK
    string authorId FK
    text body
    datetime editedAt
    datetime createdAt
  }
  Mention {
    string commentId FK
    string userId FK
  }
  Notification {
    string id PK
    string userId FK
    enum type "mention | reply | invitation | export_ready"
    json payload
    datetime readAt
    datetime emailedAt
  }
```

- `pageId` and `elementId` are IDs from the Yjs document. If an Element is deleted, its thread stays and is shown as attached to the Page.
- Presence and Soft locks are **not persisted**. They live only in the collaboration server's awareness state.
- The email summary job sends Notifications where `emailedAt IS NULL`.

## 4. Content

```mermaid
erDiagram
  Organization ||--o{ Asset : stores
  Organization |o--o{ Font : uploads
  Organization |o--o{ Template : "workspace scope"
  Template ||--o{ TemplateVersion : versions

  Asset {
    string id PK
    string organizationId FK
    enum kind "image | video | audio"
    string mime
    string storageKey
    bigint sizeBytes
    int width
    int height
    enum source "upload | unsplash | pexels"
    json attribution
    string uploadedById FK
    datetime createdAt
  }
  Font {
    string id PK
    string organizationId FK "null = curated"
    string family
    int weight
    string style
    string[] scripts "latin, vietnamese, ja, zh-Hans, zh-Hant, ko"
    string storageKey
    string license
    boolean rightsConfirmed
    string uploadedById FK
  }
  Template {
    string id PK
    enum scope "global | workspace"
    string organizationId FK "null when global"
    string currentVersionId FK
    enum status "published | unpublished"
    string[] keywords
    string createdById FK
  }
  TemplateVersion {
    string id PK
    string templateId FK
    int version
    string snapshotKey
    string thumbnailKey
    string formatKey
    datetime publishedAt
  }
```

- **Text in a Design references Fonts by ID** inside the Yjs document. Copying a Design to another Workspace copies the referenced Asset and Font rows and their MinIO objects.
- **Plan limits:**
  - At most 10 custom `Font` rows per Workspace on the free Plan.
  - `storageUsedBytes` on the Workspace is updated whenever an `Asset` or `Font` is created or deleted.
- **Keywords** are stored as a `text[]` with a GIN index. Keyword search does not depend on language.
- **Templates:** creating a Design from a Template copies `TemplateVersion.snapshotKey` into a new Design. Existing Designs never change when a Template changes.

## 5. Output and jobs

```mermaid
erDiagram
  Design ||--o{ ExportJob : requests
  Snapshot ||--o{ ExportJob : "rendered from"
  User ||--o{ ExportJob : requests

  ExportJob {
    string id PK
    string designId FK
    string snapshotId FK
    string requestedById FK "null for Guest downloads"
    enum format "png | jpg | pdf | print_pdf"
    json options "scale, transparent, quality, pages, bleed"
    enum status "queued | running | done | failed"
    int progress
    string outputKey
    string error
    datetime createdAt
    datetime finishedAt
  }
```

- **The job queue** lives in its own PostgreSQL schema, managed by the queue library. `ExportJob` is the table users see, and it stores the job's status and result.
- **Scheduled jobs:**
  - Snapshot purge
  - Trash purge
  - Invitation expiry
  - Yjs compaction
  - notification email summary
  - deleting Export files older than 7 days

## Migrations

- Prisma Migrate. Better Auth's schema is generated into the same Prisma schema with its CLI.
- Migrations run in CI and at deploy time, never at app startup.
- The API's end-to-end tests run migrations against a fresh PostgreSQL container.

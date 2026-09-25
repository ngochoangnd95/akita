# Akita

A collaborative web editor, inspired by Canva, for designing banners, posters, book covers, presentations and short videos.

## Language

### Designs

**Design**:
A single document a user edits. It has exactly one **Format** and an ordered list of **Pages**.
_Avoid_: Project, file, document, canvas

**Format**:
The kind and page size of a **Design**, such as "Instagram post 1080×1080" or "A4 poster". Resizing a Design changes its Format in place; it does not create a new Design.
_Avoid_: Template, preset, paper size

**Page**:
One surface of a **Design**, sized by its **Format**. It holds **Elements** that may overlap each other or be hidden.
_Avoid_: Slide, artboard, canvas

**Element**:
A single object placed on a **Page**: text, image, shape, line, icon, **Frame**, **Group** or **Background**.
_Avoid_: Object, node, layer, item

**Frame**:
An **Element** that shows an image clipped to a shape. An image inside a Frame has no shadow.
_Avoid_: Mask, placeholder

**Background**:
An **Element** that fills its **Page** at a fixed size and position and always sits below every other Element. Every **Page** has exactly one. It cannot be dragged, hidden or deleted, and has no shadow. It holds an image, a rectangle with a solid or gradient color, or nothing (transparent); resetting it makes it white.
_Avoid_: Backdrop, page color

**Group**:
An **Element** that contains other Elements, including other Groups, so they move and transform together.

**Hidden Element**:
An **Element** switched out of view: it stays in the **Design** but does not appear on the **Page** or in **Exports**. Resizing a **Design** hides any Element left fully outside its Page instead of deleting it. Resizing again shows those Elements if they fit inside the Page, but never Elements a user hid by hand.
_Avoid_: Invisible, removed

**Locked Element**:
An **Element** that a user has deliberately locked so no one can move, resize or edit it until it is unlocked.

**Soft lock**:
A temporary claim on an **Element** while one person is working on it, which stops other people from changing it at the same time. It is released automatically, unlike a **Locked Element**.
_Avoid_: Lock, claim

**Layers panel**:
The ordered list of a **Page**'s **Elements**, used to reorder, rename, select, hide, lock and delete them.
_Avoid_: Layer list, outline

**Text language**:
The language recorded on a piece of text, which decides the glyphs and line-breaking rules used to show it.
_Avoid_: Locale

### Presenting

**Present mode**:
Showing a **Design**'s **Pages** full screen, one after another, inside Akita.
_Avoid_: Slideshow, play mode

**Transition**:
The visual effect used when **Present mode** moves from one **Page** to the next.

**Speaker notes**:
Private text attached to a **Page**, shown only to the presenter in **Present mode**.

### Collaboration and ownership

**Workspace**:
The owner of **Designs**, **Assets** and **Templates**. Every **User** has a personal Workspace and may belong to others.
_Avoid_: Team, organization, account

**User**:
A person with an Akita login.
_Avoid_: Account, customer

**Member**:
A **User**'s membership in a **Workspace**, with one role: owner, admin, editor or **Viewer**. Each Workspace has exactly one owner.
_Avoid_: Collaborator, seat

**Invitation**:
An emailed offer to join a **Workspace** as a **Member** with a given role. The person must sign in, or sign up, to accept it.
_Avoid_: Invite link, share

**Viewer**:
A **Member** with the viewer role. A Viewer sees live editing and every **Snapshot**, and may comment if the **Workspace** allows it, but cannot edit.
_Avoid_: Reader, read-only user

**Guest**:
An anonymous visitor who opens a **Design** through a **Public link**. A Guest sees only its **Publishable Snapshots**.
_Avoid_: Visitor, public viewer, anonymous user

**Folder**:
A named container for **Designs** inside a **Workspace**. Folders cannot contain other Folders.
_Avoid_: Directory, collection, project

**Trash**:
Where deleted **Designs** stay for 30 days before they are permanently deleted along with their **Snapshots**, **Comments** and **Public link**.
_Avoid_: Recycle bin, archive

**Public link**:
A URL that lets **Guests** view, without signing in, a **Design**'s **Publishable Snapshots**, but not its live state or its other Snapshots. If no Snapshot is publishable, the Guest sees nothing.
_Avoid_: Share link

**Comment**:
A discussion message attached to an **Element** or a **Page** of a **Design**.

### History

**Snapshot**:
A saved, read-only state of a whole **Design** at a point in time. A Design has many Snapshots; restoring one creates a new Snapshot instead of deleting later ones. Unnamed Snapshots are deleted after 30 days.
_Avoid_: Revision, backup, checkpoint

**Named version**:
A **Snapshot** that a user has given a name, such as "Final v2". Named versions are never deleted automatically.
_Avoid_: Release, tag

**Publishable Snapshot**:
A **Named version** marked as fit to show through a **Public link**. A Snapshot must be named before it can be marked publishable.
_Avoid_: Published version, public snapshot

### Content

**Template**:
A **Design** offered as a starting point, described by a list of **Keywords**. Staff publish Templates for everyone; a **Workspace** can also save its own Designs as Templates for its **Members**.
_Avoid_: Theme, preset

**Keyword**:
A search term attached to a **Template** to help users find it.
_Avoid_: Tag, category

**Asset**:
A media file uploaded to a **Workspace** or taken from a stock library, such as an image, a video clip or an audio track.
_Avoid_: Media, upload, resource

**Font**:
A typeface available in the editor, either from Akita's curated open-licence set or uploaded to a **Workspace**. Each **Text language** has a fallback Font used when a character is missing.

### Output

**Export**:
A file produced from a **Design**: PNG, JPG, standard PDF, print PDF or MP4.
_Avoid_: Download, render

**Print PDF**:
A PDF **Export** intended for a printer, with bleed, crop marks and embedded **Fonts**.
_Avoid_: Print-ready file

### Business

**Plan**:
The subscription tier (free or Pro) that decides which features and limits apply.
_Avoid_: Tier, subscription, package

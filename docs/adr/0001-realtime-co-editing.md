# Real-time co-editing from v1

Several people can edit the same Design at the same time and see each other's changes live. We chose this over share-and-comment with one editor at a time, even though it is more work up front. Adding live editing later would mean changing how Designs are stored and synced, which is much harder than designing for it now.

## Consequences

- A Design's live state is merge-friendly shared data (a CRDT such as Yjs), synced over WebSockets, not a record saved whole by one client.
- Client state stores (Zustand) hold only UI state such as selection, tool and viewport. They are not the source of truth for Design content.
- Undo and redo are per user: each person undoes only their own changes.
- While one person works on an Element, a Soft lock stops everyone else from changing it, so two people never edit the same Element (for example the same text box) at once. The CRDT merges concurrent changes to different Elements.
- Editing keeps working through short disconnects, and changes merge when the connection returns.

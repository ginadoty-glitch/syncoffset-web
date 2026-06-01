/**
 * SyncOffset Script Authority — revision change kinds
 */

export type RevisionChangeKind = "added" | "modified" | "removed" | "moved" | "renumbered";

export type RevisionChangeKindDefinition = {
  readonly kind: RevisionChangeKind;
  readonly label: string;
  readonly description: string;
};

export const REVISION_CHANGE_KIND_REGISTRY: Record<RevisionChangeKind, RevisionChangeKindDefinition> = {
  added: {
    kind: "added",
    label: "Added",
    description: "Scene or content introduced in target revision.",
  },
  modified: {
    kind: "modified",
    label: "Modified",
    description: "Scene or content altered between revisions.",
  },
  removed: {
    kind: "removed",
    label: "Removed",
    description: "Scene or content dropped from target revision.",
  },
  moved: {
    kind: "moved",
    label: "Moved",
    description: "Scene order or placement changed.",
  },
  renumbered: {
    kind: "renumbered",
    label: "Renumbered",
    description: "Scene numbering changed without content move.",
  },
};

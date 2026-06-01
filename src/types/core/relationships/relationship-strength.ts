/**
 * SyncOffset Relationship Graph — edge strength / priority
 *
 * Used by future query and propagation layers to order edges — not evaluation logic.
 */

export type RelationshipStrength = "structural" | "operational" | "informational" | "derived";

export type RelationshipStrengthDefinition = {
  readonly strength: RelationshipStrength;
  readonly label: string;
  readonly description: string;
};

export const RELATIONSHIP_STRENGTH_ORDER: ReadonlyArray<RelationshipStrength> = [
  "structural",
  "operational",
  "derived",
  "informational",
];

export const RELATIONSHIP_STRENGTH_REGISTRY: Record<RelationshipStrength, RelationshipStrengthDefinition> = {
  structural: {
    strength: "structural",
    label: "Structural",
    description: "Defines production topology (day, scene, location, calendar).",
  },
  operational: {
    strength: "operational",
    label: "Operational",
    description: "Movement, assignment, or clearance required for shoot execution.",
  },
  derived: {
    strength: "derived",
    label: "Derived",
    description: "Lineage from extraction or output generation — provenance only.",
  },
  informational: {
    strength: "informational",
    label: "Informational",
    description: "Soft link for context; no blocking propagation by default.",
  },
};

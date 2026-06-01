/**
 * SyncOffset Background — category registry (extensible)
 *
 * Categories classify BG Requirements (production needs), not individual performers.
 */

export type BgCategoryId =
  | "pedestrian"
  | "office-worker"
  | "restaurant-patron"
  | "hospital-staff"
  | "police"
  | "military"
  | "casino-patron"
  | "wedding-guest"
  | "concert-crowd"
  | "stadium-crowd"
  | "custom";

export type BgCategoryRegistryEntry = {
  readonly id: BgCategoryId;
  readonly label: string;
  readonly description: string;
  readonly exampleLabels: ReadonlyArray<string>;
  /** True when id is "custom" — production may supply free-text subtype */
  readonly allowsCustomLabel: boolean;
};

export const BG_CATEGORY_REGISTRY: Record<BgCategoryId, BgCategoryRegistryEntry> = {
  pedestrian: {
    id: "pedestrian",
    label: "Pedestrian",
    description: "Street, plaza, or general pedestrian background.",
    exampleLabels: ["Business Pedestrians", "Street Crowd"],
    allowsCustomLabel: false,
  },
  "office-worker": {
    id: "office-worker",
    label: "Office Worker",
    description: "Corporate, administrative, or desk environments.",
    exampleLabels: ["Office Staff", "Corporate Extras"],
    allowsCustomLabel: false,
  },
  "restaurant-patron": {
    id: "restaurant-patron",
    label: "Restaurant Patron",
    description: "Dining, bar, or hospitality seating.",
    exampleLabels: ["Restaurant Guests", "Bar Patrons"],
    allowsCustomLabel: false,
  },
  "hospital-staff": {
    id: "hospital-staff",
    label: "Hospital Staff",
    description: "Medical facility background.",
    exampleLabels: ["Hospital Staff", "Nurses", "Orderlies"],
    allowsCustomLabel: false,
  },
  police: {
    id: "police",
    label: "Police",
    description: "Law enforcement uniform or plainclothes.",
    exampleLabels: ["Police Officers", "Detectives"],
    allowsCustomLabel: false,
  },
  military: {
    id: "military",
    label: "Military",
    description: "Armed forces or ceremonial uniform background.",
    exampleLabels: ["Soldiers", "Military Personnel"],
    allowsCustomLabel: false,
  },
  "casino-patron": {
    id: "casino-patron",
    label: "Casino Patron",
    description: "Gaming floor, lounge, or resort crowd.",
    exampleLabels: ["Casino Patrons", "High Rollers"],
    allowsCustomLabel: false,
  },
  "wedding-guest": {
    id: "wedding-guest",
    label: "Wedding Guest",
    description: "Ceremony or reception background.",
    exampleLabels: ["Wedding Guests", "Bridal Party Guests"],
    allowsCustomLabel: false,
  },
  "concert-crowd": {
    id: "concert-crowd",
    label: "Concert Crowd",
    description: "Audience or venue crowd for live performance.",
    exampleLabels: ["Concert Audience", "Mosh Pit Extras"],
    allowsCustomLabel: false,
  },
  "stadium-crowd": {
    id: "stadium-crowd",
    label: "Stadium Crowd",
    description: "Sports arena or large venue spectators.",
    exampleLabels: ["Stadium Fans", "Bleacher Crowd"],
    allowsCustomLabel: false,
  },
  custom: {
    id: "custom",
    label: "Custom",
    description: "Production-defined category not covered by standard registry entries.",
    exampleLabels: [],
    allowsCustomLabel: true,
  },
};

export function isBgCategoryId(value: string): value is BgCategoryId {
  return value in BG_CATEGORY_REGISTRY;
}

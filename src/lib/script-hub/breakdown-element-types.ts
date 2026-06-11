/** Element type → owning department (crew terms). The category column stores the element type. */
export const BREAKDOWN_ELEMENT_TYPES = [
  { category: "Set", department: "Art Department" },
  { category: "Location", department: "Locations" },
  { category: "Prop", department: "Props" },
  { category: "Vehicle", department: "Transport" },
  { category: "Graphic", department: "Graphics" },
  { category: "Picture Vehicle", department: "Picture Vehicles" },
  { category: "Greens", department: "Greens" },
  { category: "Special Effects", department: "SPFX" },
  { category: "Stunts", department: "Stunts" },
  { category: "Wardrobe Note", department: "Wardrobe" },
  { category: "Makeup Note", department: "Makeup" },
  { category: "VFX Note", department: "VFX" },
  { category: "Continuity Note", department: "Continuity" },
] as const;

export type BreakdownElementCategory = (typeof BREAKDOWN_ELEMENT_TYPES)[number]["category"];

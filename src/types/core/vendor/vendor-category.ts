/**
 * SyncOffset Vendor Authority — vendor category registry
 */

export type VendorCategoryId =
  | "prop-house"
  | "rental-house"
  | "customs-broker"
  | "freight-forwarder"
  | "shipping-carrier"
  | "florist"
  | "graphics"
  | "construction"
  | "transportation"
  | "camera"
  | "wardrobe"
  | "set-decoration"
  | "grip-electric"
  | "catering"
  | "location-service"
  | "post-house"
  | "general-supplier"
  | "custom";

export type VendorCategoryDefinition = {
  readonly id: VendorCategoryId;
  readonly label: string;
  readonly description: string;
  readonly allowsCustomLabel: boolean;
};

export const VENDOR_CATEGORY_REGISTRY: Record<VendorCategoryId, VendorCategoryDefinition> = {
  "prop-house": {
    id: "prop-house",
    label: "Prop House",
    description: "Props, set dressing items, and related rentals.",
    allowsCustomLabel: false,
  },
  "rental-house": {
    id: "rental-house",
    label: "Rental House",
    description: "Equipment and package rentals for production departments.",
    allowsCustomLabel: false,
  },
  "customs-broker": {
    id: "customs-broker",
    label: "Customs Broker",
    description: "Cross-border clearance, carnets, and customs documentation.",
    allowsCustomLabel: false,
  },
  "freight-forwarder": {
    id: "freight-forwarder",
    label: "Freight Forwarder",
    description: "Freight coordination and international shipping logistics.",
    allowsCustomLabel: false,
  },
  "shipping-carrier": {
    id: "shipping-carrier",
    label: "Shipping Carrier",
    description: "Parcel, LTL, and carrier movement services.",
    allowsCustomLabel: false,
  },
  florist: {
    id: "florist",
    label: "Florist",
    description: "Florals and greens supply for sets.",
    allowsCustomLabel: false,
  },
  graphics: {
    id: "graphics",
    label: "Graphics Vendor",
    description: "Signage, vinyl, and printed graphics for sets.",
    allowsCustomLabel: false,
  },
  construction: {
    id: "construction",
    label: "Construction Vendor",
    description: "Builds, scaffolding, and construction services.",
    allowsCustomLabel: false,
  },
  transportation: {
    id: "transportation",
    label: "Transportation Vendor",
    description: "Fleet, drivers, and production transport services.",
    allowsCustomLabel: false,
  },
  camera: {
    id: "camera",
    label: "Camera Vendor",
    description: "Camera, lens, and grip-adjacent rental vendors.",
    allowsCustomLabel: false,
  },
  wardrobe: {
    id: "wardrobe",
    label: "Wardrobe Vendor",
    description: "Costume purchase, rental, and tailoring vendors.",
    allowsCustomLabel: false,
  },
  "set-decoration": {
    id: "set-decoration",
    label: "Set Decoration Supplier",
    description: "Set dec purchase and rental suppliers.",
    allowsCustomLabel: false,
  },
  "grip-electric": {
    id: "grip-electric",
    label: "Grip & Electric Supplier",
    description: "Grip and electric rental and expendables vendors.",
    allowsCustomLabel: false,
  },
  catering: {
    id: "catering",
    label: "Catering Vendor",
    description: "Catering and commissary supply vendors.",
    allowsCustomLabel: false,
  },
  "location-service": {
    id: "location-service",
    label: "Location Service",
    description: "Location fees, permits support, and site services.",
    allowsCustomLabel: false,
  },
  "post-house": {
    id: "post-house",
    label: "Post House",
    description: "Editorial, color, and post-production vendors.",
    allowsCustomLabel: false,
  },
  "general-supplier": {
    id: "general-supplier",
    label: "General Supplier",
    description: "General production supply vendor.",
    allowsCustomLabel: false,
  },
  custom: {
    id: "custom",
    label: "Custom Vendor",
    description: "Production-defined vendor category.",
    allowsCustomLabel: true,
  },
};

export function isVendorCategoryId(value: string): value is VendorCategoryId {
  return value in VENDOR_CATEGORY_REGISTRY;
}

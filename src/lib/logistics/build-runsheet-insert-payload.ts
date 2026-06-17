/**
 * Mirrors mobile AppProvider.buildRunsheetInsertPayload — same runsheets insert contract.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUUID(value: string | undefined | null): boolean {
  return typeof value === "string" && UUID_REGEX.test(value);
}

export type TransportOrderForm = {
  orderNumber: string;
  vendorId?: string;
  vendorName: string;
  pickupLocation: string;
  deliveryLocation: string;
  requestedDate: string;
  driverSub?: string;
  notes?: string;
};

export function buildRunsheetInsertPayload(form: TransportOrderForm, showId: string): Record<string, unknown> {
  const pickupAddress = form.pickupLocation.trim();
  const deliveryLocation = form.deliveryLocation.trim();
  const scheduledDate = form.requestedDate.trim() ? new Date(`${form.requestedDate.trim()}T12:00:00`) : new Date();

  return {
    show_id: showId,
    kind: "purchase",
    scheduled_date: scheduledDate.toISOString(),
    pickup_vendor_id: isUUID(form.vendorId) ? form.vendorId : null,
    pickup_vendor_name: form.vendorName.trim() || null,
    pickup_address: pickupAddress,
    dropoff_location_name: deliveryLocation || null,
    dropoff_address: deliveryLocation,
    driver_sub: form.driverSub?.trim() || null,
    items: [],
    notes: form.notes?.trim() || null,
    status: "draft",
    po_number: form.orderNumber.trim() || null,
    return_required: false,
    flag_high_value: false,
    flag_damaged: false,
    flag_missing: false,
  };
}

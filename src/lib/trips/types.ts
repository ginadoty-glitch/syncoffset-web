export type TripStopRow = {
  id: string;
  trip_id: string;
  kind: string;
  vendor_name: string | null;
  address: string;
  status: string;
  position: number;
  notes: string | null;
};

export type TripRow = {
  id: string;
  show_id: string;
  driver_sub: string | null;
  designation: string;
  status: string;
  po_number: string | null;
  ros: string | null;
  created_at: string;
  updated_at: string;
  stops: TripStopRow[];
};

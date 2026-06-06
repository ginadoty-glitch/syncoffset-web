export type VendorRow = {
  id: string;
  show_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  gst_number: string | null;
  gst_confirmed: boolean | null;
  account_number: string | null;
  credit_limit: number | null;
  created_at: string;
  address: string | null;
  category: string | null;
};

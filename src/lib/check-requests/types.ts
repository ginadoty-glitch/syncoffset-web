export type ProductionCheckRequestRow = {
  id: string;
  show_id: string;
  request_number: string | null;
  vendor_name: string | null;
  request_scope: string;
  requested_amount: number | null;
  currency_code: string;
  payment_method_requested: string;
  status: string;
  justification: string | null;
  updated_at: string;
};

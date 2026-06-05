export type ProductionBudgetLineRow = {
  id: string;
  show_id: string;
  source_type: string;
  source_id: string | null;
  category: string;
  department: string | null;
  description: string;
  quantity: number;
  unit_cost: number;
  estimated_cost: number;
  actual_cost: number | null;
  status: string;
  updated_at: string;
};

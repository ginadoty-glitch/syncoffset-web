export type ProductionTaskRow = {
  id: string;
  show_id: string;
  title: string;
  notes: string | null;
  status: string;
  priority: string;
  due_at: string | null;
  assignee_name: string | null;
  link_type: string | null;
  linked_id: string | null;
  updated_at: string;
};

export type CrewContactRow = {
  id: string;
  show_id: string;
  name: string;
  department: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
};

export type CrewDirectoryRow = {
  id: string;
  source: "contact" | "driver" | "member";
  name: string;
  department: string | null;
  role: string | null;
  position: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  notes: string | null;
  status: string | null;
};

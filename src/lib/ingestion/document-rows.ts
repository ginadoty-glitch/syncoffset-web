import type { CoreRelationship } from "@/types/core/base";
import type { DocumentCategory } from "@/types/core/document/document-category";
import type { DocumentStatus } from "@/types/core/document/document-status";
import type { CalendarRevisionColor } from "@/types/core/production-calendar/calendar-revision-colors";

export type DocumentRow = {
  id: string;
  production_id: string;
  kind: "document";
  status: string;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
  source_document_id: string | null;
  source_version_id: string | null;
  relationships: CoreRelationship[];
  document_number: string;
  title: string;
  category_id: DocumentCategory;
  status_id: DocumentStatus;
  notes: string;
  set_id: string | null;
  set_number: string | null;
  scene_id: string | null;
  document_revision_ids: string[];
  document_package_ids: string[];
  document_link_ids: string[];
  generated_output_ids: string[];
};

export type DocumentRevisionRow = {
  id: string;
  production_id: string;
  kind: "document-revision";
  status: string;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
  source_document_id: string | null;
  source_version_id: string | null;
  relationships: CoreRelationship[];
  document_id: string;
  revision_number: number;
  revision_color: CalendarRevisionColor | null;
  revision_recorded_at: string;
  revision_recorded_by: string;
};

import { notFound } from "next/navigation";

import { getSourceDocumentDetail } from "@/lib/ingestion/queries";

import { SourceDocumentDetailView } from "../_components/source-document-detail";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function IngestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getSourceDocumentDetail(id);

  if (!detail) {
    notFound();
  }

  return <SourceDocumentDetailView detail={detail} />;
}

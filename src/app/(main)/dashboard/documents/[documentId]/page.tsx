import { notFound } from "next/navigation";

import { DocumentDetailView } from "@/components/documents/document-detail-view";
import { getDocumentDetailWithSet } from "@/lib/documents/document-set-queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ documentId: string }>;
};

export default async function DocumentDetailPage({ params }: PageProps) {
  const { documentId } = await params;
  const detail = await getDocumentDetailWithSet(documentId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <DocumentDetailView detail={detail} />
    </div>
  );
}

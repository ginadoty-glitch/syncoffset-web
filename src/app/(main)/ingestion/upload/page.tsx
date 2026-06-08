import { UploadForm } from "../_components/upload-form";

type PageProps = {
  searchParams: Promise<{ kind?: string; label?: string }>;
};

export default async function IngestionUploadPage({ searchParams }: PageProps) {
  const { kind, label } = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-xl tracking-tight">Upload Production Document</h1>
        <p className="text-muted-foreground text-sm">
          Accepted formats: PDF, XLSX, CSV, PNG, JPG.
        </p>
      </div>
      <UploadForm defaultKind={kind} contextLabel={label} />
    </div>
  );
}

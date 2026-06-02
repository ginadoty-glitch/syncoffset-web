import { UploadForm } from "../_components/upload-form";

export default function IngestionUploadPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-xl tracking-tight">Upload</h1>
        <p className="text-muted-foreground text-sm">Store file in Supabase Storage and create a source document.</p>
      </div>
      <UploadForm />
    </div>
  );
}

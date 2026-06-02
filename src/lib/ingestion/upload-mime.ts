/** Sprint-allowed upload types: PDF, XLSX, CSV, PNG, JPG */
export const ALLOWED_UPLOAD_EXTENSIONS = [".pdf", ".xlsx", ".csv", ".png", ".jpg", ".jpeg"] as const;

const EXTENSION_MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv": "text/csv",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

export function mimeTypeForFileName(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  for (const ext of ALLOWED_UPLOAD_EXTENSIONS) {
    if (lower.endsWith(ext)) {
      return EXTENSION_MIME[ext] ?? null;
    }
  }
  return null;
}

export function isAllowedUploadFile(file: File): boolean {
  const mime = mimeTypeForFileName(file.name);
  if (!mime) return false;
  if (file.type && file.type !== mime && file.type !== "application/octet-stream") {
    return ALLOWED_UPLOAD_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
  }
  return true;
}

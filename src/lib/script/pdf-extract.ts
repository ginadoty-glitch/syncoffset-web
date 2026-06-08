/**
 * Script PDF text extraction — uses pdf-parse for proper decompression
 * of FlateDecode content streams. Falls back to heuristic extraction
 * for simple/uncompressed PDFs.
 */

export type ScriptPdfExtractionResult = {
  text: string;
  pageCount: number;
  method: "pdf-parse" | "heuristic";
};

export async function extractScriptPdfText(buffer: Buffer): Promise<ScriptPdfExtractionResult> {
  try {
    const pdfParse = (await import("pdf-parse")) as unknown as (buf: Buffer) => Promise<{
      numpages: number;
      text: string;
    }>;
    const result = await pdfParse(buffer);

    if (result.text && result.text.trim().length > 20) {
      return {
        text: result.text.trim(),
        pageCount: result.numpages ?? 0,
        method: "pdf-parse",
      };
    }
  } catch {
    // pdf-parse failed — fall back to heuristic
  }

  // Fallback: heuristic extraction for simple PDFs
  const { extractPdfTextLinesFromBinaryPageIsolated } = await import("@/lib/schedule/pdf-text-extract");
  const binary = buffer.toString("latin1");
  const heuristic = extractPdfTextLinesFromBinaryPageIsolated(binary);

  return {
    text: heuristic.text,
    pageCount: heuristic.pagesSucceeded + heuristic.pagesFailed,
    method: "heuristic",
  };
}

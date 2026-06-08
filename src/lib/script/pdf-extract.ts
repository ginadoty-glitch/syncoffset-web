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
  const diag = (msg: string) => process.stderr.write(`[pdf-extract] ${msg}\n`);
  diag(`buffer size: ${buffer.length} bytes`);

  try {
    diag("importing pdf-parse...");
    const mod = await import("pdf-parse");
    diag(`import resolved — typeof mod: ${typeof mod}, keys: ${Object.keys(mod as Record<string, unknown>).join(",")}`);

    const pdfParse =
      typeof mod === "function"
        ? (mod as (buf: Buffer) => Promise<{ numpages: number; text: string }>)
        : typeof (mod as Record<string, unknown>).default === "function"
          ? ((mod as Record<string, unknown>).default as (buf: Buffer) => Promise<{ numpages: number; text: string }>)
          : null;

    if (!pdfParse) {
      diag(
        `pdf-parse not callable — typeof mod: ${typeof mod}, typeof mod.default: ${typeof (mod as Record<string, unknown>).default}`,
      );
    } else {
      diag("calling pdfParse(buffer)...");
      const result = await pdfParse(buffer);
      diag(`pdf-parse result — pages: ${result.numpages}, text length: ${result.text?.length ?? 0}`);

      if (result.text && result.text.trim().length > 20) {
        diag("pdf-parse succeeded — returning");
        return {
          text: result.text.trim(),
          pageCount: result.numpages ?? 0,
          method: "pdf-parse",
        };
      }
      diag(`pdf-parse returned insufficient text: ${result.text?.trim().length ?? 0} chars`);
    }
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    diag(`pdf-parse FAILED — ${msg}`);
  }

  diag("falling through to heuristic extractor");
  const { extractPdfTextLinesFromBinaryPageIsolated } = await import("@/lib/schedule/pdf-text-extract");
  const binary = buffer.toString("latin1");
  const heuristic = extractPdfTextLinesFromBinaryPageIsolated(binary);
  diag(
    `heuristic result — pages ok: ${heuristic.pagesSucceeded}, pages failed: ${heuristic.pagesFailed}, text length: ${heuristic.text.length}, parseIssues: ${heuristic.parseIssues}, truncated: ${heuristic.truncated}`,
  );

  return {
    text: heuristic.text,
    pageCount: heuristic.pagesSucceeded + heuristic.pagesFailed,
    method: "heuristic",
  };
}

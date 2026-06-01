/**
 * SyncOffset Source Ingestion — immutable file reference
 *
 * Constitutional: original bytes are preserved exactly as received.
 * storageRef is the future object-store key; no inline file content in types.
 */

import type { Timestamp } from "../../operations/shared";

export type SourceFileMimeCategory =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument"
  | "application/vnd.ms-excel"
  | "text/csv"
  | "text/plain"
  | "image/jpeg"
  | "image/png"
  | "image/heic"
  | "image/tiff"
  | "video/mp4"
  | "video/quicktime"
  | "audio/wav"
  | "audio/mpeg"
  | "application/octet-stream";

/**
 * Reference to the preserved original file (Article I).
 */
export type SourceFileReference = {
  readonly storageRef: string;
  readonly originalFileName: string;
  readonly mimeType: string;
  readonly mimeCategory?: SourceFileMimeCategory;
  readonly byteSize: number;
  /** SHA-256 hex digest of received file — integrity verification */
  readonly checksumSha256: string;
  readonly receivedAt: Timestamp;
};

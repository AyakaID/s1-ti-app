import { PDFDocument } from "pdf-lib";

export interface CompressResult {
  file: File;
  originalSize: number;
  newSize: number;
}

export async function optimizePdf(file: File): Promise<CompressResult> {
  const originalSize = file.size;
  try {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const saved = await doc.save({ useObjectStreams: true });
    const newFile = new File([saved as unknown as BlobPart], file.name, {
      type: "application/pdf",
    });
    return { file: newFile, originalSize, newSize: newFile.size };
  } catch {
    return { file, originalSize, newSize: originalSize };
  }
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Save uploaded file to public/uploads/{folder}/{filename}
 * Returns the public URL path: /uploads/{folder}/{filename}
 */
export async function saveUploadedFile(
  file: File,
  folder: "submissions" | "materials" | "assignments"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize filename: replace spaces and special chars, keep extension
  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "bin";
  const safeName = file.name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 100);
  const filename = `${timestamp}-${safeName}`;

  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filePath = join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return `/uploads/${folder}/${filename}`;
}

/**
 * Validate file size and type
 */
export function validateFile(
  file: File,
  maxSizeMb: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > maxSizeMb) {
    return { valid: false, error: `File too large. Max ${maxSizeMb} MB.` };
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !allowedTypes.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

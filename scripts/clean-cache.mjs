// Membersihkan cache build Next.js dan Turbopack.
// Dipanggil oleh script `npm run clean` dan `npm run dev:clean`.
// Cross-platform (Windows/macOS/Linux), tidak butuh dependency tambahan.

import { rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const targets = [".next", "node_modules/.cache"];
const root = process.cwd();

async function sizeOf(path) {
  try {
    const { size } = await stat(path);
    return size;
  } catch {
    return null;
  }
}

for (const target of targets) {
  const full = resolve(root, target);
  const exists = (await sizeOf(full)) !== null;

  if (!exists) {
    console.log(`• ${target} tidak ada, dilewati`);
    continue;
  }

  process.stdout.write(`• Menghapus ${target} ... `);
  await rm(full, { recursive: true, force: true });
  console.log("selesai");
}

console.log("Cache bersih. Next dev akan rebuild dari nol.");

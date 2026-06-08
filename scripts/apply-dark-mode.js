const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (name === "node_modules" || name === ".next" || name === "scripts") continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (p.endsWith(".tsx")) files.push(p);
  }
  return files;
}

const replacements = [
  [/className="([^"]*?)rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm([^"]*?)"/g,
    'className="$1rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900$2"'],
  [/className="([^"]*?)rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm([^"]*?)"/g,
    'className="$1rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900$2"'],
  [/className="([^"]*?)overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm([^"]*?)"/g,
    'className="$1overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900$2"'],
  [/className="([^"]*?)rounded-2xl border border-zinc-200 bg-white shadow-sm([^"]*?)"/g,
    (m, a, b) => b.includes("dark:bg") ? m : `className="${a}rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900${b}"`],
  [/text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl/g,
    "text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl"],
  [/text-xl font-bold text-zinc-900/g, "text-xl font-bold text-zinc-900 dark:text-zinc-50"],
  [/text-sm font-semibold text-zinc-900/g, "text-sm font-semibold text-zinc-900 dark:text-zinc-100"],
  [/border-b border-zinc-100 bg-zinc-50/g, "border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"],
  [/divide-y divide-zinc-100/g, "divide-y divide-zinc-100 dark:divide-zinc-800"],
  [/hover:bg-zinc-50\/80/g, "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50"],
  [/className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none/g,
    'className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500'],
];

for (const file of walk(root)) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;
  for (const [re, rep] of replacements) s = s.replace(re, rep);
  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("updated", path.relative(root, file));
  }
}

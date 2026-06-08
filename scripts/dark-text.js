const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const f = path.join(dir, name);
    if (["node_modules", ".next", "scripts"].includes(name)) continue;
    const st = fs.statSync(f);
    if (st.isDirectory()) walk(f);
    else if (f.endsWith(".tsx")) patch(f);
  }
}

function patch(file) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;
  const pairs = [
    ["text-zinc-900", "text-zinc-900 dark:text-zinc-50"],
    ["text-zinc-800", "text-zinc-800 dark:text-zinc-200"],
    ["text-zinc-700", "text-zinc-700 dark:text-zinc-300"],
    ["text-zinc-600", "text-zinc-600 dark:text-zinc-400"],
  ];
  for (const [from, to] of pairs) {
    s = s.replace(new RegExp(from + '(?![^"]*dark:)', "g"), to);
  }
  if (s !== orig) {
    fs.writeFileSync(file, s, "utf8");
    console.log("updated", path.relative(path.join(__dirname, ".."), file));
  }
}

walk(path.join(__dirname, "..", "app"));
walk(path.join(__dirname, "..", "components"));

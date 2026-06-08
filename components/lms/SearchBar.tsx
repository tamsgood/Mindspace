"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = useCallback(
    (value: string) => {
      const q = value.trim();
      if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [router],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      className="relative mx-auto w-full max-w-xl flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        submit(query);
      }}
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
        strokeWidth={1.75}
      />
      <input
        id="global-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses, assignments…"
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-24 text-sm text-zinc-800 outline-none ring-indigo-500/30 placeholder:text-zinc-400 focus:border-indigo-300 focus:bg-white focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500 dark:focus:bg-zinc-950"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 sm:inline">
        ⌘K
      </kbd>
    </form>
  );
}

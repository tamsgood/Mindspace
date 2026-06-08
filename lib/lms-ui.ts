/** Shared Tailwind classes for light/dark consistency across Mindspace LMS */
export const ui = {
  card: "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
  cardPad: "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
  cardPadLg: "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
  pageTitle: "text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl",
  pageSubtitle: "mt-1 text-sm text-zinc-600 dark:text-zinc-400",
  heading: "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
  text: "text-sm text-zinc-600 dark:text-zinc-400",
  textStrong: "font-medium text-zinc-900 dark:text-zinc-100",
  label: "text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400",
  input:
    "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30",
  select:
    "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-400",
  textarea:
    "w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400",
  tableWrap:
    "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
  tableHead:
    "border-b border-zinc-100 bg-zinc-50 text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400",
  tableRow: "divide-y divide-zinc-100 dark:divide-zinc-800",
  tableCell: "text-zinc-800 dark:text-zinc-200",
  link: "text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300",
  mutedBox: "rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950/80",
  divide: "divide-y divide-zinc-100 dark:divide-zinc-800",
  progressTrack: "overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800",
  authCard:
    "rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
} as const;

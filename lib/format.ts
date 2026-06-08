export function formatDeadline(deadline: Date) {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const days = Math.floor(abs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((abs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (diff < 0) {
    return { label: `Overdue by ${days}d ${hours}h`, overdue: true };
  }
  return { label: `Due in ${days}d ${hours}h`, overdue: false };
}

export function statusBadgeClass(status: string) {
  switch (status) {
    case "REVIEWED":
      return "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300";
    case "SUBMITTED":
      return "bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300";
    case "LATE":
      return "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

export function formatStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

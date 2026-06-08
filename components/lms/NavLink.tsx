"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={cn(
        "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg border-l-4 py-2.5 pr-3 pl-2 text-sm font-medium transition-colors",
        active
          ? "border-indigo-500 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          : "border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100",
      )}
    >
      <Icon className="size-[18px] shrink-0 text-indigo-500 opacity-90" strokeWidth={1.75} />
      {label}
    </Link>
  );
}

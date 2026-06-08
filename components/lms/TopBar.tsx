"use client";

import { Bell, PanelLeft } from "lucide-react";
import type { ShellUser } from "@/components/lms/Sidebar";
import { SearchBar } from "@/components/lms/SearchBar";
import { NotificationPanel, type NotificationItem } from "@/components/lms/NotificationPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { initials, roleLabel } from "@/lib/rbac";

export function TopBar({
  user,
  notifications,
  unreadCount,
}: {
  user: ShellUser;
  notifications: NotificationItem[];
  unreadCount: number;
}) {
  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-zinc-200/80 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95 md:flex-row md:items-center md:gap-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          className="rounded-lg border border-zinc-200 p-2 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
          aria-label="Open menu"
        >
          <PanelLeft className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      <SearchBar />

      <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
        <ThemeToggle />
        <NotificationPanel notifications={notifications} unreadCount={unreadCount} />

        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white py-1 pl-1 pr-3 dark:border-zinc-700 dark:bg-zinc-900">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-xs font-bold text-white">
            {initials(user.name)}
          </span>
          <span className="hidden text-left text-sm leading-tight sm:block">
            <span className="block font-semibold text-zinc-900 dark:text-zinc-50">{user.name}</span>
            <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">{roleLabel(user.role)}</span>
          </span>
        </div>
      </div>
    </header>
  );
}

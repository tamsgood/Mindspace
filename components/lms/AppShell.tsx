"use client";

import { Sidebar, type ShellUser } from "@/components/lms/Sidebar";
import { TopBar } from "@/components/lms/TopBar";
import { NavLink } from "@/components/lms/NavLink";
import type { NotificationItem } from "@/components/lms/NotificationPanel";
import { isAdmin, isMentor } from "@/lib/rbac";
import {
  BookOpen,
  ClipboardCheck,
  FilePlus,
  LayoutDashboard,
  Megaphone,
  PlayCircle,
  ScrollText,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";

const studentMobile = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/learn", label: "Learn", icon: PlayCircle },
  { href: "/assignments", label: "Tasks", icon: ScrollText },
  { href: "/profile", label: "Profile", icon: User },
] as const;

const mentorMobile = [
  ...studentMobile.slice(0, 4),
  { href: "/mentor/grading", label: "Grade", icon: ClipboardCheck },
  { href: "/profile", label: "Profile", icon: User },
] as const;

const adminMobile = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/announcements", label: "News", icon: Megaphone },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  user,
  notifications,
  unreadCount,
  children,
}: {
  user: ShellUser;
  notifications: NotificationItem[];
  unreadCount: number;
  children: React.ReactNode;
}) {
  const mobileLinks = isAdmin(user.role)
    ? adminMobile
    : isMentor(user.role)
      ? mentorMobile
      : studentMobile;

  return (
    <div className="flex min-h-full flex-1 bg-background text-foreground">
      <div className="hidden md:flex">
        <Sidebar user={user} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <Sparkles className="size-4" strokeWidth={1.75} />
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-50">Mindspace</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b border-zinc-200 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          {mobileLinks.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
        <TopBar user={user} notifications={notifications} unreadCount={unreadCount} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

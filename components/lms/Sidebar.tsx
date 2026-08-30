"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Role } from "@prisma/client";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FilePlus,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  LogOut,
  Megaphone,
  PlayCircle,
  Presentation,
  ScrollText,
  Settings,
  Sparkles,
  Upload,
  User,
  Users,
} from "lucide-react";
import { NavLink } from "@/components/lms/NavLink";
import { isAdmin, isMentor, roleLabel } from "@/lib/rbac";

const studentLearnLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/my-classes", label: "My Classes", icon: Presentation },
  { href: "/learn", label: "Learn", icon: PlayCircle },
  { href: "/quizzes", label: "Quizzes", icon: HelpCircle },
  { href: "/assignments", label: "Assignments", icon: ScrollText },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/submissions", label: "Submissions", icon: Upload },
] as const;

const mentorLearnLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/my-classes", label: "My Classes", icon: Presentation },
  { href: "/learn", label: "Learn", icon: PlayCircle },
  { href: "/quizzes", label: "Quizzes", icon: HelpCircle },
  { href: "/assignments", label: "Assignments", icon: ScrollText },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
] as const;

const mentorTeachLinks = [
  { href: "/materials/new", label: "Upload material", icon: FilePlus },
  { href: "/quizzes/new", label: "Create quiz", icon: HelpCircle },
  { href: "/assignments/new", label: "Create assignment", icon: ScrollText },
  { href: "/mentor/grading", label: "Grade submissions", icon: ClipboardCheck },
  { href: "/students", label: "Students", icon: Users },
] as const;

const adminLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage users", icon: Users },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
] as const;

const accountLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export type ShellUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function Sidebar({ user }: { user: ShellUser }) {
  const admin = isAdmin(user.role);
  const mentor = isMentor(user.role);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start gap-3 px-5 py-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm">
          <Sparkles className="size-5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Mindspace</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {roleLabel(user.role)}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4">
        {admin ? (
          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Administration
            </p>
            <div className="flex flex-col gap-0.5">
              {adminLinks.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                {mentor ? "Learn (as student)" : "Learn"}
              </p>
              <div className="flex flex-col gap-0.5">
                {(mentor ? mentorLearnLinks : studentLearnLinks).map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
                ))}
              </div>
            </div>
            {mentor ? (
              <div>
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Teach
                </p>
                <div className="flex flex-col gap-0.5">
                  {mentorTeachLinks.map((item) => (
                    <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}

        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Account
          </p>
          <div className="flex flex-col gap-0.5">
            {accountLinks.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto border-t border-zinc-100 p-3 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-700 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          <LogOut className="size-[18px]" strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
}

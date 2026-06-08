"use client";

import Link from "next/link";
import { DashboardCharts } from "@/components/lms/DashboardCharts";
import { PageHeader } from "@/components/lms/PageHeader";
import { ui } from "@/lib/lms-ui";

type StudentProps = {
  mode: "student";
  enrollments: { progressPercent: number; course: { id: string; title: string } }[];
  submissions: { status: string; assignment: { title: string; deadline: string } }[];
};

type MentorProps = {
  mode: "mentor";
  stats: { studentCount: number; activeToday: number; courseCount: number; pendingReview: number };
  submissionStats: { status: string; count: number }[];
  recentSubmissions: { id: string; status: string; fileName: string | null; user: { name: string } }[];
};

const statusColors: Record<string, string> = {
  SUBMITTED: "bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  REVIEWED: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  LATE: "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  NOT_SUBMITTED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const barColors: Record<string, string> = {
  SUBMITTED: "bg-sky-500",
  REVIEWED: "bg-emerald-500",
  LATE: "bg-red-500",
  NOT_SUBMITTED: "bg-zinc-300 dark:bg-zinc-600",
};

export function DashboardView(props: StudentProps | MentorProps) {
  if (props.mode === "student") {
    const top = props.enrollments[0];
    const upcoming = props.submissions.filter((s) => s.status !== "REVIEWED").slice(0, 3);
    return (
      <div className="space-y-6">
        <PageHeader title="Welcome back" description="Pick up where you left off and stay on top of deadlines." />
        <div className="grid gap-4 md:grid-cols-2">
          <div className={ui.cardPadLg}>
            <h2 className={ui.heading}>Continue learning</h2>
            {top ? (
              <>
                <p className={`mt-2 ${ui.text}`}>
                  Resume <span className={ui.textStrong}>{top.course.title}</span> — {top.progressPercent}% complete.
                </p>
                <Link href={`/learn?course=${top.course.id}`} className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Go to lesson</Link>
              </>
            ) : (
              <p className={`mt-2 ${ui.text}`}>Enroll in a course to start learning.</p>
            )}
          </div>
          <div className={ui.cardPadLg}>
            <h2 className={ui.heading}>Upcoming deadlines</h2>
            <ul className={`mt-3 space-y-2 ${ui.text}`}>
              {upcoming.length ? upcoming.map((s, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="truncate">{s.assignment.title}</span>
                  <span className="shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">{new Date(s.assignment.deadline).toLocaleDateString()}</span>
                </li>
              )) : <li>No pending deadlines.</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  const { stats, submissionStats, recentSubmissions } = props as MentorProps;
  const statCards = [
    { label: "Total students", value: stats.studentCount, delta: "+12%", tone: "up" as const },
    { label: "Active today", value: stats.activeToday, delta: "+5%", tone: "up" as const },
    { label: "Courses", value: stats.courseCount, delta: null, tone: "flat" as const },
    { label: "Pending review", value: stats.pendingReview, delta: "Urgent", tone: "warn" as const },
  ];
  const totalSubs = submissionStats.reduce((a, b) => a + b.count, 0) || 1;
  return (
    <div className="space-y-6">
      <PageHeader title="Mentor overview" description="Track learners, submissions, and course health at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className={`${ui.card} p-5`}>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{s.value}</p>
            {s.delta ? <p className={s.tone === "up" ? "mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400" : "mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400"}>{s.delta}</p> : null}
          </div>
        ))}
      </div>
      <DashboardCharts />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={ui.cardPad}>
          <h3 className={ui.heading}>Submission stats</h3>
          <ul className="mt-4 space-y-4">
            {submissionStats.map((row) => (
              <li key={row.status}>
                <div className="flex justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <span>{row.status.replace("_", " ")}</span><span>{row.count}</span>
                </div>
                <div className={`mt-2 h-2 ${ui.progressTrack}`}>
                  <div className={`h-full rounded-full ${barColors[row.status] ?? "bg-zinc-400"}`} style={{ width: `${(row.count / totalSubs) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className={ui.cardPad}>
          <div className="flex items-center justify-between">
            <h3 className={ui.heading}>Recent submissions</h3>
            <Link href="/submissions" className={ui.link}>View all</Link>
          </div>
          <ul className={`mt-4 ${ui.divide}`}>
            {recentSubmissions.map((row) => (
              <li key={row.id} className="flex items-center gap-3 py-3 first:pt-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {row.user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${ui.textStrong}`}>{row.user.name}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{row.fileName ?? "—"}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColors[row.status] ?? statusColors.NOT_SUBMITTED}`}>{row.status.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProgress } from "@/lib/data";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrollments = await getProgress(session.user.id);
  const top = enrollments[0];
  const overall = top?.progressPercent ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Progress</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Track completion across your enrolled courses.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Overall</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{overall}%</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{top?.course.title ?? "No enrollments yet"}</p>
        </section>
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">Courses enrolled</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{enrollments.length}</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Keep learning to extend your streak.</p>
        </section>
      </div>
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">By course</h2>
        <ul className="mt-4 space-y-4">
          {enrollments.map((e) => (
            <li key={e.id}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{e.course.title}</span>
                <span className="tabular-nums text-zinc-500">{e.progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${e.progressPercent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

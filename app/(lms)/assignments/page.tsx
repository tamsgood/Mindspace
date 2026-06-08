import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAssignmentsForUser } from "@/lib/data";
import { formatDeadline, formatStatus, statusBadgeClass } from "@/lib/format";
import { isMentor } from "@/lib/rbac";
import { Clock, FileText } from "lucide-react";

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const mentor = isMentor(session.user.role);
  const assignments = await getAssignmentsForUser(session.user.id, session.user.role);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
            My assignments
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Track every submission, deadline, and grade in one place.
          </p>
        </div>
        {mentor ? (
          <Link
            href="/assignments/new"
            className="inline-flex self-start rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            + Create assignment
          </Link>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3">Assignment</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Deadline</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {assignments.map((a) => {
              const sub = a.submissions[0];
              const status = sub?.status ?? "NOT_SUBMITTED";
              const dl = formatDeadline(a.deadline);
              return (
                <tr key={a.id} className="align-top hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50">
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                        <FileText className="size-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/assignments/${a.id}`}
                          className="font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-indigo-400"
                        >
                          {a.title}
                        </Link>
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{a.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{a.course.title}</td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        dl.overdue
                          ? "inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700"
                          : "inline-flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400"
                      }
                    >
                      <Clock className="size-3.5 shrink-0" strokeWidth={2} />
                      {dl.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(status)}`}
                    >
                      {formatStatus(status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

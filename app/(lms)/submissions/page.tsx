import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SubmissionForm } from "@/components/lms/SubmissionForm";
import { getAssignmentsForSubmission, getStudentSubmissions } from "@/lib/data";
import { formatStatus, statusBadgeClass } from "@/lib/format";
import { ui } from "@/lib/lms-ui";
import { isMentor } from "@/lib/rbac";
import { Upload, Download } from "lucide-react";

export default async function SubmissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const submissions = await getStudentSubmissions(session.user.id);
  const assignmentOptions = await getAssignmentsForSubmission(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">My submissions</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Upload and track your assignment files.</p>
        </div>
        {isMentor(session.user.role) ? (
          <Link
            href="/mentor/grading"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Grade student work →
          </Link>
        ) : null}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <Upload className="size-7" strokeWidth={1.75} />
        </div>
        <div className="mt-6">
          <SubmissionForm assignments={assignmentOptions} />
        </div>
      </div>

      <div className={ui.tableWrap}>
        <table className="w-full text-left text-sm">
          <thead className={ui.tableHead}>
            <tr>
              <th className="px-5 py-3">Assignment</th>
              <th className="px-5 py-3">File</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className={ui.tableRow}>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td className={`px-5 py-4 ${ui.tableCell}`}>{s.assignment.title}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                  {s.fileUrl ? (
                    <a
                      href={s.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-indigo-400"
                    >
                      {s.fileName ?? "View file"}
                      <Download className="size-3.5" />
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(s.status)}`}
                  >
                    {formatStatus(s.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

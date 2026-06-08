import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDeadline, formatStatus, statusBadgeClass } from "@/lib/format";
import { ui } from "@/lib/lms-ui";
import { isMentor } from "@/lib/rbac";
import { Calendar, FileText, AlertCircle, Download } from "lucide-react";

export default async function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      course: { include: { instructor: true } },
      submissions: {
        where: isMentor(session.user.role) ? {} : { userId: session.user.id },
        include: { user: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!assignment) notFound();

  const mentor = isMentor(session.user.role);
  const userSubmission = assignment.submissions.find((s) => s.userId === session.user.id);
  const dl = formatDeadline(assignment.deadline);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/assignments" className={ui.link}>← Back to assignments</Link>

      <div className={ui.cardPadLg}>
        <div className="flex items-start gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <FileText className="size-7" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{assignment.title}</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{assignment.course.title}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-zinc-400" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Deadline</p>
              <p className={`mt-0.5 text-sm font-semibold ${dl.overdue ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                {new Date(assignment.deadline).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-zinc-400" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">File Requirements</p>
              <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Max {assignment.maxSizeMb} MB • {assignment.allowedFileTypes}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">{assignment.description}</p>
        </div>
      </div>

      {!mentor && userSubmission ? (
        <div className={ui.cardPad}>
          <h2 className={ui.heading}>Your Submission</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {userSubmission.fileName ? (
                  userSubmission.fileUrl ? (
                    <a
                      href={userSubmission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-indigo-400"
                    >
                      {userSubmission.fileName}
                      <Download className="size-3.5" />
                    </a>
                  ) : (
                    userSubmission.fileName
                  )
                ) : (
                  "No file"
                )}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Submitted {userSubmission.submittedAt ? new Date(userSubmission.submittedAt).toLocaleString() : "—"}
              </p>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(userSubmission.status)}`}>
              {formatStatus(userSubmission.status)}
            </span>
          </div>
          {userSubmission.grade !== null ? (
            <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                Grade: {userSubmission.grade}/100
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {mentor ? (
        <div className={ui.cardPad}>
          <h2 className={ui.heading}>Submissions ({assignment.submissions.length})</h2>
          {assignment.submissions.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">No submissions yet.</p>
          ) : (
            <ul className={`mt-4 ${ui.divide}`}>
              {assignment.submissions.map((sub) => (
                <li key={sub.id} className="flex items-center justify-between py-3 first:pt-0">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{sub.user.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {sub.fileName ?? "No file"} • {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.grade !== null ? (
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{sub.grade}/100</span>
                    ) : null}
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(sub.status)}`}>
                      {formatStatus(sub.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6">
            <Link
              href="/mentor/grading"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Grade submissions →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

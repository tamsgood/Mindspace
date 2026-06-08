"use client";

import { useActionState } from "react";
import { gradeSubmission, type ActionState } from "@/app/actions/lms";
import { formatStatus, statusBadgeClass } from "@/lib/format";
import { Download, Clock } from "lucide-react";

const initial: ActionState = {};

export function GradeForm({
  submissionId,
  studentName,
  assignmentTitle,
  fileName,
  fileUrl,
  submittedAt,
  status,
  currentGrade,
}: {
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  fileName: string | null;
  fileUrl: string | null;
  submittedAt: Date | null;
  status: string;
  currentGrade: number | null;
}) {
  const [state, action, pending] = useActionState(gradeSubmission, initial);

  if (status === "NOT_SUBMITTED") {
    return <span className="text-xs text-zinc-500 dark:text-zinc-400">Not submitted</span>;
  }

  if (status === "REVIEWED") {
    return (
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{studentName}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{assignmentTitle}</p>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-indigo-400"
          >
            <Download className="size-3.5" />
            {fileName ?? "Download file"}
          </a>
        ) : (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">No file attached</p>
        )}
        {submittedAt ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="size-3.5" />
            Submitted {new Date(submittedAt).toLocaleString()}
          </p>
        ) : null}
        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass(status)}`}>
            {formatStatus(status)}
          </span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Grade: {currentGrade}/100
          </span>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="submissionId" value={submissionId} />
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{studentName}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{assignmentTitle}</p>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-indigo-400"
          >
            <Download className="size-3.5" />
            {fileName ?? "Download file"}
          </a>
        ) : (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">No file attached</p>
        )}
        {submittedAt ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="size-3.5" />
            Submitted {new Date(submittedAt).toLocaleString()}
          </p>
        ) : null}
        <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass(status)}`}>
          {formatStatus(status)}
        </span>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor={`grade-${submissionId}`} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Grade (0-100)
          </label>
          <input
            id={`grade-${submissionId}`}
            name="grade"
            type="number"
            min={0}
            max={100}
            defaultValue={currentGrade ?? ""}
            placeholder="0–100"
            required
            className="mt-1 w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save grade"}
        </button>
      </div>
      {state.error ? <p className="text-xs text-red-600 dark:text-red-400">{state.error}</p> : null}
      {state.success ? <p className="text-xs text-emerald-600 dark:text-emerald-400">{state.success}</p> : null}
    </form>
  );
}

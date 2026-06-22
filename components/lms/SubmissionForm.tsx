"use client";

import { useActionState, useState } from "react";
import { submitAssignment, type ActionState } from "@/app/actions/lms";

const initial: ActionState = {};

export function SubmissionForm({
  assignments,
}: {
  assignments: Array<{
    id: string;
    title: string;
    courseTitle: string;
    deadline: Date;
    allowedFileTypes: string;
    maxSizeMb: number;
  }>;
}) {
  const [state, action, pending] = useActionState(submitAssignment, initial);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");

  const assignment = assignments.find((a) => a.id === selectedAssignment);

  return (
    <form action={action} className="mx-auto max-w-lg space-y-4">
      <div>
        <label
          htmlFor="assignmentId"
          className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400"
        >
          Assignment
        </label>
        <select
          id="assignmentId"
          name="assignmentId"
          required
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-400"
        >
          <option value="">Select assignment</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} — {a.courseTitle}
            </option>
          ))}
        </select>
        {assignment ? (
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            Deadline: {new Date(assignment.deadline).toLocaleString()}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="fileUrl"
          className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400"
        >
          File URL
        </label>
        <input
          id="fileUrl"
          name="fileUrl"
          type="url"
          required
          placeholder="https://drive.google.com/... or https://dropbox.com/..."
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-400"
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          Paste the link to your file on Google Drive, Dropbox, or OneDrive
        </p>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !selectedAssignment}
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit assignment"}
      </button>
    </form>
  );
}

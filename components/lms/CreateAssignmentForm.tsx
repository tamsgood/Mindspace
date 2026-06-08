"use client";

import { useActionState } from "react";
import { createAssignment, type ActionState } from "@/app/actions/lms";
import { ui } from "@/lib/lms-ui";

const initial: ActionState = {};

export function CreateAssignmentForm({
  courses,
}: {
  courses: { id: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(createAssignment, initial);

  return (
    <form action={action} className="mt-6 space-y-5">
      <div>
        <label htmlFor="title" className={ui.label}>Title</label>
        <input id="title" name="title" required className={`mt-2 ${ui.input}`} />
      </div>
      <div>
        <label htmlFor="courseId" className={ui.label}>Course</label>
        <select id="courseId" name="courseId" required className={`mt-2 ${ui.select}`}>
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className={ui.label}>Description</label>
        <textarea id="description" name="description" rows={5} required className={`mt-2 ${ui.textarea}`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="deadline" className={ui.label}>Deadline</label>
          <input id="deadline" name="deadline" type="datetime-local" required className={`mt-2 ${ui.input}`} />
        </div>
        <div>
          <label htmlFor="maxSize" className={ui.label}>Max size (MB)</label>
          <input id="maxSize" name="maxSize" type="number" defaultValue={25} className={`mt-2 ${ui.input}`} />
        </div>
      </div>
      <div>
        <label htmlFor="fileTypes" className={ui.label}>Allowed file types</label>
        <input id="fileTypes" name="fileTypes" defaultValue="PDF, ZIP" className={`mt-2 ${ui.input}`} />
      </div>
      {state.error ? <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p> : null}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <a href="/assignments" className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
          Cancel
        </a>
        <button type="submit" disabled={pending} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-blue-700 disabled:opacity-60">
          {pending ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}

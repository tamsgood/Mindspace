"use client";

import { useActionState } from "react";
import { createAnnouncement, type ActionState } from "@/app/actions/lms";
import { ui } from "@/lib/lms-ui";

const initial: ActionState = {};

export function CreateAnnouncementForm({
  courses,
}: {
  courses: { id: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(createAnnouncement, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="title" className={ui.label}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Important update about..."
          className={`mt-2 ${ui.input}`}
        />
      </div>

      <div>
        <label htmlFor="body" className={ui.label}>
          Message
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={6}
          placeholder="Write your announcement here..."
          className={`mt-2 ${ui.textarea}`}
        />
      </div>

      <div>
        <label htmlFor="courseId" className={ui.label}>
          Target audience
        </label>
        <select id="courseId" name="courseId" className={`mt-2 ${ui.select}`}>
          <option value="">All users (system-wide)</option>
          <optgroup label="Course-specific">
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </optgroup>
        </select>
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          Leave as "All users" to send to everyone, or select a course to target only enrolled students
        </p>
      </div>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Publishing..." : "Publish announcement"}
      </button>
    </form>
  );
}

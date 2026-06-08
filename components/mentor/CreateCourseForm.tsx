"use client";

import { useActionState } from "react";
import { createCourse, type ActionState } from "@/app/actions/lms";
import { ui } from "@/lib/lms-ui";

const initial: ActionState = {};

export function CreateCourseForm() {
  const [state, action, pending] = useActionState(createCourse, initial);

  return (
    <form action={action} className="mt-6 space-y-5">
      <div>
        <label htmlFor="title" className={ui.label}>
          Course Title
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g. Introduction to Machine Learning"
          className={`mt-2 ${ui.input}`}
        />
      </div>
      <div>
        <label htmlFor="description" className={ui.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          placeholder="Describe what students will learn in this course..."
          className={`mt-2 ${ui.textarea}`}
        />
      </div>
      <div>
        <label htmlFor="coverImage" className={ui.label}>
          Cover Image URL (optional)
        </label>
        <input
          id="coverImage"
          name="coverImage"
          placeholder="https://images.unsplash.com/..."
          className={`mt-2 ${ui.input}`}
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          Leave blank for default image. Use Unsplash for free course images.
        </p>
      </div>
      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>
      ) : null}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <a
          href="/courses"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create Course"}
        </button>
      </div>
    </form>
  );
}

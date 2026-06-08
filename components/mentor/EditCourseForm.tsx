"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse, deleteCourse, type ActionState } from "@/app/actions/lms";
import { ui } from "@/lib/lms-ui";
import { Trash2 } from "lucide-react";

const initial: ActionState = {};

export function EditCourseForm({
  course,
}: {
  course: { id: string; title: string; description: string | null; coverImage: string };
}) {
  const [state, action, pending] = useActionState(updateCourse, initial);
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete "${course.title}"?\n\nThis will permanently delete:\n- All modules and lessons\n- All assignments\n- All submissions\n- All enrollments\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteCourse(course.id);
      router.push("/courses");
      router.refresh();
    } catch (error) {
      alert("Failed to delete course. Please try again.");
    }
  }

  return (
    <div>
      <form action={action} className="mt-6 space-y-5">
        <input type="hidden" name="courseId" value={course.id} />
        <div>
          <label htmlFor="title" className={ui.label}>
            Course Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={course.title}
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
            defaultValue={course.description || ""}
            className={`mt-2 ${ui.textarea}`}
          />
        </div>
        <div>
          <label htmlFor="coverImage" className={ui.label}>
            Cover Image URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            defaultValue={course.coverImage}
            className={`mt-2 ${ui.input}`}
          />
        </div>
        {state.error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>
        ) : null}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-red-700 hover:bg-red-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            <Trash2 className="size-4" strokeWidth={2} />
            Delete Course
          </button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
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
              {pending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

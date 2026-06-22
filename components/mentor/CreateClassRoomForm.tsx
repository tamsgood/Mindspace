"use client";

import { useActionState } from "react";
import { createClassRoom, type ActionState } from "@/app/actions/lms";
import { ui } from "@/lib/lms-ui";

const initial: ActionState = {};

export function CreateClassRoomForm({ courseId }: { courseId: string }) {
  const [state, action, pending] = useActionState(createClassRoom, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={ui.label}>
            Class name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Multimedia - Batch A"
            className={`mt-2 ${ui.input}`}
          />
        </div>

        <div>
          <label htmlFor="code" className={ui.label}>
            Class code
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="e.g. MM-2024-A"
            className={`mt-2 ${ui.input}`}
          />
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            Students will use this code to join
          </p>
        </div>
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
        {pending ? "Creating..." : "Create class"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { joinClassByCode, type ActionState } from "@/app/actions/lms";

const initial: ActionState = {};

export function JoinClassByCodeForm() {
  const [state, action, pending] = useActionState(joinClassByCode, initial);

  return (
    <form action={action} className="flex gap-2">
      <input
        name="code"
        required
        placeholder="Enter class code (e.g. MM-2024-A)"
        className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-400"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Joining..." : "Join"}
      </button>
      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>
      )}
    </form>
  );
}

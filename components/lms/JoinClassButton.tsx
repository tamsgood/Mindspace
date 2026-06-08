"use client";

import { joinClass } from "@/app/actions/lms";

export function JoinClassButton({ classId }: { classId: string }) {
  return (
    <form
      action={async () => {
        await joinClass(classId);
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Join class
      </button>
    </form>
  );
}

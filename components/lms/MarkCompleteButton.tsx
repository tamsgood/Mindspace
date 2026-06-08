"use client";

import { markLessonComplete } from "@/app/actions/lms";

export function MarkCompleteButton({
  lessonId,
  courseId,
  completed,
}: {
  lessonId: string;
  courseId: string;
  completed: boolean;
}) {
  return (
    <form
      action={async () => {
        await markLessonComplete(lessonId, courseId);
      }}
    >
      <button
        type="submit"
        disabled={completed}
        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {completed ? "Completed" : "Mark as complete"}
      </button>
    </form>
  );
}

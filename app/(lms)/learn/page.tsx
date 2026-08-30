import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MarkCompleteButton } from "@/components/lms/MarkCompleteButton";
import { LessonViewer } from "@/components/lms/LessonViewer";
import { getDefaultCourseId, getLearnCourse } from "@/lib/data";
import { ArrowLeft, CheckCircle2, Circle, FileText, HelpCircle, Play } from "lucide-react";

function LessonIcon({ type }: { type: string }) {
  if (type === "VIDEO") return <Play className="size-3.5 text-zinc-400" strokeWidth={2} />;
  if (type === "H5P_VIDEO") return <Play className="size-3.5 text-indigo-400" strokeWidth={2} />;
  if (type === "QUIZ") return <HelpCircle className="size-3.5 text-zinc-400" strokeWidth={2} />;
  return <FileText className="size-3.5 text-zinc-400" strokeWidth={2} />;
}

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; lesson?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  let courseId = params.course;
  if (!courseId) {
    courseId = (await getDefaultCourseId(session.user.id)) ?? undefined;
  }
  if (!courseId) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        No enrolled course yet. Browse{" "}
        <Link href="/courses" className="font-semibold text-indigo-600">
          courses
        </Link>{" "}
        to start.
      </div>
    );
  }

  const course = await getLearnCourse(courseId, session.user.id);
  if (!course) redirect("/courses");

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => l.progress[0]?.completed).length;
  const activeLessonId = params.lesson ?? allLessons.find((l) => !l.progress[0]?.completed)?.id ?? allLessons[0]?.id;
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) ?? allLessons[0];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:w-80">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Course details
        </Link>
        <h2 className="mt-3 text-sm font-bold leading-snug text-zinc-900 dark:text-zinc-50">{course.title}</h2>
        <p className="mt-1 text-xs font-medium text-zinc-500">
          {completedCount} of {allLessons.length} completed
        </p>
        <div className="mt-4 space-y-5">
          {course.modules.map((m) => (
            <div key={m.id}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">{m.title}</p>
              <ul className="mt-2 space-y-1">
                {m.lessons.map((l) => {
                  const done = l.progress[0]?.completed;
                  const active = l.id === activeLesson?.id;
                  return (
                    <li key={l.id}>
                      <Link
                        href={`/learn?course=${courseId}&lesson=${l.id}`}
                        className={
                          active
                            ? "flex items-center gap-2 rounded-lg bg-sky-50 px-2 py-2 text-sm font-medium text-sky-900 dark:bg-sky-950/50 dark:text-sky-200"
                            : "flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }
                      >
                        {done ? (
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" strokeWidth={2} />
                        ) : (
                          <Circle className="size-4 shrink-0 text-zinc-300" strokeWidth={2} />
                        )}
                        <LessonIcon type={l.type} />
                        <span className="min-w-0 flex-1 leading-snug">{l.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {activeLesson ? (
        <div className="min-w-0 flex-1 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 shadow-sm">
            <LessonViewer
              type={activeLesson.type}
              title={activeLesson.title}
              duration={activeLesson.duration}
              fileUrl={activeLesson.fileUrl}
            />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {activeLesson.content ??
                "Lesson materials and instructions will appear here. Follow along and mark complete when done."}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <MarkCompleteButton
                lessonId={activeLesson.id}
                courseId={courseId}
                completed={!!activeLesson.progress[0]?.completed}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

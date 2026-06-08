import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ui } from "@/lib/lms-ui";
import { Presentation, User, Calendar, BookOpen } from "lucide-react";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const classRoom = await prisma.classRoom.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          instructor: true,
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      mentor: true,
      enrollments: {
        include: { user: true },
        orderBy: { user: { name: "asc" } },
      },
    },
  });

  if (!classRoom) notFound();

  const totalLessons = classRoom.course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/my-classes" className={ui.link}>
        ← Back to classes
      </Link>

      <div className={ui.cardPadLg}>
        <div className="flex items-start gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Presentation className="size-7" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {classRoom.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {classRoom.course.title}
            </p>
          </div>
          <span
            className={
              classRoom.status === "ACTIVE"
                ? "inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
                : "inline-flex rounded-full bg-zinc-700 px-3 py-1 text-xs font-semibold text-white"
            }
          >
            {classRoom.status === "ACTIVE" ? "Active" : "Completed"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-zinc-400" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Class Code
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {classRoom.code}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="size-5 text-zinc-400" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Students
              </p>
              <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {classRoom.enrollments.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-zinc-400" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Lessons
              </p>
              <p className="mt-0.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {totalLessons}
              </p>
            </div>
          </div>
        </div>

        {classRoom.mentor ? (
          <div className="mt-6 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/50">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Mentor
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {classRoom.mentor.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {classRoom.mentor.email}
            </p>
          </div>
        ) : null}
      </div>

      <div className={ui.cardPad}>
        <h2 className={ui.heading}>Course Instructor</h2>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <User className="size-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              {classRoom.course.instructor.name}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {classRoom.course.instructor.email}
            </p>
          </div>
        </div>
      </div>

      <div className={ui.cardPad}>
        <h2 className={ui.heading}>Students ({classRoom.enrollments.length})</h2>
        <ul className={`mt-4 ${ui.divide}`}>
          {classRoom.enrollments.map((enrollment) => (
            <li
              key={enrollment.id}
              className="flex items-center gap-3 py-3 first:pt-0"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {enrollment.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {enrollment.user.name}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {enrollment.user.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={ui.cardPad}>
        <h2 className={ui.heading}>Course Modules</h2>
        <div className="mt-4 space-y-4">
          {classRoom.course.modules.map((module, idx) => (
            <div
              key={module.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {idx + 1}. {module.title}
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {module.lessons.length} lessons
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href={`/learn?course=${classRoom.course.id}`}
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to course →
          </Link>
        </div>
      </div>
    </div>
  );
}

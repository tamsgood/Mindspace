import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, requireMentor } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateClassRoomForm } from "@/components/mentor/CreateClassRoomForm";
import { ArrowLeft } from "lucide-react";

export default async function CourseClassesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  await requireMentor();

  const { id: courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      classRooms: {
        include: {
          mentor: true,
          _count: { select: { enrollments: true } },
        },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!course) redirect("/courses");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="size-4" />
          Back to courses
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
          Manage classes for {course.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Create scheduled classes for students to join via class code.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Create new class</h2>
        <div className="mt-4">
          <CreateClassRoomForm courseId={courseId} />
        </div>
      </div>

      {course.classRooms.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Existing classes</h2>
          {course.classRooms.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{cls.name}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Code: <span className="font-mono font-semibold text-indigo-600">{cls.code}</span> •{" "}
                  {cls._count.enrollments} students • Status: {cls.status}
                </p>
                {cls.mentor && (
                  <p className="mt-1 text-xs text-zinc-500">Mentor: {cls.mentor.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

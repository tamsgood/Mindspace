import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EditCourseForm } from "@/components/mentor/EditCourseForm";
import { isMentor } from "@/lib/rbac";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) redirect("/dashboard");

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/courses"
        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
      >
        ← Back to courses
      </Link>
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Edit course</h1>
        <EditCourseForm course={course} />
      </div>
    </div>
  );
}

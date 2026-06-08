import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CreateAssignmentForm } from "@/components/lms/CreateAssignmentForm";
import { getStaffCourses } from "@/lib/data";
import { isMentor } from "@/lib/rbac";

export default async function CreateAssignmentPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isMentor(session.user.role)) redirect("/dashboard");

  const courses = await getStaffCourses();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/assignments" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
        ← Back to assignments
      </Link>
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Create assignment</h1>
        <CreateAssignmentForm courses={courses} />
      </div>
    </div>
  );
}

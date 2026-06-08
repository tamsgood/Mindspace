import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UploadMaterialForm } from "@/components/mentor/UploadMaterialForm";
import { getStaffCourses } from "@/lib/data";
import { isMentor } from "@/lib/rbac";

export default async function UploadMaterialPage() {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) redirect("/dashboard");

  const courses = await getStaffCourses();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Upload material</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Add lessons and content to your courses.</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <UploadMaterialForm courses={courses} />
      </div>
    </div>
  );
}

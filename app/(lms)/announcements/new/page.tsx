import { redirect } from "next/navigation";
import { auth, requireStaff } from "@/auth";
import { CreateAnnouncementForm } from "@/components/lms/CreateAnnouncementForm";
import { getStaffCourses } from "@/lib/data";

export default async function NewAnnouncementPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  await requireStaff();

  const courses = await getStaffCourses();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
          Create announcement
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Post an announcement for all users or a specific course.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CreateAnnouncementForm courses={courses} />
      </div>
    </div>
  );
}

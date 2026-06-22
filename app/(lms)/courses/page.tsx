import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getCoursesForUser } from "@/lib/data";
import { isStaff } from "@/lib/rbac";
import { redirect } from "next/navigation";
import { EnrollButton } from "@/components/lms/EnrollButton";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const courses = await getCoursesForUser(session.user.id, session.user.role);
  const staff = isStaff(session.user.role);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
            {staff ? "Manage courses" : "Courses"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {staff ? "Create and edit your course catalog." : "Browse and enroll in available courses."}
          </p>
        </div>
        {staff ? (
          <Link
            href="/courses/new"
            className="inline-flex self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + New course
          </Link>
        ) : null}
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => {
          const isEnrolled = !staff && "enrollments" in c && c.enrollments.length > 0;
          
          return (
            <li
              key={c.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-800">
                <Image src={c.coverImage} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{c.title}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-amber-600 dark:text-amber-400">★ {c.rating}</span>
                  <span>{c._count.enrollments.toLocaleString()} students</span>
                  <span>{c._count.modules} modules</span>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2">
                  {staff ? (
                    <>
                      <Link
                        href={`/courses/${c.id}/edit`}
                        className="rounded-xl border border-zinc-200 bg-white py-2 text-center text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/learn?course=${c.id}`}
                        className="rounded-xl border border-zinc-200 bg-white py-2 text-center text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                      >
                        Modules
                      </Link>
                    </>
                  ) : isEnrolled ? (
                    <Link
                      href={`/learn?course=${c.id}`}
                      className="col-span-2 rounded-xl bg-blue-600 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Continue learning
                    </Link>
                  ) : (
                    <EnrollButton courseId={c.id} />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { searchContent } from "@/lib/notifications";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { q = "" } = await searchParams;
  const results = q ? await searchContent(session.user.id, session.user.role, q) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Search</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {q ? `Results for “${q}”` : "Enter a query using the search bar above (⌘K)."}
        </p>
      </div>

      {results ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 dark:text-zinc-50">Courses</h2>
            <ul className="mt-3 space-y-2">
              {results.courses.length ? (
                results.courses.map((c) => (
                  <li key={c.id}>
                    <Link href={`/learn?course=${c.id}`} className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                      {c.title}
                    </Link>
                    <p className="text-xs text-zinc-500">{c.instructor.name}</p>
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-500">No courses found.</li>
              )}
            </ul>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 dark:text-zinc-50">Assignments</h2>
            <ul className="mt-3 space-y-2">
              {results.assignments.length ? (
                results.assignments.map((a) => (
                  <li key={a.id}>
                    <Link href="/assignments" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                      {a.title}
                    </Link>
                    <p className="text-xs text-zinc-500">{a.course.title}</p>
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-500">No assignments found.</li>
              )}
            </ul>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 dark:text-zinc-50">Lessons</h2>
            <ul className="mt-3 space-y-2">
              {results.lessons.length ? (
                results.lessons.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/learn?course=${l.module.course.id}&lesson=${l.id}`}
                      className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {l.title}
                    </Link>
                    <p className="text-xs text-zinc-500">{l.module.course.title}</p>
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-500">No lessons found.</li>
              )}
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  );
}

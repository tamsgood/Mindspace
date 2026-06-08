import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { JoinClassButton } from "@/components/lms/JoinClassButton";
import { getAllClassesForJoin, getMyClasses } from "@/lib/data";
import { isStaff } from "@/lib/rbac";
import { Eye } from "lucide-react";

export default async function MyClassesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const staff = isStaff(session.user.role);
  const classes = staff ? await getMyClasses(session.user.id, session.user.role) : await getMyClasses(session.user.id, session.user.role);
  const available = staff ? [] : await getAllClassesForJoin();
  const enrolledIds = new Set(classes.map((c) => c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">My classes</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage and organize all your classes in one place.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3">Course name</th>
              <th className="px-5 py-3">Class code</th>
              <th className="px-5 py-3">Students</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {classes.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50">
                <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-zinc-50">{r.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-zinc-500">{r.code}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{r._count.enrollments} students</td>
                <td className="px-5 py-4">
                  <span
                    className={
                      r.status === "ACTIVE"
                        ? "inline-flex rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white"
                        : "inline-flex rounded-full bg-zinc-700 px-2.5 py-0.5 text-xs font-semibold text-white"
                    }
                  >
                    {r.status === "ACTIVE" ? "Active" : "Completed"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <a
                    href={`/my-classes/${r.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <Eye className="size-3.5" strokeWidth={2} />
                    View details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!staff && available.length > 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Available classes to join</h2>
          <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
            {available
              .filter((c) => !enrolledIds.has(c.id))
              .map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{c.name}</p>
                    <p className="text-xs text-zinc-500">
                      {c.code} · {c.course.title}
                    </p>
                  </div>
                  <JoinClassButton classId={c.id} />
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

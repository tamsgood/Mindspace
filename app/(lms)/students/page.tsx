import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudents } from "@/lib/data";
import { isMentor } from "@/lib/rbac";

export default async function StudentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isMentor(session.user.role)) redirect("/dashboard");

  const students = await getStudents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Students</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Roster for your mentor classes.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Enrollments</th>
              <th className="px-5 py-3">Submissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50">
                <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-zinc-50">{s.name}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{s.email}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{s.enrollments.length}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{s._count.submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

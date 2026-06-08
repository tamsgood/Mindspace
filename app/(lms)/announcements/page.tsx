import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAnnouncements } from "@/lib/data";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items = await getAnnouncements(session.user.id, session.user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Announcements</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Updates from your instructors and mentors.</p>
      </div>
      <ul className="space-y-3">
        {items.map((a) => (
          <li key={a.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">{a.title}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{a.body}</p>
            <p className="mt-3 text-xs text-zinc-500">
              {a.createdAt.toLocaleDateString()} · {a.author.name}
              {a.course ? ` · ${a.course.title}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAnnouncements } from "@/lib/data";
import { isStaff } from "@/lib/rbac";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items = await getAnnouncements(session.user.id, session.user.role);
  const staff = isStaff(session.user.role);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Announcements</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {staff ? "Post announcements for students." : "Updates from your instructors and mentors."}
          </p>
        </div>
        {staff && (
          <Link
            href="/announcements/new"
            className="inline-flex self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + New announcement
          </Link>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          No announcements yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">{a.title}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{a.body}</p>
              <p className="mt-3 text-xs text-zinc-500">
                {a.createdAt.toLocaleDateString()} · {a.author.name}
                {a.course ? ` · ${a.course.title}` : " · System-wide"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

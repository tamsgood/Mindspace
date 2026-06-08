import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getNotifications } from "@/lib/notifications";
import { markAllNotificationsRead } from "@/app/actions/notifications";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items = await getNotifications(session.user.id, 50);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Notifications</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">All updates for your account.</p>
        </div>
        {items.some((n) => !n.read) ? (
          <form action={markAllNotificationsRead}>
            <button type="submit" className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Mark all read
            </button>
          </form>
        ) : null}
      </div>
      <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {items.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-zinc-500">No notifications.</li>
        ) : (
          items.map((n) => (
            <li key={n.id} className={n.read ? "px-5 py-4" : "border-l-4 border-indigo-500 bg-indigo-50/40 px-5 py-4 dark:bg-indigo-950/20"}>
              {n.href ? (
                <Link href={n.href} className="block">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{n.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{n.body}</p>
                </Link>
              ) : (
                <>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{n.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{n.body}</p>
                </>
              )}
              <p className="mt-1 text-xs text-zinc-400">{n.createdAt.toLocaleString()}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

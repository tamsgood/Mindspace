import { auth } from "@/auth";
import { AppShell } from "@/components/lms/AppShell";
import { getNotifications, getUnreadCount } from "@/lib/notifications";
import { redirect } from "next/navigation";

export default async function LmsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(session.user.id, 8),
    getUnreadCount(session.user.id),
  ]);

  return (
    <AppShell
      user={session.user}
      unreadCount={unreadCount}
      notifications={notifications.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        href: n.href,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      }))}
    >
      {children}
    </AppShell>
  );
}

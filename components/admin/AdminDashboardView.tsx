export function AdminDashboardView({
  stats,
  recentUsers,
}: {
  stats: { students: number; mentors: number; courses: number; pendingSubmissions: number };
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: Date }[];
}) {
  const cards = [
    { label: "Students", value: stats.students },
    { label: "Mentors", value: stats.mentors },
    { label: "Courses", value: stats.courses },
    { label: "Pending reviews", value: stats.pendingSubmissions },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Platform overview</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Monitor users and activity. Create Student or Mentor accounts from Manage users.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ">
            <p className="text-xs font-medium uppercase text-zinc-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{c.value}</p>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 dark:text-zinc-50">Recent accounts</h2>
        <ul className="mt-4 divide-y divide-zinc-100 ">
          {recentUsers.map((u) => (
            <li key={u.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{u.name}</p>
                <p className="text-xs text-zinc-500">{u.email}</p>
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {u.role.toLowerCase()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

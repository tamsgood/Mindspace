import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSchedule } from "@/lib/data";

export default async function SchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const events = await getSchedule(session.user.id);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weekBuckets = Array.from({ length: 7 }, () => [] as typeof events);
  for (const ev of events) {
    const dow = (ev.startAt.getDay() + 6) % 7;
    weekBuckets[dow]?.push(ev);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Schedule</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Classes, deadlines, and live sessions.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 text-center text-xs font-bold uppercase tracking-wide text-zinc-500">
          {days.map((d) => (
            <div key={d} className="px-2 py-3">
              {d}
            </div>
          ))}
        </div>
        <div className="grid min-h-64 grid-cols-7 divide-x divide-zinc-100">
          {days.map((d, i) => (
            <div key={d} className="p-2">
              <ul className="mt-2 space-y-2">
                {weekBuckets[i]?.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg px-2 py-1.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: e.color }}
                  >
                    <p>{e.title}</p>
                    <p className="opacity-90">
                      {e.startAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

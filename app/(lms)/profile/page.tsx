import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProfile } from "@/lib/data";
import { initials } from "@/lib/rbac";
import { Award, Clock, Mail, MapPin } from "lucide-react";
import { formatStatus, statusBadgeClass } from "@/lib/format";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getProfile(session.user.id);
  if (!profile) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-36 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 md:h-44" />
        <div className="relative px-5 pb-6 pt-0 md:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <span className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-sky-100 text-2xl font-bold text-sky-700 shadow-md">
              {initials(profile.name)}
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{profile.name}</h1>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{profile.bio ?? "—"}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3.5" strokeWidth={2} />
                  {profile.email}
                </span>
                {profile.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" strokeWidth={2} />
                    {profile.location}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Course history</h2>
          <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {profile.enrollments.map((e) => (
              <li key={e.id} className="flex gap-4 py-4 first:pt-0">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  <Image src={e.course.coverImage} alt="" fill className="object-cover" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{e.course.title}</p>
                  <p className="text-xs text-zinc-500">{e.course.instructor.name}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${e.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-zinc-600 dark:text-zinc-400">
                      {e.progressPercent}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Certificates</h2>
            <ul className="mt-4 space-y-3">
              {profile.certificates.map((cert) => (
                <li key={cert.id} className="flex items-start gap-3">
                  <Award className="mt-0.5 size-5 shrink-0 text-violet-500" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{cert.title}</p>
                    <p className="text-xs text-zinc-500">
                      {cert.issuedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recent assignments</h2>
            <ul className="mt-4 space-y-3">
              {profile.submissions.map((s) => (
                <li key={s.id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{s.fileName ?? s.assignment.title}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadgeClass(s.status)}`}
                  >
                    {s.status === "REVIEWED" && s.grade ? (
                      <>Reviewed · {s.grade}/100</>
                    ) : s.status === "SUBMITTED" ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" strokeWidth={2} />
                        {formatStatus(s.status)}
                      </span>
                    ) : (
                      formatStatus(s.status)
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

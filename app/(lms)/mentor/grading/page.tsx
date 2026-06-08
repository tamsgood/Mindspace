import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GradeForm } from "@/components/mentor/GradeForm";
import { getStaffSubmissions } from "@/lib/data";
import { isMentor } from "@/lib/rbac";

export default async function MentorGradingPage() {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) redirect("/dashboard");

  const submissions = await getStaffSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Grade submissions</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Review and score student work.</p>
      </div>
      <ul className="space-y-4">
        {submissions.map((s) => (
          <li
            key={s.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <GradeForm
              submissionId={s.id}
              studentName={s.user.name}
              assignmentTitle={s.assignment.title}
              fileName={s.fileName}
              fileUrl={s.fileUrl}
              submittedAt={s.submittedAt}
              status={s.status}
              currentGrade={s.grade}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

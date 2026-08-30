import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMentor } from "@/lib/rbac";
import { QuizForm } from "@/components/quiz/QuizForm";
import { getStaffCourses } from "@/lib/data";

export default async function NewQuizPage() {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) redirect("/dashboard");

  const courses = await getStaffCourses();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create quiz</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Build a new quiz with multiple question types to assess student knowledge
        </p>
      </div>

      <QuizForm courses={courses} />
    </div>
  );
}

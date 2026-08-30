import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMentor } from "@/lib/rbac";
import { getQuizzes } from "@/lib/data-quiz";
import { Clock, FileText, Plus } from "lucide-react";

export default async function QuizzesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const quizzes = await getQuizzes(session.user.id, session.user.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Quizzes</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {isMentor(session.user.role)
              ? "Create and manage quizzes for your courses"
              : "Complete quizzes to test your knowledge"}
          </p>
        </div>
        {isMentor(session.user.role) && (
          <Link
            href="/quizzes/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus className="size-4" strokeWidth={2} />
            Create quiz
          </Link>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <FileText className="mx-auto size-12 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
          <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">No quizzes yet</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {isMentor(session.user.role)
              ? "Create your first quiz to assess student knowledge"
              : "No quizzes available at the moment"}
          </p>
          {isMentor(session.user.role) && (
            <Link
              href="/quizzes/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="size-4" strokeWidth={2} />
              Create quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
                    {quiz.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{quiz.courseName}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    quiz.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                      : quiz.status === "DRAFT"
                        ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {quiz.status}
                </span>
              </div>

              {quiz.description && (
                <p className="mt-3 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">{quiz.description}</p>
              )}

              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <FileText className="size-3.5" strokeWidth={2} />
                  <span>{quiz.questionCount} questions</span>
                </div>
                {quiz.timeLimit && (
                  <div className="flex items-center gap-1">
                    <Clock className="size-3.5" strokeWidth={2} />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                )}
                <div className="ml-auto">
                  <span className="font-medium">{quiz.totalPoints} pts</span>
                </div>
              </div>

              {!isMentor(session.user.role) && 'submission' in quiz && quiz.submission && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs dark:bg-zinc-800">
                  {quiz.submission.status === "GRADED" ? (
                    <>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Score: {quiz.submission.score}/{quiz.totalPoints}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        ({Math.round((quiz.submission.score / quiz.totalPoints) * 100)}%)
                      </span>
                    </>
                  ) : quiz.submission.status === "SUBMITTED" ? (
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">Pending grading</span>
                  ) : (
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">In progress</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMentor } from "@/lib/rbac";
import { getQuizDetail } from "@/lib/data-quiz";
import { Clock, FileText, Calendar, Users, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { publishQuizAction, deleteQuizAction } from "@/app/actions/quiz";

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const quiz = await getQuizDetail(id, session.user.id, session.user.role);

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Quiz not found</p>
      </div>
    );
  }

  const isCreator = quiz.creatorId === session.user.id;
  const userSubmission = isMentor(session.user.role) ? null : quiz.submissions[0];

  // Student view: redirect to take or result
  if (!isMentor(session.user.role)) {
    if (userSubmission) {
      if (userSubmission.status === "GRADED") {
        redirect(`/quizzes/${id}/result`);
      } else {
        // Submitted but not graded yet
        return (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <CheckCircle className="mx-auto size-12 text-yellow-500" strokeWidth={1.5} />
              <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Quiz submitted
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Your submission is being reviewed. Check back later for your results.
              </p>
              <Link
                href="/quizzes"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Back to quizzes
              </Link>
            </div>
          </div>
        );
      }
    }

    // Not yet taken - redirect to take page
    redirect(`/quizzes/${id}/take`);
  }

  // Mentor view
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{quiz.title}</h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{quiz.course.title}</p>
        </div>

        {isCreator && (
          <div className="flex gap-2">
            {quiz.status === "DRAFT" && (
              <form action={publishQuizAction.bind(null, id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Publish
                </button>
              </form>
            )}
            {quiz.submissions.length === 0 && (
              <form action={deleteQuizAction.bind(null, id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-zinc-900 dark:hover:bg-red-950/30"
                >
                  Delete
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {quiz.description && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{quiz.description}</p>
        </div>
      )}

      {/* Meta Info */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <FileText className="size-4" strokeWidth={2} />
            <span className="text-xs font-medium">Questions</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{quiz.questions.length}</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <CheckCircle className="size-4" strokeWidth={2} />
            <span className="text-xs font-medium">Total points</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{quiz.totalPoints}</p>
        </div>

        {quiz.timeLimit && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Clock className="size-4" strokeWidth={2} />
              <span className="text-xs font-medium">Time limit</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{quiz.timeLimit} min</p>
          </div>
        )}

        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Users className="size-4" strokeWidth={2} />
            <span className="text-xs font-medium">Submissions</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{quiz.submissions.length}</p>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Questions</h2>
        <div className="mt-4 space-y-4">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">Q{index + 1}.</span>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {question.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {question.points} pt{question.points !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{question.questionText}</p>

                  {/* Show options for multiple choice */}
                  {question.type === "MULTIPLE_CHOICE" && question.options.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {question.options.map((opt, optIndex) => (
                        <div key={opt.id} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <span
                            className={
                              question.correctAnswer === String(optIndex)
                                ? "font-semibold text-emerald-600 dark:text-emerald-400"
                                : ""
                            }
                          >
                            {String.fromCharCode(65 + optIndex)}. {opt.optionText}
                          </span>
                          {question.correctAnswer === String(optIndex) && (
                            <CheckCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show correct answer for TF and Fill blank */}
                  {(question.type === "TRUE_FALSE" || question.type === "FILL_IN_BLANK") &&
                    question.correctAnswer && (
                      <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="inline size-3 mr-1" strokeWidth={2} />
                        Correct: {question.correctAnswer}
                      </p>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions Link */}
      {quiz.submissions.length > 0 && (
        <Link
          href={`/quizzes/${id}/submissions`}
          className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">View submissions</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {quiz.submissions.length} student{quiz.submissions.length !== 1 ? "s" : ""} submitted
            </p>
          </div>
          <ArrowRight className="size-5 text-zinc-400" strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}

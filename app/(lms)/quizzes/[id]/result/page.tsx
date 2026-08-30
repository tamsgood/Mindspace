import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMentor } from "@/lib/rbac";
import { getQuizDetail } from "@/lib/data-quiz";
import { CheckCircle, XCircle, Clock, Award } from "lucide-react";

export default async function QuizResultPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  // Only students can view their results
  if (isMentor(session.user.role)) {
    redirect(`/quizzes/${id}`);
  }

  const quiz = await getQuizDetail(id, session.user.id, session.user.role);

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Quiz not found</p>
      </div>
    );
  }

  const submission = quiz.submissions[0];

  if (!submission || submission.status !== "GRADED") {
    redirect(`/quizzes/${id}`);
  }

  const percentage = Math.round((submission.score! / submission.totalPoints) * 100);
  const passed = percentage >= 60; // You can adjust passing threshold

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Score Card */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white dark:border-zinc-800">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="mt-1 text-sm text-indigo-100">{quiz.course.title}</p>
          </div>
          {passed ? (
            <Award className="size-12 text-yellow-300" strokeWidth={1.5} />
          ) : (
            <Clock className="size-12 text-indigo-200" strokeWidth={1.5} />
          )}
        </div>

        <div className="mt-8 flex items-end gap-4">
          <div>
            <p className="text-sm text-indigo-100">Your score</p>
            <p className="text-5xl font-bold">
              {submission.score}/{submission.totalPoints}
            </p>
          </div>
          <div className="mb-2">
            <p className="text-3xl font-bold">{percentage}%</p>
          </div>
        </div>

        <div className="mt-4">
          {passed ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold">
              <CheckCircle className="size-4" strokeWidth={2} />
              Passed
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900">
              <Clock className="size-4" strokeWidth={2} />
              Keep practicing
            </div>
          )}
        </div>
      </div>

      {/* Questions Review */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Review answers</h2>
        <div className="mt-6 space-y-6">
          {quiz.questions.map((question, index) => {
            const answer = submission.answers.find((a) => a.questionId === question.id);
            const isCorrect = answer?.isCorrect;
            const pointsEarned = answer?.pointsEarned || 0;

            return (
              <div
                key={question.id}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-50">Q{index + 1}.</span>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {question.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {pointsEarned}/{question.points} pts
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {question.questionText}
                    </p>
                  </div>
                  {isCorrect !== null && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle className="size-6 text-emerald-500" strokeWidth={2} />
                      ) : (
                        <XCircle className="size-6 text-red-500" strokeWidth={2} />
                      )}
                    </div>
                  )}
                </div>

                {/* Show student's answer */}
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Your answer:
                    </p>
                    {question.type === "MULTIPLE_CHOICE" && answer?.answerText ? (
                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {String.fromCharCode(65 + parseInt(answer.answerText))}.{" "}
                        {question.options[parseInt(answer.answerText)]?.optionText || "N/A"}
                      </p>
                    ) : question.type === "ESSAY" ? (
                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {answer?.answerText || "(No answer)"}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {answer?.answerText || "(No answer)"}
                      </p>
                    )}
                  </div>

                  {/* Show correct answer for wrong answers */}
                  {isCorrect === false && question.type !== "ESSAY" && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        Correct answer:
                      </p>
                      {question.type === "MULTIPLE_CHOICE" && question.correctAnswer ? (
                        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                          {String.fromCharCode(65 + parseInt(question.correctAnswer))}.{" "}
                          {question.options[parseInt(question.correctAnswer)]?.optionText || "N/A"}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                          {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Show mentor feedback for essay */}
                  {question.type === "ESSAY" && answer?.feedback && (
                    <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/30">
                      <p className="text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
                        Mentor feedback:
                      </p>
                      <p className="mt-1 text-sm text-indigo-900 dark:text-indigo-200">
                        {answer.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/quizzes"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to quizzes
        </Link>
        <Link
          href={`/courses`}
          className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Continue learning
        </Link>
      </div>
    </div>
  );
}

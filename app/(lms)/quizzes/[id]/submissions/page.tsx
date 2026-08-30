import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMentor } from "@/lib/rbac";
import { getQuizDetail } from "@/lib/data-quiz";
import { QuizGrader } from "@/components/quiz/QuizGrader";
import { ArrowLeft, CheckCircle, Clock, User } from "lucide-react";

export default async function QuizSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) redirect("/dashboard");

  const { id } = await params;
  const quiz = await getQuizDetail(id, session.user.id, session.user.role);

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Quiz not found</p>
      </div>
    );
  }

  if (quiz.creatorId !== session.user.id) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You can only view submissions for quizzes you created
        </p>
      </div>
    );
  }

  // Filter submissions to ensure user is included (TypeScript safety for mentor view)
  const submissions = quiz.submissions.filter((s): s is typeof s & { user: { id: string; name: string; email: string } } => 
    'user' in s && s.user !== null
  );
  
  const hasEssays = quiz.questions.some((q) => q.type === "ESSAY");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/quizzes/${id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Back to quiz
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{quiz.title}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <User className="mx-auto size-12 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
          <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">No submissions yet</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Students haven't taken this quiz yet
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {submissions.map((submission) => {
            const essayAnswers = submission.answers.filter(
              (a) => a.question.type === "ESSAY"
            );
            const needsGrading = essayAnswers.some((a) => a.pointsEarned === null);
            const percentage = submission.score !== null
              ? Math.round((submission.score / submission.totalPoints) * 100)
              : 0;

            return (
              <div
                key={submission.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Student Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {submission.user.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {submission.user.email}
                    </p>
                    {submission.submittedAt && (
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {submission.status === "GRADED" ? (
                      <div>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="size-4" strokeWidth={2} />
                          <span className="text-sm font-semibold">Graded</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                          {submission.score}/{submission.totalPoints}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{percentage}%</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                          <Clock className="size-4" strokeWidth={2} />
                          <span className="text-sm font-semibold">Pending</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          Needs grading
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Essay Answers to Grade */}
                {hasEssays && essayAnswers.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      Essay questions {needsGrading && "(Needs grading)"}
                    </h4>
                    {essayAnswers.map((answer) => (
                      <QuizGrader
                        key={answer.id}
                        answer={{
                          id: answer.id,
                          answerText: answer.answerText || "",
                          pointsEarned: answer.pointsEarned,
                          feedback: answer.feedback,
                          question: {
                            id: answer.question.id,
                            questionText: answer.question.questionText,
                            points: quiz.questions.find((q) => q.id === answer.question.id)?.points || 0,
                          },
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Auto-graded Summary */}
                {!hasEssays && submission.status === "GRADED" && (
                  <div className="mt-6 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/20">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      <strong>Auto-graded:</strong> All questions were automatically graded. Score:{" "}
                      {submission.score}/{submission.totalPoints} ({percentage}%)
                    </p>
                  </div>
                )}

                {/* All Answers Summary */}
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                    View all answers
                  </summary>
                  <div className="mt-4 space-y-3">
                    {submission.answers.map((answer, index) => {
                      const question = quiz.questions.find((q) => q.id === answer.question.id);
                      if (!question) return null;

                      return (
                        <div
                          key={answer.id}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                Q{index + 1}. {answer.question.questionText}
                              </p>
                              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                                {question.type === "MULTIPLE_CHOICE" && answer.answerText
                                  ? `${String.fromCharCode(65 + parseInt(answer.answerText))}. ${
                                      question.options[parseInt(answer.answerText)]?.optionText || "N/A"
                                    }`
                                  : answer.answerText || "(No answer)"}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                {answer.pointsEarned ?? 0}
                              </span>
                              <span className="text-zinc-500 dark:text-zinc-400">
                                /{question.points}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

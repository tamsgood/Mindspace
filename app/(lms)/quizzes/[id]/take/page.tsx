import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMentor } from "@/lib/rbac";
import { getQuizForTaking } from "@/lib/data-quiz";
import { submitQuiz } from "@/app/actions/quiz";
import { QuizTaker } from "@/components/quiz/QuizTaker";

export default async function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  // Only students can take quizzes
  if (isMentor(session.user.role)) {
    redirect(`/quizzes/${id}`);
  }

  const quiz = await getQuizForTaking(id, session.user.id);

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Quiz not found or not available</p>
      </div>
    );
  }

  // Check if already submitted
  const existingSubmission = quiz.submissions[0];
  if (existingSubmission && existingSubmission.status !== "IN_PROGRESS") {
    redirect(`/quizzes/${id}`);
  }

  const handleSubmit = async (answers: { questionId: string; answerText: string }[]) => {
    "use server";
    const result = await submitQuiz(id, answers);
    if (result.success) {
      redirect(`/quizzes/${id}/result`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Quiz Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{quiz.title}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{quiz.course.title}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{quiz.questions.length}</span>
            <span className="ml-1 text-zinc-600 dark:text-zinc-400">questions</span>
          </div>
          {quiz.timeLimit && (
            <div>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{quiz.timeLimit}</span>
              <span className="ml-1 text-zinc-600 dark:text-zinc-400">minutes</span>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Taker */}
      <QuizTaker questions={quiz.questions} timeLimit={quiz.timeLimit} onSubmit={handleSubmit} />
    </div>
  );
}

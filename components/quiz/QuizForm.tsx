"use client";

import { useActionState, useState } from "react";
import { createQuiz, type ActionState } from "@/app/actions/quiz";
import { QuestionForm } from "@/components/quiz/QuestionForm";
import { ui } from "@/lib/lms-ui";
import { Plus, Trash2, GripVertical } from "lucide-react";

const initial: ActionState = {};

type Question = {
  id: string; // temporary ID for UI
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "ESSAY" | "FILL_IN_BLANK";
  questionText: string;
  points: number;
  correctAnswer?: string;
  options?: { text: string }[];
};

export function QuizForm({ courses }: { courses: { id: string; title: string }[] }) {
  const [state, action, pending] = useActionState(createQuiz, initial);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const addQuestion = (question: Omit<Question, "id">) => {
    setQuestions([...questions, { ...question, id: crypto.randomUUID() }]);
    setShowQuestionForm(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("questions", JSON.stringify(questions));
    
    // Save reference to form before async operation
    const form = e.currentTarget;
    
    // Call the action
    const result = await createQuiz(initial, formData);
    
    if (result.success) {
      // Reset form
      setQuestions([]);
      form.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={ui.cardPadLg}>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Quiz details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="courseId" className={ui.label}>
              Course
            </label>
            <select id="courseId" name="courseId" required className={`mt-2 ${ui.select}`}>
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className={ui.label}>
              Quiz title
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="e.g., Module 1 Assessment"
              className={`mt-2 ${ui.input}`}
            />
          </div>

          <div>
            <label htmlFor="description" className={ui.label}>
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Brief description of the quiz"
              className={`mt-2 ${ui.textarea}`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="timeLimit" className={ui.label}>
                Time limit (minutes, optional)
              </label>
              <input
                id="timeLimit"
                name="timeLimit"
                type="number"
                min="1"
                placeholder="30"
                className={`mt-2 ${ui.input}`}
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Leave empty for no time limit
              </p>
            </div>

            <div>
              <label htmlFor="dueDate" className={ui.label}>
                Due date (optional)
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                className={`mt-2 ${ui.input}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className={ui.cardPadLg}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Questions</h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {questions.length} question{questions.length !== 1 ? "s" : ""} • {totalPoints} total points
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowQuestionForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus className="size-4" strokeWidth={2} />
            Add question
          </button>
        </div>

        {/* Question List */}
        {questions.length > 0 && (
          <div className="mt-6 space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="group rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => moveQuestion(index, "up")}
                      disabled={index === 0}
                      className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30 dark:hover:text-zinc-300"
                    >
                      <GripVertical className="size-4" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                            Q{index + 1}.
                          </span>
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {question.type.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            {question.points} pt{question.points !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {question.questionText}
                        </p>

                        {/* Show options for MC */}
                        {question.type === "MULTIPLE_CHOICE" && question.options && (
                          <div className="mt-3 space-y-1">
                            {question.options.map((opt, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                              >
                                <span
                                  className={
                                    question.correctAnswer === String(optIndex)
                                      ? "font-semibold text-emerald-600 dark:text-emerald-400"
                                      : ""
                                  }
                                >
                                  {String.fromCharCode(65 + optIndex)}. {opt.text}
                                </span>
                                {question.correctAnswer === String(optIndex) && (
                                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                    ✓ Correct
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Show correct answer for TF and Fill blank */}
                        {(question.type === "TRUE_FALSE" || question.type === "FILL_IN_BLANK") &&
                          question.correctAnswer && (
                            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                              ✓ Correct: {question.correctAnswer}
                            </p>
                          )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500 opacity-0 transition hover:text-red-700 group-hover:opacity-100 dark:hover:text-red-400"
                      >
                        <Trash2 className="size-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {questions.length === 0 && !showQuestionForm && (
          <div className="mt-6 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No questions added yet. Click "Add question" to start.
            </p>
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <QuestionForm
              onSubmit={addQuestion}
              onCancel={() => setShowQuestionForm(false)}
            />
          </div>
        </div>
      )}

      {/* Submit Section */}
      <div className={ui.cardPadLg}>
        {state.error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{state.error}</p>}
        {state.success && (
          <p className="mb-4 text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending || questions.length === 0}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {pending ? "Creating..." : "Create quiz (Draft)"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

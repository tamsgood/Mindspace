"use client";

import { useState } from "react";
import { gradeEssay } from "@/app/actions/quiz";
import { ui } from "@/lib/lms-ui";
import { Save, CheckCircle } from "lucide-react";

type EssayAnswer = {
  id: string;
  answerText: string;
  pointsEarned: number | null;
  feedback: string | null;
  question: {
    id: string;
    questionText: string;
    points: number;
  };
};

export function QuizGrader({
  answer,
  onGraded,
}: {
  answer: EssayAnswer;
  onGraded?: () => void;
}) {
  const [points, setPoints] = useState(answer.pointsEarned ?? 0);
  const [feedback, setFeedback] = useState(answer.feedback ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isGraded = answer.pointsEarned !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const result = await gradeEssay(answer.id, points, feedback);

    setSubmitting(false);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: result.success || "Graded successfully" });
      if (onGraded) {
        setTimeout(() => onGraded(), 1000);
      }
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              ESSAY
            </span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Max: {answer.question.points} pts
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {answer.question.questionText}
          </p>
        </div>
        {isGraded && (
          <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="size-4" strokeWidth={2} />
            Graded
          </div>
        )}
      </div>

      {/* Student's Answer */}
      <div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Student's answer:
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
          {answer.answerText || "(No answer provided)"}
        </p>
      </div>

      {/* Grading Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`points-${answer.id}`} className={ui.label}>
              Points earned
            </label>
            <input
              id={`points-${answer.id}`}
              type="number"
              value={points}
              onChange={(e) => setPoints(Math.min(answer.question.points, Math.max(0, parseInt(e.target.value) || 0)))}
              min={0}
              max={answer.question.points}
              required
              className={`mt-2 ${ui.input}`}
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{points}</span> /{" "}
              {answer.question.points} points
              <div className="mt-1 text-xs">
                ({Math.round((points / answer.question.points) * 100)}%)
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor={`feedback-${answer.id}`} className={ui.label}>
            Feedback (optional)
          </label>
          <textarea
            id={`feedback-${answer.id}`}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Provide feedback to help the student improve..."
            className={`mt-2 ${ui.textarea}`}
          />
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.type === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="size-4" strokeWidth={2} />
          {submitting ? "Saving..." : isGraded ? "Update grade" : "Save grade"}
        </button>
      </form>
    </div>
  );
}

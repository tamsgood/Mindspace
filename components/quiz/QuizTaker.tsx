"use client";

import { useState, useEffect } from "react";
import { ui } from "@/lib/lms-ui";
import { Clock, AlertCircle } from "lucide-react";

type Question = {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "ESSAY" | "FILL_IN_BLANK";
  questionText: string;
  points: number;
  order: number;
  options?: { id: string; optionText: string; order: number }[];
};

type Answer = {
  questionId: string;
  answerText: string;
};

export function QuizTaker({
  questions,
  timeLimit,
  onSubmit,
}: {
  questions: Question[];
  timeLimit?: number | null;
  onSubmit: (answers: Answer[]) => Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null); // in seconds
  const [submitting, setSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const setAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = questions.filter((q) => !answers[q.id] || answers[q.id].trim() === "");
    if (unanswered.length > 0 && timeRemaining !== 0) {
      const confirmSubmit = confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);

    const answersArray: Answer[] = questions.map((q) => ({
      questionId: q.id,
      answerText: answers[q.id] || "",
    }));

    await onSubmit(answersArray);
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[question.id] && answers[question.id].trim() !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        {timeRemaining !== null && (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
              timeRemaining < 300
                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            <Clock className="size-4" strokeWidth={2} />
            <span className="text-sm font-semibold">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className={ui.cardPadLg}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {question.type.replace(/_/g, " ")}
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {question.points} point{question.points !== 1 ? "s" : ""}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {question.questionText}
            </h2>
          </div>
        </div>

        {/* Answer Input based on type */}
        <div className="mt-6">
          {question.type === "MULTIPLE_CHOICE" && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${
                    answers[question.id] === String(index)
                      ? "border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/30"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={String(index)}
                    checked={answers[question.id] === String(index)}
                    onChange={(e) => setAnswer(question.id, e.target.value)}
                    className="mt-1 size-4 text-indigo-600"
                  />
                  <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <strong>{String.fromCharCode(65 + index)}.</strong> {option.optionText}
                  </span>
                </label>
              ))}
            </div>
          )}

          {question.type === "TRUE_FALSE" && (
            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                  answers[question.id] === "True"
                    ? "border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/30"
                    : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="True"
                  checked={answers[question.id] === "True"}
                  onChange={(e) => setAnswer(question.id, e.target.value)}
                  className="size-4 text-indigo-600"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">True</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                  answers[question.id] === "False"
                    ? "border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/30"
                    : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="False"
                  checked={answers[question.id] === "False"}
                  onChange={(e) => setAnswer(question.id, e.target.value)}
                  className="size-4 text-indigo-600"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">False</span>
              </label>
            </div>
          )}

          {question.type === "FILL_IN_BLANK" && (
            <div>
              <input
                type="text"
                value={answers[question.id] || ""}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className={ui.input}
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Answer will be checked case-insensitively
              </p>
            </div>
          )}

          {question.type === "ESSAY" && (
            <div>
              <textarea
                value={answers[question.id] || ""}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                rows={8}
                placeholder="Write your answer here..."
                className={ui.textarea}
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                This will be manually graded by your mentor
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentQuestion(index)}
              className={`size-8 rounded-lg text-xs font-semibold transition ${
                index === currentQuestion
                  ? "bg-indigo-600 text-white"
                  : answers[questions[index].id]
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit quiz"}
          </button>
        )}
      </div>

      {/* Warning for unanswered */}
      {timeRemaining !== 0 && Object.keys(answers).length < questions.length && (
        <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/20">
          <AlertCircle className="size-5 shrink-0 text-yellow-600 dark:text-yellow-500" strokeWidth={2} />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              You have unanswered questions
            </p>
            <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
              Use the numbered buttons above to navigate and answer all questions before submitting
            </p>
          </div>
        </div>
      )}

      {/* Time's up warning */}
      {timeRemaining === 0 && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
          <AlertCircle className="size-5 shrink-0 text-red-600 dark:text-red-500" strokeWidth={2} />
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            Time's up! Your quiz will be automatically submitted.
          </p>
        </div>
      )}
    </div>
  );
}

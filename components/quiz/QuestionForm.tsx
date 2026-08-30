"use client";

import { useState } from "react";
import { ui } from "@/lib/lms-ui";
import { Plus, X } from "lucide-react";

type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "ESSAY" | "FILL_IN_BLANK";

type QuestionData = {
  type: QuestionType;
  questionText: string;
  points: number;
  correctAnswer?: string;
  options?: { text: string }[];
};

export function QuestionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (question: QuestionData) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<QuestionType>("MULTIPLE_CHOICE");
  const [questionText, setQuestionText] = useState("");
  const [points, setPoints] = useState(1);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      alert("Multiple choice must have at least 2 options");
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
    // Reset correct answer if it was the removed option
    if (correctAnswer === String(index)) {
      setCorrectAnswer("");
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert("Question text is required");
      return;
    }

    if (points < 1) {
      alert("Points must be at least 1");
      return;
    }

    // Validate based on type
    if (type === "MULTIPLE_CHOICE") {
      const filledOptions = options.filter((opt) => opt.trim());
      if (filledOptions.length < 2) {
        alert("Multiple choice must have at least 2 options");
        return;
      }
      if (!correctAnswer) {
        alert("Please select the correct answer");
        return;
      }
      onSubmit({
        type,
        questionText,
        points,
        correctAnswer,
        options: filledOptions.map((text) => ({ text })),
      });
    } else if (type === "TRUE_FALSE") {
      if (!correctAnswer) {
        alert("Please select the correct answer (True or False)");
        return;
      }
      onSubmit({ type, questionText, points, correctAnswer });
    } else if (type === "FILL_IN_BLANK") {
      if (!correctAnswer.trim()) {
        alert("Please provide the correct answer");
        return;
      }
      onSubmit({ type, questionText, points, correctAnswer: correctAnswer.trim() });
    } else if (type === "ESSAY") {
      onSubmit({ type, questionText, points });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Add question</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Create a new question for your quiz
        </p>
      </div>

      {/* Question Type */}
      <div>
        <label htmlFor="type" className={ui.label}>
          Question type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as QuestionType);
            setCorrectAnswer(""); // Reset correct answer when type changes
          }}
          className={`mt-2 ${ui.select}`}
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="ESSAY">Essay</option>
          <option value="FILL_IN_BLANK">Fill in the Blank</option>
        </select>
      </div>

      {/* Question Text */}
      <div>
        <label htmlFor="questionText" className={ui.label}>
          Question
        </label>
        <textarea
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          rows={3}
          placeholder="Enter your question here..."
          className={`mt-2 ${ui.textarea}`}
        />
      </div>

      {/* Points */}
      <div>
        <label htmlFor="points" className={ui.label}>
          Points
        </label>
        <input
          id="points"
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
          min="1"
          required
          className={`mt-2 ${ui.input}`}
        />
      </div>

      {/* Type-specific fields */}
      {type === "MULTIPLE_CHOICE" && (
        <div>
          <label className={ui.label}>Options</label>
          <div className="mt-3 space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={String(index)}
                  checked={correctAnswer === String(index)}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="size-4 text-indigo-600"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className={`flex-1 ${ui.input}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <X className="size-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOption}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <Plus className="size-4" strokeWidth={2} />
            Add option
          </button>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Select the radio button next to the correct answer
          </p>
        </div>
      )}

      {type === "TRUE_FALSE" && (
        <div>
          <label className={ui.label}>Correct answer</label>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="tfAnswer"
                value="True"
                checked={correctAnswer === "True"}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="size-4 text-indigo-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">True</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="tfAnswer"
                value="False"
                checked={correctAnswer === "False"}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="size-4 text-indigo-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">False</span>
            </label>
          </div>
        </div>
      )}

      {type === "FILL_IN_BLANK" && (
        <div>
          <label htmlFor="correctAnswer" className={ui.label}>
            Correct answer
          </label>
          <input
            id="correctAnswer"
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="The correct answer for the blank"
            className={`mt-2 ${ui.input}`}
          />
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Answer will be checked case-insensitively with trimmed whitespace
          </p>
        </div>
      )}

      {type === "ESSAY" && (
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Essay questions require manual grading by the mentor after submission.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Add question
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isMentor } from "@/lib/rbac";

export type ActionState = {
  error?: string;
  success?: string;
};

type QuestionInput = {
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "ESSAY" | "FILL_IN_BLANK";
  questionText: string;
  points: number;
  correctAnswer?: string; // For TF, Fill blank, or MC option ID
  options?: { text: string }[]; // For MC
};

/**
 * Create a new quiz
 */
export async function createQuiz(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const courseId = formData.get("courseId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const timeLimit = formData.get("timeLimit") as string;
    const dueDate = formData.get("dueDate") as string;
    const questionsJson = formData.get("questions") as string;

    if (!courseId || !title) {
      return { error: "Course and title are required" };
    }

    const questions: QuestionInput[] = questionsJson ? JSON.parse(questionsJson) : [];
    
    if (questions.length === 0) {
      return { error: "At least one question is required" };
    }

    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        creatorId: session.user.id,
        title,
        description: description || null,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        totalPoints,
        status: "DRAFT",
        questions: {
          create: questions.map((q, index) => ({
            type: q.type,
            questionText: q.questionText,
            points: q.points,
            order: index + 1,
            correctAnswer: q.correctAnswer || null,
            options: q.options
              ? {
                  create: q.options.map((opt, optIndex) => ({
                    optionText: opt.text,
                    order: optIndex + 1,
                  })),
                }
              : undefined,
          })),
        },
      },
    });

    revalidatePath("/quizzes");
    return { success: `Quiz "${title}" created successfully` };
  } catch (error) {
    console.error("Create quiz error:", error);
    return { error: "Failed to create quiz. Please try again." };
  }
}

/**
 * Publish a quiz (change status from DRAFT to PUBLISHED)
 */
export async function publishQuiz(quizId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return { error: "Quiz not found" };
    }

    if (quiz.creatorId !== session.user.id) {
      return { error: "You can only publish your own quizzes" };
    }

    if (quiz.questions.length === 0) {
      return { error: "Cannot publish a quiz without questions" };
    }

    await prisma.quiz.update({
      where: { id: quizId },
      data: { status: "PUBLISHED" },
    });

    revalidatePath("/quizzes");
    revalidatePath(`/quizzes/${quizId}`);
    return { success: "Quiz published successfully" };
  } catch (error) {
    console.error("Publish quiz error:", error);
    return { error: "Failed to publish quiz" };
  }
}

/**
 * Delete a quiz (only if no submissions)
 */
export async function deleteQuiz(quizId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { _count: { select: { submissions: true } } },
    });

    if (!quiz) {
      return { error: "Quiz not found" };
    }

    if (quiz.creatorId !== session.user.id) {
      return { error: "You can only delete your own quizzes" };
    }

    if (quiz._count.submissions > 0) {
      return { error: "Cannot delete a quiz that has submissions" };
    }

    await prisma.quiz.delete({ where: { id: quizId } });

    revalidatePath("/quizzes");
    return { success: "Quiz deleted successfully" };
  } catch (error) {
    console.error("Delete quiz error:", error);
    return { error: "Failed to delete quiz" };
  }
}

/**
 * Submit a quiz (student)
 */
export async function submitQuiz(
  quizId: string,
  answers: { questionId: string; answerText: string }[]
): Promise<ActionState & { submissionId?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId, status: "PUBLISHED" },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!quiz) {
      return { error: "Quiz not found or not published" };
    }

    // Check if already submitted
    const existing = await prisma.quizSubmission.findUnique({
      where: {
        quizId_userId: { quizId, userId: session.user.id },
      },
    });

    if (existing && existing.status !== "IN_PROGRESS") {
      return { error: "You have already submitted this quiz" };
    }

    // Auto-grade answers
    let totalScore = 0;
    const gradedAnswers = answers.map((ans) => {
      const question = quiz.questions.find((q) => q.id === ans.questionId);
      if (!question) return ans;

      let isCorrect: boolean | null = null;
      let pointsEarned = 0;

      // Auto-grade for MC, TF, Fill in blank
      if (question.type === "MULTIPLE_CHOICE") {
        isCorrect = ans.answerText === question.correctAnswer;
        pointsEarned = isCorrect ? question.points : 0;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = ans.answerText === question.correctAnswer;
        pointsEarned = isCorrect ? question.points : 0;
      } else if (question.type === "FILL_IN_BLANK") {
        // Case-insensitive comparison, trim whitespace
        const studentAnswer = ans.answerText.trim().toLowerCase();
        const correctAnswer = (question.correctAnswer || "").trim().toLowerCase();
        isCorrect = studentAnswer === correctAnswer;
        pointsEarned = isCorrect ? question.points : 0;
      } else if (question.type === "ESSAY") {
        // Essay needs manual grading
        isCorrect = null;
        pointsEarned = 0;
      }

      if (isCorrect === true) {
        totalScore += pointsEarned;
      }

      return {
        questionId: ans.questionId,
        answerText: ans.answerText,
        isCorrect,
        pointsEarned,
      };
    });

    // Determine status: GRADED if no essays, SUBMITTED if has essays
    const hasEssays = quiz.questions.some((q) => q.type === "ESSAY");
    const status = hasEssays ? "SUBMITTED" : "GRADED";

    // Create or update submission
    const submission = await prisma.quizSubmission.upsert({
      where: {
        quizId_userId: { quizId, userId: session.user.id },
      },
      create: {
        quizId,
        userId: session.user.id,
        score: status === "GRADED" ? totalScore : null,
        totalPoints: quiz.totalPoints,
        status,
        submittedAt: new Date(),
        gradedAt: status === "GRADED" ? new Date() : null,
        answers: {
          create: gradedAnswers,
        },
      },
      update: {
        score: status === "GRADED" ? totalScore : null,
        status,
        submittedAt: new Date(),
        gradedAt: status === "GRADED" ? new Date() : null,
        answers: {
          deleteMany: {},
          create: gradedAnswers,
        },
      },
    });

    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath("/quizzes");
    
    return {
      success: status === "GRADED" 
        ? `Quiz submitted! Your score: ${totalScore}/${quiz.totalPoints}`
        : "Quiz submitted! Waiting for manual grading.",
      submissionId: submission.id,
    };
  } catch (error) {
    console.error("Submit quiz error:", error);
    return { error: "Failed to submit quiz. Please try again." };
  }
}

/**
 * Grade essay question (mentor)
 */
export async function gradeEssay(
  answerId: string,
  points: number,
  feedback?: string
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || !isMentor(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const answer = await prisma.quizAnswer.findUnique({
      where: { id: answerId },
      include: {
        question: true,
        submission: {
          include: {
            quiz: true,
            answers: { include: { question: true } },
          },
        },
      },
    });

    if (!answer) {
      return { error: "Answer not found" };
    }

    if (answer.submission.quiz.creatorId !== session.user.id) {
      return { error: "You can only grade quizzes you created" };
    }

    if (answer.question.type !== "ESSAY") {
      return { error: "Only essay questions need manual grading" };
    }

    if (points < 0 || points > answer.question.points) {
      return { error: `Points must be between 0 and ${answer.question.points}` };
    }

    // Update answer with grade
    await prisma.quizAnswer.update({
      where: { id: answerId },
      data: {
        pointsEarned: points,
        isCorrect: points === answer.question.points,
        feedback: feedback || null,
      },
    });

    // Recalculate total score
    const allAnswers = answer.submission.answers.map((a) =>
      a.id === answerId
        ? { ...a, pointsEarned: points }
        : a
    );

    const totalScore = allAnswers.reduce(
      (sum, a) => sum + (a.pointsEarned || 0),
      0
    );

    // Check if all essays are graded
    const allGraded = allAnswers.every((a) => a.pointsEarned !== null);

    // Update submission
    await prisma.quizSubmission.update({
      where: { id: answer.submission.id },
      data: {
        score: totalScore,
        status: allGraded ? "GRADED" : "SUBMITTED",
        gradedAt: allGraded ? new Date() : null,
      },
    });

    revalidatePath(`/quizzes/${answer.submission.quizId}`);
    revalidatePath(`/quizzes/${answer.submission.quizId}/submissions`);
    
    return { success: "Essay graded successfully" };
  } catch (error) {
    console.error("Grade essay error:", error);
    return { error: "Failed to grade essay" };
  }
}

/**
 * Wrapper for publishQuiz that redirects on success
 * For use in Server Component forms
 */
export async function publishQuizAction(quizId: string): Promise<void> {
  const result = await publishQuiz(quizId);
  if (result.error) {
    throw new Error(result.error);
  }
  redirect(`/quizzes/${quizId}`);
}

/**
 * Wrapper for deleteQuiz that redirects on success
 * For use in Server Component forms
 */
export async function deleteQuizAction(quizId: string): Promise<void> {
  const result = await deleteQuiz(quizId);
  if (result.error) {
    throw new Error(result.error);
  }
  redirect("/quizzes");
}

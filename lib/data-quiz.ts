import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { isMentor } from "@/lib/rbac";

/**
 * Get all quizzes for a user
 * - Mentor: sees all quizzes they created
 * - Student: sees published quizzes for enrolled courses
 */
export async function getQuizzes(userId: string, userRole: Role) {
  if (isMentor(userRole)) {
    // Mentor sees all quizzes they created
    const quizzes = await prisma.quiz.findMany({
      where: { creatorId: userId },
      include: {
        course: { select: { title: true } },
        questions: { select: { id: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      courseName: q.course.title,
      status: q.status,
      questionCount: q.questions.length,
      totalPoints: q.totalPoints,
      timeLimit: q.timeLimit,
      dueDate: q.dueDate,
      submissionCount: q._count.submissions,
    }));
  } else {
    // Student sees published quizzes for enrolled courses with their submission status
    const enrolledCourseIds = await prisma.enrollment
      .findMany({
        where: { userId },
        select: { courseId: true },
      })
      .then((e) => e.map((x) => x.courseId));

    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId: { in: enrolledCourseIds },
        status: "PUBLISHED",
      },
      include: {
        course: { select: { title: true } },
        questions: { select: { id: true } },
        submissions: {
          where: { userId },
          select: {
            id: true,
            status: true,
            score: true,
            submittedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      courseName: q.course.title,
      status: q.status,
      questionCount: q.questions.length,
      totalPoints: q.totalPoints,
      timeLimit: q.timeLimit,
      dueDate: q.dueDate,
      submission: q.submissions[0]
        ? {
            status: q.submissions[0].status,
            score: q.submissions[0].score ?? 0,
            submittedAt: q.submissions[0].submittedAt,
          }
        : null,
    }));
  }
}

/**
 * Get quiz detail with questions
 */
export async function getQuizDetail(quizId: string, userId: string, userRole: Role) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      course: { select: { id: true, title: true } },
      creator: { select: { id: true, name: true } },
      questions: {
        include: {
          options: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      },
      submissions: isMentor(userRole)
        ? {
            include: {
              user: { select: { id: true, name: true, email: true } },
              answers: {
                include: {
                  question: { select: { id: true, questionText: true, type: true } },
                },
              },
            },
            orderBy: { submittedAt: "desc" },
          }
        : {
            where: { userId },
            include: {
              answers: {
                include: {
                  question: { select: { id: true, questionText: true, type: true } },
                },
              },
            },
          },
    },
  });

  return quiz;
}

/**
 * Get quiz for student to take (without correct answers)
 */
export async function getQuizForTaking(quizId: string, userId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId, status: "PUBLISHED" },
    include: {
      course: { select: { title: true } },
      questions: {
        select: {
          id: true,
          type: true,
          questionText: true,
          points: true,
          order: true,
          options: {
            select: { id: true, optionText: true, order: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      submissions: {
        where: { userId },
        select: { id: true, status: true },
      },
    },
  });

  return quiz;
}

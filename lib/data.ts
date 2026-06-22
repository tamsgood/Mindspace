import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isStaff } from "@/lib/rbac";
import type { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function getStudentDashboard(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: { include: { instructor: true } } },
    orderBy: { progressPercent: "desc" },
    take: 3,
  });

  const submissions = await prisma.submission.findMany({
    where: { userId },
    include: { assignment: true },
    orderBy: { assignment: { deadline: "asc" } },
    take: 5,
  });

  return { enrollments, submissions };
}

export async function getMentorDashboard() {
  const [studentCount, courseCount, pendingReview, recentSubmissions] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.submission.count({
      where: { status: { in: ["SUBMITTED", "LATE"] } },
    }),
    prisma.submission.findMany({
      include: { user: true, assignment: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const submissionStats = await prisma.submission.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return {
    studentCount,
    courseCount,
    pendingReview,
    recentSubmissions,
    submissionStats,
    activeToday: Math.min(studentCount, 42),
  };
}

export async function getCoursesForUser(userId: string, role: Role) {
  if (isStaff(role)) {
    return prisma.course.findMany({
      include: {
        instructor: true,
        _count: { select: { enrollments: true, modules: true } },
      },
      orderBy: { title: "asc" },
    });
  }
  // Students: return all courses with enrollment status
  return prisma.course.findMany({
    include: {
      instructor: true,
      _count: { select: { enrollments: true, modules: true } },
      enrollments: { where: { userId }, select: { id: true } },
    },
    orderBy: { title: "asc" },
  });
}

export async function getLearnCourse(courseId: string, userId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: { where: { userId } },
            },
          },
        },
      },
      enrollments: { where: { userId } },
    },
  });
}

export async function getDefaultCourseId(userId: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId },
    orderBy: { progressPercent: "desc" },
  });
  return enrollment?.courseId ?? null;
}

export async function getAssignmentsForUser(userId: string, role: Role) {
  if (isStaff(role)) {
    return prisma.assignment.findMany({
      include: { course: true, submissions: { include: { user: true } } },
      orderBy: { deadline: "asc" },
    });
  }
  // Students: only assignments from enrolled courses
  const assignments = await prisma.assignment.findMany({
    where: {
      course: { enrollments: { some: { userId } } },
    },
    include: {
      course: true,
      submissions: { where: { userId } },
    },
    orderBy: { deadline: "asc" },
  });
  return assignments;
}

export async function getAssignmentsForSubmission(userId: string) {
  // Return only assignments that are NOT yet submitted or are late/not_submitted
  const assignments = await prisma.assignment.findMany({
    where: {
      course: { enrollments: { some: { userId } } },
      submissions: {
        none: {
          userId,
          status: { in: ["SUBMITTED", "REVIEWED"] },
        },
      },
    },
    include: { course: true },
    orderBy: { deadline: "asc" },
  });
  return assignments.map((a) => ({
    id: a.id,
    title: a.title,
    courseTitle: a.course.title,
    deadline: a.deadline,
    allowedFileTypes: a.allowedFileTypes,
    maxSizeMb: a.maxSizeMb,
  }));
}

export async function getMyClasses(userId: string, role: Role) {
  if (isStaff(role)) {
    return prisma.classRoom.findMany({
      include: {
        course: true,
        mentor: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { name: "asc" },
    });
  }
  return prisma.classRoom.findMany({
    where: { enrollments: { some: { userId } } },
    include: {
      course: true,
      mentor: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getAllClassesForJoin() {
  return prisma.classRoom.findMany({
    where: { status: "ACTIVE" },
    include: { course: true, _count: { select: { enrollments: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: { course: { include: { instructor: true } } },
        orderBy: { progressPercent: "desc" },
      },
      certificates: { orderBy: { issuedAt: "desc" } },
      submissions: {
        include: { assignment: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
    },
  });
}

export async function getStudents() {
  return prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      enrollments: { include: { course: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getAnnouncements(userId: string, role: Role) {
  if (isStaff(role)) {
    return prisma.announcement.findMany({
      include: { author: true, course: true },
      orderBy: { createdAt: "desc" },
    });
  }
  return prisma.announcement.findMany({
    where: {
      OR: [
        { courseId: null },
        { course: { enrollments: { some: { userId } } } },
      ],
    },
    include: { author: true, course: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSchedule(userId: string) {
  return prisma.scheduleEvent.findMany({
    where: { userId },
    orderBy: { startAt: "asc" },
  });
}

export async function getProgress(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      },
    },
    orderBy: { progressPercent: "desc" },
  });
}

export async function getStaffSubmissions() {
  return prisma.submission.findMany({
    include: { user: true, assignment: { include: { course: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getStudentSubmissions(userId: string) {
  return prisma.submission.findMany({
    where: { userId },
    include: { assignment: { include: { course: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSubmissions(userId: string, role: Role) {
  if (isStaff(role)) {
    return getStaffSubmissions();
  }
  return getStudentSubmissions(userId);
}

export async function getStaffCourses() {
  return prisma.course.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });
}

import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export async function getNotifications(userId: string, limit = 10) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}

export async function searchContent(userId: string, role: Role, query: string) {
  const q = query.trim();
  if (!q) return { courses: [], assignments: [], lessons: [] };

  const contains = { contains: q };

  const [courses, assignments, lessons] = await Promise.all([
    prisma.course.findMany({
      where: { title: contains },
      take: 8,
      include: { instructor: true },
    }),
    prisma.assignment.findMany({
      where: {
        title: contains,
        ...(role === "STUDENT" || role === "MENTOR"
          ? { course: { enrollments: { some: { userId } } } }
          : {}),
      },
      take: 8,
      include: { course: true },
    }),
    prisma.lesson.findMany({
      where: {
        title: contains,
        ...(role === "STUDENT" || role === "MENTOR"
          ? { module: { course: { enrollments: { some: { userId } } } } }
          : {}),
      },
      take: 8,
      include: { module: { include: { course: true } } },
    }),
  ]);

  return { courses, assignments, lessons };
}

export async function getAdminDashboard() {
  const [students, mentors, courses, pendingSubmissions, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "MENTOR" } }),
    prisma.course.count(),
    prisma.submission.count({ where: { status: { in: ["SUBMITTED", "LATE"] } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
  ]);
  return { students, mentors, courses, pendingSubmissions, recentUsers };
}

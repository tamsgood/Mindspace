import { auth } from "@/auth";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { DashboardView } from "@/components/lms/DashboardView";
import { getMentorDashboard, getStudentDashboard } from "@/lib/data";
import { getAdminDashboard } from "@/lib/notifications";
import { isAdmin, isMentor } from "@/lib/rbac";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (isAdmin(session.user.role)) {
    const data = await getAdminDashboard();
    return <AdminDashboardView stats={data} recentUsers={data.recentUsers} />;
  }

  if (isMentor(session.user.role)) {
    const data = await getMentorDashboard();
    return (
      <DashboardView
        mode="mentor"
        stats={{
          studentCount: data.studentCount,
          activeToday: data.activeToday,
          courseCount: data.courseCount,
          pendingReview: data.pendingReview,
        }}
        submissionStats={data.submissionStats.map((s) => ({
          status: s.status,
          count: s._count.status,
        }))}
        recentSubmissions={data.recentSubmissions.map((s) => ({
          id: s.id,
          status: s.status,
          fileName: s.fileName,
          user: { name: s.user.name },
        }))}
      />
    );
  }

  const data = await getStudentDashboard(session.user.id);
  return (
    <DashboardView
      mode="student"
      enrollments={data.enrollments.map((e) => ({
        progressPercent: e.progressPercent,
        course: { id: e.course.id, title: e.course.title },
      }))}
      submissions={data.submissions.map((s) => ({
        status: s.status,
        assignment: {
          title: s.assignment.title,
          deadline: s.assignment.deadline.toISOString(),
        },
      }))}
    />
  );
}

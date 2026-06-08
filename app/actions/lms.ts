"use server";

import { revalidatePath } from "next/cache";
import { SubmissionStatus } from "@prisma/client";
import { requireSession, requireMentor } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile, validateFile } from "@/lib/upload";
import { createNotification } from "@/app/actions/notifications";

export type ActionState = { error?: string; success?: string };

export async function createAssignment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireMentor();

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const courseId = formData.get("courseId")?.toString();
  const deadlineRaw = formData.get("deadline")?.toString();
  const maxSizeMb = Number(formData.get("maxSize") ?? 25);
  const allowedFileTypes = formData.get("fileTypes")?.toString() || "PDF, ZIP";

  if (!title || !description || !courseId || !deadlineRaw) {
    return { error: "All required fields must be filled." };
  }

  await prisma.assignment.create({
    data: {
      title,
      description,
      courseId,
      deadline: new Date(deadlineRaw),
      maxSizeMb,
      allowedFileTypes,
    },
  });

  revalidatePath("/assignments");
  return { success: "Assignment created." };
}

export async function submitAssignment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const assignmentId = formData.get("assignmentId")?.toString();
  const file = formData.get("file") as File | null;

  if (!assignmentId || !file || file.size === 0) {
    return { error: "Assignment and file are required." };
  }

  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) return { error: "Assignment not found." };

  // Validate file
  const allowedTypes = assignment.allowedFileTypes
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/^\./, ""));
  const validation = validateFile(file, assignment.maxSizeMb, allowedTypes);
  if (!validation.valid) {
    return { error: validation.error };
  }

  // Save file
  const fileUrl = await saveUploadedFile(file, "submissions");

  const now = new Date();
  const isLate = now > assignment.deadline;
  const status = isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED;

  const submission = await prisma.submission.upsert({
    where: {
      assignmentId_userId: { assignmentId, userId: session.user.id },
    },
    create: {
      assignmentId,
      userId: session.user.id,
      fileName: file.name,
      fileUrl,
      status,
      submittedAt: now,
    },
    update: {
      fileName: file.name,
      fileUrl,
      status,
      submittedAt: now,
    },
    include: {
      assignment: { include: { course: { include: { instructor: true } } } },
    },
  });

  const instructorId = submission.assignment.course.instructorId;
  await createNotification({
    userId: instructorId,
    title: "New submission",
    body: `${session.user.name} submitted "${submission.assignment.title}".`,
    href: "/mentor/grading",
  });

  revalidatePath("/submissions");
  revalidatePath("/assignments");
  revalidatePath("/dashboard");
  return { success: "Submission uploaded." };
}

export async function markLessonComplete(lessonId: string, courseId: string) {
  const session = await requireSession();

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId: session.user.id, lessonId },
    },
    create: { userId: session.user.id, lessonId, completed: true },
    update: { completed: true },
  });

  const totalLessons = await prisma.lesson.count({
    where: { module: { courseId } },
  });
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: session.user.id,
      completed: true,
      lesson: { module: { courseId } },
    },
  });

  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  await prisma.enrollment.updateMany({
    where: { userId: session.user.id, courseId },
    data: { progressPercent },
  });

  revalidatePath("/learn");
  revalidatePath("/progress");
  revalidatePath("/dashboard");
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const name = formData.get("name")?.toString().trim();
  const bio = formData.get("bio")?.toString().trim();
  const location = formData.get("location")?.toString().trim();

  if (!name) return { error: "Name is required." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, bio: bio || null, location: location || null },
  });

  revalidatePath("/profile");
  revalidatePath("/settings");
  return { success: "Profile updated." };
}

export async function joinClass(classId: string): Promise<ActionState> {
  const session = await requireSession();

  const existing = await prisma.classEnrollment.findUnique({
    where: { classId_userId: { classId, userId: session.user.id } },
  });
  if (existing) return { error: "Already enrolled in this class." };

  await prisma.classEnrollment.create({
    data: { classId, userId: session.user.id },
  });

  revalidatePath("/my-classes");
  return { success: "Joined class." };
}

export async function gradeSubmission(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireMentor();
  const submissionId = formData.get("submissionId")?.toString();
  const grade = Number(formData.get("grade"));

  if (!submissionId || Number.isNaN(grade) || grade < 0 || grade > 100) {
    return { error: "Valid submission and grade (0–100) required." };
  }

  const submission = await prisma.submission.update({
    where: { id: submissionId },
    data: { grade, status: SubmissionStatus.REVIEWED },
    include: { user: true, assignment: true },
  });

  await createNotification({
    userId: submission.userId,
    title: "Assignment graded",
    body: `"${submission.assignment.title}" scored ${grade}/100.`,
    href: "/assignments",
  });

  revalidatePath("/mentor/grading");
  revalidatePath("/submissions");
  return { success: "Grade saved." };
}

export async function createMaterial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireMentor();
  const courseId = formData.get("courseId")?.toString();
  const moduleTitle = formData.get("moduleTitle")?.toString().trim();
  const lessonTitle = formData.get("lessonTitle")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const typeRaw = formData.get("type")?.toString() ?? "VIDEO";
  const duration = formData.get("duration")?.toString().trim();
  const file = formData.get("file") as File | null;

  if (!courseId || !moduleTitle || !lessonTitle) {
    return { error: "Course, module, and lesson title are required." };
  }

  let fileUrl: string | null = null;
  if (file && file.size > 0) {
    // Validate: max 100MB, common formats
    const allowedTypes = ["pdf", "zip", "pptx", "docx", "mp4", "mp3", "jpg", "png"];
    const validation = validateFile(file, 100, allowedTypes);
    if (!validation.valid) {
      return { error: validation.error };
    }
    fileUrl = await saveUploadedFile(file, "materials");
  }

  let module = await prisma.module.findFirst({
    where: { courseId, title: moduleTitle },
  });
  if (!module) {
    const count = await prisma.module.count({ where: { courseId } });
    module = await prisma.module.create({
      data: { courseId, title: moduleTitle, order: count + 1 },
    });
  }

  const lessonCount = await prisma.lesson.count({ where: { moduleId: module.id } });
  await prisma.lesson.create({
    data: {
      moduleId: module.id,
      title: lessonTitle,
      content: content || null,
      fileUrl,
      duration: duration || null,
      type: typeRaw as "VIDEO" | "QUIZ" | "ASSIGNMENT" | "PRESENTATION" | "DOCUMENT" | "READING",
      order: lessonCount + 1,
    },
  });

  revalidatePath("/learn");
  revalidatePath("/courses");
  return { success: "Material uploaded." };
}

export async function createCourse(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireMentor();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const coverImage = formData.get("coverImage")?.toString().trim();

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  await prisma.course.create({
    data: {
      title,
      description,
      coverImage: coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      instructorId: session.user.id,
    },
  });

  revalidatePath("/courses");
  return { success: "Course created." };
}

export async function updateCourse(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireMentor();
  const courseId = formData.get("courseId")?.toString();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const coverImage = formData.get("coverImage")?.toString().trim();

  if (!courseId || !title || !description) {
    return { error: "All fields are required." };
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title,
      description,
      coverImage: coverImage || undefined,
    },
  });

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  return { success: "Course updated." };
}

export async function deleteCourse(courseId: string): Promise<void> {
  await requireMentor();
  
  // Delete cascade akan otomatis hapus modules, lessons, assignments, dll
  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidatePath("/courses");
}
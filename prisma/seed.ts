import bcrypt from "bcryptjs";
import {
  ClassStatus,
  LessonType,
  PrismaClient,
  Role,
  SubmissionStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.classEnrollment.deleteMany();
  await prisma.classRoom.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.scheduleEvent.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw: string) => bcrypt.hash(pw, 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@mindspace.edu",
      name: "Master Admin",
      passwordHash: await hash("Admin123!"),
      role: Role.ADMIN,
      bio: "Platform administrator",
      location: "Jakarta, Indonesia",
    },
  });

  const mentor = await prisma.user.create({
    data: {
      email: "mentor@mindspace.edu",
      name: "Sarah Chen",
      passwordHash: await hash("Mentor123!"),
      role: Role.MENTOR,
      bio: "Senior web development mentor",
      location: "Jakarta, Indonesia",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "andi@email.com",
      name: "Andi Saputra",
      passwordHash: await hash("Student123!"),
      role: Role.STUDENT,
      bio: "Frontend developer · Lifelong learner",
      location: "Jakarta, Indonesia",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "rina@student.edu",
      name: "Rina Kartika",
      passwordHash: await hash("Student123!"),
      role: Role.STUDENT,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: "budi@student.edu",
      name: "Budi Pratama",
      passwordHash: await hash("Student123!"),
      role: Role.STUDENT,
    },
  });

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "Modern Web Development with React",
        description: "Build modern web apps with React, hooks, routing, and data fetching.",
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        rating: 4.9,
        instructorId: mentor.id,
      },
    }),
    prisma.course.create({
      data: {
        title: "UI/UX Design Fundamentals",
        description: "Learn user research, wireframing, and visual design basics.",
        coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
        rating: 4.8,
        instructorId: mentor.id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Data Science with Python",
        description: "Analyze data and build dashboards with Python.",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        rating: 4.7,
        instructorId: mentor.id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Cloud Computing Essentials",
        description: "Understand cloud services, deployment, and scaling.",
        coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80",
        rating: 4.6,
        instructorId: mentor.id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Mobile App Development with Flutter",
        description: "Cross-platform mobile apps with Flutter and Dart.",
        coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
        rating: 4.8,
        instructorId: mentor.id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Introduction to AI & Machine Learning",
        description: "Foundations of ML, neural networks, and practical AI tools.",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        rating: 4.9,
        instructorId: mentor.id,
      },
    }),
  ]);

  const reactCourse = courses[0]!;

  const mod1 = await prisma.module.create({
    data: { courseId: reactCourse.id, title: "Module 1: Getting started", order: 1 },
  });
  const mod2 = await prisma.module.create({
    data: { courseId: reactCourse.id, title: "Module 2: React fundamentals", order: 2 },
  });
  const mod3 = await prisma.module.create({
    data: { courseId: reactCourse.id, title: "Module 3: Routing & data", order: 3 },
  });
  const mod4 = await prisma.module.create({
    data: { courseId: reactCourse.id, title: "Module 4: Production & deployment", order: 4 },
  });

  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        moduleId: mod1.id,
        title: "Course introduction",
        type: LessonType.VIDEO,
        duration: "8:24",
        content:
          "In this lesson you will understand how the course is structured, what tools you need, and how to get the most out of each module.",
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod1.id,
        title: "Setting up your environment",
        type: LessonType.VIDEO,
        duration: "12:10",
        order: 2,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod1.id,
        title: "Quick knowledge check",
        type: LessonType.QUIZ,
        order: 3,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod2.id,
        title: "Components & props",
        type: LessonType.VIDEO,
        duration: "15:00",
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod2.id,
        title: "State & hooks deep dive",
        type: LessonType.VIDEO,
        duration: "18:30",
        order: 2,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod2.id,
        title: "Build a counter app",
        type: LessonType.ASSIGNMENT,
        order: 3,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod3.id,
        title: "React Router v6",
        type: LessonType.VIDEO,
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod3.id,
        title: "Fetching data with TanStack Query",
        type: LessonType.VIDEO,
        order: 2,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod3.id,
        title: "Build a blog reader",
        type: LessonType.ASSIGNMENT,
        order: 3,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod4.id,
        title: "Performance best practices",
        type: LessonType.VIDEO,
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        moduleId: mod4.id,
        title: "Final quiz",
        type: LessonType.QUIZ,
        order: 2,
      },
    }),
  ]);

  await prisma.enrollment.createMany({
    data: [
      { userId: student.id, courseId: reactCourse.id, progressPercent: 64 },
      { userId: student.id, courseId: courses[1]!.id, progressPercent: 32 },
      { userId: student.id, courseId: courses[2]!.id, progressPercent: 88 },
      { userId: student.id, courseId: courses[3]!.id, progressPercent: 0 },
      { userId: student.id, courseId: courses[4]!.id, progressPercent: 45 },
      { userId: student2.id, courseId: reactCourse.id, progressPercent: 40 },
      { userId: student3.id, courseId: reactCourse.id, progressPercent: 55 },
      { userId: mentor.id, courseId: reactCourse.id, progressPercent: 20 },
    ],
  });

  await prisma.lessonProgress.createMany({
    data: [
      { userId: student.id, lessonId: lessons[0]!.id, completed: true },
      { userId: student.id, lessonId: lessons[1]!.id, completed: true },
      { userId: student.id, lessonId: lessons[2]!.id, completed: true },
      { userId: student.id, lessonId: lessons[3]!.id, completed: true },
    ],
  });

  const class1 = await prisma.classRoom.create({
    data: {
      courseId: reactCourse.id,
      name: "Web Development 101",
      code: "WD101",
      status: ClassStatus.ACTIVE,
      mentorId: mentor.id,
    },
  });
  const class2 = await prisma.classRoom.create({
    data: {
      courseId: courses[1]!.id,
      name: "UI/UX Studio Lab",
      code: "UX204",
      status: ClassStatus.ACTIVE,
      mentorId: mentor.id,
    },
  });
  const class3 = await prisma.classRoom.create({
    data: {
      courseId: courses[2]!.id,
      name: "Data Literacy",
      code: "DL100",
      status: ClassStatus.COMPLETED,
      mentorId: mentor.id,
    },
  });

  await prisma.classEnrollment.createMany({
    data: [
      { classId: class1.id, userId: student.id },
      { classId: class1.id, userId: student2.id },
      { classId: class1.id, userId: student3.id },
      { classId: class2.id, userId: student.id },
      { classId: class3.id, userId: student.id },
    ],
  });

  const now = new Date();
  const in1Day = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in6Days = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const assign1 = await prisma.assignment.create({
    data: {
      courseId: reactCourse.id,
      title: "Build a Counter App with React Hooks",
      description:
        "Create a counter component that supports increment, decrement, and reset using useState.",
      deadline: in1Day,
      maxSizeMb: 25,
      allowedFileTypes: "PDF, ZIP",
    },
  });
  const assign2 = await prisma.assignment.create({
    data: {
      courseId: reactCourse.id,
      title: "Blog reader — fetch and render articles",
      description: "Use TanStack Query to fetch posts from JSONPlaceholder and render a list.",
      deadline: in6Days,
    },
  });
  const assign3 = await prisma.assignment.create({
    data: {
      courseId: courses[1]!.id,
      title: "Wireframe a landing page",
      description: "Create a low-fidelity wireframe for a SaaS landing page. Submit as PDF.",
      deadline: yesterday,
    },
  });

  await prisma.submission.createMany({
    data: [
      {
        assignmentId: assign1.id,
        userId: student.id,
        fileName: "counter-app.zip",
        status: SubmissionStatus.REVIEWED,
        grade: 92,
        submittedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        assignmentId: assign2.id,
        userId: student.id,
        fileName: "blog-reader.zip",
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        assignmentId: assign3.id,
        userId: student.id,
        status: SubmissionStatus.LATE,
      },
      {
        assignmentId: assign1.id,
        userId: student2.id,
        fileName: "counter.zip",
        status: SubmissionStatus.SUBMITTED,
        submittedAt: now,
      },
      {
        assignmentId: assign1.id,
        userId: student3.id,
        status: SubmissionStatus.NOT_SUBMITTED,
      },
    ],
  });

  await prisma.announcement.createMany({
    data: [
      {
        courseId: reactCourse.id,
        authorId: mentor.id,
        title: "Module 2 materials are live",
        body: "Slides and starter repo for React fundamentals have been published.",
        createdAt: new Date("2026-05-12"),
      },
      {
        courseId: reactCourse.id,
        authorId: mentor.id,
        title: "Office hours moved to Friday",
        body: "This week only — join the Zoom link in the course resources tab.",
        createdAt: new Date("2026-05-10"),
      },
    ],
  });

  const weekStart = new Date();
  weekStart.setHours(9, 0, 0, 0);
  await prisma.scheduleEvent.createMany({
    data: [
      {
        userId: student.id,
        title: "React live session",
        startAt: new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000),
        endAt: new Date(weekStart.getTime() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        color: "#6366f1",
      },
      {
        userId: student.id,
        title: "Assignment due: Counter app",
        startAt: in1Day,
        endAt: in1Day,
        color: "#f87171",
      },
      {
        userId: student.id,
        title: "UI/UX critique",
        startAt: new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000),
        endAt: new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        color: "#0ea5e9",
      },
    ],
  });

  await prisma.certificate.createMany({
    data: [
      { userId: student.id, title: "UI/UX for beginners", issuedAt: new Date("2025-01-15") },
      { userId: student.id, title: "JavaScript essentials", issuedAt: new Date("2024-11-20") },
      { userId: student.id, title: "Git mastery", issuedAt: new Date("2024-08-10") },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        title: "Assignment due soon",
        body: "Build a Counter App is due within 24 hours.",
        href: "/assignments",
      },
      {
        userId: student.id,
        title: "Upcoming class",
        body: "React live session starts tomorrow at 09:00.",
        href: "/schedule",
      },
      {
        userId: student.id,
        title: "New announcement",
        body: "Module 2 materials are live for Modern Web Development.",
        href: "/announcements",
      },
      {
        userId: mentor.id,
        title: "Submission pending review",
        body: "Rina Kartika submitted counter.zip for Build a Counter App.",
        href: "/mentor/grading",
      },
      {
        userId: mentor.id,
        title: "Teaching schedule",
        body: "UI/UX critique session this Friday at 14:00.",
        href: "/schedule",
      },
      {
        userId: admin.id,
        title: "Platform activity",
        body: "3 submissions are awaiting mentor review across all courses.",
        href: "/dashboard",
      },
      {
        userId: admin.id,
        title: "User overview",
        body: "5 student accounts and 1 mentor account are active.",
        href: "/admin/users",
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Accounts:");
  console.log("  Admin:   admin@mindspace.edu / Admin123!");
  console.log("  Mentor:  mentor@mindspace.edu / Mentor123!");
  console.log("  Student: andi@email.com / Student123!");
  console.log("  (Also: rina@student.edu, budi@student.edu / Student123!)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

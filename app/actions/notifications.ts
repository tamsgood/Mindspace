"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markNotificationRead(id: string) {
  const session = await requireSession();
  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { read: true },
  });
  revalidatePath("/", "layout");
}

export async function markAllNotificationsRead() {
  const session = await requireSession();
  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/", "layout");
}

export async function createNotification(input: {
  userId: string;
  title: string;
  body: string;
  href?: string;
}) {
  await prisma.notification.create({ data: input });
}

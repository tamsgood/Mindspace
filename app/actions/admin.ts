"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminActionState = { error?: string; success?: string };

export async function createUserByAdmin(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const roleRaw = formData.get("role")?.toString();

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (roleRaw !== "STUDENT" && roleRaw !== "MENTOR") {
    return { error: "Role must be Student or Mentor." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already registered." };

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: roleRaw as Role,
    },
  });

  revalidatePath("/admin/users");
  return { success: `${roleRaw === "MENTOR" ? "Mentor" : "Student"} account created.` };
}

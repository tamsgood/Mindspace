import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SettingsForm } from "@/components/lms/SettingsForm";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Account preferences and profile details.</p>
      </div>
      <SettingsForm
        defaultName={user.name}
        defaultBio={user.bio ?? ""}
        defaultLocation={user.location ?? ""}
        email={user.email}
      />
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/rbac";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || !isAdmin(session.user.role)) redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">Manage users</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create Student or Mentor accounts.</p>
      </div>
      <CreateUserForm />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 text-[11px] font-bold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 ">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">{u.name}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                <td className="px-5 py-4 capitalize text-zinc-600 dark:text-zinc-400">{u.role.toLowerCase()}</td>
                <td className="px-5 py-4 text-zinc-500">{u.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

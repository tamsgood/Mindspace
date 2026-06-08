"use client";

import { useActionState } from "react";
import { createUserByAdmin, type AdminActionState } from "@/app/actions/admin";

const initial: AdminActionState = {};

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUserByAdmin, initial);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 dark:text-zinc-50">Create account</h2>
      <p className="text-xs text-zinc-500">Admins can create Student or Mentor accounts only.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
            Full name
          </label>
          <input id="name" name="name" required className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
            Email
          </label>
          <input id="email" name="email" type="email" required className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
        </div>
        <div>
          <label htmlFor="role" className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
            Role
          </label>
          <select id="role" name="role" required className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
          </select>
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
            Password
          </label>
          <input id="password" name="password" type="password" required minLength={8} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
        </div>
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
      <button type="submit" disabled={pending} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

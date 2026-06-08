"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "@/app/actions/lms";

const initial: ActionState = {};

export function SettingsForm({
  defaultName,
  defaultBio,
  defaultLocation,
  email,
}: {
  defaultName: string;
  defaultBio: string;
  defaultLocation: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Display name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={defaultName}
          required
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Email
        </label>
        <input
          id="email"
          type="email"
          defaultValue={email}
          disabled
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500"
        />
      </div>
      <div>
        <label htmlFor="bio" className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Bio
        </label>
        <input
          id="bio"
          name="bio"
          defaultValue={defaultBio}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div>
        <label htmlFor="location" className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={defaultLocation}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

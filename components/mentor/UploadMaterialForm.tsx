"use client";

import { useActionState } from "react";
import { createMaterial, type ActionState } from "@/app/actions/lms";
import { ui } from "@/lib/lms-ui";

const initial: ActionState = {};

export function UploadMaterialForm({ courses }: { courses: { id: string; title: string }[] }) {
  const [state, action, pending] = useActionState(createMaterial, initial);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="courseId" className={ui.label}>Course</label>
        <select id="courseId" name="courseId" required className={`mt-2 ${ui.select}`}>
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="moduleTitle" className={ui.label}>Module name</label>
        <input id="moduleTitle" name="moduleTitle" required placeholder="e.g. Module 5: Advanced topics" className={`mt-2 ${ui.input}`} />
      </div>
      <div>
        <label htmlFor="lessonTitle" className={ui.label}>Lesson title</label>
        <input id="lessonTitle" name="lessonTitle" required className={`mt-2 ${ui.input}`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className={ui.label}>Type</label>
          <select id="type" name="type" className={`mt-2 ${ui.select}`}>
            <option value="VIDEO">Video</option>
            <option value="PRESENTATION">Presentation (PPT/Slides)</option>
            <option value="DOCUMENT">Document (PDF/Word)</option>
            <option value="READING">Reading Material</option>
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </div>
        <div>
          <label htmlFor="duration" className={ui.label}>Duration (optional)</label>
          <input id="duration" name="duration" placeholder="10:30" className={`mt-2 ${ui.input}`} />
        </div>
      </div>
      <div>
        <label htmlFor="content" className={ui.label}>Content / description</label>
        <textarea id="content" name="content" rows={4} className={`mt-2 ${ui.textarea}`} />
      </div>
      
      <div>
        <label htmlFor="fileUrl" className={ui.label}>File URL (optional)</label>
        <input 
          id="fileUrl" 
          name="fileUrl" 
          type="url"
          placeholder="https://drive.google.com/... or https://dropbox.com/..."
          className={`mt-2 ${ui.input}`} 
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          Link to file on Google Drive, Dropbox, OneDrive, or any public URL
        </p>
      </div>

      {state.error ? <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p> : null}
      <button type="submit" disabled={pending} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {pending ? "Uploading…" : "Upload material"}
      </button>
    </form>
  );
}
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="courseId" className={ui.label}>Course</label>
        <select id="courseId" name="courseId" required className={`mt-2 ${ui.select}`}>
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="moduleTitle" className={ui.label}>Module name</label>
        <input id="moduleTitle" name="moduleTitle" required placeholder="e.g. Module 5: Advanced topics" className={`mt-2 ${ui.input}`} />
      </div>
      <div>
        <label htmlFor="lessonTitle" className={ui.label}>Lesson title</label>
        <input id="lessonTitle" name="lessonTitle" required className={`mt-2 ${ui.input}`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className={ui.label}>Type</label>
          <select id="type" name="type" className={`mt-2 ${ui.select}`}>
            <option value="VIDEO">Video</option>
            <option value="PRESENTATION">Presentation (PPT/Slides)</option>
            <option value="DOCUMENT">Document (PDF/Word)</option>
            <option value="READING">Reading Material</option>
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </div>
        <div>
          <label htmlFor="duration" className={ui.label}>Duration (optional)</label>
          <input id="duration" name="duration" placeholder="10:30" className={`mt-2 ${ui.input}`} />
        </div>
      </div>
      <div>
        <label htmlFor="content" className={ui.label}>Content / description</label>
        <textarea id="content" name="content" rows={4} className={`mt-2 ${ui.textarea}`} />
      </div>
      
      <div>
        <label htmlFor="fileUrl" className={ui.label}>File URL (optional)</label>
        <input 
          id="fileUrl" 
          name="fileUrl" 
          type="url"
          placeholder="https://drive.google.com/... or https://dropbox.com/..."
          className={`mt-2 ${ui.input}`} 
        />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          Link to file on Google Drive, Dropbox, OneDrive, or any public URL
        </p>
      </div>

      {state.error ? <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p> : null}
      <button type="submit" disabled={pending} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {pending ? "Uploading…" : "Upload material"}
      </button>
    </form>
  );
}

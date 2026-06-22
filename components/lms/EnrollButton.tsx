"use client";

import { enrollCourse } from "@/app/actions/lms";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEnroll() {
    setLoading(true);
    try {
      await enrollCourse(courseId);
      router.refresh();
    } catch (error) {
      alert("Failed to enroll in course");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="col-span-2 rounded-xl bg-green-600 py-2 text-center text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
    >
      {loading ? "Enrolling..." : "Enroll now"}
    </button>
  );
}

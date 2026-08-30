"use client";

import { FileText, Download, ExternalLink, Play } from "lucide-react";
import type { LessonType } from "@prisma/client";
import { H5PPlayer } from "./H5PPlayer";

interface LessonViewerProps {
  type: LessonType;
  title: string;
  duration?: string | null;
  fileUrl?: string | null;
}

export function LessonViewer({ type, title, duration, fileUrl }: LessonViewerProps) {
  // H5P Interactive Video
  if (type === "H5P_VIDEO" && fileUrl) {
    return <H5PPlayer h5pUrl={fileUrl} title={title} duration={duration} />;
  }

  // Detect file type from URL
  const isPDF = fileUrl?.toLowerCase().includes('.pdf') || fileUrl?.includes('drive.google.com');
  const isGoogleDrive = fileUrl?.includes('drive.google.com');
  const isDropbox = fileUrl?.includes('dropbox.com');

  // Video type (default)
  if (type === "VIDEO" && !fileUrl) {
    return (
      <div className="relative aspect-video w-full bg-gradient-to-br from-zinc-800 to-zinc-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-lg">
            <Play className="ml-1 size-8" fill="currentColor" strokeWidth={0} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <p className="text-sm font-semibold text-white">{title}</p>
          {duration && <p className="text-xs text-white/80">{duration}</p>}
        </div>
      </div>
    );
  }

  // Video with URL
  if (type === "VIDEO" && fileUrl) {
    return (
      <div className="relative aspect-video w-full bg-zinc-900">
        <iframe
          src={fileUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <p className="text-sm font-semibold text-white">{title}</p>
          {duration && <p className="text-xs text-white/80">{duration}</p>}
        </div>
      </div>
    );
  }

  // PDF Document
  if ((type === "DOCUMENT" || type === "PRESENTATION" || type === "READING") && isPDF && fileUrl) {
    // Convert Google Drive URL to embed format
    let embedUrl = fileUrl;
    if (isGoogleDrive) {
      const fileId = fileUrl.match(/\/d\/([^/]+)/)?.[1] || fileUrl.match(/id=([^&]+)/)?.[1];
      if (fileId) {
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    return (
      <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900">
        <iframe
          src={embedUrl}
          className="h-full w-full"
          allow="autoplay"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-white/80">PDF Document</p>
            </div>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/30"
            >
              <ExternalLink className="size-3.5" />
              Open
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Other file types with download link
  if (fileUrl) {
    const fileExtension = fileUrl.split('.').pop()?.toUpperCase() || 'FILE';
    
    return (
      <div className="relative aspect-video w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-white/95 shadow-lg">
            <FileText className="size-10 text-indigo-600" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">{title}</p>
            <p className="text-sm text-white/90">{fileExtension} File Available</p>
          </div>
          <div className="flex gap-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-white/90"
            >
              <ExternalLink className="size-4" />
              Open File
            </a>
            <a
              href={fileUrl}
              download
              className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/30"
            >
              <Download className="size-4" />
              Download
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: No file URL
  return (
    <div className="relative aspect-video w-full bg-gradient-to-br from-zinc-800 to-zinc-950">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <FileText className="size-12 text-zinc-500" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs text-zinc-400">No file attached to this lesson</p>
        </div>
      </div>
    </div>
  );
}

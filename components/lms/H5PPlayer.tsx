"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";

interface H5PPlayerProps {
  h5pUrl: string;
  title: string;
  duration?: string | null;
}

export function H5PPlayer({ h5pUrl, title, duration }: H5PPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!h5pUrl) {
      setError("No H5P URL provided");
      setLoading(false);
      return;
    }

    // Check if URL is H5P.org embed format
    const isH5PEmbed = h5pUrl.includes('h5p.org/h5p/embed/') || 
                       h5pUrl.includes('h5p.com') ||
                       h5pUrl.includes('/h5p/');

    if (isH5PEmbed) {
      // For embed URLs, we'll use iframe (simpler and more reliable)
      setLoading(false);
      return;
    }

    // For local H5P JSON files, use H5P Standalone
    const loadH5P = async () => {
      try {
        setLoading(true);
        
        // Dynamic import H5P standalone
        const { H5P } = await import("h5p-standalone");
        
        if (!containerRef.current) return;

        await new H5P(containerRef.current, {
          h5pJsonPath: h5pUrl,
          frameJs: "/h5p/frame.bundle.js",
          frameCss: "/h5p/styles/h5p.css",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading H5P content:", err);
        setError("Failed to load H5P content. Please check the URL.");
        setLoading(false);
      }
    };

    loadH5P();
  }, [h5pUrl]);

  // Use iframe for H5P embed URLs (most common case)
  const isIframeEmbed = h5pUrl.includes('h5p.org/h5p/embed/') || 
                        h5pUrl.includes('h5p.com');

  if (isIframeEmbed) {
    return (
      <div className="relative aspect-video w-full bg-zinc-900">
        <iframe
          src={h5pUrl}
          className="h-full w-full rounded-lg"
          allow="geolocation *; microphone *; camera *; midi *; encrypted-media *; autoplay *"
          allowFullScreen
          title={title}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-indigo-500">
              <Play className="size-3 text-white ml-0.5" fill="currentColor" strokeWidth={0} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{title}</p>
              {duration && <p className="text-xs text-white/80">{duration}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For local H5P content
  if (loading) {
    return (
      <div className="relative aspect-video w-full bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 text-indigo-400 animate-spin mx-auto" />
          <p className="mt-3 text-sm text-zinc-400">Loading H5P content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative aspect-video w-full bg-zinc-900 flex items-center justify-center">
        <div className="text-center px-6">
          <AlertCircle className="size-8 text-red-400 mx-auto" />
          <p className="mt-3 text-sm font-medium text-white">{error}</p>
          <p className="mt-1 text-xs text-zinc-400">Please contact your instructor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-zinc-900">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-indigo-500">
            <Play className="size-3 text-white ml-0.5" fill="currentColor" strokeWidth={0} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{title}</p>
            {duration && <p className="text-xs text-white/80">{duration}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

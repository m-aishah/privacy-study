"use client";

import { forwardRef, useEffect, useState } from "react";
import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from "@/lib/content";

type Candidate = { kind: "video" | "image"; ext: string };
type Resolved = { kind: "video" | "image"; src: string };

const CANDIDATES: Candidate[] = [
  ...VIDEO_EXTENSIONS.map((ext) => ({ kind: "video" as const, ext })),
  ...IMAGE_EXTENSIONS.map((ext) => ({ kind: "image" as const, ext })),
];

/**
 * Displays an action's media (video or still image — actions are a mix of
 * both, with varying image dimensions) inside a fixed-size box. Videos fill
 * the box directly since source clips are already 16:9. Images use a
 * blurred, scaled copy of themselves as a backdrop, with the full image
 * shown uncropped on top, so portrait or oddly-proportioned photos never
 * get cropped or leave hard letterboxed bars.
 *
 * Which extension/kind actually exists is resolved via HEAD probes before
 * rendering any <video>/<img> tag at all — not via the tag's onError. A
 * server-rendered <video src> starts loading as soon as the browser's HTML
 * parser sees it, well before React hydrates and could attach a listener,
 * so a missing file's error event fires and is lost before any handler
 * exists to catch it.
 */
export const ActionMedia = forwardRef<
  HTMLVideoElement,
  {
    basePath: string;
    alt: string;
    onKindChange?: (kind: "video" | "image" | null) => void;
  }
>(function ActionMedia({ basePath, alt, onKindChange }, videoRef) {
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setResolved(null);
    setNotFound(false);

    (async () => {
      const attempts = await Promise.all(
        CANDIDATES.map(async (c) => {
          const src = `${basePath}.${c.ext}`;
          try {
            const res = await fetch(src, { method: "HEAD" });
            return res.ok ? { kind: c.kind, src } : null;
          } catch {
            return null;
          }
        }),
      );
      const found = attempts.find((a): a is Resolved => a !== null);
      if (cancelled) return;
      if (found) setResolved(found);
      else setNotFound(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [basePath]);

  useEffect(() => {
    onKindChange?.(resolved?.kind ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved?.kind, resolved?.src]);

  if (!resolved) {
    return <div className="w-full h-full" aria-label={notFound ? alt : "Loading"} />;
  }

  if (resolved.kind === "video") {
    return (
      <video
        ref={videoRef}
        key={resolved.src}
        src={resolved.src}
        autoPlay
        muted
        playsInline
        controls={false}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${resolved.src}-bg`}
        src={resolved.src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={resolved.src}
        src={resolved.src}
        alt={alt}
        className="relative w-full h-full object-contain"
      />
    </>
  );
});

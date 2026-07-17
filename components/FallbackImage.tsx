"use client";

import { useState } from "react";
import { IMAGE_EXTENSIONS } from "@/lib/content";

/**
 * Renders an image from a base path (no extension) by trying each
 * candidate extension in turn until one loads, since source assets may be
 * saved as .jpg, .jpeg, or .png.
 */
export function FallbackImage({
  basePath,
  alt,
  className,
}: {
  basePath: string;
  alt: string;
  className?: string;
}) {
  const [extIndex, setExtIndex] = useState(0);

  if (extIndex >= IMAGE_EXTENSIONS.length) {
    return <div className={className} aria-label={alt} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}.${IMAGE_EXTENSIONS[extIndex]}`}
      alt={alt}
      className={className}
      onError={() => setExtIndex((i) => i + 1)}
    />
  );
}

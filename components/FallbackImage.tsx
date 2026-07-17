"use client";

import { useEffect, useState } from "react";
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

  // Reset back to the first extension whenever basePath changes (e.g. moving
  // to the next slideshow pair) — otherwise this component instance carries
  // over whatever index worked for the *previous* image, and a new image
  // that needs an earlier extension in the list never gets a chance to try it.
  useEffect(() => {
    setExtIndex(0);
  }, [basePath]);

  if (extIndex >= IMAGE_EXTENSIONS.length) {
    return <div className={className} aria-label={alt} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={basePath}
      src={`${basePath}.${IMAGE_EXTENSIONS[extIndex]}`}
      alt={alt}
      className={className}
      onError={() => setExtIndex((i) => i + 1)}
    />
  );
}

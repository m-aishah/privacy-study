"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ErrorScreen } from "@/components/ErrorScreen";
import { Mode } from "@/lib/supabase";

export default function SessionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const mode: Mode = pathname?.startsWith("/session/children") ? "children" : "adult";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorScreen mode={mode} onRetry={reset} />;
}

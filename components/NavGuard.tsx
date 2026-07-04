"use client";

import { useEffect, useState } from "react";
import { Mode } from "@/lib/supabase";
import { content } from "@/lib/content";
import { Modal } from "./Modal";

/**
 * Blocks browser back navigation (by re-pushing the current entry whenever
 * a popstate fires, and showing an in-app styled warning instead of
 * silently swallowing the gesture) and warns on refresh/close.
 *
 * The refresh/close warning is a native `beforeunload` dialog — browsers
 * do not allow that dialog's text or appearance to be replaced with custom
 * UI, so this is the closest a web app can get to a "confirm before you
 * lose progress" prompt in that case.
 */
export function NavGuard({ mode }: { mode: Mode }) {
  const [showBackWarning, setShowBackWarning] = useState(false);
  const copy = content[mode];

  useEffect(() => {
    const blockPop = () => {
      window.history.pushState(null, "", window.location.href);
      setShowBackWarning(true);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockPop);

    const warnOnUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warnOnUnload);

    return () => {
      window.removeEventListener("popstate", blockPop);
      window.removeEventListener("beforeunload", warnOnUnload);
    };
  }, []);

  if (!showBackWarning) return null;

  return (
    <Modal
      mode={mode}
      title={copy.leaveWarningTitle}
      body={copy.leaveWarningBody}
      dismissLabel={copy.leaveWarningDismiss}
      onDismiss={() => setShowBackWarning(false)}
    />
  );
}

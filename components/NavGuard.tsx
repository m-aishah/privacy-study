"use client";

import { useEffect, useState } from "react";
import { Mode } from "@/lib/supabase";
import { content } from "@/lib/content";
import { Modal } from "./Modal";

type Warning = "back" | "reload" | null;

/**
 * Blocks browser back navigation (by re-pushing the current entry whenever
 * a popstate fires) and keyboard-triggered reloads (F5, Ctrl/Cmd+R),
 * showing an in-app styled warning instead for both.
 *
 * There is no way to do the same for the browser's own reload button or
 * tab-close — those only ever trigger the native, unstylable
 * `beforeunload` confirmation dialog. We still register that listener as
 * a fallback safety net for those cases, but its wording and appearance
 * are controlled entirely by the browser, not this app.
 */
export function NavGuard({ mode }: { mode: Mode }) {
  const [warning, setWarning] = useState<Warning>(null);
  const copy = content[mode];

  useEffect(() => {
    const blockPop = () => {
      window.history.pushState(null, "", window.location.href);
      setWarning("back");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockPop);

    const blockReloadKeys = (e: KeyboardEvent) => {
      const isRefreshShortcut =
        e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r");
      if (isRefreshShortcut) {
        e.preventDefault();
        setWarning("reload");
      }
    };
    window.addEventListener("keydown", blockReloadKeys);

    const warnOnUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warnOnUnload);

    return () => {
      window.removeEventListener("popstate", blockPop);
      window.removeEventListener("keydown", blockReloadKeys);
      window.removeEventListener("beforeunload", warnOnUnload);
    };
  }, []);

  if (!warning) return null;

  const isBack = warning === "back";

  return (
    <Modal
      mode={mode}
      title={isBack ? copy.leaveWarningTitle : copy.reloadWarningTitle}
      body={isBack ? copy.leaveWarningBody : copy.reloadWarningBody}
      dismissLabel={isBack ? copy.leaveWarningDismiss : copy.reloadWarningDismiss}
      onDismiss={() => setWarning(null)}
    />
  );
}

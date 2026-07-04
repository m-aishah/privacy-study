"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Mode, triggerPipelineStop } from "@/lib/supabase";
import { content } from "@/lib/content";
import { useSession } from "@/context/SessionContext";
import { Modal } from "./Modal";

type Warning = "back" | "reload" | null;

/**
 * Blocks browser back navigation and keyboard-triggered reloads (F5,
 * Ctrl/Cmd+R), showing an in-app styled warning instead of either. Both
 * warnings offer a secondary "restart" action, since neither going back
 * nor refreshing has a meaningful "resume where you left off" state in
 * this app — the only real option besides staying is starting over.
 *
 * Every step of the session (welcome -> slideshow -> game -> ...) is a
 * real route change, which pushes its own history entry. Without extra
 * handling, a back press from deep in the flow would land on whatever
 * real page sits behind it (e.g. the welcome screen) and briefly render
 * it before the popstate handler catches up — a visible flash back to a
 * previous step. To prevent that, a duplicate of the *current* page is
 * pushed onto history after every route change, so the entry directly
 * behind the current one is always a copy of itself: back can only ever
 * land on "the same page" (no visible change) before the modal appears.
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
  const router = useRouter();
  const pathname = usePathname();
  const { clearSession } = useSession();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
  }, [pathname]);

  useEffect(() => {
    const blockPop = () => {
      window.history.pushState(null, "", window.location.href);
      setWarning("back");
    };

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

  const handleRestart = () => {
    // The participant may currently be mid-game with the anonymization
    // pipeline running — make sure it's told to stop even though this
    // session never reached the natural end of the 15 actions.
    triggerPipelineStop();
    clearSession();
    router.push("/");
  };

  if (!warning) return null;

  const isBack = warning === "back";

  return (
    <Modal
      mode={mode}
      title={isBack ? copy.leaveWarningTitle : copy.reloadWarningTitle}
      body={isBack ? copy.leaveWarningBody : copy.reloadWarningBody}
      dismissLabel={isBack ? copy.leaveWarningDismiss : copy.reloadWarningDismiss}
      onDismiss={() => setWarning(null)}
      confirmLabel={isBack ? copy.leaveWarningConfirm : copy.reloadWarningConfirm}
      onConfirm={handleRestart}
    />
  );
}

"use client";

import { useEffect } from "react";

/**
 * Blocks browser back navigation (by re-pushing the current entry whenever
 * a popstate fires) and warns on refresh/close. Session pages are strictly
 * linear — there is no supported "back" state to return to.
 */
export function NavGuard() {
  useEffect(() => {
    const blockPop = () => {
      window.history.pushState(null, "", window.location.href);
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

  return null;
}

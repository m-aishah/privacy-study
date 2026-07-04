"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { Mode } from "@/lib/supabase";

type SessionState = {
  participantId: string | null;
  sessionId: string | null;
  mode: Mode | null;
};

type SessionContextValue = SessionState & {
  startSession: (participantId: string, sessionId: string, mode: Mode) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const EMPTY_STATE: SessionState = {
  participantId: null,
  sessionId: null,
  mode: null,
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(EMPTY_STATE);

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      startSession: (participantId, sessionId, mode) =>
        setState({ participantId, sessionId, mode }),
      clearSession: () => setState(EMPTY_STATE),
    }),
    [state]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}

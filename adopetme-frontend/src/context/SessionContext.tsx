import React, { createContext, useContext, useEffect, useState } from "react";

export type SessionType = "ONG" | "TUTOR" | "NONE";

interface SessionContextType {
  session: SessionType;
  setSession: (s: SessionType) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<SessionType>(() => {
    try {
      // During development/testing we prefer to start in NONE so the prototype
      // always begins without an active session. In production we honor
      // previously persisted session_type.
      try {
        // @ts-ignore - import.meta is injected by Vite; guard with try/catch
        if (import.meta && import.meta.env && import.meta.env.DEV) {
          try { localStorage.removeItem('session_type'); } catch {}
          return 'NONE';
        }
      } catch {}

      const stored = localStorage.getItem("session_type");
      if (stored === "ONG" || stored === "TUTOR") return stored;
      return "NONE";
    } catch (e) {
      return "NONE";
    }
  });

  useEffect(() => {
    try {
      // only persist real sessions
      if (session === 'NONE') {
        localStorage.removeItem('session_type');
      } else {
        localStorage.setItem("session_type", session);
      }
    } catch (e) {
      // ignore
    }
  }, [session]);

  const setSession = (s: SessionType) => setSessionState(s);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
};

export default SessionContext;

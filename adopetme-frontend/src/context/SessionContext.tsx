import React, { createContext, useContext, useEffect, useState } from "react";

export type SessionType = "ONG" | "TUTOR" | "NONE";

interface SessionContextType {
  session: SessionType;
  setSession: (s: SessionType) => void;
  userName: string | null; // 👈 NOVO: Nome do usuário
  setUserName: (name: string | null) => void; // 👈 NOVO: Setter para o nome
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<SessionType>(() => {
    try {
      // @ts-ignore
      if (import.meta && import.meta.env && import.meta.env.DEV) {
          try { 
              localStorage.removeItem('session_type'); 
              localStorage.removeItem('user_name'); // Limpa nome em DEV
          } catch {}
          return 'NONE';
      }

      const stored = localStorage.getItem("session_type");
      if (stored === "ONG" || stored === "TUTOR") return stored;
      return "NONE";
    } catch (e) {
      return "NONE";
    }
  });

  // Estado para o nome do usuário
  const [userName, setUserName] = useState<string | null>(() => {
    try {
        return localStorage.getItem("user_name") || null;
    } catch {
        return null;
    }
  });


  useEffect(() => {
    try {
      if (session === 'NONE') {
        localStorage.removeItem('session_type');
        localStorage.removeItem('user_name');
        setUserName(null);
      } else {
        localStorage.setItem("session_type", session);
        // Garante que o nome salvo localmente seja o nome do estado
        if (userName) localStorage.setItem("user_name", userName);
      }
    } catch (e) {
      // ignore
    }
  }, [session, userName]);

  const setSession = (s: SessionType) => setSessionState(s);
  // Não precisamos de um setter aqui, mas incluímos no Type. A lógica de setar o nome
  // é feita no login/register e no useEffect.

  const contextValue = React.useMemo(() => ({
      session,
      setSession,
      userName,
      setUserName // Incluído, mas o uso principal é interno e no login/register
  }), [session, userName]);


  return (
    <SessionContext.Provider value={contextValue}>
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
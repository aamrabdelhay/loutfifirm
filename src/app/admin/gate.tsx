"use client";

import { useEffect, useState } from "react";
import { Loader2, Scale } from "lucide-react";
import { LoginScreen } from "./login-screen";
import { AdminApp } from "./admin-app";
import { adminFetch, getToken, setToken } from "./api-client";

export function AdminGate({ passwordSet }: { passwordSet: boolean }) {
  const [state, setState] = useState<"loading" | "login" | "app">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Bearer token (iframe-safe) first; cookie works too where allowed
        const res = await adminFetch("/api/admin/check", { cache: "no-store" });
        if (alive) setState(res.ok ? "app" : "login");
      } catch {
        if (alive) setState(getToken() ? "app" : "login");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="ink-surface grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-5">
          <span className="grid size-16 rotate-45 place-items-center rounded-2xl border border-steel-500/40 bg-gradient-to-br from-steel-400/20 to-transparent">
            <Scale className="-rotate-45 text-steel-200 animate-pulse" size={28} strokeWidth={1.5} />
          </span>
          <Loader2 size={26} className="animate-spin text-steel-300" />
        </div>
      </div>
    );
  }

  if (state === "app") {
    return <AdminApp />;
  }

  return (
    <LoginScreen
      passwordSet={passwordSet}
      onSuccess={(token) => {
        setToken(token);
        setState("app");
      }}
    />
  );
}

"use client";

import { useState } from "react";
import { api } from "./api";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next: string }) {
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(undefined);
    try {
      await api("POST", `/api/v1/auth/${mode}`, { email: f.get("email"), password: f.get("password") });
      window.location.assign(next); // full load so server components see the cookie
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={mode === "signup" ? 10 : 1}
          required
        />
      </label>
      {error && <div className="err">{error}</div>}
      <button disabled={busy}>{mode === "login" ? "Log in" : "Create account"}</button>
    </form>
  );
}

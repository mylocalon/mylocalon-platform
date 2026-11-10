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
    <form className="stack" onSubmit={submit} noValidate={false}>
      <label className="field">
        Email
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required autoFocus />
      </label>
      <label className="field">
        Password
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder={mode === "signup" ? "At least 10 characters" : "Your password"}
          minLength={mode === "signup" ? 10 : 1}
          required
        />
      </label>
      {error && <div className="err" role="alert">{error}</div>}
      <button className="btn btn-primary" disabled={busy}>
        {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { IconAlert, IconCheck, IconCopy, IconMonitor, IconMoon, IconSun } from "./icons";

/* ------------------------------------------------------------ toasts */
type ToastKind = "ok" | "bad";
type ToastMsg = { id: number; text: string; kind: ToastKind };

export function toast(text: string, kind: ToastKind = "ok") {
  window.dispatchEvent(new CustomEvent("ml-toast", { detail: { text, kind } }));
}

export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    let n = 0;
    const on = (e: Event) => {
      const { text, kind } = (e as CustomEvent<{ text: string; kind: ToastKind }>).detail;
      const id = ++n;
      setItems((xs) => [...xs, { id, text, kind }]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3800);
    };
    window.addEventListener("ml-toast", on);
    return () => window.removeEventListener("ml-toast", on);
  }, []);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          {t.kind === "ok" ? <IconCheck /> : <IconAlert />}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ confirm dialog */
type ConfirmOpts = { title: string; body?: string; confirm?: string; danger?: boolean };
type ConfirmReq = ConfirmOpts & { resolve: (ok: boolean) => void };

export function confirmDialog(opts: ConfirmOpts): Promise<boolean> {
  return new Promise((resolve) => window.dispatchEvent(new CustomEvent("ml-confirm", { detail: { ...opts, resolve } })));
}

export function ConfirmHost() {
  const ref = useRef<HTMLDialogElement>(null);
  const [req, setReq] = useState<ConfirmReq | null>(null);
  useEffect(() => {
    const on = (e: Event) => setReq((e as CustomEvent<ConfirmReq>).detail);
    window.addEventListener("ml-confirm", on);
    return () => window.removeEventListener("ml-confirm", on);
  }, []);
  useEffect(() => {
    if (req && ref.current && !ref.current.open) ref.current.showModal();
  }, [req]);
  const done = (ok: boolean) => {
    req?.resolve(ok);
    ref.current?.close();
    setReq(null);
  };
  return (
    <dialog ref={ref} className="dialog" onCancel={(e) => { e.preventDefault(); done(false); }}>
      {req && (
        <>
          <div className="dialog-body">
            <h3>{req.title}</h3>
            {req.body && <p>{req.body}</p>}
          </div>
          <div className="dialog-actions">
            <button className="btn btn-secondary" onClick={() => done(false)}>Cancel</button>
            <button className={`btn ${req.danger ? "btn-danger-solid" : "btn-primary"}`} onClick={() => done(true)} autoFocus>
              {req.confirm ?? "Confirm"}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------ copy */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`copy-btn${done ? " done" : ""}`}
      aria-label={`${label}: ${text}`}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
    >
      {done ? <IconCheck size={13} /> : <IconCopy size={13} />}
      {done ? "Copied" : label}
    </button>
  );
}

/* ------------------------------------------------------------ theme */
type Theme = "system" | "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    try {
      const t = localStorage.getItem("ml-theme");
      if (t === "light" || t === "dark") setTheme(t);
    } catch {}
  }, []);
  const pick = (t: Theme) => {
    setTheme(t);
    const root = document.documentElement;
    if (t === "system") delete root.dataset.theme;
    else root.dataset.theme = t;
    try {
      if (t === "system") localStorage.removeItem("ml-theme");
      else localStorage.setItem("ml-theme", t);
    } catch {}
  };
  const opts: [Theme, string, React.ReactNode][] = [
    ["system", "System theme", <IconMonitor key="m" size={15} />],
    ["light", "Light theme", <IconSun key="s" size={15} />],
    ["dark", "Dark theme", <IconMoon key="d" size={15} />],
  ];
  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {opts.map(([t, label, icon]) => (
        <button key={t} type="button" aria-label={label} title={label} aria-pressed={theme === t} onClick={() => pick(t)}>
          {icon}
        </button>
      ))}
    </div>
  );
}

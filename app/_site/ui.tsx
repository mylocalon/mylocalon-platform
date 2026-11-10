"use client";

import { useEffect, useRef, useState } from "react";
import { Toaster as SonnerToaster, toast as sonner } from "sonner";
import { IconCheck, IconCopy, IconMonitor, IconMoon, IconSun } from "./icons";

/* ------------------------------------------------------------ theme helpers */
type Theme = "system" | "light" | "dark";

function resolvedTheme(): "light" | "dark" {
  const t = document.documentElement.dataset["theme"];
  if (t === "light" || t === "dark") return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Re-renders when the theme changes (toggle or OS). */
function useResolvedTheme(): "light" | "dark" {
  const [t, setT] = useState<"light" | "dark">("light");
  useEffect(() => {
    const update = () => setT(resolvedTheme());
    update();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      mq.removeEventListener("change", update);
      mo.disconnect();
    };
  }, []);
  return t;
}

/* ------------------------------------------------------------ toasts (Sonner) */
type ToastKind = "ok" | "bad";

/** App-wide toast API: completion (ok) or error (bad) feedback. */
export function toast(text: string, kind: ToastKind = "ok") {
  if (kind === "ok") sonner.success(text);
  else sonner.error(text);
}

export function Toaster() {
  const theme = useResolvedTheme();
  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      offset={{ bottom: "calc(20px + env(safe-area-inset-bottom, 0px))", right: "calc(20px + env(safe-area-inset-right, 0px))" }}
      mobileOffset={{ bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      toastOptions={{
        style: {
          background: "var(--panel)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          fontFamily: "var(--font-sans)",
          borderRadius: "12px",
        },
      }}
      icons={{ success: <span className="ok" style={{ display: "flex" }}><IconCheck size={16} /></span> }}
    />
  );
}

/* ------------------------------------------------------------ confirm dialog */
type ConfirmOpts = { title: string; body?: string; confirm?: string; danger?: boolean };
type ConfirmReq = ConfirmOpts & { resolve: (ok: boolean) => void };

/** Styled replacement for window.confirm — reserve for destructive, irreversible actions. */
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
    ref.current?.close(); // exit animates via CSS (allow-discrete); content stays until then
  };
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="confirm-title"
      onCancel={(e) => { e.preventDefault(); done(false); }}
      onClick={(e) => { if (e.target === ref.current) done(false); }}
    >
      {req && (
        <>
          <div className="dialog-body">
            <h3 id="confirm-title">{req.title}</h3>
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

/** Copy with an icon that morphs copy → check (scale + blur crossfade). */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      className="copy-btn"
      data-done={done || undefined}
      aria-label={done ? "Copied" : `${label}: ${text}`}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setDone(false), 1600);
        }
      }}
    >
      <span className="copy-icons" aria-hidden="true">
        <span className="i-copy"><IconCopy size={13} /></span>
        <span className="i-check"><IconCheck size={13} /></span>
      </span>
      <span>{done ? "Copied" : label}</span>
    </button>
  );
}

/* ------------------------------------------------------------ theme toggle */
const THEME_COLORS = { light: "#fbfbfd", dark: "#09090f" };

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    try {
      const t = localStorage.getItem("ml-theme");
      if (t === "light" || t === "dark") setTheme(t);
    } catch {}
  }, []);

  const apply = (t: Theme) => {
    const root = document.documentElement;
    if (t === "system") delete root.dataset["theme"];
    else root.dataset["theme"] = t;
    // Status bar / browser chrome follows the chosen theme, not just the OS.
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
      m.content = t === "system" ? (m.media.includes("dark") ? THEME_COLORS.dark : THEME_COLORS.light) : THEME_COLORS[t];
    });
    try {
      if (t === "system") localStorage.removeItem("ml-theme");
      else localStorage.setItem("ml-theme", t);
    } catch {}
  };

  const pick = (t: Theme) => {
    setTheme(t);
    // Ease the brightness change with a short crossfade instead of an abrupt jump.
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("theme-xfade");
      const vt = doc.startViewTransition(() => apply(t)) as { finished?: Promise<void> };
      vt.finished?.finally(() => document.documentElement.classList.remove("theme-xfade"));
    } else {
      apply(t);
    }
  };

  const opts: [Theme, string, React.ReactNode][] = [
    ["system", "System theme", <IconMonitor key="m" size={15} />],
    ["light", "Light theme", <IconSun key="s" size={15} />],
    ["dark", "Dark theme", <IconMoon key="d" size={15} />],
  ];
  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Theme">
      {opts.map(([t, label, icon]) => (
        <button key={t} type="button" role="radio" aria-label={label} title={label} aria-checked={theme === t} onClick={() => pick(t)}>
          {icon}
        </button>
      ))}
    </div>
  );
}

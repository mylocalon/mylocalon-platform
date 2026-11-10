"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconLogout, IconPlus } from "../_site/icons";
import { confirmDialog, CopyButton, toast } from "../_site/ui";
import { api } from "./api";

/** A button that calls the API (optionally after a styled confirm), then refreshes server data. */
export function ActionButton(props: {
  method: string;
  path: string;
  body?: unknown;
  label: string;
  confirm?: { title: string; body?: string; confirm?: string };
  success?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={props.className ?? "btn btn-danger btn-sm"}
      disabled={busy}
      onClick={async () => {
        if (props.confirm && !(await confirmDialog({ ...props.confirm, danger: true }))) return;
        setBusy(true);
        try {
          await api(props.method, props.path, props.body);
          if (props.success) toast(props.success);
          router.refresh();
        } catch (e) {
          toast((e as Error).message, "bad");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "…" : props.label}
    </button>
  );
}

/** Mirrors src/domain/subdomain.ts so the form can validate as you type. */
const LABEL = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])$/;
const BLOCKED = new Set(["www", "api", "admin", "gateway", "app", "dashboard", "mail", "smtp", "status", "docs", "static", "cdn", "auth", "login", "billing", "support", "help", "blog", "root", "ns1", "ns2"]);

function subdomainProblem(v: string): string | null {
  if (!v) return null;
  if (/[^a-z0-9-]/.test(v)) return "Only lowercase letters, numbers and hyphens";
  if (v.length < 3) return "At least 3 characters";
  if (v.length > 63) return "At most 63 characters";
  if (v.startsWith("-") || v.endsWith("-")) return "Can't start or end with a hyphen";
  if (v.includes("--")) return "No double hyphens";
  if (BLOCKED.has(v)) return `“${v}” is reserved for mylocalon`;
  return LABEL.test(v) ? null : "Not a valid name";
}

/**
 * Single-field create form (projects, subdomains). Props are plain data so a
 * Server Component can render it: `success` is a template where {value} is
 * replaced with what was entered.
 */
export function CreateForm(props: {
  path: string;
  field: string;
  placeholder: string;
  label: string;
  success: string;
  suffix?: string;
  validate?: "subdomain";
  extra?: { name: string; label: string; options: { value: string; label: string }[] };
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState("");
  const problem = props.validate === "subdomain" ? subdomainProblem(value) : null;
  const ok = props.validate === "subdomain" && value.length > 0 && !problem;

  return (
    <form
      className="card"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (problem || !value.trim()) return;
        const form = e.currentTarget;
        const f = new FormData(form);
        const body: Record<string, unknown> = { [props.field]: value.trim() };
        const extra = props.extra && f.get(props.extra.name);
        if (props.extra && extra) body[props.extra.name] = extra;
        setBusy(true);
        setError(undefined);
        try {
          await api("POST", props.path, body);
          toast(props.success.replace("{value}", value.trim()));
          setValue("");
          form.reset();
          router.refresh();
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="row">
        {props.suffix ? (
          <div className="input-group" data-invalid={problem ? "" : undefined} style={{ flex: "1 1 260px" }}>
            <input
              name={props.field}
              value={value}
              onChange={(e) => { setValue(props.validate === "subdomain" ? e.target.value.toLowerCase().replace(/\s/g, "") : e.target.value); setError(undefined); }}
              placeholder={props.placeholder}
              aria-label={props.placeholder}
              aria-invalid={problem ? true : undefined}
              aria-describedby={`${props.field}-hint`}
              autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="done"
              maxLength={63}
            />
            <span className="addon">{props.suffix}</span>
          </div>
        ) : (
          <input
            name={props.field} value={value} onChange={(e) => { setValue(e.target.value); setError(undefined); }}
            placeholder={props.placeholder} aria-label={props.placeholder} maxLength={64} enterKeyHint="done"
            style={{ flex: "1 1 260px" }}
          />
        )}
        {props.extra && props.extra.options.length > 0 && (
          <select name={props.extra.name} aria-label={props.extra.label} defaultValue="">
            <option value="">No project</option>
            {props.extra.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        <button className="btn btn-primary" disabled={busy || !!problem || !value.trim()}><IconPlus size={16} /> {props.label}</button>
      </div>
      {props.validate === "subdomain" && (
        <p id={`${props.field}-hint`} className={`hint${problem ? " bad" : ok ? " ok" : ""}`} aria-live="polite">
          {problem ?? (ok ? `✓ ${value}${props.suffix ?? ""} looks good` : "3–63 characters: lowercase letters, numbers and single hyphens")}
        </p>
      )}
      {error && <p className="err" role="alert">{error}</p>}
    </form>
  );
}

/** Creates an API key and shows the secret exactly once. */
export function CreateKeyForm() {
  const router = useRouter();
  const [secret, setSecret] = useState<string>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  return (
    <>
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          setError(undefined);
          setBusy(true);
          try {
            const r = await api<{ secret: string }>("POST", "/api/v1/keys", { name: new FormData(form).get("name") });
            setSecret(r.secret);
            form.reset();
            toast("API key created — copy it now");
            router.refresh();
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="row">
          <input name="name" placeholder="Key name, e.g. laptop or ci" required aria-label="Key name" style={{ flex: "1 1 260px" }} />
          <button className="btn btn-primary" disabled={busy}><IconPlus size={16} /> Create key</button>
        </div>
        {error && <p className="err" role="alert">{error}</p>}
      </form>
      {secret && (
        <div className="secret-box" role="alert">
          <strong>Copy this key now — you won&apos;t see it again.</strong>
          <div className="cmd"><code>{secret}</code><CopyButton text={secret} /></div>
          <span className="muted" style={{ fontSize: 13 }}>Use it with </span>
          <code>mylocalon login --api-key …</code>
        </div>
      )}
    </>
  );
}

/** Re-renders server data periodically (live tunnel status). Pauses in background tabs. */
export function AutoRefresh({ ms }: { ms: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => document.visibilityState === "visible" && router.refresh(), ms);
    return () => clearInterval(t);
  }, [ms, router]);
  return null;
}

export function LogoutButton() {
  return (
    <button
      className="btn btn-quiet btn-sm btn-icon"
      title="Log out"
      aria-label="Log out"
      onClick={async () => {
        await api("POST", "/api/v1/auth/logout").catch(() => {});
        window.location.assign("/login");
      }}
    >
      <IconLogout size={16} />
    </button>
  );
}

export function DeviceDecision({ code }: { code: string }) {
  const [done, setDone] = useState<"approved" | "denied">();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  if (done === "approved") return <p className="badge ok" style={{ height: "auto", padding: "10px 14px", fontSize: 14 }}>✓ Approved — return to your terminal, you&apos;re logged in.</p>;
  if (done === "denied") return <p className="badge bad" style={{ height: "auto", padding: "10px 14px", fontSize: 14 }}>Denied — the CLI login was cancelled.</p>;
  const decide = async (approve: boolean) => {
    setBusy(true);
    try {
      await api("POST", "/api/v1/device/decide", { userCode: code, approve });
      setDone(approve ? "approved" : "denied");
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };
  return (
    <>
      <div className="row">
        <button className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={busy} onClick={() => decide(true)}>Approve</button>
        <button className="btn btn-secondary btn-lg" disabled={busy} onClick={() => decide(false)}>Deny</button>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
    </>
  );
}

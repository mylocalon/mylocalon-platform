"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "./api";

/** A button that calls the API, then refreshes server data. */
export function ActionButton(props: {
  method: string;
  path: string;
  body?: unknown;
  label: string;
  confirm?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={props.className ?? "danger"}
      disabled={busy}
      onClick={async () => {
        if (props.confirm && !window.confirm(props.confirm)) return;
        setBusy(true);
        try {
          await api(props.method, props.path, props.body);
          router.refresh();
        } catch (e) {
          window.alert((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {props.label}
    </button>
  );
}

/** Single-field create form (projects, subdomains). */
export function CreateForm(props: {
  path: string;
  field: string;
  placeholder: string;
  label: string;
  extra?: { name: string; options: { value: string; label: string }[] };
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  return (
    <>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          const body: Record<string, unknown> = { [props.field]: f.get(props.field) };
          const extra = props.extra && f.get(props.extra.name);
          if (props.extra && extra) body[props.extra.name] = extra;
          setBusy(true);
          setError(undefined);
          try {
            await api("POST", props.path, body);
            form.reset();
            router.refresh();
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <input name={props.field} placeholder={props.placeholder} required aria-label={props.placeholder} />
        {props.extra && (
          <select name={props.extra.name} aria-label={props.extra.name} defaultValue="">
            <option value="">No project</option>
            {props.extra.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        <button disabled={busy}>{props.label}</button>
      </form>
      {error && <p className="err">{error}</p>}
    </>
  );
}

/** Creates an API key and shows the secret exactly once. */
export function CreateKeyForm() {
  const router = useRouter();
  const [secret, setSecret] = useState<string>();
  const [error, setError] = useState<string>();
  return (
    <>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          setError(undefined);
          try {
            const r = await api<{ secret: string }>("POST", "/api/v1/keys", { name: new FormData(form).get("name") });
            setSecret(r.secret);
            form.reset();
            router.refresh();
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <input name="name" placeholder="Key name, e.g. laptop" required aria-label="Key name" />
        <button>Create key</button>
      </form>
      {error && <p className="err">{error}</p>}
      {secret && (
        <div className="card secret" style={{ marginTop: 12 }}>
          <strong>Copy this key now — it won't be shown again.</strong>
          <pre>{secret}</pre>
          <span className="muted">Use it with </span>
          <code>mylocalon login --api-key …</code>
        </div>
      )}
    </>
  );
}

/** Re-renders server data periodically (live-ish tunnel status). */
export function AutoRefresh({ ms }: { ms: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), ms);
    return () => clearInterval(t);
  }, [ms, router]);
  return null;
}

export function LogoutButton() {
  return (
    <button
      className="ghost"
      onClick={async () => {
        await api("POST", "/api/v1/auth/logout").catch(() => {});
        window.location.assign("/login");
      }}
    >
      Log out
    </button>
  );
}

export function DeviceDecision({ code }: { code: string }) {
  const [done, setDone] = useState<"approved" | "denied">();
  const [error, setError] = useState<string>();
  if (done === "approved") return <p className="ok">✓ Approved. Return to your terminal — you're logged in.</p>;
  if (done === "denied") return <p className="bad">Denied. The CLI login was cancelled.</p>;
  const decide = async (approve: boolean) => {
    try {
      await api("POST", "/api/v1/device/decide", { userCode: code, approve });
      setDone(approve ? "approved" : "denied");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <div className="row" style={{ display: "flex", gap: 8 }}>
        <button onClick={() => decide(true)}>Approve</button>
        <button className="ghost" onClick={() => decide(false)}>
          Deny
        </button>
      </div>
      {error && <p className="err">{error}</p>}
    </>
  );
}

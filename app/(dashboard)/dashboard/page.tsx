import { AutoRefresh } from "../../_components/Actions";
import { IconExternal, IconGlobe, IconKey, IconRefresh, IconTunnel } from "../../_site/icons";
import { CopyButton } from "../../_site/ui";
import { requireUser } from "@/auth/current";
import type { TunnelEvent } from "@/domain/types";
import { getConfig } from "@/lib/config";
import { listApiKeys } from "@/services/apiKeys";
import { listReserved } from "@/services/subdomains";
import { listTunnels, tunnelHistory } from "@/services/tunnels";

export const metadata = { title: "Tunnels · mylocalon" };

function tunnelUrl(sub: string) {
  const c = getConfig();
  return `${c.TUNNEL_URL_SCHEME}://${sub}.${c.BASE_DOMAIN}${c.TUNNEL_URL_PORT ? `:${c.TUNNEL_URL_PORT}` : ""}`;
}

function ago(d: Date): string {
  const s = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const EVENT: Record<TunnelEvent, { label: string; cls: string }> = {
  connected: { label: "Connected", cls: "ok" },
  resumed: { label: "Reconnected", cls: "ok" },
  disconnected: { label: "Connection lost", cls: "warn" },
  closed: { label: "Stopped", cls: "muted" },
};

export default async function TunnelsPage() {
  const user = await requireUser("/dashboard");
  const c = getConfig();
  const [tunnels, history, reserved, keys] = await Promise.all([
    listTunnels(user.id), tunnelHistory(user.id, 15), listReserved(user.id), listApiKeys(user.id),
  ]);
  const live = tunnels.filter((t) => t.status !== "closed");
  const activeKeys = keys.filter((k) => !k.revokedAt).length;

  return (
    <>
      <AutoRefresh ms={5000} />
      <div className="page-head">
        <div>
          <h1>Tunnels</h1>
          <p>Live from the gateway · refreshes every few seconds</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="label"><IconTunnel size={15} /> Active tunnels</div><div className="value">{live.length} <small>/ {c.MAX_TUNNELS}</small></div></div>
        <div className="stat"><div className="label"><IconGlobe size={15} /> Reserved subdomains</div><div className="value">{reserved.length} <small>/ {c.MAX_RESERVED_SUBDOMAINS}</small></div></div>
        <div className="stat"><div className="label"><IconKey size={15} /> API keys</div><div className="value">{activeKeys}</div></div>
      </div>

      <div className="section-title">Running now</div>
      {live.length === 0 ? (
        <div className="card card-pad-lg">
          <h3>{activeKeys === 0 ? "Share your first local app" : "No tunnels running"}</h3>
          <p className="muted" style={{ margin: 0 }}>Run these in a terminal — your tunnel appears here the moment it connects.</p>
          <div className="checklist">
            <div className="check-step"><span className="n">1</span><strong>Install the CLI</strong><div className="cmd"><code>npm install -g mylocalon</code><CopyButton text="npm install -g mylocalon" /></div></div>
            <div className="check-step"><span className="n">2</span><strong>Log in {activeKeys > 0 && <span className="badge ok" style={{ marginLeft: 6 }}>done</span>}</strong><div className="cmd"><code>mylocalon login</code><CopyButton text="mylocalon login" /></div></div>
            <div className="check-step"><span className="n">3</span><strong>Share a port</strong><div className="cmd"><code>mylocalon http 3000</code><CopyButton text="mylocalon http 3000" /></div></div>
          </div>
        </div>
      ) : (
        <div className="tunnel-list">
          {live.map((t) => {
            const url = tunnelUrl(t.subdomain);
            const ok = t.status === "active";
            return (
              <div className="tunnel" key={t.tunnelId}>
                <span className={`tunnel-icon${ok ? "" : " warn"}`}>{ok ? <IconTunnel size={18} /> : <IconRefresh size={18} />}</span>
                <div className="tunnel-main">
                  <a className="tunnel-url" href={url} target="_blank" rel="noreferrer">{url.replace(/^https?:\/\//, "")}</a>
                  <div className="tunnel-meta">
                    {ok ? <span className="ok">● Online</span> : <span className="warn">● Reconnecting</span>} · started {ago(t.since)}
                  </div>
                </div>
                <CopyButton text={url} label="Copy URL" />
                <a className="btn btn-secondary btn-sm hide-sm" href={url} target="_blank" rel="noreferrer">Open <IconExternal size={14} /></a>
              </div>
            );
          })}
        </div>
      )}

      <div className="section-title">Recent activity</div>
      {history.length === 0 ? (
        <div className="empty"><strong>Nothing yet</strong><span>Connects, reconnects and stops will show up here.</span></div>
      ) : (
        <div className="card" style={{ padding: "6px 16px" }}>
          <div className="feed">
            {history.map((h, i) => {
              const e = EVENT[h.event];
              const reason = typeof h.meta["reason"] === "string" ? String(h.meta["reason"]).replaceAll("_", " ") : "";
              return (
                <div className="feed-item" key={`${h.tunnelId}-${i}`}>
                  <span className="time">{ago(h.at)}</span>
                  <span className={`dot ${e.cls}`} style={{ justifySelf: "center" }} />
                  <span><b style={{ fontWeight: 550 }}>{e.label}</b> <span className="muted">· {h.subdomain}{reason && ` · ${reason}`}</span></span>
                  <span className="tid">{h.tunnelId}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

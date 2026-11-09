import { AutoRefresh } from "../_components/Actions";
import { requireUser } from "@/auth/current";
import { getConfig } from "@/lib/config";
import { listTunnels, tunnelHistory } from "@/services/tunnels";

const BADGE = { active: "ok", reconnecting: "warn", closed: "muted" } as const;

function tunnelUrl(sub: string) {
  const c = getConfig();
  return `${c.TUNNEL_URL_SCHEME}://${sub}.${c.BASE_DOMAIN}${c.TUNNEL_URL_PORT ? `:${c.TUNNEL_URL_PORT}` : ""}`;
}

export default async function TunnelsPage() {
  const user = await requireUser("/");
  const [tunnels, history] = await Promise.all([listTunnels(user.id), tunnelHistory(user.id, 20)]);
  const live = tunnels.filter((t) => t.status !== "closed");

  return (
    <>
      <AutoRefresh ms={5000} />
      <h1>Tunnels</h1>
      <p className="muted">Live status from the gateway, refreshed every few seconds.</p>

      <h2>Active</h2>
      {live.length === 0 ? (
        <div className="card">
          <p style={{ marginTop: 0 }}>No tunnels running. From your terminal:</p>
          <pre>{`mylocalon login\nmylocalon http 3000`}</pre>
        </div>
      ) : (
        <table>
          <thead>
            <tr><th>URL</th><th>Status</th><th className="hide-sm">Since</th></tr>
          </thead>
          <tbody>
            {live.map((t) => (
              <tr key={t.tunnelId}>
                <td><a href={tunnelUrl(t.subdomain)} target="_blank" rel="noreferrer">{tunnelUrl(t.subdomain).replace(/^https?:\/\//, "")}</a></td>
                <td><span className={`badge ${BADGE[t.status]}`}>{t.status}</span></td>
                <td className="hide-sm muted">{t.since.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Recent activity</h2>
      {history.length === 0 ? (
        <div className="card empty">Nothing yet.</div>
      ) : (
        <table>
          <thead>
            <tr><th>When</th><th>Subdomain</th><th>Event</th><th className="hide-sm">Tunnel</th></tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={`${h.tunnelId}-${i}`}>
                <td className="muted">{h.at.toLocaleTimeString()}</td>
                <td>{h.subdomain}</td>
                <td>{h.event}{typeof h.meta["reason"] === "string" ? <span className="muted"> · {h.meta["reason"]}</span> : null}</td>
                <td className="hide-sm muted"><code>{h.tunnelId}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

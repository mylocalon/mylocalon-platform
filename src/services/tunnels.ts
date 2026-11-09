import { db } from "@/db/pool";
import type { TunnelAuditRow, TunnelEvent, TunnelSummary } from "@/domain/types";

export interface IncomingEvent {
  tunnelId: string;
  userId: string;
  subdomain: string;
  event: TunnelEvent;
  meta?: Record<string, unknown>;
  at: number; // unix ms
}

/** Appends Gateway lifecycle events to history (tunnel_audit is history only). */
export async function recordEvents(events: IncomingEvent[]): Promise<number> {
  if (events.length === 0) return 0;
  const vals: unknown[] = [];
  const rows = events.map((e, i) => {
    vals.push(e.tunnelId, e.userId, e.subdomain, e.event, JSON.stringify(e.meta ?? {}), new Date(e.at));
    const o = i * 6;
    return `($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4}, $${o + 5}::jsonb, $${o + 6})`;
  });
  await db().query(
    `INSERT INTO tunnel_audit (tunnel_id, user_id, subdomain, event, meta, at) VALUES ${rows.join(",")}`,
    vals,
  );
  return events.length;
}

const STATUS: Record<TunnelEvent, TunnelSummary["status"]> = {
  connected: "active",
  resumed: "active",
  disconnected: "reconnecting",
  closed: "closed",
};

/**
 * The gateway holds a dropped tunnel for a 30s grace window. If it restarts
 * during that window, the "closed" event is never sent — so a tunnel still
 * "reconnecting" well past the window is reported as closed.
 */
const STALE_RECONNECT_MS = 2 * 60_000;

/** Latest state per tunnel seen in the last 24h. */
export async function listTunnels(userId: string, now = Date.now()): Promise<TunnelSummary[]> {
  const { rows } = await db().query(
    `SELECT DISTINCT ON (tunnel_id) tunnel_id, subdomain, event, at,
            (SELECT min(at) FROM tunnel_audit f WHERE f.tunnel_id = t.tunnel_id) AS since
     FROM tunnel_audit t
     WHERE user_id = $1 AND at > now() - interval '24 hours'
     ORDER BY tunnel_id, at DESC, id DESC`,
    [userId],
  );
  return rows
    .map((r) => ({
      tunnelId: r.tunnel_id,
      subdomain: r.subdomain,
      status:
        STATUS[r.event as TunnelEvent] === "reconnecting" && now - r.at.getTime() > STALE_RECONNECT_MS
          ? ("closed" as const)
          : STATUS[r.event as TunnelEvent],
      since: r.since,
      lastEventAt: r.at,
    }))
    .sort((a, b) => b.lastEventAt.getTime() - a.lastEventAt.getTime());
}

export async function tunnelHistory(userId: string, limit = 50): Promise<TunnelAuditRow[]> {
  const { rows } = await db().query(
    `SELECT tunnel_id, subdomain, event, meta, at FROM tunnel_audit
     WHERE user_id = $1 ORDER BY at DESC, id DESC LIMIT $2`,
    [userId, limit],
  );
  return rows.map((r) => ({ tunnelId: r.tunnel_id, subdomain: r.subdomain, event: r.event, meta: r.meta, at: r.at }));
}

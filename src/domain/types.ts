export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Reserved {
  id: string;
  name: string;
  projectId: string | null;
  createdAt: Date;
}

export type TunnelEvent = "connected" | "resumed" | "disconnected" | "closed";

export interface TunnelAuditRow {
  tunnelId: string;
  subdomain: string;
  event: TunnelEvent;
  meta: Record<string, unknown>;
  at: Date;
}

export interface TunnelSummary {
  tunnelId: string;
  subdomain: string;
  status: "active" | "reconnecting" | "closed";
  since: Date;
  lastEventAt: Date;
}

/** Who is calling, and how. */
export interface Principal {
  userId: string;
  via: "session" | "apikey";
  keyId?: string;
}

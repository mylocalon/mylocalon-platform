import { db } from "@/db/pool";
import { getConfig } from "@/lib/config";
import { randomBase62, sha256 } from "@/lib/crypto";

export const SESSION_COOKIE = "ml_session";

/** Creates a DB-backed session; only the sha256 of the cookie value is stored. */
export async function createSession(userId: string): Promise<{ value: string; expiresAt: Date }> {
  const value = randomBase62(43);
  const expiresAt = new Date(Date.now() + getConfig().SESSION_TTL_DAYS * 86_400_000);
  await db().query("INSERT INTO sessions (id_hash, user_id, expires_at) VALUES ($1, $2, $3)", [
    sha256(value),
    userId,
    expiresAt,
  ]);
  return { value, expiresAt };
}

export async function sessionUser(value: string | undefined): Promise<string | null> {
  if (!value || value.length > 128) return null;
  const { rows } = await db().query("SELECT user_id FROM sessions WHERE id_hash = $1 AND expires_at > now()", [
    sha256(value),
  ]);
  return rows[0]?.user_id ?? null;
}

export async function destroySession(value: string | undefined): Promise<void> {
  if (value) await db().query("DELETE FROM sessions WHERE id_hash = $1", [sha256(value)]);
}

export function sessionCookie(value: string, expiresAt: Date): string {
  const secure = getConfig().cookieSecure ? "; Secure" : "";
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}${secure}`;
}

export function clearSessionCookie(): string {
  const secure = getConfig().cookieSecure ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

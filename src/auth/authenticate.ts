import type { Principal } from "@/domain/types";
import { getConfig } from "@/lib/config";
import { safeEqual } from "@/lib/crypto";
import { forbidden, tooMany, unauthorized } from "@/lib/errors";
import { allow } from "@/lib/ratelimit";
import { verifyApiKey } from "@/services/apiKeys";
import { readCookie, SESSION_COOKIE, sessionUser } from "./session";

const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

function bearer(req: Request): string | undefined {
  const h = req.headers.get("authorization");
  return h?.startsWith("Bearer ") ? h.slice(7).trim() : undefined;
}

/**
 * Accepts an API key (CLI/scripts) or the dashboard session cookie. Cookie
 * auth on unsafe methods requires a same-origin Origin header (CSRF).
 */
export async function authenticate(req: Request): Promise<Principal> {
  const key = bearer(req);
  if (key) {
    const v = await verifyApiKey(key);
    if (!v) throw unauthorized("invalid or revoked API key");
    if (!allow(`api:key:${v.keyId}`, getConfig().API_RATE_PER_MIN)) throw tooMany();
    return { userId: v.userId, via: "apikey", keyId: v.keyId };
  }
  const userId = await sessionUser(readCookie(req.headers.get("cookie"), SESSION_COOKIE));
  if (!userId) throw unauthorized();
  if (!SAFE.has(req.method)) assertSameOrigin(req);
  return { userId, via: "session" };
}

export function assertSameOrigin(req: Request): void {
  const origin = req.headers.get("origin");
  const expected = new URL(getConfig().BASE_URL).origin;
  const self = new URL(req.url).origin;
  if (!origin || (origin !== expected && origin !== self)) throw forbidden("cross-origin request rejected");
}

/** Gateway → Platform calls on the private network. */
export function authenticateInternal(req: Request): void {
  const tok = bearer(req);
  if (!tok || !safeEqual(tok, getConfig().INTERNAL_API_TOKEN)) throw unauthorized("invalid internal token");
}

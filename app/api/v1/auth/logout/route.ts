export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { assertSameOrigin } from "@/auth/authenticate";
import { clearSessionCookie, destroySession, readCookie, SESSION_COOKIE } from "@/auth/session";
import { json, route } from "@/lib/http";

export const POST = route(async (req) => {
  assertSameOrigin(req);
  await destroySession(readCookie(req.headers.get("cookie"), SESSION_COOKIE));
  return json({ ok: true }, 200, { "set-cookie": clearSessionCookie() });
});

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { unauthorized } from "@/lib/errors";
import { json, route } from "@/lib/http";
import { tokenRequestSchema } from "@/lib/validation";
import { issueGatewayJWT } from "@/services/tokens";

/** API key → short-lived Gateway JWT (PLATFORM.md §4). */
export const POST = route(async (req) => {
  const p = await authenticate(req);
  if (p.via !== "apikey") throw unauthorized("use an API key (Authorization: Bearer mlk_live_...)");
  const text = await req.text();
  const opts = text ? tokenRequestSchema.parse(JSON.parse(text)) : {};
  const { token, expiresAt } = await issueGatewayJWT(p.userId, opts);
  return json({ token, expiresAt: expiresAt.toISOString() });
});

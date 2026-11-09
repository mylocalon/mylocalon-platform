export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { assertSameOrigin } from "@/auth/authenticate";
import { createSession, sessionCookie } from "@/auth/session";
import { getConfig } from "@/lib/config";
import { tooMany } from "@/lib/errors";
import { body, json, route } from "@/lib/http";
import { clientIp } from "@/lib/ip";
import { allow } from "@/lib/ratelimit";
import { signupSchema } from "@/lib/validation";
import { createUser } from "@/services/users";

export const POST = route(async (req) => {
  assertSameOrigin(req);
  if (!allow(`auth:ip:${clientIp(req)}`, getConfig().AUTH_RATE_PER_MIN)) throw tooMany();
  const { email, password } = await body(req, signupSchema);
  const user = await createUser(email, password);
  const s = await createSession(user.id);
  return json({ user }, 201, { "set-cookie": sessionCookie(s.value, s.expiresAt) });
});

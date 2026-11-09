export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { notFound } from "@/lib/errors";
import { json, route } from "@/lib/http";
import { getUser } from "@/services/users";

export const GET = route(async (req) => {
  const p = await authenticate(req);
  const user = await getUser(p.userId);
  if (!user) throw notFound();
  return json({ user, via: p.via });
});

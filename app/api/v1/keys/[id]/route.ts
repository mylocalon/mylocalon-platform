export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { json, route } from "@/lib/http";
import { revokeApiKey } from "@/services/apiKeys";

export const DELETE = route<{ id: string }>(async (req, { params }) => {
  const p = await authenticate(req);
  await revokeApiKey(p.userId, (await params).id);
  return json({ ok: true });
});

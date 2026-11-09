export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { json, route } from "@/lib/http";
import { listTunnels, tunnelHistory } from "@/services/tunnels";

export const GET = route(async (req) => {
  const p = await authenticate(req);
  const [tunnels, history] = await Promise.all([listTunnels(p.userId), tunnelHistory(p.userId)]);
  return json({ tunnels, history });
});

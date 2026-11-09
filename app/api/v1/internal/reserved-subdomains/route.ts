export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticateInternal } from "@/auth/authenticate";
import { json, route } from "@/lib/http";
import { allReservedNames } from "@/services/subdomains";

/** Gateway read path: names it must never hand out as random subdomains. */
export const GET = route(async (req) => {
  authenticateInternal(req);
  return json({ names: await allReservedNames() });
});

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticateInternal } from "@/auth/authenticate";
import { body, json, route } from "@/lib/http";
import { tunnelEventsSchema } from "@/lib/validation";
import { recordEvents } from "@/services/tunnels";

/** Gateway → Platform lifecycle events for dashboard history. */
export const POST = route(async (req) => {
  authenticateInternal(req);
  const { events } = await body(req, tunnelEventsSchema);
  return json({ accepted: await recordEvents(events) }, 202);
});

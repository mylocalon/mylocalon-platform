export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { unauthorized } from "@/lib/errors";
import { body, json, route } from "@/lib/http";
import { deviceDecideSchema } from "@/lib/validation";
import { decideDeviceCode } from "@/services/device";

/** Browser-only: approving a CLI login requires the dashboard session. */
export const POST = route(async (req) => {
  const p = await authenticate(req);
  if (p.via !== "session") throw unauthorized("approve device logins from the dashboard");
  const { userCode, approve } = await body(req, deviceDecideSchema);
  await decideDeviceCode(p.userId, userCode, approve);
  return json({ ok: true });
});

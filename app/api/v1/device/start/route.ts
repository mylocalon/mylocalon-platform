export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { tooMany } from "@/lib/errors";
import { body, json, route } from "@/lib/http";
import { clientIp } from "@/lib/ip";
import { allow } from "@/lib/ratelimit";
import { deviceStartSchema } from "@/lib/validation";
import { startDeviceFlow } from "@/services/device";

export const POST = route(async (req) => {
  if (!allow(`device:start:${clientIp(req)}`, 10)) throw tooMany();
  const { clientName } = await body(req, deviceStartSchema);
  return json(await startDeviceFlow(clientName), 201);
});

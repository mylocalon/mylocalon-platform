export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { tooMany } from "@/lib/errors";
import { body, json, route } from "@/lib/http";
import { clientIp } from "@/lib/ip";
import { allow } from "@/lib/ratelimit";
import { devicePollSchema } from "@/lib/validation";
import { pollDeviceCode } from "@/services/device";

export const POST = route(async (req) => {
  if (!allow(`device:poll:${clientIp(req)}`, 60)) throw tooMany("polling too fast");
  const { deviceCode } = await body(req, devicePollSchema);
  return json(await pollDeviceCode(deviceCode));
});

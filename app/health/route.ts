export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { json } from "@/lib/http";
import { startedAt, VERSION } from "@/lib/metrics";

export function GET() {
  return json({ status: "ok", version: VERSION, uptimeSec: Math.floor((Date.now() - startedAt) / 1000) });
}

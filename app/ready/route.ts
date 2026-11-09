export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { db } from "@/db/pool";
import { json } from "@/lib/http";

export async function GET() {
  try {
    await db().query("SELECT 1");
    return json({ status: "ok" });
  } catch (e) {
    return json({ status: "unavailable", postgres: (e as Error).message }, 503);
  }
}

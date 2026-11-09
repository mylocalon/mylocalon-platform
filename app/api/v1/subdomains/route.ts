export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { body, json, route } from "@/lib/http";
import { reserveSchema } from "@/lib/validation";
import { listReserved, reserveSubdomain } from "@/services/subdomains";

export const GET = route(async (req) => {
  const p = await authenticate(req);
  return json({ subdomains: await listReserved(p.userId) });
});

export const POST = route(async (req) => {
  const p = await authenticate(req);
  const { name, projectId } = await body(req, reserveSchema);
  return json({ subdomain: await reserveSubdomain(p.userId, name, projectId) }, 201);
});

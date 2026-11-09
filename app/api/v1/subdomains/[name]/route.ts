export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { json, route } from "@/lib/http";
import { releaseSubdomain } from "@/services/subdomains";

export const DELETE = route<{ name: string }>(async (req, { params }) => {
  const p = await authenticate(req);
  await releaseSubdomain(p.userId, (await params).name);
  return json({ ok: true });
});

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { json, route } from "@/lib/http";
import { deleteProject } from "@/services/projects";

export const DELETE = route<{ id: string }>(async (req, { params }) => {
  const p = await authenticate(req);
  await deleteProject(p.userId, (await params).id);
  return json({ ok: true });
});

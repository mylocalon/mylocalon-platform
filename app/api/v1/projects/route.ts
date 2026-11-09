export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { body, json, route } from "@/lib/http";
import { createProjectSchema } from "@/lib/validation";
import { createProject, listProjects } from "@/services/projects";

export const GET = route(async (req) => {
  const p = await authenticate(req);
  return json({ projects: await listProjects(p.userId) });
});

export const POST = route(async (req) => {
  const p = await authenticate(req);
  const { name } = await body(req, createProjectSchema);
  return json({ project: await createProject(p.userId, name) }, 201);
});

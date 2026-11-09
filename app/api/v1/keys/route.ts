export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authenticate } from "@/auth/authenticate";
import { body, json, route } from "@/lib/http";
import { createKeySchema } from "@/lib/validation";
import { createApiKey, listApiKeys } from "@/services/apiKeys";

export const GET = route(async (req) => {
  const p = await authenticate(req);
  return json({ keys: await listApiKeys(p.userId) });
});

/** The secret is in this response only; it is never retrievable again. */
export const POST = route(async (req) => {
  const p = await authenticate(req);
  const { name } = await body(req, createKeySchema);
  const { key, secret } = await createApiKey(p.userId, name);
  return json({ key, secret }, 201);
});

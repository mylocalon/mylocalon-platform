export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { json, route } from "@/lib/http";
import { jwks } from "@/services/tokens";

/** Public Ed25519 keys for offline JWT verification by the Gateway. */
export const GET = route(async () => json(await jwks()));

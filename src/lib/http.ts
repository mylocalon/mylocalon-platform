import { randomBytes } from "node:crypto";
import { ZodError, type ZodTypeAny, type z } from "zod";
import { AppError, unprocessable } from "./errors";
import { logger } from "./logger";
import { metrics } from "./metrics";

type Ctx<P> = { params: Promise<P> };
type Handler<P> = (req: Request, ctx: Ctx<P>, reqId: string) => Promise<Response>;

/**
 * Wraps a route handler: request id, JSON error envelope
 * `{ error: { code, message, details? } }`, access log, panic safety.
 */
export function route<P = Record<string, never>>(fn: Handler<P>) {
  return async (req: Request, ctx: Ctx<P>): Promise<Response> => {
    const reqId = `rq_${randomBytes(8).toString("hex")}`;
    const started = Date.now();
    let res: Response;
    try {
      res = await fn(req, ctx, reqId);
    } catch (e) {
      res = toErrorResponse(e, reqId);
    }
    res.headers.set("x-request-id", reqId);
    res.headers.set("cache-control", "no-store");
    metrics.apiRequests++;
    const path = new URL(req.url).pathname;
    logger.info({ reqId, method: req.method, path, status: res.status, durationMs: Date.now() - started }, "api_request");
    return res;
  };
}

function toErrorResponse(e: unknown, reqId: string): Response {
  if (e instanceof AppError) {
    return json({ error: { code: e.code, message: e.message, ...(e.details ? { details: e.details } : {}) } }, e.status);
  }
  if (e instanceof ZodError) {
    return json({ error: { code: "INVALID", message: "invalid request", details: e.flatten() } }, 422);
  }
  logger.error({ err: e, reqId }, "unhandled_error");
  return json({ error: { code: "INTERNAL", message: "internal error", reqId } }, 500);
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
}

/** Parse + validate a JSON body with a strict zod schema. */
export async function body<S extends ZodTypeAny>(req: Request, schema: S): Promise<z.infer<S>> {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) throw unprocessable("content-type must be application/json");
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw unprocessable("invalid JSON body");
  }
  return schema.parse(raw);
}

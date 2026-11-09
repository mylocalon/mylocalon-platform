const BASE = "http://localhost:3001";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- route ctx param types vary per route
type Handler = (req: Request, ctx: any) => Promise<Response> | Response;

export interface CallOpts {
  body?: unknown;
  cookie?: string;
  bearer?: string;
  origin?: string | null;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

/** Invoke a Next route handler directly with a real Request. */
export async function call(handler: Handler, method: string, path: string, o: CallOpts = {}) {
  const headers: Record<string, string> = { ...o.headers };
  if (o.body !== undefined) headers["content-type"] = "application/json";
  if (o.cookie) headers["cookie"] = o.cookie;
  if (o.bearer) headers["authorization"] = `Bearer ${o.bearer}`;
  if (o.origin !== null && method !== "GET") headers["origin"] = o.origin ?? BASE;
  const req = new Request(BASE + path, {
    method,
    headers,
    ...(o.body !== undefined ? { body: JSON.stringify(o.body) } : {}),
  });
  const res = await handler(req as never, { params: Promise.resolve(o.params ?? {}) } as never);
  const text = await res.text();
  return { status: res.status, headers: res.headers, json: text ? JSON.parse(text) : undefined };
}

export function cookieFrom(headers: Headers): string {
  const sc = headers.get("set-cookie") ?? "";
  return sc.split(";")[0]!;
}

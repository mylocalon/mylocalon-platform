export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { metrics } from "@/lib/metrics";

/** Prometheus text stub. Not routed publicly by Caddy. */
export function GET() {
  const body = `# TYPE mylocalon_api_requests_total counter\nmylocalon_api_requests_total ${metrics.apiRequests}\n`;
  return new Response(body, { headers: { "content-type": "text/plain; version=0.0.4" } });
}

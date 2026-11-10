import { llmsFullTxt } from "@/docs/markdown";

export const dynamic = "force-dynamic"; // uses BASE_URL at runtime

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

import { docMarkdown } from "@/docs/markdown";
import { DOCS_ORDER } from "@/docs/nav";

export const dynamic = "force-dynamic"; // uses BASE_URL at runtime
const HEADERS = { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=3600", "x-robots-tag": "noindex" };

export const dynamicParams = false;
export function generateStaticParams() {
  return DOCS_ORDER.map((d) => ({ slug: d.slug }));
}

/** Served at /docs/<slug>.md (rewrite in next.config.mjs). noindex: the HTML page is canonical. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const md = docMarkdown((await params).slug);
  if (!md) return new Response("Not found", { status: 404 });
  return new Response(md, { headers: HEADERS });
}

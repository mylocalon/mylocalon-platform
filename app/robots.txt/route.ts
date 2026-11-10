import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic"; // uses BASE_URL at runtime

// Policy (owner decision, 2026-11-10): search, AI answers and AI training all allowed.
// Content-Signal is a draft standard (contentsignals.org); it states intent, it does not enforce it.
const SIGNAL = "Content-Signal: search=yes, ai-input=yes, ai-train=yes";
// Machine endpoints only. Login/dashboard pages stay crawlable so crawlers can see
// their noindex tag (a Disallow would hide it); they are protected by login anyway.
const PRIVATE = ["/api/", "/docs-md/"];

function group(agents: string[]): string {
  return [...agents.map((a) => `User-agent: ${a}`), SIGNAL, "Allow: /", ...PRIVATE.map((p) => `Disallow: ${p}`), ""].join("\n");
}

export function GET() {
  const body = [
    "# mylocalon — https://mylocalon.com",
    "",
    "# Search engines",
    group(["Googlebot", "Bingbot", "Applebot", "DuckDuckBot"]),
    "# AI search and answer engines (citability)",
    group(["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"]),
    "# AI model training (allowed by owner choice)",
    group(["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "cohere-ai", "Bytespider"]),
    "# Everyone else",
    group(["*"]),
    `Sitemap: ${siteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

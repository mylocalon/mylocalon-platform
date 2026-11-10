import { loadDoc } from "./content";
import { DOCS_NAV, DOCS_ORDER } from "./nav";
import { AUTHORS, SITE, siteUrl } from "@/lib/site";

/** Root-relative doc links → absolute URLs, so the Markdown stands on its own. */
const absolutize = (md: string) => md.replace(/\]\((\/[^)\s]*)\)/g, (_, p: string) => `](${siteUrl(p)})`);

/** One docs page as standalone Markdown (title, summary, source URL, body). */
export function docMarkdown(slug: string): string | null {
  const doc = loadDoc(slug);
  if (!doc) return null;
  return [
    `# ${doc.title}`,
    "",
    `> ${doc.description}`,
    "",
    `Source: ${siteUrl(`/docs/${slug}`)}${doc.updated ? ` · Updated ${doc.updated}` : ""}`,
    "",
    absolutize(doc.markdown).trim(),
    "",
  ].join("\n");
}

const intro = () => [
  `# ${SITE.name}`,
  "",
  `> ${SITE.description}`,
  "",
  "Key facts:",
  "",
  "- Install: `npm install -g mylocalon` (Node.js 20+, macOS, Linux, Windows). Then `mylocalon login` and `mylocalon http <port>`.",
  "- Every tunnel gets an HTTPS URL like `https://abc123xy.mylocalon.com`; reserved subdomains keep a fixed URL.",
  "- Free plan: 5 concurrent tunnels, 5 reserved subdomains, 10 MB per request, 30 s response time.",
  "- HTTP only: WebSocket forwarding and response streaming are not supported yet; MCP servers work via Streamable HTTP with JSON responses.",
  "- Open source and self-hostable (Go gateway, Next.js platform, Node.js CLI and SDK).",
  `- Built by ${AUTHORS.map((a) => a.name).join(" and ")}.`,
  "",
];

/** llms.txt (https://llmstxt.org): a curated map of the site for LLMs. */
export function llmsTxt(): string {
  const lines = intro();
  for (const group of DOCS_NAV) {
    lines.push(`## ${group.title}`, "");
    for (const item of group.items) {
      const d = loadDoc(item.slug);
      lines.push(`- [${item.title}](${siteUrl(`/docs/${item.slug}.md`)}): ${d?.description ?? ""}`);
    }
    lines.push("");
  }
  lines.push(
    "## Optional",
    "",
    `- [Full documentation in one file](${siteUrl("/llms-full.txt")}): every page above, concatenated`,
    `- [Source code](${SITE.github}): gateway, platform, CLI, SDK and deployment kit`,
    `- [npm package](${SITE.npm}): the mylocalon CLI`,
    "",
  );
  return lines.join("\n");
}

/** llms-full.txt: the whole documentation as one Markdown file. */
export function llmsFullTxt(): string {
  return [...intro(), ...DOCS_ORDER.map((d) => docMarkdown(d.slug) ?? "")].join("\n---\n\n");
}

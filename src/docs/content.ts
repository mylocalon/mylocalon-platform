import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked, type Tokens } from "marked";
import { DOCS_ORDER } from "./nav";

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  html: string;
  toc: { id: string; text: string; depth: 2 | 3 }[];
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

const DIR = join(process.cwd(), "content", "docs");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Docs are our own trusted markdown, rendered at build time. */
export function loadDoc(slug: string): DocPage | null {
  const idx = DOCS_ORDER.findIndex((d) => d.slug === slug);
  if (idx < 0) return null;
  const raw = readFileSync(join(DIR, `${slug}.md`), "utf8");
  const m = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  const meta: Record<string, string> = {};
  for (const line of (m?.[1] ?? "").split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = m ? raw.slice(m[0].length) : raw;

  const toc: DocPage["toc"] = [];
  const seen = new Map<string, number>();
  const md = new Marked({
    gfm: true,
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, { tokens, depth, text }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        let id = slugify(text);
        const n = seen.get(id) ?? 0;
        seen.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        if (depth === 2 || depth === 3) toc.push({ id, text: inner.replace(/<[^>]+>/g, ""), depth });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${inner}</h${depth}>`;
      },
      code({ text, lang }: Tokens.Code) {
        const l = (lang ?? "").split(/\s/)[0] || "text";
        return `<div class="code-block" data-lang="${escapeHtml(l)}"><pre><code>${escapeHtml(text)}</code></pre></div>`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const inner = (this as unknown as { parser: { parseInline: (t: Tokens.Generic[]) => string } }).parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith("https://mylocalon.com");
        const t = title ? ` title="${escapeHtml(title)}"` : "";
        return `<a href="${escapeHtml(href)}"${t}${external ? ' target="_blank" rel="noreferrer"' : ""}>${inner}</a>`;
      },
    },
  });
  // Wrap tables so wide ones scroll horizontally on phones.
  const html = (md.parse(body, { async: false }) as string)
    .replaceAll("<table>", '<div class="table-wrap"><table>')
    .replaceAll("</table>", "</table></div>");

  const prev = DOCS_ORDER[idx - 1];
  const next = DOCS_ORDER[idx + 1];
  return {
    slug,
    title: meta["title"] ?? DOCS_ORDER[idx]!.title,
    description: meta["description"] ?? "",
    html,
    toc,
    ...(prev ? { prev } : {}),
    ...(next ? { next } : {}),
  };
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DOCS_NAV } from "./nav";

export interface SearchEntry {
  href: string;
  title: string; // "Page" or "Page › Section"
  section: string; // sidebar group
  text: string; // plain text for matching + snippet
}

const strip = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, (b) => b.replace(/```\w*|```/g, " "))
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_>#|]/g, " ")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const slug = (s: string) => s.toLowerCase().replace(/[`*_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let cache: SearchEntry[] | undefined;

/** One entry per page and per ## / ### section, built from content/docs. */
export function searchIndex(): SearchEntry[] {
  if (cache) return cache;
  const out: SearchEntry[] = [];
  for (const group of DOCS_NAV) {
    for (const item of group.items) {
      const raw = readFileSync(join(process.cwd(), "content", "docs", `${item.slug}.md`), "utf8").replace(/^---[\s\S]*?---\n/, "");
      const parts = raw.split(/^(#{2,3}) (.+)$/m);
      out.push({ href: `/docs/${item.slug}`, title: item.title, section: group.title, text: strip(parts[0] ?? "").slice(0, 400) });
      for (let i = 1; i + 2 < parts.length + 1; i += 3) {
        const heading = (parts[i + 1] ?? "").trim();
        if (!heading) continue;
        out.push({
          href: `/docs/${item.slug}#${slug(heading)}`,
          title: `${item.title} › ${strip(heading)}`,
          section: group.title,
          text: strip(parts[i + 2] ?? "").slice(0, 400),
        });
      }
    }
  }
  cache = out;
  return out;
}

export const dynamic = "force-dynamic"; // reads runtime config (BASE_URL)

import type { MetadataRoute } from "next";
import { loadDoc } from "@/docs/content";
import { DOCS_ORDER } from "@/docs/nav";
import { siteUrl } from "@/lib/site";

/** Last significant change to the landing page content (update when it changes). */
const LANDING_UPDATED = "2026-11-10";

// Indexable, canonical pages only (no noindex/private routes). lastmod comes from
// each doc's `updated` front matter, so it reflects real content changes.
export default function sitemap(): MetadataRoute.Sitemap {
  const docs = DOCS_ORDER.map((d) => ({ url: siteUrl(`/docs/${d.slug}`), lastModified: loadDoc(d.slug)?.updated }));
  const newest = docs.map((d) => d.lastModified ?? "").sort().at(-1) || LANDING_UPDATED;
  return [
    { url: siteUrl("/"), lastModified: LANDING_UPDATED },
    { url: siteUrl("/docs"), lastModified: newest },
    ...docs.filter((d) => d.url !== siteUrl("/docs/introduction")).map((d) => (d.lastModified ? d : { url: d.url })),
  ];
}

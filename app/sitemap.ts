export const dynamic = "force-dynamic"; // reads runtime config (BASE_URL)
import type { MetadataRoute } from "next";
import { DOCS_ORDER } from "@/docs/nav";
import { getConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getConfig().BASE_URL;
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/docs`, priority: 0.9 },
    ...DOCS_ORDER.map((d) => ({ url: `${base}/docs/${d.slug}`, priority: 0.7 })),
  ];
}

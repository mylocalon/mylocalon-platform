export const dynamic = "force-dynamic"; // reads runtime config (BASE_URL)
import type { MetadataRoute } from "next";
import { getConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const base = getConfig().BASE_URL;
  return {
    rules: { userAgent: "*", allow: ["/", "/docs"], disallow: ["/dashboard", "/device", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}

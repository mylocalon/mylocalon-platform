import type { Metadata } from "next";
import { DocView } from "./DocView";

export const metadata: Metadata = {
  title: "Documentation — mylocalon",
  description: "Install the mylocalon CLI, share localhost on a public HTTPS URL, expose MCP servers, and use the SDK and REST API.",
  alternates: { canonical: "/docs", types: { "text/markdown": "/docs/introduction.md" } },
  openGraph: { url: "/docs", title: "mylocalon documentation", images: ["/opengraph-image.png"] },
  twitter: { card: "summary_large_image", images: ["/twitter-image.png"] },
};

export default function DocsIndex() {
  return <DocView slug="introduction" />;
}

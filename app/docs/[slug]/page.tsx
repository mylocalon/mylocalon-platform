import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocView } from "../DocView";
import { loadDoc } from "@/docs/content";
import { DOCS_ORDER } from "@/docs/nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS_ORDER.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const doc = loadDoc((await params).slug);
  if (!doc) return {};
  // /docs renders the introduction, so the two share one canonical URL.
  const path = doc.slug === "introduction" ? "/docs" : `/docs/${doc.slug}`;
  return {
    title: `${doc.title} — mylocalon docs`,
    description: doc.description,
    alternates: { canonical: path, types: { "text/markdown": `/docs/${doc.slug}.md` } },
    openGraph: { type: "article", url: path, images: ["/opengraph-image.png"], title: `${doc.title} — mylocalon docs`, description: doc.description, ...(doc.updated ? { modifiedTime: doc.updated } : {}) },
    twitter: { card: "summary_large_image", images: ["/twitter-image.png"], title: `${doc.title} — mylocalon docs`, description: doc.description },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!loadDoc(slug)) notFound();
  return <DocView slug={slug} />;
}

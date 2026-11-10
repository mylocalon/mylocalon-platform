import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeCopyButtons } from "../_site/Copy";
import { JsonLd } from "../_site/JsonLd";
import { loadDoc } from "@/docs/content";
import { DOCS_NAV } from "@/docs/nav";
import { AUTHORS, SITE, siteUrl } from "@/lib/site";

const plain = (md: string) =>
  md.replace(/```[\s\S]*?```/g, " ").replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_>#|]/g, "").replace(/\s+/g, " ").trim();

/** FAQPage entities from "## Question" sections (answers = the text that follows). */
function faqEntities(md: string) {
  return md.split(/^## /m).slice(1).map((block) => {
    const [q = "", ...rest] = block.split("\n");
    return { "@type": "Question", name: q.trim(), acceptedAnswer: { "@type": "Answer", text: plain(rest.join("\n")) } };
  });
}

const EDIT_BASE = "https://github.com/mylocalon/mylocalon-platform/edit/main/content/docs";

export function DocView({ slug }: { slug: string }) {
  const doc = loadDoc(slug);
  if (!doc) notFound();
  const section = DOCS_NAV.find((g) => g.items.some((i) => i.slug === doc.slug))?.title ?? "Docs";
  const url = siteUrl(`/docs/${doc.slug}`);
  const ld: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: doc.title,
      description: doc.description,
      url,
      ...(doc.updated ? { dateModified: doc.updated } : {}),
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", name: SITE.name, url: siteUrl("/") },
      about: { "@type": "SoftwareApplication", name: SITE.name },
      author: AUTHORS.map((a) => ({ "@type": "Person", name: a.name, sameAs: [a.linkedin, a.github] })),
      publisher: { "@type": "Organization", name: SITE.name, url: siteUrl("/"), logo: siteUrl("/icon.svg") },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Docs", item: siteUrl("/docs") },
        { "@type": "ListItem", position: 2, name: section, item: siteUrl("/docs") },
        { "@type": "ListItem", position: 3, name: doc.title, item: url },
      ],
    },
  ];
  if (doc.slug === "faq") ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqEntities(doc.markdown) });
  return (
    <div className="docs-page">
      <article className="docs-article">
        <JsonLd data={ld} />
        <header className="docs-head">
          <nav aria-label="Breadcrumb" className="docs-crumb"><a href="/docs">Docs</a> <span aria-hidden="true">/</span> {section}</nav>
          <h1>{doc.title}</h1>
          {doc.description && <p className="docs-lead">{doc.description}</p>}
          {doc.updated && (
            <p className="docs-meta">
              Updated <time dateTime={doc.updated}>{new Date(doc.updated + "T00:00:00Z").toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time>
              {" · By "}{AUTHORS.map((a, i) => (
                <span key={a.name}>{i > 0 && " & "}<a href={a.linkedin} target="_blank" rel="author noopener noreferrer">{a.name}</a></span>
              ))}
              {" · "}<a href={`/docs/${doc.slug}.md`}>View as Markdown</a>
            </p>
          )}
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
        <CodeCopyButtons />
        <nav className="docs-pager" aria-label="Previous and next">
          {doc.prev ? (
            <Link href={`/docs/${doc.prev.slug}`} className="pager-link">
              <span className="muted">← Previous</span>
              {doc.prev.title}
            </Link>
          ) : <span />}
          {doc.next ? (
            <Link href={`/docs/${doc.next.slug}`} className="pager-link next">
              <span className="muted">Next →</span>
              {doc.next.title}
            </Link>
          ) : <span />}
        </nav>
        <p className="docs-edit">
          <a href={`${EDIT_BASE}/${doc.slug}.md`} target="_blank" rel="noreferrer">Edit this page on GitHub</a>
        </p>
      </article>
      {doc.toc.length > 1 && (
        <aside className="docs-toc" aria-label="On this page">
          <div className="docs-nav-title">On this page</div>
          {doc.toc.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={t.depth === 3 ? "sub" : undefined}>{t.text}</a>
          ))}
        </aside>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeCopyButtons } from "../_site/Copy";
import { loadDoc } from "@/docs/content";

const EDIT_BASE = "https://github.com/mylocalon/mylocalon-platform/edit/main/content/docs";

export function DocView({ slug }: { slug: string }) {
  const doc = loadDoc(slug);
  if (!doc) notFound();
  return (
    <div className="docs-page">
      <article className="docs-article">
        <header className="docs-head">
          <h1>{doc.title}</h1>
          {doc.description && <p className="docs-lead">{doc.description}</p>}
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

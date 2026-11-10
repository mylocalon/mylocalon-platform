"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/docs/nav";

function Links({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <>
      {DOCS_NAV.map((section) => (
        <div key={section.title} className="docs-nav-section">
          <div className="docs-nav-title">{section.title}</div>
          {section.items.map((item) => {
            const href = `/docs/${item.slug}`;
            const active = path === href || (path === "/docs" && item.slug === "introduction");
            return (
              <Link key={item.slug} href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined} onClick={onNavigate}>
                {item.title}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}

export function DocsSidebar() {
  return (
    <>
      <aside className="docs-sidebar" aria-label="Documentation">
        <Links />
      </aside>
      <details className="docs-mobile-nav">
        <summary>Documentation menu</summary>
        <Links onNavigate={() => document.querySelector<HTMLDetailsElement>(".docs-mobile-nav")?.removeAttribute("open")} />
      </details>
    </>
  );
}

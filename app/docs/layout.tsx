import { DocsSidebar } from "../_site/DocsSidebar";
import { SiteFooter, SiteHeader } from "../_site/SiteHeader";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <SiteHeader />
      <div className="site-wrap docs-shell">
        <DocsSidebar />
        <div className="docs-main">{children}</div>
      </div>
      <SiteFooter />
    </div>
  );
}

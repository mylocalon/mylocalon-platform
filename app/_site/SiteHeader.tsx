import Link from "next/link";
import { currentUser } from "@/auth/current";
import { searchIndex } from "@/docs/search";
import { IconGitHub } from "./icons";
import { Logo, Wordmark } from "./Logo";
import { SearchButton } from "./Search";
import { ThemeToggle } from "./ui";

export const GITHUB_URL = "https://github.com/mylocalon";

/** Total stars across the org's public repos; cached for an hour, hidden on error. */
async function githubStars(): Promise<number | null> {
  try {
    const res = await fetch("https://api.github.com/orgs/mylocalon/repos?per_page=100&type=public", {
      headers: { accept: "application/vnd.github+json", "user-agent": "mylocalon-site" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const repos = (await res.json()) as { stargazers_count?: number }[];
    return repos.reduce((n, r) => n + (r.stargazers_count ?? 0), 0);
  } catch {
    return null;
  }
}

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

export async function SiteHeader() {
  const [user, stars] = await Promise.all([currentUser(), githubStars()]);
  return (
    <header className="site-header">
      <div className="site-wrap site-header-row">
        <Link href="/" className="site-brand" aria-label="mylocalon home">
          <Logo size={28} id="ml-head" /> <Wordmark />
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/docs">Docs</Link>
          <Link href="/docs/use-cases">Use cases</Link>
          <Link href="/docs/self-hosting">Self-host</Link>
        </nav>
        <div className="site-actions">
          <SearchButton index={searchIndex()} />
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="gh-btn hide-sm" aria-label={`Star mylocalon on GitHub${stars ? ` (${stars} stars)` : ""}`}>
            <IconGitHub /> <span className="label">Star</span>
            {stars ? <span className="count">{fmt(stars)}</span> : null}
          </a>
          <span className="hide-sm"><ThemeToggle /></span>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
          ) : (
            <>
              <Link href="/login?next=/dashboard" className="btn btn-quiet btn-sm hide-sm">Log in</Link>
              <Link href="/signup?next=/dashboard" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="site-footer-row">
          <div style={{ maxWidth: 280 }}>
            <Link href="/" className="site-brand" aria-label="mylocalon home">
              <Logo size={24} id="ml-foot" /> <Wordmark />
            </Link>
            <p className="muted" style={{ margin: "12px 0 16px" }}>Your localhost, on the internet. Free and open source.</p>
            <ThemeToggle />
          </div>
          <nav aria-label="Footer" className="site-footer-links">
            <div>
              <strong>Product</strong>
              <Link href="/docs/quickstart">Quickstart</Link>
              <Link href="/docs/use-cases">Use cases</Link>
              <Link href="/docs/limits">Limits</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div>
              <strong>Developers</strong>
              <Link href="/docs/cli">CLI</Link>
              <Link href="/docs/sdk">Node.js SDK</Link>
              <Link href="/docs/api">REST API</Link>
              <Link href="/docs/self-hosting">Self-hosting</Link>
            </div>
            <div>
              <strong>Community</strong>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.npmjs.com/package/mylocalon" target="_blank" rel="noreferrer">npm</a>
              <Link href="/docs/security">Security</Link>
              <Link href="/docs/faq">FAQ</Link>
            </div>
          </nav>
        </div>
        <div className="footer-note">
          <span>© {new Date().getFullYear()} mylocalon</span>
          <span>Made for developers who ship from localhost.</span>
        </div>
      </div>
    </footer>
  );
}

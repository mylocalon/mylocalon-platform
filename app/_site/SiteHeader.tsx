import Link from "next/link";
import { currentUser } from "@/auth/current";
import { Logo, Wordmark } from "./Logo";

export const GITHUB_URL = "https://github.com/mylocalon";

export async function SiteHeader() {
  const user = await currentUser();
  return (
    <header className="site-header">
      <div className="site-wrap site-header-row">
        <Link href="/" className="site-brand" aria-label="mylocalon home">
          <Logo size={28} id="ml-head" /> <Wordmark />
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/docs">Docs</Link>
          <Link href="/docs/use-cases" className="hide-sm">Use cases</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hide-sm">GitHub</a>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
          ) : (
            <>
              <Link href="/login?next=/dashboard" className="hide-sm">Log in</Link>
              <Link href="/signup?next=/dashboard" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-wrap site-footer-row">
        <div>
          <Link href="/" className="site-brand" aria-label="mylocalon home">
            <Logo size={22} id="ml-foot" /> <Wordmark />
          </Link>
          <p className="muted">Your localhost, on the internet. Open source.</p>
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
    </footer>
  );
}

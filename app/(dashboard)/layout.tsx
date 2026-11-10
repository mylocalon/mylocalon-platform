import Link from "next/link";
import { LogoutButton } from "../_components/Actions";
import { AppNav } from "../_site/AppNav";
import { Logo, Wordmark } from "../_site/Logo";
import { ThemeToggle } from "../_site/ui";
import { currentUser } from "@/auth/current";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser(); // pages enforce auth with requireUser()
  return (
    <div className="app">
      <aside className="app-side">
        <Link href="/" className="site-brand" aria-label="mylocalon home"><Logo size={26} id="ml-dash" /> <Wordmark /></Link>
        <nav aria-label="Dashboard" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <AppNav />
        </nav>
        <div className="grow" />
        <div style={{ padding: "0 8px 6px" }}><ThemeToggle /></div>
        {user && (
          <div className="user-box">
            <span className="avatar" aria-hidden="true">{user.email.slice(0, 1).toUpperCase()}</span>
            <span className="email" title={user.email}>{user.email}</span>
            <LogoutButton />
          </div>
        )}
      </aside>
      <div>
        <nav className="mobile-bar" aria-label="Dashboard">
          <Link href="/" className="site-brand" aria-label="mylocalon home"><Logo size={22} id="ml-mob" /></Link>
          <AppNav />
          {user && <LogoutButton />}
        </nav>
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { LogoutButton } from "../_components/Actions";
import { currentUser } from "@/auth/current";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser(); // pages enforce auth with requireUser()
  return (
    <div className="shell">
      <nav className="side">
        <div className="brand">mylocalon</div>
        <Link href="/">Tunnels</Link>
        <Link href="/subdomains">Subdomains</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/keys">API keys</Link>
        <div className="grow" />
        {user && (
          <>
            <span className="muted hide-sm" style={{ fontSize: 13, padding: "6px 10px" }}>
              {user.email}
            </span>
            <LogoutButton />
          </>
        )}
      </nav>
      <main className="main">{children}</main>
    </div>
  );
}

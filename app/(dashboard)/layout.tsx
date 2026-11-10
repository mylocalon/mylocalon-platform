import Link from "next/link";
import { LogoutButton } from "../_components/Actions";
import { currentUser } from "@/auth/current";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser(); // pages enforce auth with requireUser()
  return (
    <div className="shell">
      <nav className="side">
        <Link href="/" className="brand">mylocalon</Link>
        <Link href="/dashboard">Tunnels</Link>
        <Link href="/dashboard/subdomains">Subdomains</Link>
        <Link href="/dashboard/projects">Projects</Link>
        <Link href="/dashboard/keys">API keys</Link>
        <Link href="/docs">Docs</Link>
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

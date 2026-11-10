"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBook, IconFolder, IconGlobe, IconKey, IconTunnel } from "./icons";

const LINKS = [
  { href: "/dashboard", label: "Tunnels", icon: IconTunnel },
  { href: "/dashboard/subdomains", label: "Subdomains", icon: IconGlobe },
  { href: "/dashboard/projects", label: "Projects", icon: IconFolder },
  { href: "/dashboard/keys", label: "API keys", icon: IconKey },
];

export function AppNav() {
  const path = usePathname();
  return (
    <>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} className={`nav-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
            <Icon size={17} /> {label}
          </Link>
        );
      })}
      <Link href="/docs" className="nav-link"><IconBook size={17} /> Docs</Link>
    </>
  );
}

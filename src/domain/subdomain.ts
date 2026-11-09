/**
 * Subdomain rules. MUST match mylocalon-gateway/internal/subdomain so names
 * reserved here are always routable there.
 */
const LABEL = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])$/;

export const BLOCKLIST: ReadonlySet<string> = new Set([
  "www", "api", "admin", "gateway", "app", "dashboard", "mail", "smtp", "status", "docs",
  "static", "cdn", "auth", "login", "billing", "support", "help", "blog", "root", "ns1", "ns2",
]);

export type SubdomainProblem = "invalid" | "blocked" | null;

export function checkSubdomain(name: string): SubdomainProblem {
  if (!LABEL.test(name) || name.includes("--")) return "invalid";
  if (BLOCKLIST.has(name)) return "blocked";
  return null;
}

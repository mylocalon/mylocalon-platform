/**
 * Subdomain rules. MUST match mylocalon-gateway/internal/subdomain so names
 * reserved here are always routable there. Canonical list:
 * docs/fixtures/policy/reserved-subdomains.json (test/subdomain-policy.test.ts keeps it in sync).
 */
const LABEL = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])$/;

/** Never claimable: mylocalon's own surfaces, infrastructure, environments, account words, brands. */
export const RESERVED: ReadonlySet<string> = new Set([
  "about", "abuse", "account", "accounts", "admin", "administrator", "admins", "airtel",
  "alpha", "amazon", "anthropic", "api", "apis", "app", "apple", "apps",
  "assets", "auth", "autoconfig", "autodiscover", "aws", "azure", "beta", "billing",
  "binance", "blog", "canary", "careers", "cdn", "changelog", "chat", "chatgpt",
  "checkout", "claude", "cluster", "coinbase", "community", "compliance", "console", "contact",
  "cookies", "dashboard", "demo", "dev", "develop", "developer", "developers", "development",
  "dns", "doc", "docs", "documentation", "download", "downloads", "edge", "email",
  "facebook", "faq", "files", "forum", "ftp", "gateway", "gdpr", "git",
  "github", "gitlab", "gmail", "google", "grafana", "hdfc", "health", "help",
  "helpdesk", "hostmaster", "icici", "icloud", "identity", "images", "imap", "img",
  "instagram", "internal", "invoice", "invoices", "jio", "jobs", "keys", "legal",
  "linkedin", "local", "localhost", "localon", "login", "logout", "logs", "mail",
  "mcp", "media", "metamask", "metrics", "microsoft", "mod", "moderator", "monitor",
  "monitoring", "my-localon", "mylocal", "mylocalon", "netflix", "news", "node", "nodes",
  "ns1", "ns2", "ns3", "ns4", "null", "oauth", "office365", "official",
  "openai", "origin", "outlook", "owner", "panel", "password", "passwords", "pay",
  "payment", "payments", "paypal", "paytm", "phonepe", "plans", "policy", "pop",
  "pop3", "portal", "postmaster", "press", "preview", "pricing", "privacy", "prod",
  "production", "prometheus", "proxy", "razorpay", "register", "registry", "relay", "report",
  "reset", "root", "sandbox", "sbi", "secure", "security", "server", "servers",
  "session", "sessions", "sftp", "shop", "signin", "signout", "signup", "smtp",
  "ssh", "sso", "staff", "stage", "staging", "static", "status", "store",
  "stripe", "superuser", "support", "sysadmin", "system", "team", "terms", "test",
  "testing", "token", "tokens", "tos", "trust", "tunnel", "tunnels", "twitter",
  "uat", "undefined", "upload", "uploads", "verification", "verify", "vpn", "webhook",
  "webhooks", "webmail", "webmaster", "whatsapp", "www", "youtube",
]);

/** Also refused as any hyphen-separated part of a name ("paypal-login"), to blunt phishing. */
export const BRAND_TOKENS: ReadonlySet<string> = new Set([
  "airtel", "amazon", "anthropic", "apple", "aws", "azure", "binance", "chatgpt",
  "claude", "coinbase", "facebook", "github", "gitlab", "gmail", "google", "hdfc",
  "icici", "icloud", "instagram", "jio", "linkedin", "metamask", "microsoft", "mylocalon",
  "netflix", "office365", "openai", "outlook", "paypal", "paytm", "phonepe", "razorpay",
  "sbi", "stripe", "twitter", "whatsapp", "youtube",
]);

export type SubdomainProblem = "invalid" | "reserved" | "brand" | null;

export function checkSubdomain(name: string): SubdomainProblem {
  if (!LABEL.test(name) || name.includes("--")) return "invalid";
  if (RESERVED.has(name)) return "reserved";
  if (name.split("-").some((part) => BRAND_TOKENS.has(part))) return "brand";
  return null;
}

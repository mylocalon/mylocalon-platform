/** Single source for site facts used in metadata, structured data, llms.txt and the footer. */
export const SITE = {
  name: "mylocalon",
  tagline: "Your localhost, on the internet",
  description:
    "mylocalon is a free, open-source tunneling tool that gives an app running on your computer a public HTTPS URL with one command — for webhooks, client demos, testing on real phones, OAuth callbacks and sharing local MCP servers with AI assistants.",
  shortDescription: "Free, open-source localhost tunnels with HTTPS. Share a local app or MCP server with one command.",
  github: "https://github.com/mylocalon",
  npm: "https://www.npmjs.com/package/mylocalon",
  version: "0.1.1",
  keywords: [
    "localhost tunnel", "expose localhost", "ngrok alternative", "open source ngrok", "https tunnel",
    "webhook testing", "localhost to public url", "share localhost", "reverse proxy tunnel", "mcp server tunnel",
    "remote mcp server", "self-hosted tunnel", "developer tools",
  ],
} as const;

export const AUTHORS = [
  {
    name: "Pragyanprava Swain",
    linkedin: "https://www.linkedin.com/in/pragyanprava-swain-7930a3248/",
    github: "https://github.com/PragyanpravaSwain",
  },
  {
    name: "Mukesh Kumar Mandal",
    linkedin: "https://www.linkedin.com/in/mukimondal/",
    github: "https://github.com/mkuser608",
  },
] as const;

/** Absolute site URL (canonical links, sitemaps, JSON-LD). */
export function siteUrl(path = "/"): string {
  const base = (process.env["BASE_URL"] ?? "https://mylocalon.com").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Docs sidebar, in reading order. Each slug is content/docs/<slug>.md. */
export const DOCS_NAV: { title: string; items: { slug: string; title: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      { slug: "introduction", title: "Introduction" },
      { slug: "installation", title: "Installation" },
      { slug: "quickstart", title: "Quickstart" },
    ],
  },
  {
    title: "Guides",
    items: [
      { slug: "use-cases", title: "Use cases" },
      { slug: "subdomains", title: "Reserved subdomains" },
      { slug: "dashboard", title: "Dashboard & API keys" },
    ],
  },
  {
    title: "Reference",
    items: [
      { slug: "cli", title: "CLI reference" },
      { slug: "sdk", title: "Node.js SDK" },
      { slug: "api", title: "REST API" },
      { slug: "limits", title: "Limits" },
    ],
  },
  {
    title: "More",
    items: [
      { slug: "how-it-works", title: "How it works" },
      { slug: "troubleshooting", title: "Troubleshooting" },
      { slug: "security", title: "Security" },
      { slug: "self-hosting", title: "Self-hosting" },
      { slug: "faq", title: "FAQ" },
    ],
  },
];

export const DOCS_ORDER = DOCS_NAV.flatMap((s) => s.items);

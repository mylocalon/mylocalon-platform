import type { Metadata } from "next";
import Link from "next/link";
import { CopyCommand } from "./_site/Copy";
import { JsonLd } from "./_site/JsonLd";
import {
  IconArrowRight, IconCheck, IconCode, IconGitHub, IconLock, IconPhone,
  IconShield, IconUsers, IconWebhook,
} from "./_site/icons";
import { GITHUB_URL, SiteFooter, SiteHeader } from "./_site/SiteHeader";
import { TypingTerminal } from "./_site/Terminal";
import { AUTHORS, SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "mylocalon — Open-source localhost tunnels with HTTPS" },
  description:
    "Expose localhost with one command. Free, open-source ngrok alternative: a public HTTPS URL for webhooks, demos, phone testing and MCP servers.",
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "mylocalon — your localhost, on the internet", description: SITE.shortDescription, images: ["/opengraph-image.png"] },
  twitter: { card: "summary_large_image", images: ["/twitter-image.png"] },
};

// Visible on the page and mirrored in FAQPage structured data (answers must match).
const FAQ = [
  { q: "What is mylocalon?", a: "mylocalon is a free, open-source tunneling tool. It gives an app running on your computer a public HTTPS URL, so anyone on the internet can reach it without deploying or opening router ports." },
  { q: "How do I expose localhost to the internet?", a: "Install the CLI with npm install -g mylocalon, run mylocalon login once, then run mylocalon http 3000. You get a URL like https://abc123xy.mylocalon.com that forwards to http://localhost:3000." },
  { q: "Is mylocalon free?", a: "Yes. The hosted service has a free plan with 5 concurrent tunnels, 5 reserved subdomains and HTTPS on every URL, and the full stack is open source if you want to self-host it." },
  { q: "Can I share a local MCP server with Claude or ChatGPT?", a: "Yes. Run your MCP server with the Streamable HTTP transport and JSON responses, start mylocalon http <port>, and add the https://<name>.mylocalon.com/mcp URL to your AI client as a remote connector." },
  { q: "Is mylocalon an ngrok alternative?", a: "Yes. Like ngrok it gives localhost a public HTTPS URL; mylocalon is fully open source, has a free plan and can be self-hosted on your own server and domain." },
  { q: "Do WebSockets work through mylocalon?", a: "Not yet. Regular HTTP pages, APIs, webhooks and MCP request/response traffic work; WebSocket forwarding and response streaming are planned." },
];

const USE_CASES = [
  { icon: <IconCode />, title: "MCP servers for AI assistants", body: "Give the MCP server on your laptop a public HTTPS URL and add it to Claude, ChatGPT or any MCP client as a remote connector — no deploy.", cmd: "mylocalon http 8000 --subdomain my-mcp" },
  { icon: <IconWebhook />, title: "Webhooks", body: "Point Stripe, Razorpay, GitHub or Slack at your laptop and debug events with breakpoints.", cmd: "mylocalon http 3000 --subdomain hooks" },
  { icon: <IconUsers />, title: "Client demos", body: "Send a link instead of deploying to staging. They see your latest code as you save.", cmd: "mylocalon http 5173" },
  { icon: <IconPhone />, title: "Real-device testing", body: "Open your site on any phone, on any network — with the HTTPS that camera and location APIs need.", cmd: "mylocalon http 8080" },
  { icon: <IconLock />, title: "OAuth callbacks", body: "Register https://myapp.mylocalon.com/auth/callback once with Google or GitHub and keep using it.", cmd: "mylocalon http 3000 --subdomain myapp" },
];

const PLAN = ["5 tunnels at once", "5 reserved subdomains", "HTTPS on every URL", "10 MB per request", "Live dashboard & API keys", "CLI, Node.js SDK & REST API"];

export default function Landing() {
  return (
    <div className="site">
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: SITE.name,
          description: SITE.description,
          url: siteUrl("/"),
          applicationCategory: "DeveloperApplication",
          operatingSystem: "macOS, Linux, Windows",
          softwareVersion: SITE.version,
          softwareRequirements: "Node.js 20 or newer",
          downloadUrl: SITE.npm,
          installUrl: siteUrl("/docs/installation"),
          license: "https://opensource.org/license/mit",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Public HTTPS URL for localhost", "Reserved subdomains", "Automatic reconnect with the same URL",
            "Webhook testing", "Share local MCP servers with AI assistants", "Dashboard and API keys", "Self-hostable",
          ],
          author: AUTHORS.map((a) => ({ "@type": "Person", name: a.name, url: a.linkedin, sameAs: [a.linkedin, a.github] })),
          sameAs: [SITE.github, SITE.npm],
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: siteUrl("/"),
          logo: siteUrl("/brand/app-icon-512.png"),
          sameAs: [SITE.github, SITE.npm],
          founder: AUTHORS.map((a) => ({ "@type": "Person", name: a.name, sameAs: [a.linkedin, a.github] })),
        },
        { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: siteUrl("/"), inLanguage: "en" },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ]} />
      <SiteHeader />

      <main>
        {/* ---------------------------------------------------------------- hero */}
        <section className="lp-hero">
          <div className="site-wrap">
            <div className="lp-hero-inner">
              <a className="lp-pill" href={GITHUB_URL} target="_blank" rel="noreferrer">
                <span className="new">Open source</span> Free HTTPS tunnels<span className="hide-sm">, self-hostable</span> <IconArrowRight size={14} />
              </a>
              <h1 className="lp-title">
                Your localhost,
                <br />
                <span className="grad-text">on the internet.</span>
              </h1>
              <p className="lp-sub">
                <strong>mylocalon</strong> is a free, open-source tunnel that gives the app on your computer a public HTTPS URL
                with one command. Test webhooks, share MCP servers with AI assistants, show clients your work and try your site
                on real phones — no deploy, no router setup.
              </p>
              <div className="lp-cta">
                <Link href="/signup?next=/dashboard" className="btn btn-primary btn-lg">Start for free <IconArrowRight size={16} /></Link>
                <Link href="/docs/quickstart" className="btn btn-secondary btn-lg">Read the quickstart</Link>
              </div>
              <CopyCommand command="npm install -g mylocalon" />
            </div>
            <div className="lp-demo">
              <TypingTerminal />
            </div>

          </div>
        </section>

        {/* ---------------------------------------------------------------- steps */}
        <section className="lp-section">
          <div className="site-wrap">
            <span className="lp-kicker">Get started</span>
            <h2 className="lp-h2">Three commands. That&apos;s the whole setup.</h2>
            <p className="lp-lead">No config files, no router settings, no credit card.</p>
            <ol className="lp-steps">
              <li>
                <h3>Install</h3>
                <p>Get the CLI from npm. Works on macOS, Linux and Windows with Node.js 20+.</p>
                <div className="cmd"><code>npm install -g mylocalon</code></div>
              </li>
              <li>
                <h3>Log in</h3>
                <p>Your browser opens. Sign up, approve this computer, done — once per machine.</p>
                <div className="cmd"><code>mylocalon login</code></div>
              </li>
              <li>
                <h3>Share</h3>
                <p>Point it at the port your app runs on and send the HTTPS link to anyone.</p>
                <div className="cmd"><code>mylocalon http 3000</code></div>
              </li>
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------------------------- bento */}
        <section className="lp-section" style={{ paddingTop: 0 }}>
          <div className="site-wrap">
            <span className="lp-kicker">Features</span>
            <h2 className="lp-h2">Built for everyday development</h2>
            <p className="lp-lead">Everything a tunnel should do, nothing you have to configure.</p>
            <div className="bento">
              <div className="bento-card wide">
                <div className="bento-visual">
                  <span className="bv-url"><IconLock size={15} className="lock" />https://myapp.mylocalon.com</span>
                </div>
                <h3>HTTPS and your own subdomain</h3>
                <p>Every tunnel gets a trusted certificate. Reserve a name and get the same URL every time — register it with a webhook once.</p>
              </div>
              <div className="bento-card wide">
                <div className="bento-visual">
                  <div className="bv-flow">
                    <span className="bv-node">Visitor</span><span className="bv-line" />
                    <span className="bv-node brand">mylocalon</span><span className="bv-line" />
                    <span className="bv-node">localhost:3000</span>
                  </div>
                </div>
                <h3>No router setup, ever</h3>
                <p>Your computer dials out, so it works behind home Wi-Fi, office firewalls and mobile hotspots.</p>
              </div>
              <div className="bento-card">
                <div className="bento-visual">
                  <div className="bv-states">
                    <span className="bv-chip"><span className="dot warn" /> reconnecting…</span>
                    <span className="bv-chip"><span className="dot live ok" /> back online · same URL</span>
                  </div>
                </div>
                <h3>Survives hiccups</h3>
                <p>Wi-Fi blips and laptop sleep don&apos;t break the link.</p>
              </div>
              <div className="bento-card">
                <div className="bento-visual">
                  <div className="bv-bars" aria-hidden="true">
                    {[28, 44, 36, 58, 40, 64, 52].map((h, i) => <span key={i} style={{ height: h }} />)}
                  </div>
                </div>
                <h3>Live dashboard</h3>
                <p>Tunnels, history, API keys and subdomains in one place.</p>
              </div>
              <div className="bento-card">
                <div className="bento-visual">
                  <div className="bv-states">
                    <span className="bv-chip"><IconShield size={14} /> Argon2id-hashed keys</span>
                    <span className="bv-chip"><IconCode size={14} /> 100% open source</span>
                  </div>
                </div>
                <h3>Secure &amp; open</h3>
                <p>Short-lived tokens, revocable keys, and code you can read or self-host.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- use cases */}
        <section className="lp-section" style={{ paddingTop: 0 }}>
          <div className="site-wrap">
            <span className="lp-kicker">Use cases</span>
            <h2 className="lp-h2">What people use it for</h2>
            <p className="lp-lead">From payment webhooks and MCP servers to a quick demo for a client.</p>
            <div className="uc-grid">
              {USE_CASES.map((u) => (
                <div key={u.title} className="uc">
                  <div className="uc-head"><span className="uc-icon">{u.icon}</span><h3>{u.title}</h3></div>
                  <p>{u.body}</p>
                  <div className="cmd"><code>{u.cmd}</code></div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 28 }}>
              <Link href="/docs/use-cases" className="btn btn-secondary">Step-by-step recipes <IconArrowRight size={15} /></Link>{" "}<Link href="/docs/mcp" className="btn btn-secondary">MCP guide <IconArrowRight size={15} /></Link>
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- plan */}
        <section className="lp-section" style={{ paddingTop: 0 }}>
          <div className="site-wrap">
            <div className="lp-plan">
              <div>
                <span className="lp-kicker" style={{ textAlign: "left" }}>Pricing</span>
                <h2 className="lp-h2">Free while you build</h2>
                <p className="lp-lead">Everything you need for day-to-day development, no card required. Need more? Run mylocalon on your own server.</p>
                <div className="lp-cta">
                  <Link href="/signup?next=/dashboard" className="btn btn-primary">Create a free account</Link>
                  <Link href="/docs/self-hosting" className="btn btn-secondary">Self-host it</Link>
                </div>
              </div>
              <ul className="plan-list">
                {PLAN.map((p) => <li key={p}><IconCheck size={16} /> {p}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- FAQ */}
        <section className="lp-section" style={{ paddingTop: 0 }} aria-labelledby="faq-title">
          <div className="site-wrap">
            <span className="lp-kicker">FAQ</span>
            <h2 className="lp-h2" id="faq-title">Questions, answered</h2>
            <p className="lp-lead">More in the <Link href="/docs/faq">full FAQ</Link>.</p>
            <div className="faq">
              {FAQ.map((f) => (
                <details key={f.q} className="faq-item">
                  <summary><h3>{f.q}</h3></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- final */}
        <section className="lp-final">
          <div className="site-wrap">
            <h2>Share what you&apos;re building<br />in the next minute.</h2>
            <p>One install, one login, one command.</p>
            <div className="lp-cta">
              <Link href="/signup?next=/dashboard" className="btn btn-primary btn-lg">Start for free <IconArrowRight size={16} /></Link>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg"><IconGitHub /> Star on GitHub</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CopyCommand } from "./_site/Copy";
import { GITHUB_URL, SiteFooter, SiteHeader } from "./_site/SiteHeader";

export const metadata: Metadata = {
  title: "mylocalon — your localhost, on the internet",
  description:
    "Give the app on your computer a public HTTPS URL with one command. For webhooks, client demos and testing on real phones. Free and open source.",
};

const FEATURES = [
  {
    title: "HTTPS in one command",
    body: "Every tunnel gets a valid certificate, so webhooks, OAuth providers and phones trust it immediately.",
    icon: "M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z M9 12l2 2 4-4",
  },
  {
    title: "No router setup",
    body: "Your computer dials out, so it works behind home Wi-Fi, office firewalls and mobile hotspots.",
    icon: "M3 12h18 M12 3a14 14 0 0 1 0 18 M12 3a14 14 0 0 0 0 18 M4 7h16 M4 17h16",
  },
  {
    title: "Your own subdomain",
    body: "Reserve myapp.mylocalon.com and get the same URL every time — register it with a webhook once.",
    icon: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  },
  {
    title: "Survives hiccups",
    body: "Wi-Fi blips and laptop sleep don't break the link. The tunnel reconnects and keeps its URL.",
    icon: "M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7",
  },
  {
    title: "Live dashboard",
    body: "See running tunnels and their history, manage API keys and reserved subdomains in one place.",
    icon: "M4 19V9 M10 19V5 M16 19v-7 M22 19H2",
  },
  {
    title: "Open source",
    body: "The gateway, website and CLI are public. Read the code, or run the whole stack on your own domain.",
    icon: "M8 7l-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16",
  },
];

const USE_CASES = [
  {
    title: "Webhooks",
    body: "Point Stripe, Razorpay, GitHub or Slack at your laptop and debug events with breakpoints.",
    cmd: "mylocalon http 3000 --subdomain myhooks",
  },
  {
    title: "Client demos",
    body: "Send a link instead of deploying to staging. They see your latest code as you save.",
    cmd: "mylocalon http 5173",
  },
  {
    title: "Real-device testing",
    body: "Open your site on any phone, on any network — with the HTTPS that camera and location APIs need.",
    cmd: "mylocalon http 8080",
  },
  {
    title: "OAuth callbacks",
    body: "Register https://myapp.mylocalon.com/auth/callback once with Google or GitHub and keep using it.",
    cmd: "mylocalon http 3000 --subdomain myapp",
  },
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : `M${seg}`} />
      ))}
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="site">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="lp-hero">
          <div className="site-wrap lp-hero-grid">
            <div>
              <p className="lp-eyebrow">Free · Open source · HTTPS by default</p>
              <h1 className="lp-title">
                Your localhost,
                <br />
                <span className="lp-accent">on the internet.</span>
              </h1>
              <p className="lp-sub">
                Give the app on your computer a public HTTPS URL with one command. Test webhooks, show clients your work and
                try your site on real phones — no deploy, no router setup.
              </p>
              <div className="lp-cta">
                <Link href="/signup?next=/dashboard" className="btn btn-primary btn-lg">Get started free</Link>
                <Link href="/docs/quickstart" className="btn btn-ghost btn-lg">Read the quickstart</Link>
              </div>
              <CopyCommand command="npm install -g mylocalon" />
            </div>

            <div className="terminal" role="img" aria-label="Terminal: mylocalon http 3000 prints a public HTTPS URL and logs requests">
              <div className="terminal-bar">
                <span /><span /><span />
                <em>~/my-app</em>
              </div>
              <div className="terminal-body">
                <p className="t-line" style={{ animationDelay: "0.1s" }}><span className="t-prompt">$</span> mylocalon http 3000</p>
                <p className="t-line" style={{ animationDelay: "0.7s" }}>&nbsp;</p>
                <p className="t-line" style={{ animationDelay: "0.8s" }}>  <span className="t-ok">●</span> <strong>mylocalon tunnel online</strong></p>
                <p className="t-line" style={{ animationDelay: "0.9s" }}>&nbsp;</p>
                <p className="t-line" style={{ animationDelay: "1.0s" }}>  Forwarding  <span className="t-url">https://myapp.mylocalon.com</span> → localhost:3000</p>
                <p className="t-line" style={{ animationDelay: "1.1s" }}>&nbsp;</p>
                <p className="t-line t-dim" style={{ animationDelay: "1.6s" }}>  10:42:07  GET   /              <span className="t-ok">200</span>  12ms</p>
                <p className="t-line t-dim" style={{ animationDelay: "2.0s" }}>  10:42:08  GET   /api/products  <span className="t-ok">200</span>  31ms</p>
                <p className="t-line t-dim" style={{ animationDelay: "2.5s" }}>  10:42:15  POST  /webhooks/pay  <span className="t-ok">201</span>  48ms</p>
                <p className="t-line" style={{ animationDelay: "2.9s" }}><span className="t-cursor" /></p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="lp-section">
          <div className="site-wrap">
            <h2 className="lp-h2">Three commands. That&apos;s the whole setup.</h2>
            <ol className="lp-steps">
              <li>
                <span className="lp-step-n">1</span>
                <h3>Install</h3>
                <p>Get the CLI from npm. Works on macOS, Linux and Windows with Node.js 20+.</p>
                <code>npm install -g mylocalon</code>
              </li>
              <li>
                <span className="lp-step-n">2</span>
                <h3>Log in</h3>
                <p>Your browser opens. Sign up, approve this computer, done — once per machine.</p>
                <code>mylocalon login</code>
              </li>
              <li>
                <span className="lp-step-n">3</span>
                <h3>Share</h3>
                <p>Point it at the port your app runs on and send the HTTPS link to anyone.</p>
                <code>mylocalon http 3000</code>
              </li>
            </ol>
          </div>
        </section>

        {/* Flow diagram */}
        <section className="lp-section lp-alt">
          <div className="site-wrap">
            <h2 className="lp-h2">How a request reaches your laptop</h2>
            <p className="lp-lead">Your computer opens one secure connection out to mylocalon. Visitors&apos; requests travel down it and the answers come back the same way.</p>
            <div className="lp-flow" aria-label="Visitor to mylocalon to your computer">
              <div className="lp-node">
                <strong>Visitor</strong>
                <span>myapp.mylocalon.com</span>
              </div>
              <div className="lp-arrow"><span>HTTPS</span></div>
              <div className="lp-node lp-node-accent">
                <strong>mylocalon</strong>
                <span>routes by subdomain</span>
              </div>
              <div className="lp-arrow"><span>secure tunnel</span></div>
              <div className="lp-node">
                <strong>Your computer</strong>
                <span>localhost:3000</span>
              </div>
            </div>
            <p className="lp-more"><Link href="/docs/how-it-works">How it works in detail →</Link></p>
          </div>
        </section>

        {/* Features */}
        <section className="lp-section">
          <div className="site-wrap">
            <h2 className="lp-h2">Built for everyday development</h2>
            <div className="lp-grid">
              {FEATURES.map((f) => (
                <div key={f.title} className="lp-card">
                  <div className="lp-icon"><Icon d={f.icon} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="lp-section lp-alt">
          <div className="site-wrap">
            <h2 className="lp-h2">What people use it for</h2>
            <div className="lp-grid lp-grid-2">
              {USE_CASES.map((u) => (
                <div key={u.title} className="lp-card">
                  <h3>{u.title}</h3>
                  <p>{u.body}</p>
                  <code className="lp-card-cmd">{u.cmd}</code>
                </div>
              ))}
            </div>
            <p className="lp-more"><Link href="/docs/use-cases">Step-by-step recipes →</Link></p>
          </div>
        </section>

        {/* Free plan */}
        <section className="lp-section">
          <div className="site-wrap lp-plan">
            <div>
              <h2 className="lp-h2 left">Free while you build</h2>
              <p className="lp-lead left">Everything you need for day-to-day development, no card required. Need more? Run mylocalon on your own server.</p>
              <div className="lp-cta">
                <Link href="/signup?next=/dashboard" className="btn btn-primary">Create a free account</Link>
                <Link href="/docs/self-hosting" className="btn btn-ghost">Self-host it</Link>
              </div>
            </div>
            <ul className="lp-plan-list">
              <li><strong>5</strong> tunnels at once</li>
              <li><strong>5</strong> reserved subdomains</li>
              <li><strong>HTTPS</strong> on every URL</li>
              <li><strong>10 MB</strong> per request</li>
              <li><strong>Live</strong> dashboard &amp; API keys</li>
              <li><strong>CLI</strong>, Node.js SDK &amp; REST API</li>
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className="lp-final">
          <div className="site-wrap">
            <h2>Share what you&apos;re building in the next minute.</h2>
            <CopyCommand command="npm install -g mylocalon" />
            <p>
              <Link href="/docs/installation">Installation guide</Link> · <a href={GITHUB_URL} target="_blank" rel="noreferrer">Star on GitHub</a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

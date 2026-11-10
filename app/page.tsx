import type { Metadata } from "next";
import Link from "next/link";
import { CopyCommand } from "./_site/Copy";
import {
  IconArrowRight, IconCheck, IconCode, IconGitHub, IconLock, IconPhone,
  IconShield, IconUsers, IconWebhook,
} from "./_site/icons";
import { GITHUB_URL, SiteFooter, SiteHeader } from "./_site/SiteHeader";
import { TypingTerminal } from "./_site/Terminal";

export const metadata: Metadata = {
  title: "mylocalon — your localhost, on the internet",
  description:
    "Give the app on your computer a public HTTPS URL with one command. For webhooks, client demos and testing on real phones. Free and open source.",
};

const USE_CASES = [
  { icon: <IconWebhook />, title: "Webhooks", body: "Point Stripe, Razorpay, GitHub or Slack at your laptop and debug events with breakpoints.", cmd: "mylocalon http 3000 --subdomain hooks" },
  { icon: <IconUsers />, title: "Client demos", body: "Send a link instead of deploying to staging. They see your latest code as you save.", cmd: "mylocalon http 5173" },
  { icon: <IconPhone />, title: "Real-device testing", body: "Open your site on any phone, on any network — with the HTTPS that camera and location APIs need.", cmd: "mylocalon http 8080" },
  { icon: <IconLock />, title: "OAuth callbacks", body: "Register https://myapp.mylocalon.com/auth/callback once with Google or GitHub and keep using it.", cmd: "mylocalon http 3000 --subdomain myapp" },
];

const PLAN = ["5 tunnels at once", "5 reserved subdomains", "HTTPS on every URL", "10 MB per request", "Live dashboard & API keys", "CLI, Node.js SDK & REST API"];

export default function Landing() {
  return (
    <div className="site">
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
                Give the app on your computer a public HTTPS URL with one command. Test webhooks, show clients your work and
                try your site on real phones — no deploy, no router setup.
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
            <p className="lp-lead">From payment webhooks to a quick demo for a client.</p>
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
              <Link href="/docs/use-cases" className="btn btn-secondary">Step-by-step recipes <IconArrowRight size={15} /></Link>
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

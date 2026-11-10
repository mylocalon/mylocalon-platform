import Link from "next/link";
import { Logo, Wordmark } from "./Logo";

/** Split-screen auth layout: brand panel left, form right. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <aside className="auth-art" aria-hidden="true">
        <Link href="/" className="site-brand" tabIndex={-1}><Logo size={30} id="ml-art" /> <Wordmark /></Link>
        <div>
          <p className="auth-quote">Share what you&apos;re building, straight from localhost.</p>
          <div className="terminal">
            <div className="terminal-bar"><i /><i /><i /></div>
            <div className="terminal-body">
              <p className="t-line"><span className="t-prompt">❯</span> mylocalon http 3000</p>
              <p className="t-line"> </p>
              <p className="t-line">  <span className="t-ok">●</span> <b>mylocalon tunnel online</b></p>
              <p className="t-line">  Forwarding  <span className="t-url">https://myapp.mylocalon.com</span></p>
            </div>
          </div>
        </div>
        <p className="t-dim" style={{ margin: 0, fontSize: 13 }}>Free · Open source · HTTPS by default</p>
      </aside>
      <main className="auth-form-wrap">
        <div className="auth-form">
          <Link href="/" className="site-brand auth-logo-sm" aria-label="mylocalon home"><Logo size={28} id="ml-auth" /> <Wordmark /></Link>
          {children}
        </div>
      </main>
    </div>
  );
}

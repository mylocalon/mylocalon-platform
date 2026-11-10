"use client";

import { useEffect, useState } from "react";

type Line = { text: React.ReactNode; delay: number };

const CMD = "mylocalon http 3000";
const OUTPUT: Line[] = [
  { text: " ", delay: 350 },
  { text: <>  <span className="t-ok">●</span> <b>mylocalon tunnel online</b></>, delay: 250 },
  { text: " ", delay: 80 },
  { text: <>  Forwarding  <span className="t-url">https://myapp.mylocalon.com</span> → localhost:3000</>, delay: 120 },
  { text: " ", delay: 600 },
  { text: <span className="t-dim">  10:42:07  GET    /               <span className="t-ok">200</span>   12ms</span>, delay: 500 },
  { text: <span className="t-dim">  10:42:08  GET    /api/products   <span className="t-ok">200</span>   31ms</span>, delay: 420 },
  { text: <span className="t-dim">  10:42:15  POST   /webhooks/pay   <span className="t-ok">201</span>   48ms</span>, delay: 900 },
];

/** Hero terminal that types the command, then prints output. Static when motion is reduced. */
export function TypingTerminal({ title = "~/my-app" }: { title?: string }) {
  const [typed, setTyped] = useState(CMD.length);
  const [shown, setShown] = useState(OUTPUT.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setTyped(0);
    setShown(0);
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 500;
    for (let i = 1; i <= CMD.length; i++) {
      t += 45 + Math.random() * 55;
      timers.push(setTimeout(() => !cancelled && setTyped(i), t));
    }
    OUTPUT.forEach((l, i) => {
      t += l.delay;
      timers.push(setTimeout(() => !cancelled && setShown(i + 1), t));
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="terminal" role="img" aria-label="Terminal: mylocalon http 3000 prints a public HTTPS URL and logs incoming requests">
      <div className="terminal-bar"><i /><i /><i /><em>{title}</em></div>
      <div className="terminal-body" aria-hidden="true">
        <p className="t-line"><span className="t-prompt">❯</span> {CMD.slice(0, typed)}{typed < CMD.length && <span className="t-cursor" />}</p>
        {OUTPUT.slice(0, shown).map((l, i) => <p key={i} className="t-line">{l.text}</p>)}
        {typed === CMD.length && shown === OUTPUT.length && <p className="t-line"><span className="t-cursor" /></p>}
      </div>
    </div>
  );
}

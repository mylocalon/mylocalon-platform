"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/docs/search";
import { IconSearch } from "./icons";

function score(e: SearchEntry, terms: string[]): number {
  const t = e.title.toLowerCase();
  const x = e.text.toLowerCase();
  let s = 0;
  for (const term of terms) {
    if (t.includes(term)) s += t.startsWith(term) ? 12 : 8;
    else if (x.includes(term)) s += 2;
    else return 0; // every term must match somewhere
  }
  return s;
}

function snippet(text: string, term: string): string {
  const i = text.toLowerCase().indexOf(term);
  if (i < 0) return text.slice(0, 110);
  const start = Math.max(0, i - 40);
  return (start ? "…" : "") + text.slice(start, start + 120);
}

/** ⌘K / Ctrl+K docs search. */
export function SearchButton({ index }: { index: SearchEntry[] }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      } else if (e.key === "/" && !/INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((e) => !e.title.includes("›")).slice(0, 8);
    return index
      .map((e) => ({ e, s: score(e, terms) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((r) => r.e);
  }, [q, index]);

  function open() {
    setQ("");
    setSel(0);
    ref.current?.showModal();
  }
  function go(e?: SearchEntry) {
    if (!e) return;
    ref.current?.close();
    router.push(e.href);
  }
  const first = q.toLowerCase().split(/\s+/).filter(Boolean)[0] ?? "";

  return (
    <>
      <button type="button" className="search-btn" onClick={open} aria-label="Search docs">
        <IconSearch size={15} />
        <span className="label">Search docs…</span>
        <kbd>{mac ? "⌘" : "Ctrl"} K</kbd>
      </button>
      <dialog
        ref={ref}
        className="search"
        aria-label="Search documentation"
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
      >
        <div className="search-input">
          <IconSearch size={18} />
          <input
            autoFocus
            placeholder="Search docs — install, webhooks, 502, subdomain…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === "Enter") { e.preventDefault(); go(results[sel]); }
            }}
            aria-controls="search-results"
          />
          <kbd>Esc</kbd>
        </div>
        <div className="search-results" id="search-results" role="listbox">
          {results.length === 0 ? (
            <div className="search-empty">No results for “{q}”. Try <a href="/docs/troubleshooting">Troubleshooting</a>.</div>
          ) : (
            results.map((r, i) => (
              <a
                key={r.href}
                href={r.href}
                role="option"
                aria-selected={i === sel}
                className="search-result"
                onMouseEnter={() => setSel(i)}
                onClick={(e) => { e.preventDefault(); go(r); }}
              >
                <div className="t">{r.title}</div>
                <div className="s">{q ? snippet(r.text, first) : r.section}</div>
              </a>
            ))
          )}
        </div>
        <div className="search-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span></div>
      </dialog>
    </>
  );
}

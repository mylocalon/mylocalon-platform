"use client";

import { useEffect, useState } from "react";

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** One-line install snippet with a copy button. */
export function CopyCommand({ command }: { command: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="copy-cmd">
      <code>
        <span className="prompt" aria-hidden="true">$ </span>
        {command}
      </code>
      <button
        type="button"
        className="copy-btn"
        aria-label={`Copy "${command}"`}
        onClick={async () => {
          if (await copy(command)) {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          }
        }}
      >
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** Adds copy buttons to every rendered code block inside `.prose`. */
export function CodeCopyButtons() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLDivElement>(".prose .code-block");
    const added: HTMLButtonElement[] = [];
    blocks.forEach((block) => {
      if (block.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code");
      btn.addEventListener("click", async () => {
        const text = block.querySelector("code")?.innerText ?? "";
        if (await copy(text)) {
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = "Copy"), 1500);
        }
      });
      block.appendChild(btn);
      added.push(btn);
    });
    return () => added.forEach((b) => b.remove());
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";
import { copyText, CopyButton } from "./ui";

/** Big install snippet with a copy button (landing page). */
export function CopyCommand({ command }: { command: string }) {
  return (
    <div className="lp-install">
      <code>
        <span className="prompt" aria-hidden="true">$ </span>
        {command}
      </code>
      <CopyButton text={command} />
    </div>
  );
}

/** Adds copy buttons to every rendered code block inside `.prose`. */
export function CodeCopyButtons() {
  useEffect(() => {
    const added: HTMLButtonElement[] = [];
    document.querySelectorAll<HTMLDivElement>(".prose .code-block").forEach((block) => {
      if (block.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code");
      btn.addEventListener("click", async () => {
        if (await copyText(block.querySelector("code")?.innerText ?? "")) {
          btn.textContent = "Copied";
          btn.classList.add("done");
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove("done");
          }, 1500);
        }
      });
      block.appendChild(btn);
      added.push(btn);
    });
    return () => added.forEach((b) => b.remove());
  }, []);
  return null;
}

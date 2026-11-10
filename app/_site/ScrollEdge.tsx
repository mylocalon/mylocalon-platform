"use client";

import { useEffect, useRef } from "react";

/** Marks the enclosing header once content scrolls beneath it (scroll edge effect). */
export function ScrollEdge() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const header = ref.current?.closest("header");
    if (!header) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (window.scrollY > 4) header.setAttribute("data-scrolled", "");
      else header.removeAttribute("data-scrolled");
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <span ref={ref} hidden />;
}

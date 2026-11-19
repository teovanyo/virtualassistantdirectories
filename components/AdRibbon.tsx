"use client";

import { useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";

const KEY = "vad-ribbon-dismissed";

export function AdRibbon() {
  const ref = useRef<HTMLDivElement>(null);
  const dismiss = () => {
    if (ref.current) ref.current.style.display = "none";
    try { localStorage.setItem(KEY, "1"); } catch {}
  };
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("${KEY}")==="1"){var s=document.currentScript;s&&s.parentElement&&s.parentElement.querySelectorAll("[data-va-ribbon]").forEach(function(n){n.style.display="none"})}}catch(e){}`,
        }}
      />
      <div ref={ref} data-va-ribbon className="relative bg-lime text-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-3 px-8 py-2 text-center">
          <span className="hidden rounded bg-ink/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] sm:inline">Ad</span>
          <p className="text-[12.5px] font-medium leading-snug">
            Need a dedicated assistant? <span className="font-bold">Stealth Agents</span> places vetted VAs in 48 hours.
          </p>
          <a
            href="https://stealthagents.com/?utm_source=virtualassistantdirectories&utm_medium=display&utm_campaign=virtual-assistant&utm_content=sitewide-ribbon"
            target="_blank"
            rel="sponsored noopener"
            className="inline-flex shrink-0 items-center gap-0.5 text-[12.5px] font-bold underline decoration-2 underline-offset-2"
          >
            See VAs <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
        <button type="button" onClick={dismiss} aria-label="Dismiss advertisement" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink/40 hover:bg-ink/10 hover:text-ink">
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </>
  );
}

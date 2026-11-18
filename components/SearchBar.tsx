"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

type Suggestion = { city: string; slug: string; state: string; stateName: string; count: number };

export function SearchBar({ initial = "", size = "lg" }: { initial?: string; size?: "lg" | "sm" }) {
  const [q, setQ] = useState(initial);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/cities?q=${encodeURIComponent(q)}`);
        setItems(await r.json());
      } catch {
        setItems([]);
      }
    }, 120);
    return () => clearTimeout(t);
  }, [q, open]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={box} className="relative">
      <form
        action="/search"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(q)}`);
        }}
        className={`flex items-center gap-2 rounded-full border-2 border-ink bg-card ${size === "lg" ? "p-1.5 pl-5" : "p-1 pl-4"}`}
      >
        <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          name="q"
          placeholder="City, state or company name"
          aria-label="Search virtual assistant companies"
          className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted/80 ${size === "lg" ? "py-2.5 text-[15px]" : "py-1.5 text-sm"}`}
        />
        <button
          type="submit"
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink font-semibold text-white transition hover:bg-charcoal ${size === "lg" ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-[13px]"}`}
        >
          Search <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </form>

      {open && (items.length > 0 || q) ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-line bg-card shadow-xl">
          {q ? (
            <Link
              href={`/search?q=${encodeURIComponent(q)}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-sm hover:bg-paper"
            >
              <span className="truncate">Search all providers for <strong>“{q}”</strong></span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          ) : null}
          {items.map((c) => (
            <Link
              key={`${c.state}-${c.slug}`}
              href={`/state/${c.state.toLowerCase()}/${c.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-paper"
            >
              <span>{c.city}, {c.state}</span>
              <span className="mono text-[11px] text-muted">{c.count}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

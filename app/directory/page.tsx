import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getIndex } from "@/lib/data";
import { Breadcrumbs } from "@/components/Nav";
import { AdBanner } from "@/components/Ads";

export const metadata: Metadata = {
  title: { absolute: "Virtual Assistant Companies by State" },
  description: "Browse virtual assistant companies across all 50 states and Washington, D.C. Pick a state to see VA agencies, staffing firms and offshore teams by city.",
  alternates: { canonical: "https://virtualassistantdirectories.com/directory" },
};

export default function DirectoryPage() {
  const { states, firms, topCities } = getIndex();
  const max = Math.max(...states.map((s) => s.count), 1);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Directory" }]} />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Directory</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">Virtual assistant companies by state</h1>
          <p className="mt-3 text-[15px] leading-7 text-muted">
            {firms.length.toLocaleString()} providers across {states.length} states and {topCities.length.toLocaleString()} cities and towns. Pick a state to browse local agencies, staffing firms and offshore teams, or search by company name.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-ink bg-lime px-5 py-4">
          <p className="mono text-2xl font-bold">{firms.length.toLocaleString()}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-lime-ink/70">Providers listed</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-card">
        <div className="hidden grid-cols-[2.5rem_1fr_7rem_7rem_12rem_2rem] gap-4 border-b border-line bg-paper px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted md:grid">
          <span>#</span><span>State</span><span>Providers</span><span>Cities</span><span>Density</span><span />
        </div>
        {states.map((s, i) => (
          <Link key={s.code} href={`/state/${s.code.toLowerCase()}`} className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-paper/70 md:grid-cols-[2.5rem_1fr_7rem_7rem_12rem_2rem] md:gap-4 md:px-5">
            <span className="mono text-[11px] font-bold text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="font-semibold group-hover:text-violet">{s.name}</span>
              <span className="mono rounded bg-paper px-1.5 py-0.5 text-[10px] text-muted ring-1 ring-line">{s.code}</span>
            </span>
            <span className="mono text-right text-[13px] font-bold md:text-left">{s.count.toLocaleString()}</span>
            <span className="mono hidden text-[13px] text-muted md:block">{s.cities}</span>
            <span className="hidden h-1.5 overflow-hidden rounded-full bg-paper md:block">
              <span className="block h-full rounded-full bg-ink" style={{ width: `${Math.max(4, Math.round((s.count / max) * 100))}%` }} />
            </span>
            <ArrowUpRight className="hidden h-4 w-4 text-muted group-hover:text-ink md:block" aria-hidden />
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <AdBanner placement="directory-bottom" />
      </div>
    </div>
  );
}

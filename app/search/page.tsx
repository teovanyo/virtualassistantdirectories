import Link from "next/link";
import type { Metadata } from "next";
import { getIndex, searchFirms, stateName } from "@/lib/data";
import { Breadcrumbs, Pagination } from "@/components/Nav";
import { ProviderRow } from "@/components/ProviderCard";
import { SearchBar } from "@/components/SearchBar";

export const metadata: Metadata = { title: "Search Virtual Assistant Companies", description: "Search virtual assistant companies across the United States by name, city, state or ZIP code.", robots: { index: false, follow: true } };

type Props = { searchParams: Promise<{ q?: string; state?: string; city?: string; page?: string; sort?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const result = searchFirms({ q: sp.q, state: sp.state, city: sp.city, page, perPage: 20, sort: sp.sort });
  const { states } = getIndex();
  const makeHref = (p: number) => {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.state) params.set("state", sp.state);
    if (sp.city) params.set("city", sp.city);
    if (sp.sort) params.set("sort", sp.sort);
    if (p > 1) params.set("page", String(p));
    return `/search?${params.toString()}`;
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Search</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">Find a virtual assistant provider</h1>
      <div className="mt-5 max-w-2xl"><SearchBar initial={sp.q || ""} size="sm" /></div>
      <form method="get" action="/search" className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {sp.q ? <input type="hidden" name="q" value={sp.q} /> : null}
        <select name="state" defaultValue={sp.state || ""} className="rounded-full border border-line bg-card px-4 py-2">
          <option value="">All states</option>
          {states.map((s) => <option key={s.code} value={s.code}>{s.name} ({s.count})</option>)}
        </select>
        <button type="submit" className="rounded-full bg-ink px-4 py-2 font-semibold text-white">Apply</button>
        {sp.q || sp.state ? <Link href="/search" className="text-muted hover:text-ink">Clear</Link> : null}
      </form>
      <p className="mono mt-6 text-[12px] text-muted">{result.total.toLocaleString()} {result.total === 1 ? "provider" : "providers"}{sp.q ? ` matching “${sp.q}”` : ""}{sp.state ? ` in ${stateName(sp.state.toUpperCase())}` : ""}</p>
      <div className="mt-4 space-y-2 sm:space-y-0">
        {result.firms.map((f, i) => <ProviderRow key={f.slug} firm={f} rank={i + 1} />)}
      </div>
      {!result.firms.length ? <div className="mt-8 rounded-2xl border border-dashed border-line bg-card p-10 text-center"><p className="font-semibold">No providers matched that search.</p><p className="mt-1 text-sm text-muted">Try a city, a state, or part of a company name.</p></div> : null}
      <Pagination page={page} pages={result.pages} makeHref={makeHref} />
    </div>
  );
}

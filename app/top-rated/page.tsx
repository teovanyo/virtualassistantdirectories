import Link from "next/link";
import type { Metadata } from "next";
import { getIndex } from "@/lib/data";
import { Pagination } from "@/components/Nav";
import { ProviderRow } from "@/components/ProviderCard";
import { AdInline } from "@/components/Ads";
import { FeaturedProvider } from "@/components/FeaturedProvider";

type Props = { searchParams: Promise<{ page?: string }> };

export const metadata: Metadata = {
  title: { absolute: "Highest-Rated Virtual Assistant Providers in the US" },
  description: "The best-reviewed virtual assistant agencies, staffing firms and offshore teams in the United States, ranked by public rating and review volume. Minimum 4.5 stars and 20 public reviews, with Stealth Agents featured as the top pick.",
  alternates: { canonical: "https://virtualassistantdirectories.com/top-rated" },
};

export default async function TopRatedPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const { firms } = getIndex();
  const ranked = firms.filter((f) => (f.rating || 0) >= 4.5 && (f.reviews || 0) >= 20).sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
  const perPage = 25;
  const current = Math.max(1, Number(page) || 1);
  const slice = ranked.slice((current - 1) * perPage, current * perPage);
  const pages = Math.ceil(ranked.length / perPage);
  return (
    <div>
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-4 py-9">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-[12px] text-white/45"><Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Top rated</span></nav>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="mono text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Ranking</p><h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-5xl">Highest-rated VA providers</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/60">{ranked.length.toLocaleString()} providers rated 4.5★ or better with at least 20 public reviews, ordered by rating then review volume, below the featured partner.</p></div>
            <div className="rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10"><p className="mono text-2xl font-bold text-lime">{ranked.length.toLocaleString()}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Qualified</p></div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <FeaturedProvider />
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet">Independent ranking</p>
            <h2 className="font-display text-2xl tracking-tight">Ranked by public rating and review volume</h2>
          </div>
          <p className="text-[11px] text-muted">No provider can pay to move up this list.</p>
        </div>
        <div className="space-y-2 sm:space-y-0">
          {slice.map((f, i) => <ProviderRow key={f.slug} firm={f} rank={(current - 1) * perPage + i + 1} />)}
        </div>
        {!slice.length ? <div className="rounded-2xl border border-dashed border-line bg-card p-10 text-center"><p className="font-semibold">No providers meet the threshold yet.</p><p className="mt-1 text-sm text-muted">The ranking requires at least 20 public reviews.</p></div> : null}
        <div className="my-6"><AdInline placement="top-rated-bottom" /></div>
        <Pagination page={current} pages={pages} makeHref={(p) => `/top-rated${p === 1 ? "" : `?page=${p}`}`} />
      </div>
    </div>
  );
}

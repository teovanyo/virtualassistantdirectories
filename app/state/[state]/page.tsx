import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { FIRM_TYPE_LABELS, firmTypes, getIndex, stateName, type FirmType } from "@/lib/data";
import { ProviderCard } from "@/components/ProviderCard";
import { AdInline } from "@/components/Ads";

type Props = { params: Promise<{ state: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const code = state.toUpperCase();
  const name = stateName(code);
  const idx = getIndex();
  const firms = idx.byState.get(code) || [];
  const cities = idx.citiesByState.get(code) || [];
  const year = new Date().getFullYear();
  const canonical = `https://virtualassistantdirectories.com/state/${code.toLowerCase()}`;
  return {
    title: { absolute: `Virtual Assistant Companies in ${name} (${year})` },
    description: `Compare ${firms.length.toLocaleString()} virtual assistant companies across ${cities.length} cities in ${name}. VA agencies, staffing firms, offshore teams and specialist assistants with ratings and contact details.`,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, siteName: "Virtual Assistant Directories", title: `Virtual Assistant Companies in ${name}`, description: `Directory of VA providers in ${name}.` },
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const code = state.toUpperCase();
  const idx = getIndex();
  const firms = idx.byState.get(code);
  if (!firms) notFound();
  const cities = idx.citiesByState.get(code) || [];
  const name = stateName(code);
  const topFirms = [...firms].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 10);
  const withSite = firms.filter((f) => f.website).length;
  const rated = firms.filter((f) => f.rating != null);
  const avgRating = rated.length ? rated.reduce((s, f) => s + (f.rating || 0), 0) / rated.length : null;
  const typeCounts = new Map<FirmType, number>();
  for (const f of firms) for (const t of firmTypes(f)) typeCounts.set(t, (typeCounts.get(t) || 0) + 1);
  const topTypes = [...typeCounts.entries()].sort((a, b) => b[1] - a[1]);
  const canonical = `https://virtualassistantdirectories.com/state/${code.toLowerCase()}`;

  const faqs = [
    { q: `How many virtual assistant companies are in ${name}?`, a: `This directory lists ${firms.length.toLocaleString()} providers across ${cities.length} cities and towns in ${name}. ${withSite.toLocaleString()} publish a website and ${rated.length.toLocaleString()} carry a public rating. Coverage includes agencies, staffing and placement firms, offshore teams, executive support and specialist VAs.` },
    { q: `How much does a virtual assistant cost in ${name}?`, a: `Pricing depends on the model and location. Offshore dedicated assistants commonly run $1,000-$3,500 per month full-time, while US-based assistants often run $3,500-$7,000. Managed agencies add recruiting and backup. Request an all-in monthly quote for the hours you need rather than comparing hourly rates alone.` },
    { q: `How do I find a VA provider near me in ${name}?`, a: `Choose your city, filter by provider type and minimum rating, then compare three providers on the same questions: scope, hours, time-zone overlap, tools, training, replacement policy, security and total monthly cost. Run a small paid trial before committing.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": canonical, url: canonical, name: `Virtual assistant companies in ${name}`, description: `Directory of ${firms.length.toLocaleString()} VA providers across ${cities.length} cities in ${name}.`, isPartOf: { "@type": "WebSite", "@id": "https://virtualassistantdirectories.com/#website" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://virtualassistantdirectories.com/" },
        { "@type": "ListItem", position: 2, name: "Directory", item: "https://virtualassistantdirectories.com/directory" },
        { "@type": "ListItem", position: 3, name, item: canonical },
      ] },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-[12px] text-white/45">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <Link href="/directory" className="hover:text-white">Directory</Link><span>/</span>
            <span className="text-white">{name}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mono text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Statewide directory</p>
              <h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-6xl">Virtual assistants in {name}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">{firms.length.toLocaleString()} providers across {cities.length} cities and towns. Compare agencies, staffing firms, offshore teams and specialist assistants.</p>
            </div>
            <div className="flex gap-6">
              <div><p className="mono text-2xl font-bold text-lime">{firms.length.toLocaleString()}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Providers</p></div>
              <div><p className="mono text-2xl font-bold text-white">{cities.length}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Cities</p></div>
              <div><p className="mono text-2xl font-bold text-white">{avgRating ? avgRating.toFixed(1) : "-"}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Avg rating</p></div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {topTypes.slice(0, 5).map(([t, n]) => (
            <Link key={t} href={`/type/${t}`} className="rounded-full border border-line bg-card px-3.5 py-1.5 text-[12px] font-semibold hover:border-ink">
              {FIRM_TYPE_LABELS[t]} <span className="mono text-[10px] text-muted">{n.toLocaleString()}</span>
            </Link>
          ))}
        </div>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl tracking-tight">Cities and towns in {name}</h2>
            <span className="mono text-[11px] text-muted">{cities.length} cities</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link key={c.slug} href={`/state/${code.toLowerCase()}/${c.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-2.5 text-sm transition hover:border-ink">
                <span className="truncate font-medium group-hover:text-violet">{c.city}</span>
                <span className="mono text-[11px] text-muted">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="my-10"><AdInline placement="state-mid" /></div>

        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl tracking-tight">Most-reviewed providers in {name}</h2>
            {cities[0] ? <Link href={`/state/${code.toLowerCase()}/${cities[0].slug}`} className="text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-violet">Start local →</Link> : null}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {topFirms.map((f, i) => <ProviderCard key={f.slug} firm={f} rank={i + 1} />)}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl tracking-tight">Common questions about {name}</h2>
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4 open:bg-paper/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">{f.q}<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-lime transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card px-5 py-4 text-sm">
          <span className="text-muted">Looking for another state?</span>
          <Link href="/directory" className="inline-flex items-center gap-1 font-bold underline decoration-2 underline-offset-4 hover:text-violet">Open the directory <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </div>
  );
}

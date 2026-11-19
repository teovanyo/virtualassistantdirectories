import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock3, Star } from "lucide-react";
import { FIRM_TYPE_LABELS, filterCityFirms, firmTypes, getCity, getIndex, stateName, type FirmType } from "@/lib/data";
import { Pagination } from "@/components/Nav";
import { ProviderRow } from "@/components/ProviderCard";
import { Filters } from "@/components/Filters";
import { AdBand, AdCard, AdInline } from "@/components/Ads";

type Props = {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ page?: string; type?: string; site?: string; rating?: string; sort?: string }>;
};

function displayCity(state: string, citySlug: string) {
  const list = getCity(state.toUpperCase(), citySlug);
  return list[0]?.city || citySlug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const code = state.toUpperCase();
  const cityName = displayCity(code, city);
  const firms = getCity(code, city);
  const slug = firms[0]?.citySlug || city.toLowerCase();
  const canonical = `https://virtualassistantdirectories.com/state/${code.toLowerCase()}/${slug}`;
  const title = `Virtual Assistant Companies in ${cityName}, ${code}`;
  const description = `Compare ${firms.length} virtual assistant providers in ${cityName}, ${stateName(code)}. VA agencies, staffing firms, offshore teams and specialists with ratings, reviews and contact details.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, siteName: "Virtual Assistant Directories", title, description },
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { state, city } = await params;
  const sp = await searchParams;
  const code = state.toUpperCase();
  const citySlug = decodeURIComponent(city);
  const firms = getCity(code, citySlug);
  if (!firms.length) notFound();

  const cityName = firms[0].city;
  const slug = firms[0].citySlug;
  const basePath = `/state/${code.toLowerCase()}/${slug}`;
  const perPage = 20;
  const current = Math.max(1, Number(sp.page) || 1);
  const filtered = filterCityFirms(firms, sp);
  const slice = filtered.slice((current - 1) * perPage, current * perPage);
  const pages = Math.ceil(filtered.length / perPage);
  const idx = getIndex();
  const nearby = (idx.citiesByState.get(code) || []).filter((c) => c.city !== cityName).slice(0, 10);
  const withSite = firms.filter((f) => f.website).length;
  const rated = firms.filter((f) => f.rating != null);
  const avgRating = rated.length ? rated.reduce((s, f) => s + (f.rating || 0), 0) / rated.length : null;
  const reviewTotal = firms.reduce((s, f) => s + (f.reviews || 0), 0);
  const typeCounts = new Map<FirmType, number>();
  for (const f of firms) for (const t of firmTypes(f)) typeCounts.set(t, (typeCounts.get(t) || 0) + 1);
  const topTypes = [...typeCounts.entries()].sort((a, b) => b[1] - a[1]);
  const canonical = `https://virtualassistantdirectories.com/state/${code.toLowerCase()}/${slug}`;

  const faqs = [
    { q: `How many virtual assistant companies are in ${cityName}?`, a: `This directory lists ${firms.length} ${firms.length === 1 ? "provider" : "providers"} in ${cityName}, ${stateName(code)}. ${withSite} publish a website and ${rated.length} carry a public rating. The directory covers agencies, staffing firms, offshore teams, executive support and specialist assistants where those options exist locally.` },
    { q: `How much does a virtual assistant cost in ${cityName}?`, a: `Offshore dedicated assistants commonly run $1,000-$3,500 per month full-time, while US-based assistants often run $3,500-$7,000. Managed agencies add recruiting and backup, and part-time or hourly help is priced differently. Ask each provider for an all-in monthly quote for the hours you need.` },
    { q: `How do I compare VA providers in ${cityName}?`, a: `Shortlist three providers with the right engagement model, then ask the same questions about scope, hours, time-zone overlap, tools, training, replacement policy, security and total cost. Run a small paid trial with a documented task before expanding.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": canonical, url: canonical, name: `Virtual assistant companies in ${cityName}, ${code}`, description: `Directory of ${firms.length} VA providers in ${cityName}, ${stateName(code)}.`, isPartOf: { "@type": "WebSite", "@id": "https://virtualassistantdirectories.com/#website" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://virtualassistantdirectories.com/" },
        { "@type": "ListItem", position: 2, name: stateName(code), item: `https://virtualassistantdirectories.com/state/${code.toLowerCase()}` },
        { "@type": "ListItem", position: 3, name: cityName, item: canonical },
      ] },
      { "@type": "ItemList", name: `Virtual assistant providers in ${cityName}`, numberOfItems: slice.length, itemListElement: slice.map((f, i) => ({ "@type": "ListItem", position: (current - 1) * perPage + i + 1, name: f.name, url: `https://virtualassistantdirectories.com/provider/${f.slug}` })) },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-4 py-9">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-[12px] text-white/45">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <Link href={`/state/${code.toLowerCase()}`} className="hover:text-white">{stateName(code)}</Link><span>/</span>
            <span className="text-white">{cityName}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mono text-[11px] font-bold uppercase tracking-[0.18em] text-lime">City directory</p>
              <h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-6xl">Virtual assistants in {cityName}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">{firms.length} providers in {cityName}, {stateName(code)}. Compare type, rating, review volume and contact details, then open a profile for the full scope.</p>
            </div>
            <div className="flex flex-wrap gap-5">
              <div><p className="mono text-xl font-bold text-lime">{firms.length}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Providers</p></div>
              <div><p className="mono text-xl font-bold text-white">{reviewTotal.toLocaleString()}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Reviews</p></div>
              <div><p className="mono text-xl font-bold text-white">{avgRating ? avgRating.toFixed(1) : "-"}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Avg rating</p></div>
            </div>
          </div>
        </div>
      </section>

      <AdBand placement="city-top" image="hero" />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {topTypes.slice(0, 5).map(([t, n]) => (
            <Link key={t} href={`${basePath}?type=${t}`} className="rounded-full border border-line bg-card px-3 py-1.5 text-[12px] font-semibold hover:border-ink">
              {FIRM_TYPE_LABELS[t]} <span className="mono text-[10px] text-muted">{n}</span>
            </Link>
          ))}
        </div>

        <Filters basePath={basePath} params={{ type: sp.type, site: sp.site, rating: sp.rating, sort: sp.sort }} total={firms.length} shown={filtered.length} />

        {slice.length ? (
          <div>
            {slice.slice(0, 6).map((f, i) => <ProviderRow key={f.slug} firm={f} rank={(current - 1) * perPage + i + 1} />)}
            <div className="my-5"><AdInline placement="city-listings-inline" /></div>
            {slice.slice(6).map((f, i) => <ProviderRow key={f.slug} firm={f} rank={(current - 1) * perPage + 7 + i} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-card p-10 text-center">
            <p className="font-semibold">No providers match these filters.</p>
            <p className="mt-1 text-sm text-muted">Try clearing the filters or <Link href={basePath} className="text-violet underline">see all {firms.length} providers in {cityName}</Link>.</p>
          </div>
        )}

        <Pagination page={current} pages={pages} makeHref={(p) => {
          const qs = new URLSearchParams();
          if (sp.type) qs.set("type", sp.type);
          if (sp.site) qs.set("site", sp.site);
          if (sp.rating) qs.set("rating", sp.rating);
          if (sp.sort) qs.set("sort", sp.sort);
          if (p > 1) qs.set("page", String(p));
          const s = qs.toString();
          return `${basePath}${s ? `?${s}` : ""}`;
        }} />

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-line bg-card p-6">
            <h2 className="font-display text-2xl tracking-tight">Hiring a VA in {cityName}</h2>
            <p className="mt-3 text-[14px] leading-7 text-muted">
              {cityName} has {firms.length} listed {firms.length === 1 ? "provider" : "providers"}, with {withSite} publishing a website and {rated.length} carrying a public rating. The average rating among rated providers is {avgRating ? avgRating.toFixed(1) : "not yet available"}.
              {topTypes[0] ? ` The most common specialty is ${FIRM_TYPE_LABELS[topTypes[0][0]].toLowerCase()}, with ${topTypes[0][1]} providers.` : ""}
            </p>
            <p className="mt-3 text-[14px] leading-7 text-muted">
              Remote work means you are not limited to providers with an office in {cityName}. Use the local list for a point of contact in your time zone, then widen to statewide or national providers if the specialty or price is a better fit. Confirm hours, overlap, tools, training and replacement terms before signing.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5"><Star className="h-3.5 w-3.5 fill-ink text-ink" aria-hidden /> Independent editorial profiles</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden /> Updated {new Date().getFullYear()}</span>
            </div>
          </div>
          <aside className="rounded-2xl border border-line bg-charcoal p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime">Market snapshot</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3"><dt className="text-white/55">Providers</dt><dd className="mono font-bold">{firms.length}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-white/55">With website</dt><dd className="mono font-bold">{withSite}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-white/55">With rating</dt><dd className="mono font-bold">{rated.length}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-white/55">Avg rating</dt><dd className="mono font-bold">{avgRating ? avgRating.toFixed(1) : "-"}</dd></div>
            </dl>
            <p className="mt-4 text-[11px] leading-5 text-white/40">Ratings are public business ratings, not VirtualAssistantDirectories.com reviews.</p>
            <div className="mt-4"><AdCard placement="city-aside" image="team" /></div>
          </aside>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl tracking-tight">Common questions about {cityName}</h2>
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4 open:bg-paper/60">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">{f.q}<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-lime transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {nearby.length ? (
          <section className="mt-12">
            <h2 className="font-display text-xl tracking-tight">Providers in nearby cities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {nearby.map((c) => (
                <Link key={c.city} href={`/state/${code.toLowerCase()}/${c.slug}`} className="rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] hover:border-ink">
                  {c.city} <span className="mono text-[10px] text-muted">{c.count}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

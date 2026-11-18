import Link from "next/link";
import type { Metadata } from "next";
import { FIRM_TYPE_LABELS, FIRM_TYPES, getIndex } from "@/lib/data";
import { BASE_URL, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap";
import { Breadcrumbs } from "@/components/Nav";

export const metadata: Metadata = { title: { absolute: "Site map" }, description: "Browse every virtual assistant provider, city, state and provider-type page in the directory.", alternates: { canonical: `${BASE_URL}/site-map` }, robots: { index: true, follow: true } };

export default function SiteMapPage() {
  const { firms, states, topCities } = getIndex();
  const chunks = Math.max(1, Math.ceil(firms.length / SITEMAP_CHUNK_SIZE));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Site map" }]} />
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Site map</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight">Everything in the directory</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">The directory currently covers {firms.length.toLocaleString()} providers across {topCities.length.toLocaleString()} cities and {states.length} states. Browse by state, provider type or XML sitemap.</p>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">By state</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((s) => (
            <Link key={s.code} href={`/state/${s.code.toLowerCase()}`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm hover:border-ink"><span className="font-medium">{s.name}</span><span className="mono text-[10px] text-muted">{s.count.toLocaleString()}</span></Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">By provider type</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {FIRM_TYPES.map((t) => (
            <Link key={t} href={`/type/${t}`} className="rounded-xl border border-line bg-card px-4 py-3 text-sm font-semibold hover:border-ink">{FIRM_TYPE_LABELS[t]}</Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">Popular cities</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {topCities.slice(0, 40).map((c) => (
            <Link key={`${c.state}-${c.slug}`} href={`/state/${c.state.toLowerCase()}/${c.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm hover:border-ink"><span className="truncate">{c.city}, {c.state}</span><span className="mono text-[10px] text-muted">{c.count}</span></Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">XML sitemaps</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a href="/sitemap.xml" className="rounded-full border border-line bg-card px-3.5 py-1.5 hover:border-ink">Sitemap index</a>
          <a href="/sitemap-states.xml" className="rounded-full border border-line bg-card px-3.5 py-1.5 hover:border-ink">States</a>
          <a href="/sitemap-cities.xml" className="rounded-full border border-line bg-card px-3.5 py-1.5 hover:border-ink">Cities</a>
          {Array.from({ length: chunks }, (_, i) => (
            <a key={i} href={`/sitemap-firms/${i + 1}`} className="rounded-full border border-line bg-card px-3.5 py-1.5 hover:border-ink">Providers {i + 1}</a>
          ))}
        </div>
      </section>
    </div>
  );
}

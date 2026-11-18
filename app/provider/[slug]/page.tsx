import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, Globe, MapPin, Phone, Star } from "lucide-react";
import { FIRM_TYPE_LABELS, firmTypes, getCity, getFirm, getIndex, stateName } from "@/lib/data";
import { getFirmContent } from "@/lib/content";
import { ProviderCard } from "@/components/ProviderCard";
import { Comparison } from "@/components/Comparison";
import { AdInline } from "@/components/Ads";

type Props = { params: Promise<{ slug: string }> };
const BASE = "https://virtualassistantdirectories.com";

function initials(name: string) {
  return name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

function tagHref(tag: string) {
  const t = tag.toLowerCase();
  if (/staff|recruit|placement/.test(t)) return "/type/staffing";
  if (/offshore|outsourc|bpo/.test(t)) return "/type/offshore";
  if (/executive|admin/.test(t)) return "/type/executive";
  if (/special|real estate|medical|legal|bookkeep|marketing|ecommerce/.test(t)) return "/type/specialist";
  return "/type/agency";
}

type ReviewBlock = { type: "h2"; text: string } | { type: "p"; text: string } | { type: "ul"; items: string[] };

function parseReview(markdown: string): ReviewBlock[] {
  const blocks: ReviewBlock[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushP = () => { if (para.length) { blocks.push({ type: "p", text: para.join(" ").trim() }); para = []; } };
  const flushL = () => { if (list.length) { blocks.push({ type: "ul", items: list }); list = []; } };
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { flushP(); flushL(); continue; }
    if (line.startsWith("## ")) { flushP(); flushL(); blocks.push({ type: "h2", text: line.slice(3).trim() }); continue; }
    if (/^[-*]\s+/.test(line)) { flushP(); list.push(line.replace(/^[-*]\s+/, "").trim()); continue; }
    flushL(); para.push(line);
  }
  flushP(); flushL();
  return blocks;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) return { title: "Provider not found" };
  const content = getFirmContent(firm);
  const canonical = `${BASE}/provider/${firm.slug}`;
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, siteName: "Virtual Assistant Directories", title: content.metaTitle, description: content.metaDescription, modifiedTime: content.generatedAt, tags: content.tags },
    twitter: { card: "summary", title: content.metaTitle, description: content.metaDescription },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
  };
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const firm = getFirm(slug);
  if (!firm) notFound();

  const content = getFirmContent(firm);
  const idx = getIndex();
  const cityFirms = getCity(firm.state, firm.citySlug);
  const siblings = [...cityFirms].filter((f) => f.slug !== firm.slug).sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 4);
  const types = firmTypes(firm);
  const canonical = `${BASE}/provider/${firm.slug}`;
  const nearby = (idx.citiesByState.get(firm.state) || []).filter((c) => c.city !== firm.city).slice(0, 8);
  const typeLabels = types.map((t) => FIRM_TYPE_LABELS[t]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": canonical, url: canonical, name: content.metaTitle, description: content.metaDescription, dateModified: content.generatedAt, isPartOf: { "@type": "WebSite", "@id": `${BASE}/#website` }, breadcrumb: { "@id": `${canonical}#breadcrumb` }, mainEntity: { "@id": `${canonical}#business` } },
      { "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: stateName(firm.state), item: `${BASE}/state/${firm.state.toLowerCase()}` },
        { "@type": "ListItem", position: 3, name: firm.city, item: `${BASE}/state/${firm.state.toLowerCase()}/${firm.citySlug}` },
        { "@type": "ListItem", position: 4, name: firm.name, item: canonical },
      ] },
      { "@type": "ProfessionalService", "@id": `${canonical}#business`, name: firm.name, telephone: firm.phone || undefined, url: firm.website || canonical, sameAs: firm.website || undefined,
        address: { "@type": "PostalAddress", streetAddress: firm.address ? firm.address.split(",")[0] : undefined, addressLocality: firm.city, addressRegion: firm.state, postalCode: firm.zip || undefined, addressCountry: "US" },
        areaServed: [{ "@type": "City", name: firm.city }, { "@type": "State", name: stateName(firm.state) }],
        knowsAbout: typeLabels,
        aggregateRating: firm.rating != null && firm.reviews ? { "@type": "AggregateRating", ratingValue: firm.rating, reviewCount: firm.reviews, bestRating: 5, worstRating: 1 } : undefined },
      { "@type": "FAQPage", "@id": `${canonical}#faq`, mainEntity: content.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-[12px] text-white/45">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span>
            <Link href={`/state/${firm.state.toLowerCase()}`} className="hover:text-white">{stateName(firm.state)}</Link><span>/</span>
            <Link href={`/state/${firm.state.toLowerCase()}/${firm.citySlug}`} className="hover:text-white">{firm.city}</Link><span>/</span>
            <span className="text-white">{firm.name}</span>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex min-w-0 items-start gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-lime font-display text-xl font-bold text-ink">{initials(firm.name)}</span>
              <div className="min-w-0">
                <h1 className="font-display text-3xl leading-none tracking-tight sm:text-5xl">{firm.name}</h1>
                <p className="mt-3 flex items-center gap-1.5 text-sm text-white/60"><MapPin className="h-4 w-4" aria-hidden />{firm.city}, {stateName(firm.state)}{firm.zip ? ` ${firm.zip}` : ""}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {types.map((t) => (
                    <Link key={t} href={`/type/${t}`} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80 hover:border-lime hover:text-lime">{FIRM_TYPE_LABELS[t]}</Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-right ring-1 ring-white/10">
              {firm.rating != null ? (
                <>
                  <p className="mono text-3xl font-bold text-lime">{firm.rating.toFixed(1)}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-white/60"><Star className="h-3 w-3 fill-lime text-lime" aria-hidden />{firm.reviews?.toLocaleString() || 0} public reviews</p>
                </>
              ) : (
                <p className="text-[12px] text-white/60">No public rating</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="rounded-2xl border border-line bg-card p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-violet"><BadgeCheck className="h-4 w-4" aria-hidden /> Provider brief</div>
              {content.brief.split(/\n\s*\n/).map((p, i) => <p key={i} className="mt-3 text-[15px] leading-7 text-ink/80">{p}</p>)}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {content.tags.map((tag) => (
                  <Link key={tag} href={tagHref(tag)} className="rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-medium text-muted hover:border-ink hover:text-ink">{tag}</Link>
                ))}
              </div>
            </div>

            <article className="mt-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5 font-semibold text-ink"><BadgeCheck className="h-4 w-4 text-violet" aria-hidden /> Editorial profile</span>
                <span className="text-line">·</span><span>Based on public listing data</span><span className="text-line">·</span><span>Updated {new Date(content.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="mt-6">
                {parseReview(content.review).map((block, i) =>
                  block.type === "h2" ? (
                    <h2 key={i} className="mt-9 font-display text-2xl tracking-tight first:mt-0">{block.text}</h2>
                  ) : block.type === "ul" ? (
                    <ul key={i} className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-7 text-ink/80">{block.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                  ) : (
                    <p key={i} className="mt-4 text-[15px] leading-7 text-ink/80">{block.text}</p>
                  )
                )}
              </div>
              <div className="mt-8 rounded-xl border border-line bg-paper px-5 py-4 text-[12px] leading-6 text-muted">
                This is an editorial summary based on public business listing data. It is not a customer review, a rating of service quality, or an endorsement. Scope, pricing and terms change; confirm them directly with the provider.
              </div>
            </article>

            <div className="mt-8"><AdInline placement="provider-inline" /></div>

            <Comparison firm={firm} cityFirms={cityFirms} />

            <section className="mt-14">
              <h2 className="font-display text-2xl tracking-tight">Questions to ask {firm.name}</h2>
              <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
                {content.faqs.map((f) => (
                  <details key={f.q} className="group px-5 py-4 open:bg-paper/60">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">{f.q}<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-lime transition group-open:rotate-45">+</span></summary>
                    <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {siblings.length ? (
              <section className="mt-14">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 className="font-display text-2xl tracking-tight">More providers in {firm.city}</h2>
                  <Link href={`/state/${firm.state.toLowerCase()}/${firm.citySlug}`} className="text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-violet">See all {cityFirms.length} →</Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {siblings.map((f) => <ProviderCard key={f.slug} firm={f} />)}
                </div>
              </section>
            ) : null}

            {nearby.length ? (
              <section className="mt-12">
                <h2 className="font-display text-xl tracking-tight">Providers in nearby cities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {nearby.map((c) => (
                    <Link key={c.city} href={`/state/${firm.state.toLowerCase()}/${c.slug}`} className="rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] hover:border-ink">{c.city} <span className="mono text-[10px] text-muted">{c.count}</span></Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border-2 border-ink bg-lime p-5 text-ink">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime-ink/70">Contact</p>
              <p className="mt-1 font-display text-xl leading-tight">{firm.name}</p>
              <div className="mt-4 space-y-2">
                {firm.phone ? <a href={`tel:${firm.phone.replace(/[^+\d]/g, "")}`} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-charcoal"><Phone className="h-4 w-4" aria-hidden />Call {firm.phone}</a> : null}
                {firm.website ? <a href={firm.website} target="_blank" rel="nofollow noopener" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink px-4 py-2.5 text-sm font-semibold hover:bg-ink hover:text-white"><Globe className="h-4 w-4" aria-hidden />Visit website</a> : null}
                {firm.lat != null && firm.lon != null ? <a href={`https://www.google.com/maps/search/?api=1&query=${firm.lat},${firm.lon}`} target="_blank" rel="nofollow noopener" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink px-4 py-2.5 text-sm font-semibold hover:bg-ink hover:text-white"><MapPin className="h-4 w-4" aria-hidden />Open in Maps</a> : null}
              </div>
              <p className="mt-4 text-[11px] leading-5 text-lime-ink/70">Listing data comes from public business profiles and may be out of date. Confirm scope, pricing and terms directly with the provider.</p>
              <Link href="/about" className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold underline decoration-2 underline-offset-2">Suggest a correction <ArrowUpRight className="h-3 w-3" aria-hidden /></Link>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">At a glance</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3"><dt className="text-muted">Provider type</dt><dd className="text-right font-semibold">{typeLabels.join(", ")}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-muted">Providers in {firm.city}</dt><dd className="mono font-semibold">{cityFirms.length.toLocaleString()}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-muted">Public reviews</dt><dd className="mono font-semibold">{firm.reviews?.toLocaleString() || "-"}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-muted">Website</dt><dd className="font-semibold">{firm.website ? "Listed" : "Not listed"}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

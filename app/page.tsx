import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, BadgeCheck, Briefcase, Building2, Check, Globe2, MapPin, Sparkles, Star, Users } from "lucide-react";
import { FIRM_TYPE_LABELS, getHighlights, getIndex } from "@/lib/data";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";
import { HomeContent } from "@/components/HomeContent";
import { AdBanner } from "@/components/Ads";

export const metadata: Metadata = {
  alternates: { canonical: "https://virtualassistantdirectories.com" },
  openGraph: {
    type: "website",
    url: "https://virtualassistantdirectories.com",
    siteName: "Virtual Assistant Directories",
    title: "Virtual Assistant Directories - Find a VA Agency or Assistant",
    description: "Find virtual assistant companies across the US: agencies, staffing firms, offshore teams and specialist assistants.",
  },
};

const faqs = [
  {
    q: "How many virtual assistant companies are in the United States?",
    a: "This directory currently lists ${firmCount} virtual assistant providers across ${stateCount} states and Washington, D.C., including VA agencies, staffing and placement firms, offshore teams, executive support providers and industry specialists.",
  },
  {
    q: "How much does a virtual assistant cost?",
    a: "Pricing depends on the model. Offshore and nearshore dedicated assistants commonly run $1,000-$3,500 per month full-time, while US-based assistants often run $3,500-$7,000. Managed agencies add recruiting, training and backup. Hourly and task-based help usually ranges from $10 to $60 per hour depending on the market and skill level.",
  },
  {
    q: "What is the difference between a VA agency and a staffing firm?",
    a: "A VA agency usually manages the assistant for you, including recruiting, training, backup and replacement. A staffing firm places a vetted assistant with your team, and you manage the day-to-day work. Agencies are more hands-off; staffing is better when you already have processes and a manager.",
  },
  {
    q: "Can a virtual assistant work in my time zone?",
    a: "Many offshore and nearshore providers offer full or partial overlap with US hours, and some run night shifts. Ask how many hours of live overlap are included, what happens outside those hours, and whether the assistant is expected to respond during your business day.",
  },
  {
    q: "What tasks can I delegate to a virtual assistant?",
    a: "Common work includes inbox and calendar management, scheduling, travel, data entry, CRM updates, research, customer support, order processing, invoicing support, social media scheduling and recurring reporting. The best first tasks are repetitive, well documented and easy to check.",
  },
  {
    q: "How do I choose a virtual assistant provider?",
    a: "Start with the tasks, hours and time zone you need, then compare the engagement model, vetting, training, tools, replacement policy, security controls and total monthly cost. Ask for references in a similar role and run a small paid trial before committing to a long term.",
  },
  {
    q: "Is this directory free to use?",
    a: "Yes. Listings are free to browse and providers do not pay to appear in search results or city listings. Data comes from public business profiles and is refreshed periodically; providers can request corrections or claim their listing. The top-rated page has one clearly labeled sponsored featured partner, kept separate from the independent ranking.",
  },
  {
    q: "Are the reviews on this site customer reviews?",
    a: "No. The long provider profiles are editorial summaries based on public business listing data. The star rating and review count come from the underlying public business profile. They are not our own customer reviews or paid endorsements.",
  },
  {
    q: "How are providers ranked?",
    a: "Search and city pages default to public review volume so established providers surface first. You can re-sort by rating or name and filter by provider type, website availability and minimum rating. The top-rated page uses a rating and review threshold so a handful of reviews cannot dominate the list.",
  },
];

const TYPES = [
  { key: "agency", icon: Building2, blurb: "Managed assistants and teams", label: FIRM_TYPE_LABELS.agency },
  { key: "staffing", icon: Users, blurb: "Vetted placements you manage", label: FIRM_TYPE_LABELS.staffing },
  { key: "offshore", icon: Globe2, blurb: "Offshore and nearshore teams", label: FIRM_TYPE_LABELS.offshore },
  { key: "executive", icon: Briefcase, blurb: "High-trust executive support", label: FIRM_TYPE_LABELS.executive },
  { key: "specialist", icon: Sparkles, blurb: "Role- and industry-specific VAs", label: FIRM_TYPE_LABELS.specialist },
];

export default function HomePage() {
  const { firms, states, topCities } = getIndex();
  const { typeCounts, topRated, avgRating, ratedCount, reviewTotal } = getHighlights();
  const withSite = firms.filter((f) => f.website).length;
  const FAQS = faqs.map((f) => ({ ...f, a: f.a.replace("${firmCount}", firms.length.toLocaleString()).replace("${stateCount}", String(states.length)) }));

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div aria-hidden className="dot-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-3 py-1 text-[12px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-violet" aria-hidden />
              United States · Updated November 2026
            </div>
            <h1 className="mt-5 font-display text-[2.7rem] leading-[1.02] sm:text-[4rem]">
              Find the virtual assistant team that{" "}
              <span className="relative inline-block">
                <span className="relative z-10">fits how you work.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-lime sm:h-6" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-7 text-muted">
              {firms.length.toLocaleString()} VA agencies, staffing firms, offshore teams and specialist assistants across {states.length} states. Ratings, reviews, phone numbers, websites and pricing signals. Free to browse.
            </p>
            <div className="mt-7 max-w-xl">
              <SearchBar />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted">
              <span className="font-semibold text-ink">Popular:</span>
              {topCities.slice(0, 6).map((c, i) => (
                <span key={`${c.state}-${c.city}`} className="flex items-center gap-1">
                  {i > 0 ? <span className="text-line">·</span> : null}
                  <Link href={`/state/${c.state.toLowerCase()}/${c.slug}`} className="rounded px-0.5 hover:text-violet hover:underline">{c.city}</Link>
                </span>
              ))}
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-muted">
              {["Free to use", "No signup", `${states.length} states`].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-ink" aria-hidden />{t}</li>
              ))}
              <li className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-ink text-ink" aria-hidden />
                <span><strong className="text-ink">{avgRating.toFixed(1)}</strong> average across {ratedCount.toLocaleString()} rated providers</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-charcoal text-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between px-5 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">Coverage snapshot</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[10px] text-white/70">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" aria-hidden /> live dataset
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/us-firms-map.svg" alt="Map of the United States showing where virtual assistant providers are concentrated" width={1000} height={620} className="mt-4 h-auto w-full opacity-90" />
              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
                <div className="px-4 py-4">
                  <p className="mono text-2xl font-bold text-lime">{firms.length.toLocaleString()}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/50">Providers</p>
                </div>
                <div className="px-4 py-4">
                  <p className="mono text-2xl font-bold text-white">{topCities.length.toLocaleString()}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/50">Cities</p>
                </div>
                <div className="px-4 py-4">
                  <p className="mono text-2xl font-bold text-white">{withSite.toLocaleString()}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/50">With website</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Browse the market</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">Pick your provider type</h2>
          </div>
          <Link href="/directory" className="inline-flex items-center gap-1 text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-violet">Full directory <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TYPES.map((t, i) => {
            const Icon = t.icon;
            return (
              <Link key={t.key} href={`/type/${t.key}`} className="group relative overflow-hidden rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:border-ink">
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-lime"><Icon className="h-4.5 w-4.5" aria-hidden /></span>
                  <span className="mono text-[11px] font-bold text-muted">0{i + 1}</span>
                </div>
                <p className="mt-4 text-[14px] font-bold leading-tight">{t.label}</p>
                <p className="mt-1 text-[12px] leading-5 text-muted">{t.blurb}</p>
                <p className="mono mt-3 text-[11px] font-bold text-violet">{(typeCounts[t.key] || 0).toLocaleString()} listed</p>
                <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-muted transition group-hover:text-ink" aria-hidden />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-charcoal text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-10 sm:grid-cols-4 sm:gap-8 sm:py-12">
          {[
            { n: firms.length, l: "Providers listed" },
            { n: topCities.length, l: "Cities and towns" },
            { n: reviewTotal, l: "Public reviews" },
            { n: states.length, l: "States + DC" },
          ].map((s) => (
            <div key={s.l}>
              <p className="mono text-3xl font-bold text-lime sm:text-4xl">{s.n.toLocaleString()}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Highest rated</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">Providers buyers keep coming back to</h2>
            <p className="mt-2 text-sm text-muted">4.6★ or better, 20+ public reviews, one per provider type.</p>
          </div>
          <Link href="/top-rated" className="inline-flex items-center gap-1 text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-violet">See the ranking <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topRated.map((f, i) => <ProviderCard key={f.slug} firm={f} rank={i + 1} />)}
        </div>
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Popular markets</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">Start with your city</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Providers cluster in major metros, but remote engagements mean you can hire outside your city too. Start local, then widen the search.</p>
            <Link href="/directory" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-violet">All states <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {topCities.slice(0, 16).map((c) => (
              <Link key={`${c.state}-${c.city}`} href={`/state/${c.state.toLowerCase()}/${c.slug}`} className="group flex items-center justify-between gap-3 border-b border-line py-2.5 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                  <span className="truncate font-medium group-hover:text-violet">{c.city}, {c.state}</span>
                </span>
                <span className="mono shrink-0 text-[11px] text-muted">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdBanner placement="home-mid" />

      <HomeContent />

      <section className="border-t border-line bg-card">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">FAQ</p>
          <h2 className="mt-1 font-display text-3xl tracking-tight">Questions buyers ask first</h2>
          <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper/40">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-5 py-4 open:bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-lime transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-white sm:px-10">
          <div aria-hidden className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-lime/20 blur-2xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-lime"><BadgeCheck className="h-3.5 w-3.5" aria-hidden /> For providers</div>
              <h2 className="mt-2 font-display text-3xl tracking-tight">Own or run a VA company?</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">Claim your listing to correct details, update your website and phone number, or have the listing removed. It is free.</p>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:bg-lime-soft">Claim a listing <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

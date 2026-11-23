import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { companiesByNiche, getCompanies } from "@/lib/companies";
import { CompanyCard } from "@/components/CompanyCard";
import { Breadcrumbs } from "@/components/Nav";
import { AdInline } from "@/components/Ads";

const BASE = "https://virtualassistantdirectories.com";

export const metadata: Metadata = {
  title: { absolute: "VA Companies Directory - Virtual Assistant Brands & Specialists" },
  description:
    "Browse virtual assistant companies and specialist VA brands by industry: executive support, medical, legal, real estate, finance, offshore teams and staffing. Each listing includes an editorial review and a direct link.",
  alternates: { canonical: `${BASE}/companies` },
  openGraph: {
    type: "website",
    url: `${BASE}/companies`,
    siteName: "Virtual Assistant Directories",
    title: "VA Companies Directory - Virtual Assistant Brands & Specialists",
    description: "Browse virtual assistant companies and specialist VA brands by industry, with an editorial review and a direct link for each.",
  },
};

export default function CompaniesPage() {
  const groups = companiesByNiche();
  const all = getCompanies();

  return (
    <div>
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "VA companies" }]} />
          <p className="mono text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Company directory</p>
          <h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-5xl">Virtual assistant companies by specialty</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            {all.length} virtual assistant companies and specialist brands, grouped by the work they focus on. Each listing has a short editorial
            review and a direct link to the company. These are brand and specialist sites, not the public business listings on the rest of the directory.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {groups.map((g) => (
              <a key={g.niche} href={`#${g.niche}`} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white/80 transition hover:bg-white/20 hover:text-white">
                {g.label} <span className="text-white/40">{g.companies.length}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-card p-4">
            <Building2 className="h-5 w-5 text-violet" aria-hidden />
            <p className="mt-2 font-display text-2xl tracking-tight">{all.length}</p>
            <p className="text-[12px] text-muted">VA companies & brands</p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4">
            <ShieldCheck className="h-5 w-5 text-violet" aria-hidden />
            <p className="mt-2 font-display text-2xl tracking-tight">{groups.length}</p>
            <p className="text-[12px] text-muted">Specialty categories</p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4">
            <ArrowRight className="h-5 w-5 text-violet" aria-hidden />
            <p className="mt-2 font-display text-2xl tracking-tight">1 click</p>
            <p className="text-[12px] text-muted">Straight to each company</p>
          </div>
        </div>

        <p className="mb-8 max-w-3xl text-[14px] leading-7 text-muted">
          Looking for a local provider instead? Browse the <Link href="/directory" className="font-semibold text-violet underline">state-by-state directory</Link> of
          public business listings. The companies below are specialist virtual assistant brands organized by industry.
        </p>

        {groups.map((g, gi) => (
          <section key={g.niche} id={g.niche} className="mb-12 scroll-mt-24">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-3">
              <div>
                <h2 className="font-display text-2xl tracking-tight">{g.label}</h2>
                <p className="text-[12px] text-muted">{g.companies.length} companies</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.companies.map((c, i) => (
                <CompanyCard key={c.slug} company={c} index={i + gi} />
              ))}
            </div>
            {gi === 1 ? <div className="mt-8"><AdInline placement="companies-mid" /></div> : null}
          </section>
        ))}
      </div>
    </div>
  );
}

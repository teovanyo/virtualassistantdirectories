import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FIRM_TYPES, FIRM_TYPE_LABELS, firmsByType, typeStateCounts, type FirmType } from "@/lib/data";
import { Pagination } from "@/components/Nav";
import { ProviderCard } from "@/components/ProviderCard";
import { AdBand, AdInline } from "@/components/Ads";

type Props = { params: Promise<{ type: string }>; searchParams: Promise<{ page?: string }> };

const COPY: Record<FirmType, { title: string; intro: string; short: string; what: string; pricing: string; questions: string }> = {
  agency: {
    title: "Virtual assistant agencies",
    intro: "Managed VA agencies recruit, train and support assistants for you, often with backup coverage and an account manager.",
    short: "Managed assistants with recruiting, training and backup included.",
    what: "A managed agency usually assigns a dedicated assistant or a small team for inbox, calendar, travel, data entry, CRM, research, customer support and recurring admin. The agency handles recruiting, onboarding, training, supervision and replacement, and many provide a team lead as the engagement grows.",
    pricing: "Pricing is often a monthly retainer based on hours or full-time equivalence, with management, software and setup sometimes bundled. Offshore and nearshore agencies sit lower than US-based ones. Ask what is included for backup, management and replacement.",
    questions: "Ask whether the assistant is dedicated, how many hours are included, what time-zone overlap is guaranteed, how training and supervision work, what the replacement policy is, and what happens during holidays or illness. Confirm NDAs, background checks, device policy and data access.",
  },
  staffing: {
    title: "VA staffing and placement firms",
    intro: "Staffing and placement firms recruit and vet virtual assistants for your team, then you manage the work day to day.",
    short: "Vetted placements that your team manages directly.",
    what: "A staffing firm sources candidates, screens them, checks references and handles contracts or payroll, then places the assistant with your team. You own the onboarding, task management and performance feedback. Some firms specialize in executive, sales, medical or industry roles.",
    pricing: "Pricing can be a placement fee, a markup on the assistant's rate, or a monthly service fee. Ask what happens if the placement does not work out, how replacements are handled, who employs the assistant and what the minimum commitment is.",
    questions: "Ask how candidates are sourced and vetted, how long a typical search takes, what the replacement guarantee is, who handles payroll and compliance, and how much say you get in the final choice. Ask for references from clients with a similar role.",
  },
  offshore: {
    title: "Offshore and nearshore VA teams",
    intro: "Offshore providers build remote teams in lower-cost markets, from a single dedicated assistant to a supervised team.",
    short: "Dedicated remote teams with lower rates and shift coverage.",
    what: "Offshore and nearshore providers supply assistants or teams for admin, support, data processing, bookkeeping, marketing and sales. Engagements can include a team lead, documented processes, equipment and coverage across US hours. Quality depends heavily on recruiting, training and supervision.",
    pricing: "Offshore dedicated assistants commonly run $1,000-$3,500 per month full-time, depending on the country, experience and management layer. Confirm whether equipment, connectivity, software, supervision and holiday coverage are included.",
    questions: "Ask about English proficiency, live overlap hours, connectivity and backup power, equipment, supervision, background checks, data security, turnover and replacement. Ask for video introductions and a paid trial before committing.",
  },
  executive: {
    title: "Executive assistant services",
    intro: "Executive support providers place high-trust assistants for calendar, inbox, travel, meeting prep and personal admin.",
    short: "High-trust support for founders, executives and family offices.",
    what: "Executive assistants work across the principal's calendar, inbox, travel, board materials, meeting follow-ups and personal tasks. The best operate with discretion and anticipation, coordinate with other staff and protect the principal's time. Vetting and onboarding are usually more rigorous than general admin.",
    pricing: "Executive support usually costs more than general admin. US-based executive assistants commonly run $3,500-$8,000 per month; offshore or hybrid options can be lower. Confirm hours, on-call expectations, travel support, expense handling and confidentiality terms.",
    questions: "Ask about the vetting process, prior executives supported, discretion and NDA terms, availability outside hours, how travel and personal tasks are handled, and who covers during absence. Ask for a scenario-based trial task, not only a resume.",
  },
  specialist: {
    title: "Specialist virtual assistants",
    intro: "Specialist VAs bring domain experience in real estate, medical, legal, ecommerce, bookkeeping, marketing, recruiting and more.",
    short: "Role- and industry-specific assistants who know your workflow.",
    what: "Specialist assistants combine general admin with a specific function: transaction coordination, patient scheduling, legal intake, Amazon or Shopify operations, bookkeeping, social media, recruiting or sales development. The provider should be able to show work in your actual tools and workflow, not just your industry.",
    pricing: "Pricing varies by specialty and experience. Specialized offshore assistants often run $1,200-$4,000 per month; US-based specialists and licensed-adjacent roles cost more. Confirm software access, compliance requirements and who covers the role during absence.",
    questions: "Ask for examples in your exact workflow and tools, how the assistant is trained, what compliance or licensing limits apply, who supervises quality, and how replacement works if the specialist leaves. Test with a real task before expanding scope.",
  },
};

export function generateStaticParams() {
  return FIRM_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!FIRM_TYPES.includes(type as FirmType)) return { title: "Not found" };
  const copy = COPY[type as FirmType];
  const count = firmsByType(type as FirmType).length;
  const states = typeStateCounts(type as FirmType).length;
  const canonical = `https://virtualassistantdirectories.com/type/${type}`;
  return {
    title: { absolute: `${copy.title} in the US (${new Date().getFullYear()})` },
    description: `Compare ${count.toLocaleString()} ${copy.title.toLowerCase()} across ${states} states. ${copy.short}`,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, siteName: "Virtual Assistant Directories", title: copy.title, description: copy.short },
  };
}

export default async function TypePage({ params, searchParams }: Props) {
  const { type } = await params;
  const { page } = await searchParams;
  if (!FIRM_TYPES.includes(type as FirmType)) notFound();
  const t = type as FirmType;
  const copy = COPY[t];
  const firms = [...firmsByType(t)].sort((a, b) => (b.reviews || 0) - (a.reviews || 0) || a.name.localeCompare(b.name));
  const states = typeStateCounts(t);
  const perPage = 20;
  const current = Math.max(1, Number(page) || 1);
  const slice = firms.slice((current - 1) * perPage, current * perPage);
  const pages = Math.ceil(firms.length / perPage);

  return (
    <div>
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-4 py-9">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-[12px] text-white/45">
            <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">{FIRM_TYPE_LABELS[t]}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="mono text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Provider type</p>
              <h1 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-5xl">{copy.title}</h1>
              <p className="mt-3 text-sm leading-6 text-white/60">{copy.intro}</p>
            </div>
            <div className="flex gap-6">
              <div><p className="mono text-2xl font-bold text-lime">{firms.length.toLocaleString()}</p><p className="text-[10px] uppercase tracking-wide text-white/45">Providers</p></div>
              <div><p className="mono text-2xl font-bold text-white">{states.length}</p><p className="text-[10px] uppercase tracking-wide text-white/45">States</p></div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl tracking-tight">What to know about {copy.title.toLowerCase()}</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            <div><h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet">What the work includes</h3><p className="mt-2 text-[13.5px] leading-6 text-muted">{copy.what}</p></div>
            <div><h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet">How pricing works</h3><p className="mt-2 text-[13.5px] leading-6 text-muted">{copy.pricing}</p></div>
            <div><h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet">What to ask</h3><p className="mt-2 text-[13.5px] leading-6 text-muted">{copy.questions}</p></div>
          </div>
        </section>

        <div className="my-6"><AdInline placement="type-top" /></div>

        <div className="flex flex-wrap gap-1.5">
          {states.slice(0, 12).map((s) => (
            <Link key={s.state} href={`/state/${s.state.toLowerCase()}`} className="rounded-full border border-line bg-card px-3 py-1.5 text-[12px] hover:border-ink">{s.name} <span className="mono text-[10px] text-muted">{s.count.toLocaleString()}</span></Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((f) => <ProviderCard key={f.slug} firm={f} />)}
        </div>

        <Pagination page={current} pages={pages} makeHref={(p) => `/type/${t}${p === 1 ? "" : `?page=${p}`}`} />
      </div>

      <AdBand placement="type-bottom" tone="light" image="team" headline="A dedicated assistant, not another job post." cta="See Stealth Agents" />
    </div>
  );
}

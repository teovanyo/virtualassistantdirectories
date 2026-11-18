import { ArrowUpRight, Check } from "lucide-react";

const BASE = "https://stealthagents.com/virtual-assistant";

export function adHref(placement: string) {
  const u = new URL(BASE);
  u.searchParams.set("utm_source", "virtualassistantdirectories");
  u.searchParams.set("utm_medium", "display");
  u.searchParams.set("utm_campaign", "virtual-assistant");
  u.searchParams.set("utm_content", placement);
  return u.toString();
}

const BULLETS = ["Inbox & calendar", "CRM updates", "Customer support", "Research & data"];

export function AdBanner({ placement = "sitewide" }: { placement?: string }) {
  return (
    <section className="bg-paper px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <a
          href={adHref(placement)}
          target="_blank"
          rel="sponsored noopener"
          className="group grid overflow-hidden rounded-3xl bg-charcoal text-white transition hover:opacity-95 md:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="p-7 sm:p-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden /> Sponsored by Stealth Agents
            </span>
            <p className="mt-4 font-display text-3xl leading-[1.05] tracking-tight sm:text-4xl">
              Hire a dedicated VA.<br /><span className="text-lime">Not another job post.</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
              Vetted virtual assistants for admin, support, research and sales. Clear English, USA hours, 48-hour placement, no long-term contracts.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink transition group-hover:bg-lime-soft">
              See how it works <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <div className="relative hidden items-center justify-center bg-lime/5 md:flex">
            <div className="dot-grid absolute inset-0 opacity-30" />
            <ul className="relative grid gap-2 p-8">
              {BULLETS.map((b) => (
                <li key={b} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white/80">
                  <Check className="h-4 w-4 text-lime" aria-hidden /> {b}
                </li>
              ))}
            </ul>
          </div>
        </a>
      </div>
    </section>
  );
}

export function AdInline({ placement, className = "" }: { placement: string; className?: string }) {
  return (
    <a
      href={adHref(placement)}
      target="_blank"
      rel="sponsored noopener"
      className={`group flex flex-col gap-3 rounded-2xl border-2 border-ink bg-lime p-5 text-ink transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime-ink/70">Sponsored · Stealth Agents</p>
        <p className="mt-1 font-display text-xl leading-tight tracking-tight">Your next assistant is already vetted.</p>
        <p className="mt-1 text-[13px] leading-5 text-lime-ink/80">Dedicated VAs placed in 48 hours. USA hours, no contracts.</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-charcoal">
        See VAs <ArrowUpRight className="h-4 w-4" aria-hidden />
      </span>
    </a>
  );
}

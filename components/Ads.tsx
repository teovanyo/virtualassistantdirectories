import { ArrowUpRight, Check } from "lucide-react";

const BASE = "https://stealthagents.com/";

export const AD_IMAGES = {
  hero: "/ads/stealthagents-va-hero.jpg",
  team: "/ads/stealthagents-va-team.jpg",
  desk: "/ads/stealthagents-va-desk.jpg",
  flatlay: "/ads/stealthagents-va-flatlay.jpg",
} as const;

export type AdImage = keyof typeof AD_IMAGES;

export function adHref(placement: string) {
  const u = new URL(BASE);
  u.searchParams.set("utm_source", "virtualassistantdirectories");
  u.searchParams.set("utm_medium", "display");
  u.searchParams.set("utm_campaign", "virtual-assistant");
  u.searchParams.set("utm_content", placement);
  return u.toString();
}

const BULLETS = ["Inbox & calendar", "CRM updates", "Customer support", "Research & data"];

const DEFAULTS = {
  band: {
    headline: "Your next assistant is already vetted.",
    body: "Stealth Agents matches you with a dedicated virtual assistant for admin, support, research and sales. Clear English, USA hours, 48-hour placement, no long-term contracts.",
    cta: "See Stealth Agents",
  },
  card: {
    headline: "Hire a VA in 48 hours.",
    body: "Dedicated, vetted assistants for admin, support and sales. USA hours, no long-term contracts.",
    cta: "See the service",
  },
  strip: {
    headline: "Your inbox shouldn't own your week.",
    body: "Offload admin, customer support and follow-ups to a dedicated Stealth Agents virtual assistant.",
    cta: "See VAs",
  },
};

type Props = {
  placement: string;
  tone?: "dark" | "light";
  image?: AdImage;
  headline?: string;
  body?: string;
  cta?: string;
  className?: string;
  eager?: boolean;
};

function Eyebrow({ tone }: { tone: "dark" | "light" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${tone === "dark" ? "text-lime" : "text-violet"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden /> Sponsored by Stealth Agents
    </span>
  );
}

export function AdBand({
  placement,
  tone = "dark",
  image = "hero",
  headline,
  body,
  cta,
  className = "",
  eager = false,
}: Props) {
  const dark = tone === "dark";
  const copy = DEFAULTS.band;
  return (
    <section className={`mx-auto max-w-6xl px-4 py-8 ${className}`}>
      <a
        href={adHref(placement)}
        target="_blank"
        rel="sponsored noopener"
        className={`group grid overflow-hidden rounded-3xl border transition hover:opacity-95 md:grid-cols-[1.08fr_0.92fr] ${
          dark ? "border-ink bg-charcoal text-white" : "border-line bg-card text-ink"
        }`}
      >
        <div className="order-2 p-6 sm:p-8 md:order-1 md:p-10">
          <Eyebrow tone={dark ? "dark" : "light"} />
          <p className="mt-3 font-display text-3xl leading-[1.02] tracking-tight sm:text-4xl">
            {headline ?? copy.headline}
          </p>
          <p className={`mt-3 max-w-lg text-sm leading-6 ${dark ? "text-white/60" : "text-muted"}`}>{body ?? copy.body}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {BULLETS.map((b) => (
              <li key={b} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${dark ? "border-white/15 bg-white/5 text-white/75" : "border-line bg-paper text-muted"}`}>
                <Check className={`h-3 w-3 ${dark ? "text-lime" : "text-violet"}`} aria-hidden /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold ${dark ? "bg-lime text-ink group-hover:bg-lime-soft" : "bg-ink text-white group-hover:bg-charcoal"}`}>
              {cta ?? copy.cta} <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
            <span className={`text-[11px] ${dark ? "text-white/40" : "text-muted"}`}>48-hour placement · USA hours · No long-term contracts</span>
          </div>
        </div>
        <div className="relative order-1 min-h-[180px] overflow-hidden md:order-2 md:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AD_IMAGES[image]}
            alt="A virtual assistant working at a desk"
            loading={eager ? "eager" : "lazy"}
            width={1600}
            height={900}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div aria-hidden className={`absolute inset-0 bg-gradient-to-r ${dark ? "from-charcoal/80 via-charcoal/10 to-transparent" : "from-card/70 via-card/10 to-transparent"}`} />
          <span className="absolute right-3 top-3 rounded bg-charcoal/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">Ad</span>
        </div>
      </a>
    </section>
  );
}

export function AdStrip({
  placement,
  tone = "light",
  image = "flatlay",
  headline,
  body,
  cta,
  className = "",
}: Props) {
  const dark = tone === "dark";
  const copy = DEFAULTS.strip;
  return (
    <a
      href={adHref(placement)}
      target="_blank"
      rel="sponsored noopener"
      className={`group flex flex-col gap-4 rounded-2xl border p-4 transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
        dark ? "border-ink bg-charcoal text-white" : "border-2 border-ink bg-lime text-ink"
      } ${className}`}
    >
      <div className="flex min-w-0 items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AD_IMAGES[image]} alt="" loading="lazy" width={160} height={160} className="hidden h-16 w-16 shrink-0 rounded-xl object-cover sm:block" />
        <div className="min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? "text-lime" : "text-lime-ink/70"}`}>Sponsored · Stealth Agents</p>
          <p className={`mt-1 font-display text-xl leading-tight tracking-tight ${dark ? "text-white" : "text-ink"}`}>{headline ?? copy.headline}</p>
          <p className={`mt-1 text-[12.5px] leading-5 ${dark ? "text-white/55" : "text-lime-ink/80"}`}>{body ?? copy.body}</p>
        </div>
      </div>
      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold ${dark ? "bg-lime text-ink" : "bg-ink text-white"}`}>
        {cta ?? copy.cta} <ArrowUpRight className="h-4 w-4" aria-hidden />
      </span>
    </a>
  );
}

export function AdInline({ placement, image = "flatlay", className = "" }: { placement: string; image?: AdImage; className?: string }) {
  return <AdStrip placement={placement} image={image} className={className} />;
}

export function AdCard({ placement, image = "desk", className = "" }: { placement: string; image?: AdImage; className?: string }) {
  const copy = DEFAULTS.card;
  return (
    <a
      href={adHref(placement)}
      target="_blank"
      rel="sponsored noopener"
      className={`group block overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-0.5 hover:border-ink ${className}`}
    >
      <div className="relative h-36 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AD_IMAGES[image]} alt="A virtual assistant at work" loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 rounded bg-charcoal/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">Ad</span>
      </div>
      <div className="p-4">
        <Eyebrow tone="light" />
        <p className="mt-2 font-display text-lg leading-tight tracking-tight">{copy.headline}</p>
        <p className="mt-1 text-[12px] leading-5 text-muted">{copy.body}</p>
        <span className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[13px] font-bold text-white group-hover:bg-charcoal">
          {copy.cta} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </a>
  );
}

export function AdBanner({ placement = "sitewide", image = "team" }: { placement?: string; image?: AdImage }) {
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
            <Eyebrow tone="dark" />
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
          <div className="relative hidden min-h-[220px] md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AD_IMAGES[image]} alt="Stealth Agents virtual assistants" loading="lazy" width={1600} height={900} className="h-full w-full object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/40 to-transparent" />
          </div>
        </a>
      </div>
    </section>
  );
}

import { ArrowUpRight, BadgeCheck, Check, ShieldCheck, Star, Timer, UserRoundCheck } from "lucide-react";

const BASE = "https://stealthagents.com/virtual-assistant";
function href(placement: string) {
  const u = new URL(BASE);
  u.searchParams.set("utm_source", "virtualassistantdirectories");
  u.searchParams.set("utm_medium", "display");
  u.searchParams.set("utm_campaign", "virtual-assistant");
  u.searchParams.set("utm_content", placement);
  return u.toString();
}
const callHref = "https://stealthagents.com/contact-us?utm_source=virtualassistantdirectories&utm_medium=display&utm_campaign=virtual-assistant&utm_content=top-rated-featured-call";

const QUALITY = [
  {
    icon: UserRoundCheck,
    title: "Top 1% vetting",
    body: "14,755 applicants reviewed and only 0.89% hired. Every agent passes skills testing, background checks and a live communication and English fluency evaluation before placement.",
  },
  {
    icon: Timer,
    title: "48-hour placement, USA hours",
    body: "Matched, interviewed and onboarded within 48 hours. Agents work during US business hours, so collaboration happens in real time, not overnight.",
  },
  {
    icon: BadgeCheck,
    title: "Dedicated Campaign Manager",
    body: "Every client gets a manager for onboarding, tool setup, quality assurance and ongoing performance reviews at no extra cost.",
  },
  {
    icon: ShieldCheck,
    title: "Free replacement guarantee",
    body: "If the fit is wrong for any reason, Stealth Agents replaces the assistant immediately at zero cost. No long-term contracts and no replacement fees.",
  },
];

const SCORES = [
  { source: "Google", score: "4.7", reviews: 83 },
  { source: "Trustpilot", score: "4.8", reviews: 80 },
  { source: "Facebook", score: "4.9", reviews: 51 },
  { source: "BBB", score: "5.0", reviews: 28 },
];

export function FeaturedProvider() {
  return (
    <section aria-labelledby="featured-partner" className="mb-8">
      <div className="overflow-hidden rounded-3xl bg-charcoal text-white ring-1 ring-ink/20">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                <Star className="h-3 w-3 fill-ink" aria-hidden /> Top pick
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                Sponsored · Featured partner
              </span>
            </div>

            <h2 id="featured-partner" className="mt-4 font-display text-4xl leading-none tracking-tight sm:text-5xl">
              Stealth Agents
            </h2>
            <p className="mt-2 text-sm font-semibold text-lime">Managed virtual assistants, vetted to the top 1%</p>
            <p className="mt-4 max-w-xl text-[14px] leading-6 text-white/65">
              Stealth Agents has placed virtual assistants with more than 2,000 businesses since 2017. The model is built for quality control: a narrow hiring bar, a dedicated manager on every account and a replacement guarantee that removes the risk of a bad match.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[12px] font-semibold ring-1 ring-white/10">
                <Star className="h-3.5 w-3.5 fill-lime text-lime" aria-hidden /> 4.8 average across 242 public reviews
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-white/55">
                <Check className="h-3.5 w-3.5 text-lime" aria-hidden /> USA timezone · No long-term contracts
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:grid-cols-4">
              {[
                { n: "14,755", l: "Applicants reviewed" },
                { n: "0.89%", l: "Hire rate" },
                { n: "2,000+", l: "Businesses served" },
                { n: "48h", l: "Placement" },
              ].map((x) => (
                <div key={x.l}>
                  <p className="mono text-xl font-bold text-lime">{x.n}</p>
                  <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.12em] text-white/40">{x.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={href("top-rated-featured")} target="_blank" rel="sponsored noopener" className="inline-flex items-center gap-1.5 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:bg-lime-soft">
                See Stealth Agents <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <a href={callHref} target="_blank" rel="sponsored noopener" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-lime hover:text-lime">
                Book a free 30-min call
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime">Why the quality holds up</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {QUALITY.map((q) => {
                const Icon = q.icon;
                return (
                  <div key={q.title} className="rounded-xl border border-white/10 bg-charcoal/60 p-3.5">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-lime" aria-hidden />
                      <p className="text-[12.5px] font-bold leading-tight">{q.title}</p>
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-5 text-white/55">{q.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
              {SCORES.map((s) => (
                <div key={s.source}>
                  <p className="mono text-[13px] font-bold text-lime">{s.score}★</p>
                  <p className="text-[9.5px] uppercase tracking-wide text-white/40">{s.source}</p>
                  <p className="mono text-[9px] text-white/30">{s.reviews} reviews</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-3 sm:px-8 lg:px-10">
          <p className="text-[10.5px] leading-5 text-white/40">
            Sponsored featured placement. It is kept separate from the independent ranking below and does not change any other provider&rsquo;s position. Ratings shown are Stealth Agents&rsquo; public ratings on Google, Trustpilot, Facebook and BBB at the time of publication.
          </p>
        </div>
      </div>
    </section>
  );
}

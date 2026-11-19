import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { FIRM_TYPE_LABELS, getHighlights, getIndex } from "@/lib/data";
import { AdInline } from "@/components/Ads";

const TASKS = [
  { t: "Inbox triage", d: "Sort, label, draft replies and flag what needs you." },
  { t: "Calendar & scheduling", d: "Meetings, reminders, time zones and conflicts." },
  { t: "Travel", d: "Flights, hotels, itineraries and changes." },
  { t: "CRM hygiene", d: "Updates, notes, pipelines and follow-up queues." },
  { t: "Research", d: "Lists, vendor comparisons, briefs and summaries." },
  { t: "Customer support", d: "Tickets, chat, order issues and refunds." },
  { t: "Data & reporting", d: "Spreadsheets, dashboards and recurring reports." },
  { t: "Content ops", d: "Scheduling, repurposing, uploads and assets." },
];

const MODELS = [
  { m: "VA agency", best: "You want a managed assistant with backup", who: "Agency finds, trains and covers the role", you: "Set priorities and review output", cost: "$$$" },
  { m: "Staffing / placement", best: "You have processes and a manager", who: "Firm recruits and vets candidates", you: "Manage the assistant day to day", cost: "$$" },
  { m: "Offshore team", best: "Repeatable volume and budget matter", who: "Provider supplies people and supervision", you: "Document the work and review quality", cost: "$" },
  { m: "Independent VA", best: "Small, flexible scope", who: "One person, often part-time", you: "Hire, train and cover gaps yourself", cost: "$-$$" },
];

const PRICES = [
  { item: "Offshore dedicated VA, full-time", range: "$1,000-$3,500 / month", note: "Often 40 hrs/week; confirm overlap hours, equipment and supervision." },
  { item: "US-based dedicated VA, full-time", range: "$3,500-$7,000 / month", note: "Cost varies by city, experience and whether the provider handles payroll and benefits." },
  { item: "Managed agency retainer", range: "$1,500-$6,000 / month", note: "Includes recruiting, training, backup and account management; scope varies." },
  { item: "Part-time VA", range: "$500-$2,500 / month", note: "Commonly 10-20 hrs/week. Confirm the minimum block and how unused hours are treated." },
  { item: "Hourly or task-based", range: "$10-$60+ / hour", note: "Offshore rates sit at the low end; specialized or US-based support at the high end." },
  { item: "Executive support", range: "$2,500-$8,000 / month", note: "Higher vetting and discretion; often includes personal and business admin." },
  { item: "Setup and onboarding", range: "$0-$1,500", note: "Covers intake, tool access, training and a trial period. Some providers waive it." },
];

const STEPS = [
  { t: "List the work before you shop", d: "Write down the tasks, volume, tools and hours you need. Separate recurring work from one-off projects. A clear task list gets better candidates and more accurate pricing." },
  { t: "Choose the engagement model", d: "Managed agency, staffing placement, offshore team or independent VA. Each changes who recruits, trains, supervises and covers absences, so decide before comparing quotes." },
  { t: "Confirm hours and time-zone overlap", d: "Ask how many hours of live overlap are included, what happens outside them, and how holidays and sick days are covered. A low rate with no overlap can cost more in delays." },
  { t: "Test the tools and security", d: "Confirm which apps the assistant can use, who owns the accounts, how passwords are shared, whether devices are managed, and what NDAs and background checks apply." },
  { t: "Run a small paid trial", d: "Start with a narrow, well-documented task and a one- or two-week trial. Measure turnaround, accuracy and communication before expanding scope or signing a longer term." },
  { t: "Set a review rhythm", d: "Use a weekly check-in and a simple scorecard. Document the work as you go so a replacement can step in without starting over. Confirm notice and replacement terms in writing." },
];

export function HomeContent() {
  const { states } = getIndex();
  const { typeCounts } = getHighlights();
  return (
    <>
      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Delegation map</p>
              <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">What a VA can take off your plate</h2>
              <p className="mt-4 text-[15px] leading-7 text-muted">
                The best first tasks are repetitive, rule-based and easy to check. Start with a narrow slice of work, document the steps, and expand once the output is reliable. A good assistant compounds; a badly scoped one just moves the mess.
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {(["agency", "staffing", "offshore", "executive", "specialist"] as const).map((k) => (
                  <Link key={k} href={`/type/${k}`} className="rounded-full border border-line bg-card px-3 py-1.5 text-[12px] font-medium hover:border-ink">
                    {FIRM_TYPE_LABELS[k]} <span className="mono text-[10px] text-muted">{typeCounts[k]?.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {TASKS.map((task) => (
                <div key={task.t} className="rounded-xl border border-line bg-card px-4 py-3">
                  <p className="flex items-center gap-2 text-[13px] font-bold"><Check className="h-3.5 w-3.5 text-violet" aria-hidden />{task.t}</p>
                  <p className="mt-1 text-[12px] leading-5 text-muted">{task.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <AdInline placement="home-tasks" />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Model guide</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">Agency, staffing firm or independent VA?</h2>
            <p className="mt-3 text-[15px] leading-7 text-muted">The label matters less than who owns recruiting, training, supervision and backup. Use this table to compare the four common models before you shortlist providers.</p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-charcoal text-[10px] uppercase tracking-[0.14em] text-white/70">
                  <th className="px-4 py-3 font-bold">Model</th>
                  <th className="px-4 py-3 font-bold">Best when</th>
                  <th className="px-4 py-3 font-bold">Who handles</th>
                  <th className="px-4 py-3 font-bold">You handle</th>
                  <th className="px-4 py-3 font-bold">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {MODELS.map((m) => (
                  <tr key={m.m} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-bold">{m.m}</td>
                    <td className="px-4 py-3 text-muted">{m.best}</td>
                    <td className="px-4 py-3 text-muted">{m.who}</td>
                    <td className="px-4 py-3 text-muted">{m.you}</td>
                    <td className="mono px-4 py-3 font-bold text-violet">{m.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Pricing</p>
              <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">What virtual assistant services cost</h2>
              <p className="mt-4 text-[15px] leading-7 text-muted">
                The ranges below are typical US market ranges, not quotes. The model, location, hours, experience and management layer drive most of the difference. A low headline rate can hide minimum hours, setup fees, manager fees or limited time-zone overlap.
              </p>
              <div className="mt-5 rounded-xl border-2 border-ink bg-lime p-4 text-[13px] leading-6 text-lime-ink">
                <p className="font-bold">Rule of thumb</p>
                <p className="mt-1">Compare the all-in monthly cost for the hours you actually need, including management, software, setup and replacement terms, not only the hourly rate.</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line bg-card">
              <table className="w-full min-w-[540px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-[10px] uppercase tracking-[0.14em] text-muted">
                    <th className="px-4 py-3 font-bold">Engagement</th>
                    <th className="px-4 py-3 font-bold">Typical range</th>
                    <th className="px-4 py-3 font-bold">What to confirm</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICES.map((p) => (
                    <tr key={p.item} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-semibold">{p.item}</td>
                      <td className="mono px-4 py-3 text-[13px] text-ink">{p.range}</td>
                      <td className="px-4 py-3 text-[12.5px] leading-5 text-muted">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">Checklist</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">How to choose without wasting a quarter</h2>
          </div>
          <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-line bg-paper/60 p-5">
                <span className="mono text-[11px] font-bold text-violet">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg leading-tight tracking-tight">{s.t}</h3>
                <p className="mt-2 text-[13px] leading-6 text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-paper px-5 py-4">
            <p className="text-sm text-muted">Comparing providers? The city pages keep your shortlist in one place.</p>
            <Link href="/directory" className="inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-violet">Browse by state <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet">How this works</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">Where the data comes from</h2>
            <p className="mt-3 text-[14px] leading-7 text-muted">
              Listings come from public business profiles. Each record can include the name, address, phone, website, categories and the public rating and review count at the time of collection. Providers do not pay to appear in search results, and payment does not change search order or the independent ranking. The top-rated page has one clearly labeled sponsored featured partner.
            </p>
            <p className="mt-3 text-[14px] leading-7 text-muted">
              Profiles are editorial summaries built from listing data and local market context. They are not customer reviews, endorsements or a verification that a provider is licensed, insured or accepting clients. Confirm scope, pricing and terms directly with each provider.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-line bg-card p-5">
              <p className="mono text-2xl font-bold">{states.length}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">States + DC</p>
            </div>
            <div className="rounded-2xl border border-line bg-card p-5">
              <p className="mono text-2xl font-bold">5</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">Provider types</p>
            </div>
            <div className="rounded-2xl border border-line bg-card p-5">
              <p className="mono text-2xl font-bold">0</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">Paid placements</p>
            </div>
            <div className="rounded-2xl border border-line bg-card p-5">
              <p className="mono text-2xl font-bold">Free</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">To browse</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

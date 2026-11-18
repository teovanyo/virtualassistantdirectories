import Link from "next/link";
import { ArrowUpRight, Globe, MapPin, Phone, Star } from "lucide-react";
import { FIRM_TYPE_LABELS, firmTypes, type Firm } from "@/lib/data";

function initials(name: string) {
  return name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

const TILE = ["bg-charcoal text-lime", "bg-lime text-ink", "bg-violet text-white", "bg-ink text-white", "bg-lime-soft text-ink"];

function typeIndex(f: Firm) {
  return Math.max(0, firmTypes(f).findIndex((t) => t !== "agency"));
}

export function ProviderCard({ firm, rank }: { firm: Firm; rank?: number }) {
  const type = firmTypes(firm)[0];
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_14px_40px_-24px_rgba(22,22,26,0.5)]">
      <div className="flex items-start gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[13px] font-bold ${TILE[typeIndex(firm)]}`}>
          {initials(firm.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold leading-snug">
            <Link href={`/provider/${firm.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {firm.name}
            </Link>
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {firm.city}, {firm.state}
          </p>
        </div>
        {typeof rank === "number" ? (
          <span className="mono shrink-0 text-[11px] font-bold text-muted">#{String(rank).padStart(2, "0")}</span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">{FIRM_TYPE_LABELS[type]}</span>
        {firm.rating != null ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-soft px-2.5 py-1 text-[11px] font-bold text-lime-ink">
            <Star className="h-3 w-3 fill-current" aria-hidden /> {firm.rating.toFixed(1)}
            {firm.reviews ? <span className="font-medium text-lime-ink/70">({firm.reviews.toLocaleString()})</span> : null}
          </span>
        ) : (
          <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">No rating</span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-[12.5px]">
        {firm.phone ? (
          <a href={`tel:${firm.phone.replace(/[^+\d]/g, "")}`} className="relative z-10 flex items-center gap-1.5 text-ink hover:text-violet">
            <Phone className="h-3.5 w-3.5 text-muted" aria-hidden /> {firm.phone}
          </a>
        ) : null}
        {firm.website ? (
          <p className="flex items-center gap-1.5 truncate text-muted">
            <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {firm.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </p>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted">{firm.categories[0] || "Virtual assistant"}</span>
        <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-ink opacity-0 transition group-hover:opacity-100">
          View <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

export function ProviderRow({ firm, rank }: { firm: Firm; rank: number }) {
  const types = firmTypes(firm);
  return (
    <article className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 border-b border-line py-4 transition hover:bg-card sm:grid-cols-[3rem_minmax(0,1fr)_9rem_7rem_auto] sm:gap-4 sm:rounded-xl sm:border sm:px-4 sm:py-3.5 sm:hover:border-ink">
      <span className="mono text-sm font-bold text-muted">{String(rank).padStart(2, "0")}</span>
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-semibold">
          <Link href={`/provider/${firm.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            {firm.name}
          </Link>
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted">
          <MapPin className="h-3.5 w-3.5" aria-hidden /> {firm.city}, {firm.state}
        </p>
      </div>
      <div className="hidden sm:block">
        <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-line">{FIRM_TYPE_LABELS[types[0]]}</span>
      </div>
      <div className="hidden sm:block">
        {firm.rating != null ? (
          <span className="inline-flex items-center gap-1 text-[13px] font-bold">
            <Star className="h-3.5 w-3.5 fill-ink" aria-hidden /> {firm.rating.toFixed(1)}
            <span className="font-normal text-muted">({firm.reviews?.toLocaleString() || 0})</span>
          </span>
        ) : (
          <span className="text-[12px] text-muted">No rating</span>
        )}
      </div>
      <span className="hidden h-8 w-8 place-items-center rounded-full border border-line text-ink transition group-hover:border-ink group-hover:bg-lime sm:grid">
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </span>
      <div className="col-span-2 flex flex-wrap items-center gap-2 sm:hidden">
        <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">{FIRM_TYPE_LABELS[types[0]]}</span>
        {firm.rating != null ? <span className="text-[12px] font-bold">★ {firm.rating.toFixed(1)} <span className="font-normal text-muted">({firm.reviews?.toLocaleString() || 0})</span></span> : null}
        {firm.phone ? <a href={`tel:${firm.phone.replace(/[^+\d]/g, "")}`} className="relative z-10 text-[12px] font-medium text-violet">{firm.phone}</a> : null}
      </div>
    </article>
  );
}

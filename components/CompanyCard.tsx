import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import type { Company } from "@/lib/companies";

function initials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const TILE = ["bg-charcoal text-lime", "bg-lime text-ink", "bg-violet text-white", "bg-ink text-white", "bg-lime-soft text-ink"];

export function CompanyCard({ company, index = 0 }: { company: Company; index?: number }) {
  const snippet = company.review.length > 190 ? `${company.review.slice(0, 187).replace(/\s+\S*$/, "")}...` : company.review;
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_14px_40px_-24px_rgba(22,22,26,0.5)]">
      <div className="flex items-start gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[13px] font-bold ${TILE[index % TILE.length]}`}>
          {initials(company.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold leading-snug">
            <Link href={`/companies/${company.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {company.name}
            </Link>
          </h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[12.5px] text-muted">
            <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {company.domain}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-6 text-ink/75">{snippet}</p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted">VA company</span>
        <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-ink opacity-0 transition group-hover:opacity-100">
          View <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

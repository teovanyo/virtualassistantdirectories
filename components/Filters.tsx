import Link from "next/link";
import { FIRM_TYPE_LABELS, FIRM_TYPES } from "@/lib/data";

const SORTS = [
  { key: "reviews", label: "Most reviewed" },
  { key: "rating", label: "Top rated" },
  { key: "name", label: "A-Z" },
];

export function Filters({ basePath, params, total, shown }: { basePath: string; params: { type?: string; site?: string; rating?: string; sort?: string }; total: number; shown: number }) {
  const build = (next: Record<string, string | undefined>) => {
    const merged = { ...params, ...next };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v && !(k === "type" && v === "all") && !(k === "sort" && v === "reviews")) qs.set(k, v);
    }
    const s = qs.toString();
    return `${basePath}${s ? `?${s}` : ""}`;
  };
  const active = params.type || "all";
  return (
    <div className="mb-6 rounded-2xl border border-line bg-card p-3">
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        <Link href={build({ type: undefined })} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${active === "all" ? "bg-ink text-lime" : "bg-paper text-ink hover:bg-lime-soft"}`}>
          All providers
        </Link>
        {FIRM_TYPES.map((t) => (
          <Link key={t} href={build({ type: t })} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${active === t ? "bg-ink text-lime" : "bg-paper text-ink hover:bg-lime-soft"}`}>
            {FIRM_TYPE_LABELS[t]}
          </Link>
        ))}
        <Link href={build({ site: params.site === "1" ? undefined : "1" })} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${params.site === "1" ? "bg-violet text-white" : "bg-paper text-ink hover:bg-lime-soft"}`}>
          Has website
        </Link>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
        <p className="text-[12.5px] text-muted">
          Showing <span className="font-bold text-ink">{shown.toLocaleString()}</span> of {total.toLocaleString()} providers
        </p>
        <div className="flex items-center gap-1">
          <span className="text-[11px] uppercase tracking-wide text-muted">Sort</span>
          {SORTS.map((s) => {
            const on = (params.sort || "reviews") === s.key;
            return (
              <Link key={s.key} href={build({ sort: s.key === "reviews" ? undefined : s.key })} className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${on ? "bg-ink text-lime" : "text-muted hover:text-ink"}`}>
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

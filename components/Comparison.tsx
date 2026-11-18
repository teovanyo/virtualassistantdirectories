import Link from "next/link";
import { Star } from "lucide-react";
import { FIRM_TYPE_LABELS, firmTypes, type Firm } from "@/lib/data";

export function Comparison({ firm, cityFirms }: { firm: Firm; cityFirms: Firm[] }) {
  const ranked = [...cityFirms].sort((a, b) => (b.reviews || 0) - (a.reviews || 0) || (b.rating || 0) - (a.rating || 0));
  const selected = new Set<string>([firm.slug]);
  for (const f of ranked) {
    if (selected.size >= 6) break;
    selected.add(f.slug);
  }
  const rows = ranked.filter((f) => selected.has(f.slug));
  if (rows.length < 2) return null;
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet">Compare</p>
          <h2 className="mt-1 font-display text-2xl tracking-tight">Other providers in {firm.city}</h2>
        </div>
        <Link href={`/state/${firm.state.toLowerCase()}/${firm.citySlug}`} className="text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-violet">
          See all {cityFirms.length} →
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-[10px] uppercase tracking-[0.14em] text-muted">
              <th className="px-4 py-3 font-bold">Provider</th>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold">Rating</th>
              <th className="px-4 py-3 font-bold">Reviews</th>
              <th className="px-4 py-3 font-bold">Phone</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => {
              const current = f.slug === firm.slug;
              return (
                <tr key={f.slug} className={`border-b border-line last:border-0 ${current ? "bg-lime-soft/40" : "hover:bg-paper/60"}`}>
                  <td className="px-4 py-3">
                    <Link href={`/provider/${f.slug}`} className="font-semibold hover:text-violet">{f.name}</Link>
                    {current ? <span className="ml-2 rounded bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase text-lime">This</span> : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{FIRM_TYPE_LABELS[firmTypes(f)[0]]}</td>
                  <td className="px-4 py-3 font-semibold">{f.rating != null ? <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-ink" aria-hidden />{f.rating.toFixed(1)}</span> : "-"}</td>
                  <td className="mono px-4 py-3 text-muted">{f.reviews?.toLocaleString() || "-"}</td>
                  <td className="px-4 py-3">{f.phone ? <a href={`tel:${f.phone.replace(/[^+\d]/g, "")}`} className="font-medium text-violet hover:underline">{f.phone}</a> : <span className="text-muted">-</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

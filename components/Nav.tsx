import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-[12px] text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 ? <span className="text-line">/</span> : null}
          {item.href ? <Link href={item.href} className="rounded-full px-1.5 py-0.5 hover:bg-card hover:text-ink">{item.label}</Link> : <span className="px-1.5 py-0.5 text-ink">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function Pagination({ page, pages, makeHref }: { page: number; pages: number; makeHref: (p: number) => string }) {
  if (pages <= 1) return null;
  const nums = new Set<number>([1, pages, page - 1, page, page + 1]);
  const list = [...nums].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
      {page > 1 ? <Link href={makeHref(page - 1)} className="rounded-full border border-ink px-3.5 py-1.5 text-sm hover:bg-card">Prev</Link> : null}
      {list.map((n, i) => (
        <span key={n} className="flex items-center gap-1">
          {i > 0 && n - list[i - 1] > 1 ? <span className="px-1 text-muted">…</span> : null}
          {n === page ? <span className="mono rounded-full bg-ink px-3.5 py-1.5 text-sm font-bold text-lime">{n}</span> : <Link href={makeHref(n)} className="mono rounded-full border border-line px-3.5 py-1.5 text-sm hover:border-ink">{n}</Link>}
        </span>
      ))}
      {page < pages ? <Link href={makeHref(page + 1)} className="rounded-full border border-ink px-3.5 py-1.5 text-sm hover:bg-card">Next</Link> : null}
    </nav>
  );
}

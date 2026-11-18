export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
      {faqs.map((f) => (
        <details key={f.q} className="group px-5 py-4 open:bg-paper/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
            {f.q}
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-lime transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

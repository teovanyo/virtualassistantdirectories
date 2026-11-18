export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[10px] bg-lime text-ink"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path d="M4 6.5h16M4 12h11M4 17.5h7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="18.5" cy="16.5" r="2.6" fill="currentColor" />
      </svg>
    </span>
  );
}

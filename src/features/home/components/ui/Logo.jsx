export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <rect x="1" y="15" width="6" height="8" className="fill-terracotta" />
        <rect x="9" y="8" width="6" height="15" fill="currentColor" />
        <rect x="17" y="1" width="6" height="22" fill="currentColor" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">InternUp</span>
    </span>
  );
}

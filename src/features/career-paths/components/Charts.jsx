export function BarChart({ items, label }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul aria-label={label} className="space-y-3.5">
      {items.map((item, index) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-cream/85">{item.label}</span>
            <span className="shrink-0 font-semibold text-cream tabular-nums">{item.value}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream/10" aria-hidden="true">
            <div
              className={`h-full origin-left rounded-full motion-safe:animate-grow ${index === 0 ? 'bg-terracotta' : 'bg-cream/70'}`}
              style={{ width: `${(item.value / max) * 100}%`, animationDelay: `${index * 70}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

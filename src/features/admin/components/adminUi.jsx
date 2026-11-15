export const actionButton =
  'inline-flex min-h-10 items-center justify-center gap-2 border border-cream/20 px-3 py-2 text-sm font-semibold text-cream/85 transition-colors hover:border-cream/45 hover:bg-cream/10 hover:text-cream disabled:cursor-not-allowed disabled:opacity-40';

export const iconButton = `${actionButton} size-10 px-0`;

export function HomeBadge({ onHome, offLabel = 'Jo në ballinë' }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold ${
        onHome ? 'bg-cream text-charcoal' : 'border border-cream/25 text-cream/60'
      }`}
    >
      {onHome ? 'Në ballinë' : offLabel}
    </span>
  );
}

export function SectionIntro({ title }) {
  return <h1 className="font-display text-3xl text-cream">{title}</h1>;
}

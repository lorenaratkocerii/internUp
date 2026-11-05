export function SectionHeading({ eyebrow, title, description, id, className = '' }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="text-sm font-semibold tracking-[0.18em] text-cream/70 uppercase">{eyebrow}</p>
      <h2
        id={id}
        className="mt-4 font-display text-4xl leading-[1.08] font-medium tracking-tight text-cream sm:text-5xl"
      >
        {title}
      </h2>
      {description && <p className="mt-5 text-lg leading-relaxed text-cream/75">{description}</p>}
    </div>
  );
}

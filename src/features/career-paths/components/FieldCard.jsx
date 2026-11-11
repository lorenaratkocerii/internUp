import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { fieldVisual } from '../fieldVisuals';

export function FieldIcon({ fieldId, className = 'size-11', iconClassName = 'size-5' }) {
  const { icon: Icon, accent } = fieldVisual(fieldId);
  return (
    <span className={`grid shrink-0 place-items-center text-cream ${accent} ${className}`}>
      <Icon aria-hidden="true" strokeWidth={1.75} className={iconClassName} />
    </span>
  );
}

export function FieldCard({ field, activePositions }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden bg-cream text-charcoal transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 focus-within:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-navy">
        <img
          src={field.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <FieldIcon fieldId={field.id} className="absolute bottom-4 left-4 size-11" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-2xl leading-tight font-medium tracking-tight">
          <Link
            to={`/fushat/${field.id}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline group-hover:decoration-terracotta group-hover:decoration-2 group-hover:underline-offset-4"
          >
            {field.name}
          </Link>
        </h3>
        <p className="mt-2 leading-relaxed text-charcoal/75">{field.tagline}</p>
        <p className="mt-auto flex items-center justify-between border-t border-charcoal/15 pt-4 text-sm font-semibold">
          {activePositions === 1 ? '1 pozitë aktive' : `${activePositions} pozita aktive`}
          <ArrowUpRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </div>
    </article>
  );
}

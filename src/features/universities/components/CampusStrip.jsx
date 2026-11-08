import { Link } from 'react-router';
import { FadeImage } from './FadeImage';

const TILE = 'h-44 w-64 rounded-2xl bg-cream/[0.06] sm:h-52 sm:w-80';
const PLACEHOLDERS = 6;

export function CampusStrip({ universities, loading = false }) {
  const withPhotos = universities.filter((university) => university.photo);

  if (loading) {
    return (
      <ul aria-hidden="true" className="flex gap-4 overflow-hidden">
        {Array.from({ length: PLACEHOLDERS }, (_, index) => (
          <li key={index} className={`shrink-0 ${TILE}`} />
        ))}
      </ul>
    );
  }
  if (withPhotos.length === 0) return null;

  const renderRow = (copy) =>
    withPhotos.map((university) => (
      <li key={`${copy}-${university.id}`} className="shrink-0 pr-4" aria-hidden={copy === 1 || undefined}>
        <Link
          to={`/universitetet/${university.id}`}
          tabIndex={copy === 1 ? -1 : undefined}
          className={`group relative block overflow-hidden ${TILE}`}
        >
          <FadeImage src={university.photo} alt="" className="size-full object-cover group-hover:scale-105" />
          <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-charcoal/85 to-transparent px-4 pt-10 pb-3 text-sm font-semibold text-cream">
            {university.shortName}
          </span>
        </Link>
      </li>
    ));

  return (
    <div className="group/strip overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <ul
        aria-label="Kampuset"
        className="flex w-max animate-marquee will-change-transform group-hover/strip:[animation-play-state:paused] motion-reduce:animate-none"
      >
        {renderRow(0)}
        {renderRow(1)}
      </ul>
    </div>
  );
}

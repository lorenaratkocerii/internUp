import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { FadeImage } from './FadeImage';
import { UniversityLogo } from './UniversityLogo';

export function verifiedLabel(count) {
  if (count === 0) return 'Ende pa studentë të verifikuar';
  return count === 1 ? '1 student i verifikuar' : `${count} studentë të verifikuar`;
}

export function UniversityCard({ university }) {
  const [hasPhoto, setHasPhoto] = useState(Boolean(university.photo));

  return (
    <Link
      to={`/universitetet/${university.id}`}
      className={`group grid h-full min-h-72 overflow-hidden rounded-2xl bg-cream text-charcoal shadow-[0_1px_0_rgb(0_0_0/0.25)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)] ${
        hasPhoto ? 'grid-cols-[minmax(0,1fr)_45%]' : ''
      }`}
    >
      <div className="flex flex-col p-6 sm:p-8">
        <UniversityLogo university={university} className="size-24" bare />

        <h3 className="mt-6 font-display text-2xl leading-snug font-medium tracking-tight">{university.name}</h3>
        <p className="mt-1.5 text-charcoal/60">{university.city}</p>

        <p className="mt-auto flex items-center justify-between gap-3 pt-7 text-sm">
          <span className={university.verifiedStudents ? 'font-semibold' : 'text-charcoal/55'}>
            {verifiedLabel(university.verifiedStudents)}
          </span>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-charcoal/20 transition-colors duration-300 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-cream">
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </span>
        </p>
      </div>

      {hasPhoto && (
        <div className="relative m-2 ml-0 overflow-hidden rounded-xl bg-charcoal/[0.08]">
          <FadeImage
            src={university.photo}
            alt=""
            loading="lazy"
            onError={() => setHasPhoto(false)}
            className="absolute inset-0 size-full object-cover group-hover:scale-105"
          />
        </div>
      )}
    </Link>
  );
}

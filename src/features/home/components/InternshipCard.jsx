import { ArrowUpRight, CalendarDays, MapPin, Wallet } from 'lucide-react';
import { Link } from 'react-router';

const tones = ['bg-navy', 'bg-mauve', 'bg-charcoal'];

function getInitials(name) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function InternshipCard({ internship, index = 0 }) {
  const { id, title, companyId, company, location, workMode, durationMonths, paid, skills, canApply } = internship;
  const detailsHref = `/kompanite/${companyId}/pozitat/${id}`;
  const details = [
    { icon: MapPin, text: `${location}, ${({ Remote: 'Në distancë', Hybrid: 'Hibrid', 'On-site': 'Në zyrë' })[workMode] ?? workMode}` },
    { icon: CalendarDays, text: `${durationMonths} muaj` },
    { icon: Wallet, text: paid ? 'Me pagesë' : 'Pa pagesë' },
  ];

  return (
    <article
      className={`group clip-step flex h-full flex-col p-6 pt-7 text-cream transition-transform duration-300 ease-out hover:-translate-y-2 ${
        tones[index % tones.length]
      }`}
    >
      <div className="flex items-center gap-3 pr-10">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center bg-cream font-display text-base font-semibold text-charcoal"
        >
          {getInitials(company)}
        </span>
        <p className="text-sm leading-snug text-cream/80">{company}</p>
      </div>

      <h3 className="mt-7 font-display text-3xl leading-[1.1] font-medium tracking-tight xl:min-h-[2.2em]">
        {title}
      </h3>

      <ul className="mt-6 space-y-2.5 text-sm text-cream/85">
        {details.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5">
            <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
            {text}
          </li>
        ))}
      </ul>

      <ul aria-label="Aftësitë" className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className="border border-cream/30 px-2.5 py-1 text-xs text-cream/90">
            {skill}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Link
          to={canApply ? `${detailsHref}#apliko` : detailsHref}
          aria-label={canApply ? `Apliko për ${title} te ${company}` : `Shiko detajet për ${title} te ${company}`}
          className="flex items-center justify-between border-t border-cream/20 pt-5 font-semibold"
        >
          {canApply ? 'Apliko Tani' : 'Shiko hollësitë'}
          <span className="grid size-10 place-items-center bg-cream text-charcoal transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight aria-hidden="true" className="size-5" />
          </span>
        </Link>
      </div>
    </article>
  );
}

import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { CompanyLogo } from './CompanyLogo';

const WORK_MODE_LABELS = { Remote: 'Në distancë', Hybrid: 'Hibrid', 'On-site': 'Në zyrë' };

function activePositionsLabel(count) {
  if (count === 0) return 'Asnjë pozitë aktive';
  return count === 1 ? '1 pozitë aktive' : `${count} pozita aktive`;
}

export function CompanyCard({ company }) {
  const facts = [company.location, WORK_MODE_LABELS[company.workMode] ?? company.workMode, company.size].filter(Boolean);

  return (
    <article className="group relative flex h-full flex-col bg-cream p-6 text-charcoal transition-transform duration-300 ease-out focus-within:-translate-y-1 hover:-translate-y-1 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <CompanyLogo companyId={company.id} logo={company.logo} name={company.name} className="size-14" iconClassName="size-7" />
        <span className="border border-charcoal/25 px-2.5 py-1 text-xs font-semibold text-charcoal/80">
          {company.industry}
        </span>
      </div>

      <h2 className="mt-6 font-display text-3xl leading-tight font-medium tracking-tight">
        <Link
          to={`/kompanite/${company.id}`}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline group-hover:decoration-terracotta group-hover:decoration-2 group-hover:underline-offset-4"
        >
          {company.name}
        </Link>
      </h2>
      <p className="mt-3 leading-relaxed text-charcoal/75">{company.shortDescription}</p>

      <ul aria-label="Të dhëna" className="mt-5 mb-6 flex flex-wrap gap-x-2 gap-y-1 text-sm text-charcoal/70">
        {facts.map((fact, index) => (
          <li key={fact} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="size-1 bg-terracotta" />}
            {fact}
          </li>
        ))}
      </ul>

      <p className="mt-auto flex items-center justify-between border-t border-charcoal/15 pt-5 text-sm font-semibold">
        <span className={company.activePositions ? '' : 'font-normal text-charcoal/55'}>
          {activePositionsLabel(company.activePositions)}
        </span>
        <span className="grid size-10 place-items-center bg-charcoal text-cream transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight aria-hidden="true" className="size-5" />
        </span>
      </p>
    </article>
  );
}

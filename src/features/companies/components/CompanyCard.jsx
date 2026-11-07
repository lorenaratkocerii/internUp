import { ArrowUpRight, Briefcase, CalendarDays, Factory, Laptop, MapPin, Users } from 'lucide-react';
import { ButtonLink } from '../../home/components/ui/Button';
import { CompanyLogo } from './CompanyLogo';

function activePositionsLabel(count) {
  if (count === 0) return 'Asnjë pozitë aktive';
  return count === 1 ? '1 pozitë aktive' : `${count} pozita aktive`;
}

export function CompanyCard({ company }) {
  const facts = [
    { icon: MapPin, label: 'Lokacioni', value: company.location },
    { icon: Factory, label: 'Industria', value: company.industry },
    { icon: CalendarDays, label: 'Themeluar', value: company.foundedYear },
    { icon: Users, label: 'Madhësia', value: company.size },
    { icon: Laptop, label: 'Mënyra e punës', value: ({ Remote: 'Në distancë', Hybrid: 'Hibrid', 'On-site': 'Në zyrë' })[company.workMode] ?? company.workMode },
    { icon: Briefcase, label: 'Pozitat', value: activePositionsLabel(company.activePositions) },
  ];

  return (
    <article className="flex h-full flex-col bg-cream p-6 text-charcoal">
      <div className="flex items-center gap-4">
        <CompanyLogo companyId={company.id} />
        <h2 className="font-display text-2xl leading-tight font-medium tracking-tight">{company.name}</h2>
      </div>

      <p className="mt-4 leading-relaxed text-charcoal/80 md:min-h-[3.25rem]">{company.shortDescription}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-charcoal/20 pt-5">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label}>
            <dt className="flex items-center gap-1.5 text-xs font-semibold text-mauve">
              <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              {label}
            </dt>
            <dd className="mt-1 text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto pt-6">
        <ButtonLink
          href={`/kompanite/${company.id}`}
          variant="charcoal"
          icon={ArrowUpRight}
          aria-label={`Shiko kompaninë ${company.name}`}
          className="w-full"
        >
          Shiko kompaninë
        </ButtonLink>
      </div>
    </article>
  );
}

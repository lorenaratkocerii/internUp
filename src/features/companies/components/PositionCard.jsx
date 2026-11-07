import { ArrowUpRight } from 'lucide-react';
import { buttonClasses, ButtonLink } from '../../home/components/ui/Button';
import { PositionFacts } from './PositionFacts';
import { StatusBadge } from './StatusBadge';

export function PositionCard({ position, companyId }) {
  const href = `/kompanite/${companyId}/pozitat/${position.id}`;

  return (
    <article className="grid bg-cream text-charcoal lg:grid-cols-[1fr_24rem]">
      <div className="p-6 lg:p-8">
        <StatusBadge status={position.status} />
        <h3 className="mt-4 font-display text-3xl leading-tight font-medium tracking-tight">{position.title}</h3>
        <p className="mt-3 leading-relaxed text-charcoal/80">{position.description}</p>

        <h4 className="mt-6 text-sm font-semibold">Përgjegjësitë</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-charcoal/80 marker:text-terracotta">
          {position.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {position.requirements?.length > 0 && (
          <>
            <h4 className="mt-6 text-sm font-semibold">Kriteret e studentit</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-charcoal/80 marker:text-terracotta">
              {position.requirements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </>
        )}

        <h4 className="mt-6 text-sm font-semibold">Aftësitë e kërkuara</h4>
        <ul className="mt-2 flex flex-wrap gap-2">
          {position.skills.map((skill) => (
            <li key={skill} className="border border-charcoal/30 px-2.5 py-1 text-xs font-medium">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col border-t border-charcoal/20 p-6 lg:border-t-0 lg:border-l lg:p-8">
        <PositionFacts position={position} />

        <div className="mt-auto grid gap-3 pt-7 sm:grid-cols-2">
          <ButtonLink
            href={href}
            variant="outline"
            aria-label={`Shiko detajet për ${position.title}`}
            className="px-3 text-sm"
          >
            Shiko detajet
          </ButtonLink>
          {position.canApply ? (
            <ButtonLink
              href={`${href}#apliko`}
              variant="charcoal"
              icon={ArrowUpRight}
              aria-label={`Apliko tani për ${position.title}`}
              className="gap-2 px-3 text-sm"
            >
              Apliko tani
            </ButtonLink>
          ) : (
            <button
              type="button"
              disabled
              aria-label={`Aplikimet për ${position.title} janë mbyllur`}
              className={buttonClasses('disabled', 'px-3 text-sm')}
            >
              Apliko tani
            </button>
          )}
        </div>

        {!position.canApply && (
          <p className="mt-3 text-sm text-charcoal/75">Kjo pozitë nuk pranon më aplikime.</p>
        )}
      </div>
    </article>
  );
}

import { X } from 'lucide-react';
import { InternshipCard } from './InternshipCard';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { StatusMessage } from './ui/StatusMessage';

function resultsSummary(count, { position, location }) {
  const noun = count === 1 ? 'praktikë' : 'praktika';
  const parts = [position && `për “${position}”`, location && `në “${location}”`].filter(Boolean);
  return `${count} ${noun} ${parts.join(' ')}`;
}

export function SearchResults({ results, applied, onReset, headingRef }) {
  const internships = results.data ?? [];

  return (
    <section
      id="rezultatet"
      aria-labelledby="rezultatet-titull"
      className="bg-cream py-20 text-charcoal lg:py-28"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-mauve uppercase">Kërkimi yt</p>
            <h2
              id="rezultatet-titull"
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 font-display text-4xl leading-[1.08] font-medium tracking-tight outline-none sm:text-5xl"
            >
              Rezultatet e kërkimit
            </h2>
            <p aria-live="polite" className="mt-5 min-h-7 text-lg leading-relaxed text-mauve">
              {results.status === 'success' && resultsSummary(internships.length, applied)}
            </p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-charcoal/40 px-4 font-semibold transition-colors duration-200 hover:border-charcoal hover:bg-charcoal hover:text-cream"
          >
            <X aria-hidden="true" className="size-4" />
            Pastro kërkimin
          </button>
        </div>

        <div className="mt-12">
          {results.status === 'error' && (
            <StatusMessage className="text-mauve">
              Praktikat nuk u ngarkuan. Provo përsëri më vonë.
            </StatusMessage>
          )}

          {results.status === 'success' && internships.length === 0 && (
            <StatusMessage className="border-l-2 border-terracotta pl-5 text-lg text-mauve">
              Nuk gjetëm praktika me këto kritere. Provo një pozitë tjetër ose një lokacion më të gjerë.
            </StatusMessage>
          )}

          {internships.length > 0 && (
            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {internships.map((internship, index) => (
                <Reveal as="li" key={internship.id} delay={index * 70}>
                  <InternshipCard internship={internship} index={index} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}

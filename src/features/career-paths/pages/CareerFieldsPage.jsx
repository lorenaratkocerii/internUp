import { useCallback } from 'react';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Container } from '../../home/components/ui/Container';
import { Reveal } from '../../home/components/ui/Reveal';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { FieldCard } from '../components/FieldCard';

export function CareerFieldsPage({ useCases }) {
  useDocumentTitle('Fushat');
  const load = useCallback(() => useCases.listFields(), [useCases]);
  const result = useAsyncData(load);

  return (
    <>
      <section aria-labelledby="fushat-titull" className="relative isolate overflow-hidden border-b border-cream/10">
        <Container className="py-14 lg:py-20">
          <div className="mx-auto max-w-2xl text-center motion-safe:animate-fade-up">
            <h1
              id="fushat-titull"
              className="font-hero text-5xl leading-[1] font-bold tracking-tight text-cream sm:text-6xl"
            >
              Gjej fushën tënde.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream/75">
              Për çdo fushë: çfarë aftësish të duhen, cilat kompani marrin praktikantë dhe çfarë thonë studentët.
            </p>
          </div>
        </Container>
      </section>

      <section aria-label="Fushat" className="py-16 lg:py-20">
        <Container>
          {result.status === 'error' && (
            <StatusMessage className="text-cream/75">Fushat nuk u ngarkuan. Provo përsëri më vonë.</StatusMessage>
          )}
          {result.status === 'loading' && !result.data && (
            <div aria-hidden="true" className="h-96 animate-pulse bg-cream/10" />
          )}
          {result.data && (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.data.map(({ field, activePositions }, index) => (
                <Reveal as="li" key={field.id} delay={(index % 3) * 80}>
                  <FieldCard field={field} activePositions={activePositions} />
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}

import { useCallback } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { StoryCard } from '../../blog/components/StoryCard';
import { CompanyCard } from '../../companies/components/CompanyCard';
import { NotFoundMessage } from '../../companies/components/NotFoundMessage';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Container } from '../../home/components/ui/Container';
import { Reveal } from '../../home/components/ui/Reveal';
import { SectionHeading } from '../../home/components/ui/SectionHeading';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { BarChart } from '../components/Charts';
import { FieldIcon } from '../components/FieldCard';
import { Roadmap } from '../components/Roadmap';

export function CareerFieldPage({ useCases }) {
  const { fieldId } = useParams();
  const load = useCallback(() => useCases.getField(fieldId), [useCases, fieldId]);
  const result = useAsyncData(load);
  const detail = result.data;
  useDocumentTitle(detail?.field.name ?? 'Fushat');

  if (result.status === 'error') {
    return (
      <Container className="py-20">
        <StatusMessage className="text-cream/75">Fusha nuk u ngarkua. Provo përsëri më vonë.</StatusMessage>
      </Container>
    );
  }
  if (!detail) {
    if (result.status === 'loading') {
      return (
        <Container className="py-20">
          <div aria-hidden="true" className="h-96 animate-pulse bg-cream/10" />
        </Container>
      );
    }
    return (
      <NotFoundMessage
        title="Kjo fushë nuk u gjet."
        description="Zgjidh një nga fushat e listuara."
        href="/fushat"
        linkLabel="Kthehu te fushat"
      />
    );
  }

  const { field, companies, stories, skillDemand } = detail;

  return (
    <>
      <section aria-labelledby="fusha-titull" className="relative isolate overflow-hidden border-b border-cream/10">
        <img src={field.image} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-30" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-charcoal via-charcoal/90 to-charcoal/40" />

        <Container className="py-12 lg:py-20">
          <Link
            to="/fushat"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cream/75 transition-colors hover:text-cream"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Të gjitha fushat
          </Link>
          <div className="mt-8 max-w-3xl motion-safe:animate-fade-up">
            <FieldIcon fieldId={field.id} className="size-14" iconClassName="size-7" />
            <h1 id="fusha-titull" className="mt-6 font-hero text-5xl leading-[1] font-bold tracking-tight text-cream sm:text-6xl">
              {field.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/75">{field.description}</p>
            <p className="mt-6 text-sm text-cream/60">Rolet: {field.roles.join(' · ')}</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="aftesite" className="py-16 lg:py-20">
        <Container>
          <SectionHeading id="aftesite" title="Çfarë duhet të dish." className="mb-10" />
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal className="bg-cream p-6 text-charcoal sm:p-8">
              <h3 className="font-display text-xl font-medium">Aftësitë bazë</h3>
              <ul className="mt-5 space-y-3">
                {field.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3">
                    <Check aria-hidden="true" className="size-5 shrink-0 text-terracotta" />
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="border border-cream/10 bg-charcoal/60 p-6 sm:p-8">
              <h3 className="font-display text-xl font-medium">Më të kërkuarat në pozita</h3>
              <p className="mt-1 mb-6 text-sm text-cream/60">Sa herë kërkohet secila aftësi në pozitat e kësaj fushe.</p>
              {skillDemand.length > 0 ? (
                <BarChart items={skillDemand} label="Aftësitë më të kërkuara" />
              ) : (
                <p className="text-cream/60">Ende nuk ka pozita në këtë fushë.</p>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="rruga" className="border-y border-cream/10 bg-mauve/25 py-16 lg:py-20">
        <Container>
          <SectionHeading id="rruga" eyebrow="Rruga" title="Nga studimet te praktika." className="mb-12" />
          <Roadmap steps={field.roadmap} />
        </Container>
      </section>

      {companies.length > 0 && (
        <section aria-labelledby="kompanite" className="py-16 lg:py-20">
          <Container>
            <SectionHeading id="kompanite" title="Kush merr praktikantë." className="mb-10" />
            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => (
                <li key={company.id}>
                  <CompanyCard company={company} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {stories.length > 0 && (
        <section aria-labelledby="historite" className="border-t border-cream/10 py-16 lg:py-20">
          <Container>
            <SectionHeading id="historite" eyebrow="Nga Blogu i Studentëve" title="Çfarë thonë studentët." className="mb-10" />
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => (
                <li key={story.id}>
                  <StoryCard story={story} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}

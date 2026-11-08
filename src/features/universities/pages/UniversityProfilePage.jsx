import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Role } from '../../../domain/auth/accessControl';
import { UNIVERSITY_TYPE_LABELS } from '../../../domain/university/University';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { NotFoundMessage } from '../../companies/components/NotFoundMessage';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Container } from '../../home/components/ui/Container';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { verifiedLabel } from '../components/UniversityCard';
import { FadeImage } from '../components/FadeImage';
import { UniversityLogo } from '../components/UniversityLogo';

const displayUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function Hero({ university }) {
  const [hasPhoto, setHasPhoto] = useState(Boolean(university.photo));
  const subtitle = `${UNIVERSITY_TYPE_LABELS[university.type]} · ${university.city}`;

  if (!hasPhoto) {
    return (
      <div className="flex flex-col gap-6 rounded-3xl bg-cream p-8 text-charcoal sm:flex-row sm:items-center sm:p-12">
        <UniversityLogo university={university} className="size-28" bare />
        <div>
          <p className="text-charcoal/60">{subtitle}</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.08] font-medium tracking-tight sm:text-5xl">{university.name}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-cream/[0.06]">
      <FadeImage
        src={university.photo}
        alt={`Kampusi i ${university.shortName}`}
        onError={() => setHasPhoto(false)}
        className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-5 p-6 sm:p-10">
        <UniversityLogo university={university} className="hidden size-24 rounded-2xl sm:grid" padding="p-2" />
        <div className="min-w-0">
          <p className="text-cream/75">{subtitle}</p>
          <h1 className="mt-1 font-display text-3xl leading-[1.08] font-medium tracking-tight text-cream sm:text-5xl">
            {university.name}
          </h1>
        </div>
      </div>
    </div>
  );
}

export function UniversityProfilePage({ useCases }) {
  const { universityId } = useParams();
  const actor = useCurrentActor();
  const load = useCallback(() => useCases.getUniversityProfile(universityId, actor), [useCases, universityId, actor]);
  const profile = useAsyncData(load);
  const university = profile.data?.university;

  useDocumentTitle(university?.shortName);

  if (profile.status === 'error') {
    return (
      <Container className="py-24">
        <StatusMessage className="text-cream/75">Profili nuk u ngarkua. Provo përsëri më vonë.</StatusMessage>
      </Container>
    );
  }
  if (profile.status === 'success' && !university) {
    return (
      <NotFoundMessage
        title="Ky universitet nuk u gjet."
        description="Lidhja mund të jetë e pasaktë."
        href="/universitetet"
        linkLabel="Kthehu te universitetet"
      />
    );
  }
  if (!university) return <div className="min-h-[60vh]" />;

  const { students, stories, verifiedCount, canSeeStudents } = profile.data;
  const representative = university.representative;

  return (
    <Container className="pt-6 pb-16 lg:pt-8 lg:pb-24">
      <Link
        to="/universitetet"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Të gjitha universitetet
      </Link>

      <div className="mt-3">
        <Hero university={university} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-8">
          {university.description && (
            <p className="max-w-3xl font-display text-2xl leading-snug text-cream/90 sm:text-[1.75rem]">
              {university.description}
            </p>
          )}

          <section aria-labelledby="studentet-titull" className="mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="studentet-titull" className="font-display text-3xl font-medium tracking-tight">
                Studentët
              </h2>
              {canSeeStudents && <span className="text-sm text-cream/55">{verifiedLabel(verifiedCount)}</span>}
            </div>

            {!canSeeStudents ? (
              <p className="mt-4 text-lg text-cream/75">
                {verifiedCount
                  ? `${verifiedLabel(verifiedCount)} nga ${university.shortName} në InternUp.`
                  : `Asnjë student nga ${university.shortName} nuk është verifikuar ende.`}
              </p>
            ) : students.length > 0 ? (
              <ul className="mt-5 border-t border-cream/15">
                {students.map((student) => (
                  <li
                    key={student.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-cream/15 py-4"
                  >
                    <span className="font-semibold">{student.name}</span>
                    <span className="text-sm text-cream/60">
                      {student.program}, {student.studyYear.toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-cream/70">Asnjë student nga {university.shortName} nuk është verifikuar ende.</p>
            )}
            {canSeeStudents && (
              <p className="mt-4 text-sm text-cream/55">
                Këtë listë e sheh vetëm përfaqësuesi i universitetit.{' '}
                <Link to="/universitet/studentet" className="underline underline-offset-4 hover:text-cream">
                  Hap panelin
                </Link>
              </p>
            )}
          </section>

          {stories.length > 0 && (
            <section aria-labelledby="historite-titull" className="mt-14">
              <h2 id="historite-titull" className="font-display text-3xl font-medium tracking-tight">
                Nga Student Blog
              </h2>
              <ul className="mt-6 space-y-6">
                {stories.map((story) => (
                  <li key={story.id}>
                    <Link to={`/blog/${story.id}`} className="group block">
                      <p className="text-sm text-cream/55">
                        {story.author.name} · {story.companyName}
                      </p>
                      <p className="mt-1 font-display text-xl leading-snug decoration-cream/40 underline-offset-4 group-hover:underline">
                        {story.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="self-start lg:sticky lg:top-24 lg:col-span-4">
          <div className="rounded-3xl bg-cream p-7 text-charcoal">
            {representative?.name && (
              <>
                <p className="text-sm text-charcoal/55">Përfaqësuesi në InternUp</p>
                <p className="mt-2 font-display text-2xl">{representative.name}</p>
                <p className="text-charcoal/70">{representative.title}</p>
                <p className="mt-4 text-sm break-all text-charcoal/80">{representative.email}</p>
              </>
            )}

            {university.website && (
              <a
                href={university.website}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-between gap-3 border-t border-charcoal/15 pt-5 font-semibold hover:underline hover:underline-offset-4"
              >
                {displayUrl(university.website)}
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </a>
            )}
          </div>

          {actor?.role === Role.STUDENT && (
            <Link
              to="/student#verifikimi"
              className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-navy px-7 py-5 font-semibold transition-colors hover:bg-navy/80"
            >
              Studion këtu? Kërko verifikimin
              <ArrowUpRight aria-hidden="true" className="size-5 shrink-0" />
            </Link>
          )}
        </aside>
      </div>
    </Container>
  );
}

import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CircleCheck,
  Clock,
  GraduationCap,
  Laptop,
  MapPin,
  Mountain,
  Timer,
  UserRound,
  BriefcaseBusiness,
} from 'lucide-react';
import { useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { workModeLabel } from '../../../domain/blog/Story';
import { NotFoundMessage } from '../../companies/components/NotFoundMessage';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Container } from '../../home/components/ui/Container';
import { Reveal } from '../../home/components/ui/Reveal';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { useUniversityDirectory } from '../../universities/hooks/useUniversityDirectory';
import { AuthorAvatar, CategoryBadge, VerifiedBadge } from '../components/StoryBadges';
import { StoryCard } from '../components/StoryCard';
import { StoryCover } from '../components/StoryCover';
import { durationLabel, formatDate, readingTimeLabel } from '../utils/format';

function FactList({ story, universityHref }) {
  const facts = [
    { icon: UserRound, label: 'Studenti', value: story.author.name },
    { icon: GraduationCap, label: 'Universiteti', value: story.author.university, href: universityHref },
    { icon: Building2, label: 'Kompania', value: story.companyName, href: story.companyId ? `/kompanite/${story.companyId}` : null },
    { icon: BriefcaseBusiness, label: 'Pozita', value: story.position },
    { icon: Timer, label: 'Kohëzgjatja', value: durationLabel(story.durationMonths) },
    { icon: Laptop, label: 'Work mode', value: workModeLabel(story.workMode) },
    { icon: MapPin, label: 'Lokacioni', value: story.location },
  ].filter((fact) => fact.value);

  return (
    <dl className="divide-y divide-charcoal/15">
      {facts.map(({ icon: Icon, label, value, href }) => (
        <div key={label} className="flex items-start gap-3 py-3">
          <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-terracotta" />
          <div className="min-w-0">
            <dt className="text-xs font-semibold tracking-wide text-charcoal/60 uppercase">{label}</dt>
            <dd className="mt-0.5 font-medium">
              {href ? (
                <Link to={href} className="inline-flex items-center gap-1 underline decoration-terracotta underline-offset-4 hover:text-burgundy">
                  {value}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              ) : (
                value
              )}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function StoryDetailsPage({ useCases, universityUseCases }) {
  const { storyId } = useParams();
  const { state } = useLocation();

  const load = useCallback(() => useCases.getStory(storyId), [useCases, storyId]);
  const result = useAsyncData(load);

  const story = result.data?.story;
  const { findByName } = useUniversityDirectory(universityUseCases);
  const university = findByName(story?.author.university);
  const universityHref = university ? `/universitetet/${university.id}` : null;
  useDocumentTitle(story?.title ?? (result.status === 'loading' ? 'Historia' : 'Historia nuk u gjet'));

  if (result.status === 'loading' && !result.data) {
    return (
      <Container className="py-20">
        <StatusMessage className="text-cream/70">Po ngarkohet historia…</StatusMessage>
      </Container>
    );
  }

  if (result.status === 'error' || !story) {
    return (
      <NotFoundMessage
        title="Kjo histori nuk u gjet."
        description="Mund të jetë hequr ose lidhja është e pasaktë."
        href="/blog"
        linkLabel="Kthehu te blogu"
      />
    );
  }

  return (
    <>
      <article aria-labelledby="historia-titull">
        <header className="relative isolate overflow-hidden border-b border-cream/10">
          <Container className="pt-8 pb-10 lg:pt-12">
            <Link
              to="/blog"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cream/75 transition-colors hover:text-cream"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Kthehu te Blogu i Studentëve
            </Link>

            {state?.published && (
              <div role="status" className="mt-4 flex items-start gap-3 border-l-2 border-cream bg-navy px-5 py-4 motion-safe:animate-fade-up">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p>
                  <span className="font-semibold">Historia jote u publikua!</span>{' '}
                  <span className="text-cream/80">
                    Shenja “Praktikant i verifikuar” shtohet pasi kompania ta konfirmojë praktikën.
                  </span>
                </p>
              </div>
            )}

            <div className="mt-6 max-w-4xl motion-safe:animate-fade-up">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/blog?kategoria=${story.category}#eksploro`}
                  title="Shiko historitë e kësaj kategorie"
                  className="transition-opacity hover:opacity-85"
                >
                  <CategoryBadge category={story.category} />
                </Link>
                <VerifiedBadge verified={story.verified} className={story.verified ? 'bg-cream/15' : ''} />
              </div>
              <h1
                id="historia-titull"
                className="mt-5 font-display text-4xl leading-[1.08] font-medium tracking-tight sm:text-5xl lg:text-6xl"
              >
                {story.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-cream/75 sm:text-xl">{story.excerpt}</p>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-3">
                  <AuthorAvatar author={story.author} anonymous={story.anonymous} size="lg" />
                  <div>
                    <p className="font-semibold">{story.author.name}</p>
                    <p className="text-sm text-cream/65">
                      {[story.author.studyProgram, story.author.university].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cream/70">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    <time dateTime={story.publishedAt}>{formatDate(story.publishedAt)}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock aria-hidden="true" className="size-4" />
                    {readingTimeLabel(story.readingMinutes)}
                  </span>
                </p>
              </div>
            </div>
          </Container>
        </header>

        <Container className="pt-10">
          <StoryCover story={story} eager className="aspect-[16/9] max-h-[34rem] w-full sm:aspect-[21/9]" />
        </Container>

        <Container className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-14 lg:py-16">
          <div className="lg:col-span-8">
            <div className="max-w-[68ch] space-y-6 text-lg leading-[1.8] text-cream/85">
              {story.content.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? 'first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-none first-letter:text-cream'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <Reveal as="section" aria-labelledby="sfidat" className="border border-cream/15 bg-cream/[0.03] p-6">
                <h2 id="sfidat" className="flex items-center gap-2 font-display text-2xl font-medium">
                  <Mountain aria-hidden="true" className="size-5 text-terracotta" />
                  Sfidat
                </h2>
                <ul className="mt-4 space-y-3">
                  {story.challenges.map((challenge) => (
                    <li key={challenge} className="flex gap-3 text-cream/85">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-terracotta" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal as="section" delay={100} aria-labelledby="aftesite" className="border border-cream/15 bg-cream/[0.03] p-6">
                <h2 id="aftesite" className="flex items-center gap-2 font-display text-2xl font-medium">
                  <GraduationCap aria-hidden="true" className="size-5 text-terracotta" />
                  Aftësitë e fituara
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {story.skills.map((skill) => (
                    <li key={skill} className="rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-charcoal">
                      {skill}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

          </div>

          <aside aria-label="Detajet e praktikës" className="lg:col-span-4">
            <div className="bg-cream p-6 text-charcoal lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-medium">Detajet e praktikës</h2>
              <div className="mt-2">
                <FactList story={story} universityHref={universityHref} />
              </div>
              <div className="mt-4 border-t border-charcoal/15 pt-4">
                <VerifiedBadge verified={story.verified} className={story.verified ? '' : 'text-charcoal'} />
                <p className="mt-2 text-sm text-charcoal/70">
                  {story.verified
                    ? 'Kompania e ka konfirmuar që ky student ka bërë praktikë aty.'
                    : 'Praktika është në pritje të konfirmimit nga kompania.'}
                </p>
              </div>
              {story.companyId && (
                <Link
                  to={`/kompanite/${story.companyId}`}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-charcoal px-5 font-semibold text-cream transition-colors hover:bg-navy"
                >
                  Shiko pozitat te {story.companyName}
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </Link>
              )}
            </div>
          </aside>
        </Container>
      </article>

      {result.data.related.length > 0 && (
        <section aria-labelledby="te-ngjashme" className="border-t border-cream/10 py-16">
          <Container>
            <h2 id="te-ngjashme" className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Histori të ngjashme
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.data.related.map((item, index) => (
                <Reveal as="li" key={item.id} delay={index * 80}>
                  <StoryCard story={item} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

    </>
  );
}

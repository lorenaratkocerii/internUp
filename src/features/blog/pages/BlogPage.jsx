import { ArrowDownUp, PenLine, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { DATE_ORDER_OPTIONS } from '../../../application/blogUseCases';
import { categoryLabel } from '../../../domain/blog/storyTaxonomy';
import { Pagination } from '../../companies/components/Pagination';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { usePagination } from '../../companies/hooks/usePagination';
import { ButtonLink } from '../../home/components/ui/Button';
import { Container } from '../../home/components/ui/Container';
import { Reveal } from '../../home/components/ui/Reveal';
import { SectionHeading } from '../../home/components/ui/SectionHeading';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { BlogHero, SHARE_STORY_PATH } from '../components/BlogHero';
import { CategoryGrid } from '../components/CategoryGrid';
import { FeaturedStories } from '../components/FeaturedStories';
import { StoryCard } from '../components/StoryCard';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { useStoryBrowse } from '../hooks/useStoryBrowse';
import { useViewer } from '../hooks/useViewer';

const STORIES_PER_PAGE = 6;
const NO_STORIES = [];

function StoryGridSkeleton() {
  return (
    <ul aria-hidden="true" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index} className="h-[28rem] animate-pulse bg-cream/10" />
      ))}
    </ul>
  );
}

export function BlogPage({ useCases }) {
  useDocumentTitle('Blogu i Studentëve');
  const viewer = useViewer();

  const load = useCallback(() => useCases.listStories(), [useCases]);
  const directory = useAsyncData(load);
  const stories = directory.data ?? NO_STORIES;
  const { browse, setCategory, setOrder } = useStoryBrowse();

  const featured = useMemo(() => stories.filter((story) => story.featured).slice(0, 3), [stories]);
  const results = useMemo(() => useCases.browseStories(stories, browse), [useCases, stories, browse]);
  const counts = useMemo(
    () => stories.reduce((acc, story) => ({ ...acc, [story.category]: (acc[story.category] ?? 0) + 1 }), {}),
    [stories],
  );
  const stats = useMemo(
    () => [
      { label: 'Histori', value: stories.length || '–' },
      { label: 'Kompani', value: new Set(stories.map((story) => story.companyName)).size || '–' },
      {
        label: 'Universitete',
        value: new Set(stories.map((story) => story.author.university).filter(Boolean)).size || '–',
      },
    ],
    [stories],
  );

  const { visible, page, totalPages, goToPage } = usePagination(results, {
    pageSize: STORIES_PER_PAGE,
    resetKey: browse,
    storageKey: 'internup:blog-faqja',
  });

  const resultsRef = useRef(null);
  const pageChanged = useRef(false);
  const handlePageChange = (next) => {
    pageChanged.current = true;
    goToPage(next);
  };
  useEffect(() => {
    if (!pageChanged.current) return;
    pageChanged.current = false;
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [page]);

  const highlight = stories.find((story) => !featured.some((item) => item.id === story.id)) ?? featured[0] ?? stories[0];

  const openCategory = (category) => {
    setCategory(category);
    document.getElementById('eksploro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <BlogHero stats={stats} viewer={viewer} highlight={highlight} />

      {directory.status === 'error' && (
        <Container className="py-10">
          <StatusMessage className="text-cream/75">Historitë nuk u ngarkuan. Provo përsëri më vonë.</StatusMessage>
        </Container>
      )}

      {featured.length > 0 && (
        <section aria-labelledby="te-vecanta" className="py-16 lg:py-20">
          <Container>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                id="te-vecanta"
                eyebrow="Të zgjedhura"
                title="Historitë që po lexohen më shumë."
                description="Të zgjedhura nga ekipi i InternUp për sinqeritetin dhe këshillat praktike."
              />
            </div>
            <FeaturedStories stories={featured} />
          </Container>
        </section>
      )}

      <section aria-labelledby="kategorite" className="border-y border-cream/10 bg-mauve/25 py-16 lg:py-20">
        <Container>
          <SectionHeading
            id="kategorite"
            title="Gjej historinë që të duhet."
            className="mb-10"
          />
          <CategoryGrid counts={counts} activeCategory={browse.category} onSelect={openCategory} />
        </Container>
      </section>

      <section id="eksploro" aria-labelledby="eksploro-titull" className="scroll-mt-20 py-16 lg:py-20">
        <Container>
          <SectionHeading
            id="eksploro-titull"
            title={browse.category ? categoryLabel(browse.category) : 'Eksploro të gjitha përvojat.'}
            className="mb-8"
          />

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-cream/15 pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <p aria-live="polite" className="text-sm font-semibold text-cream/75">
                {results.length === 1 ? '1 histori' : `${results.length} histori`}
              </p>
              {browse.category && (
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full bg-cream px-3 text-sm font-semibold text-charcoal transition-colors hover:bg-cream/85"
                >
                  {categoryLabel(browse.category)}
                  <X aria-hidden="true" className="size-4" />
                  <span className="sr-only">— shfaq të gjitha kategoritë</span>
                </button>
              )}
            </div>

            <div className="w-full sm:w-auto">
              <label htmlFor="renditja-data" className="text-sm font-semibold text-cream/85">
                Rendit sipas datës
              </label>
              <div className="relative mt-1.5">
                <ArrowDownUp
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cream/70"
                />
                <select
                  id="renditja-data"
                  value={browse.order}
                  onChange={(event) => setOrder(event.target.value)}
                  className="min-h-11 w-full cursor-pointer border border-cream/30 bg-charcoal pr-3 pl-9 text-base text-cream transition-colors hover:border-cream/60 sm:w-auto"
                >
                  {DATE_ORDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div ref={resultsRef} tabIndex={-1} className="scroll-mt-24 outline-none">
            {directory.status === 'loading' && !directory.data && <StoryGridSkeleton />}

            {directory.data && (
              <>
                {results.length === 0 ? (
                  <div className="border-l-2 border-terracotta pl-5">
                    <p className="text-lg text-cream/85">
                      {browse.category
                        ? 'Ende nuk ka histori në këtë kategori. Bëhu i pari që ndan përvojën tënde!'
                        : 'Ende nuk ka histori të publikuara. Bëhu i pari që ndan përvojën tënde!'}
                    </p>
                    {browse.category && (
                      <button
                        type="button"
                        onClick={() => setCategory('')}
                        className="mt-3 min-h-11 cursor-pointer font-semibold underline underline-offset-4"
                      >
                        Shfaq të gjitha historitë
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {visible.map((story, index) => (
                        <Reveal as="li" key={story.id} delay={(index % 3) * 80}>
                          <StoryCard
                            story={story}
                          />
                        </Reveal>
                      ))}
                    </ul>
                    {totalPages > 1 && (
                      <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} label="Faqet e historive" />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </Container>
      </section>

      <section aria-labelledby="ndaj-historine" className="pb-20">
        <Container>
          <Reveal className="relative isolate overflow-hidden bg-cream px-6 py-12 text-charcoal sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-burgundy uppercase">Vetëm për studentë</p>
              <h2 id="ndaj-historine" className="mt-3 font-display text-3xl leading-tight font-medium sm:text-4xl">
                Praktika jote mund të jetë udhërrëfyesi i dikujt tjetër.
              </h2>
              <p className="mt-3 text-charcoal/75">
                Shkruaj si aplikove, çfarë mësove dhe çfarë do të bëje ndryshe. Mund ta publikosh edhe në mënyrë anonime.
              </p>
            </div>
            <ButtonLink href={SHARE_STORY_PATH} variant="charcoal" icon={PenLine} className="mt-7 shrink-0 lg:mt-0">
              Ndaj historinë tënde
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

    </>
  );
}

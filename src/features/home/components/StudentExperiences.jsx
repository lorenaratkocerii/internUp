import { ArrowUpRight } from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router';
import { categoryLabel } from '../../../domain/blog/storyTaxonomy';
import { useAsyncData } from '../hooks/useAsyncData';
import { ButtonLink } from './ui/Button';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

const NO_STORIES = [];
const STORIES_ON_HOME = 3;

export function StudentExperiences({ useCases }) {
  const load = useCallback(() => useCases.listStories(), [useCases]);
  const stories = useAsyncData(load);
  const featured = (stories.data ?? NO_STORIES).slice(0, STORIES_ON_HOME);

  if (!featured.length) return null;

  return (
    <section id="eksperiencat-e-studenteve" aria-labelledby="eksperiencat-titull" className="py-20 lg:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="eksperiencat-titull"
            eyebrow="Student Blog"
            title="Eksperiencat e studentëve."
          />
          <ButtonLink href="/blog" variant="ghost" icon={ArrowUpRight}>
            Të gjitha eksperiencat
          </ButtonLink>
        </div>

        <ul className="mt-14 grid gap-px bg-cream/15 p-px md:grid-cols-3">
          {featured.map((story, index) => (
            <Reveal as="li" key={story.id} delay={index * 60} className="bg-charcoal">
              <Link
                to={`/blog/${story.id}`}
                className="group flex h-full min-h-64 flex-col p-6 transition-colors duration-300 hover:bg-navy"
              >
                <span className="text-xs font-semibold tracking-[0.14em] text-cream/55 uppercase">
                  {categoryLabel(story.category)}
                </span>
                <h3 className="mt-4 font-display text-2xl leading-tight font-medium transition-colors group-hover:text-cream">
                  {story.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/70">{story.excerpt}</p>
                <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{story.author.name}</p>
                    <p className="mt-1 truncate text-xs text-cream/55">{story.author.university || 'Student InternUp'}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-cream/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream" />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

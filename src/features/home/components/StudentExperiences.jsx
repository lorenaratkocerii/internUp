import { useCallback } from 'react';
import { Link } from 'react-router';
import { categoryLabel } from '../../../domain/blog/storyTaxonomy';
import { useAsyncData } from '../hooks/useAsyncData';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { TextLink } from './ui/TextLink';

const NO_STORIES = [];
const STORIES_ON_HOME = 3;

export function StudentExperiences({ useCases }) {
  const load = useCallback(() => useCases.listStories(), [useCases]);
  const stories = useAsyncData(load);
  const featured = (stories.data ?? NO_STORIES).slice(0, STORIES_ON_HOME);

  if (!featured.length) return null;

  return (
    <section id="eksperiencat-e-studenteve" aria-labelledby="eksperiencat-titull" className="bg-navy py-20 lg:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2
            id="eksperiencat-titull"
            className="font-display text-4xl leading-[1.08] font-medium tracking-tight text-cream sm:text-5xl"
          >
            Eksperiencat e studentëve.
          </h2>
          <TextLink href="/blog">Lexo të gjitha në blog</TextLink>
        </div>

        <ol className="mt-12 border-t border-cream/20">
          {featured.map((story, index) => (
            <Reveal as="li" key={story.id} delay={index * 60} className="border-b border-cream/20">
              <Link to={`/blog/${story.id}`} className="group grid gap-x-10 gap-y-3 py-8 lg:grid-cols-12 lg:py-10">
                <div className="text-sm lg:col-span-3">
                  <p className="font-semibold">{story.author.name}</p>
                  <p className="mt-1 text-cream/65">{story.author.university || 'Student në InternUp'}</p>
                </div>
                <div className="lg:col-span-9">
                  <h3 className="max-w-3xl font-display text-2xl leading-tight font-medium decoration-cream/40 decoration-1 underline-offset-[6px] group-hover:underline sm:text-3xl">
                    {story.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 max-w-2xl leading-relaxed text-cream/75">{story.excerpt}</p>
                  <p className="mt-4 text-sm text-cream/60">{categoryLabel(story.category)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

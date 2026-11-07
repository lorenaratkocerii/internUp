import { ArrowUpRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router';
import { Reveal } from '../../home/components/ui/Reveal';
import { readingTimeLabel } from '../utils/format';
import { CategoryBadge, VerifiedBadge } from './StoryBadges';
import { StoryMeta } from './StoryCard';
import { StoryCover } from './StoryCover';

function LeadStory({ story }) {
  return (
    <article className="group relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden bg-navy text-cream lg:min-h-[34rem]">
      <StoryCover
        story={story}
        eager
        className="absolute inset-0 -z-20"
        imgClassName="group-hover:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-charcoal via-charcoal/70 to-charcoal/5" />

      <div className="p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={story.category} />
          <VerifiedBadge verified={story.verified} className="bg-cream/15 backdrop-blur" />
        </div>
        <h3 className="mt-4 max-w-2xl font-display text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
          <Link to={`/blog/${story.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {story.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-xl text-cream/80 sm:text-lg">{story.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <StoryMeta story={story} />
          <span className="inline-flex items-center gap-2 font-semibold">
            Lexo historinë
            <ArrowUpRight aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

function SideStory({ story }) {
  return (
    <article className="group relative grid grid-cols-[7rem_minmax(0,1fr)] gap-4 bg-cream p-3 text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <StoryCover story={story} className="aspect-square" imgClassName="group-hover:scale-105" />
      <div className="flex min-w-0 flex-col py-1 pr-1">
        <CategoryBadge category={story.category} className="self-start" />
        <h3 className="mt-2 line-clamp-2 font-display text-lg leading-snug font-medium">
          <Link to={`/blog/${story.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {story.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-sm text-charcoal/75">
          {story.author.name} · {story.companyName}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-charcoal/70">
          <span className="inline-flex items-center gap-1">
            <Briefcase aria-hidden="true" className="size-3.5" />
            {readingTimeLabel(story.readingMinutes)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function FeaturedStories({ stories }) {
  const [lead, ...rest] = stories;
  if (!lead) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <Reveal className="lg:col-span-7">
        <LeadStory story={lead} />
      </Reveal>
      <div className="grid content-start gap-5 lg:col-span-5">
        {rest.map((story, index) => (
          <Reveal key={story.id} delay={120 * (index + 1)}>
            <SideStory story={story} />
          </Reveal>
        ))}
        <Reveal delay={360} className="border-l-2 border-terracotta pl-5">
          <p className="text-sm font-semibold tracking-[0.14em] text-cream/60 uppercase">Pse lexojnë studentët</p>
          <p className="mt-2 text-cream/80">
            Çdo histori me shenjën <span className="font-semibold text-cream">Verified Intern</span> është shkruar nga një
            student praktika e të cilit është konfirmuar nga kompania.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

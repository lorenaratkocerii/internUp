import { Building2, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { formatDate, readingTimeLabel } from '../utils/format';
import { AuthorAvatar, CategoryBadge, VerifiedBadge } from './StoryBadges';
import { StoryCover } from './StoryCover';

export function StoryMeta({ story, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AuthorAvatar author={story.author} anonymous={story.anonymous} />
      <div className="min-w-0 text-sm">
        <p className="truncate font-semibold">{story.author.name}</p>
        <p className="flex flex-wrap items-center gap-x-2 opacity-70">
          <span className="inline-flex items-center gap-1">
            <Building2 aria-hidden="true" className="size-3.5" />
            {story.companyName}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3.5" />
            {readingTimeLabel(story.readingMinutes)}
          </span>
        </p>
      </div>
    </div>
  );
}

export function StoryCard({ story }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden bg-cream text-charcoal shadow-[0_1px_0_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 focus-within:-translate-y-1">
      <div className="relative">
        <StoryCover story={story} className="aspect-[16/10]" imgClassName="group-hover:scale-105" />
        <CategoryBadge category={story.category} className="absolute top-3 left-3" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-charcoal/70">
          <VerifiedBadge verified={story.verified} />
          <time dateTime={story.publishedAt}>{formatDate(story.publishedAt)}</time>
        </div>

        <h3 className="mt-3 font-display text-xl leading-snug font-medium tracking-tight">
          <Link
            to={`/blog/${story.id}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline group-hover:decoration-terracotta group-hover:decoration-2 group-hover:underline-offset-4"
          >
            {story.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 leading-relaxed text-charcoal/75">{story.excerpt}</p>

        <div className="mt-auto pt-5">
          <StoryMeta story={story} />
        </div>
      </div>
    </article>
  );
}

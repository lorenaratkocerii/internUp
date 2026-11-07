import { Quote } from 'lucide-react';

export function StoryCover({ story, className = '', imgClassName = '', eager = false }) {
  if (story.coverImage) {
    return (
      <div className={`overflow-hidden bg-navy ${className}`}>
        <img
          src={story.coverImage}
          alt={story.coverAlt || ''}
          loading={eager ? 'eager' : 'lazy'}
          className={`size-full object-cover transition-transform duration-700 ease-out ${imgClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center overflow-hidden bg-linear-to-br from-navy via-mauve to-burgundy ${className}`}
    >
      <Quote className="size-12 text-cream/40" strokeWidth={1.25} />
      <span className="absolute bottom-3 left-4 font-display text-lg text-cream/80">{story.companyName}</span>
    </div>
  );
}

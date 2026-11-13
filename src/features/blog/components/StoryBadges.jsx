import { BadgeCheck, Clock3 } from 'lucide-react';
import { categoryLabel } from '../../../domain/blog/storyTaxonomy';

export function VerifiedBadge({ verified, className = '' }) {
  if (verified) {
    return (
      <span
        title="Praktika është konfirmuar nga kompania përmes InternUp"
        className={`inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-cream ${className}`}
      >
        <BadgeCheck aria-hidden="true" className="size-3.5" />
        Praktikant i verifikuar
      </span>
    );
  }
  return (
    <span
      title="Kompania ende nuk e ka konfirmuar këtë praktikë"
      className={`inline-flex items-center gap-1 rounded-full border border-current/25 px-2.5 py-1 text-xs font-semibold opacity-75 ${className}`}
    >
      <Clock3 aria-hidden="true" className="size-3.5" />
      Në verifikim
    </span>
  );
}

export function CategoryBadge({ category, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-terracotta px-2.5 py-1 text-xs font-semibold tracking-wide text-cream ${className}`}
    >
      {categoryLabel(category)}
    </span>
  );
}

export function AuthorAvatar({ author, anonymous, size = 'md' }) {
  const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg' };
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${sizes[size]} ${
        anonymous ? 'bg-mauve text-cream' : 'bg-burgundy text-cream'
      }`}
    >
      {author.initials}
    </span>
  );
}

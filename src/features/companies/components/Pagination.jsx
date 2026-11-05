import { ArrowLeft, ArrowRight } from 'lucide-react';

const arrowClasses =
  'grid size-12 cursor-pointer place-items-center border border-cream/40 text-cream transition-colors duration-300 hover:border-cream hover:bg-cream/10 disabled:cursor-not-allowed disabled:border-cream/15 disabled:text-cream/30 disabled:hover:bg-transparent';

export function Pagination({ page, totalPages, onChange, label }) {
  return (
    <nav aria-label={label} className="mt-10 flex items-center justify-center gap-6">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Faqja e mëparshme"
        className={arrowClasses}
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
      </button>
      <p aria-live="polite" className="min-w-28 text-center font-semibold text-cream/85">
        Faqja {page} nga {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Faqja tjetër"
        className={arrowClasses}
      >
        <ArrowRight aria-hidden="true" className="size-5" />
      </button>
    </nav>
  );
}

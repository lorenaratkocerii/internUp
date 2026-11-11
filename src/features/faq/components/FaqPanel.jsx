import { useEffect, useRef, useState } from 'react';
import { ChevronDown, CircleHelp, Mail, Search, X } from 'lucide-react';
import { contact } from '../../home/content';
import { faqItems } from '../content';

const normalize = (text) => text.toLowerCase().replace(/ë/g, 'e').replace(/ç/g, 'c');

export function FaqPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null);

  const close = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    searchRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const term = normalize(query.trim());
  const visibleItems = faqItems.filter(
    (item) => !term || normalize(`${item.question} ${item.answer}`).includes(term),
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Hap pyetjet e shpeshta"
        aria-expanded={isOpen}
        className="group fixed right-4 bottom-4 z-[55] grid size-14 place-items-center rounded-full bg-terracotta text-cream shadow-xl shadow-charcoal/30 ring-1 ring-cream/20 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-burgundy sm:right-6 sm:bottom-6"
      >
        <CircleHelp aria-hidden="true" className="size-6 transition-transform duration-300 group-hover:scale-110" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[65] bg-charcoal/60 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-titull"
            className="ml-auto flex h-full w-full max-w-md flex-col border-l border-cream/10 bg-charcoal text-cream shadow-2xl motion-safe:animate-slide-in"
          >
            <header className="border-b border-cream/10 px-6 pt-6 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-cream/55 uppercase">Qendra e ndihmës</p>
                  <h2 id="faq-titull" className="mt-1 font-display text-3xl">
                    Pyetjet e shpeshta
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Mbyll pyetjet e shpeshta"
                  className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">
                Mirë se erdhe! Këtu gjen përgjigjet për pyetjet më të zakonshme rreth InternUp.
              </p>

              <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-cream/15 bg-cream/[0.04] px-3.5 transition-colors focus-within:border-cream/50">
                <Search aria-hidden="true" className="size-4 shrink-0 text-cream/50" />
                <label htmlFor="faq-kerko" className="sr-only">
                  Kërko një pyetje
                </label>
                <input
                  ref={searchRef}
                  id="faq-kerko"
                  type="search"
                  value={query}
                  autoComplete="off"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpenIndex(null);
                  }}
                  placeholder="Kërko një pyetje…"
                  className="min-h-11 min-w-0 flex-1 bg-transparent text-base text-cream placeholder:text-cream/40 focus:outline-none sm:text-sm"
                />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-2">
              {visibleItems.length > 0 ? (
                <ul aria-live="polite">
                  {visibleItems.map((item, index) => {
                    const expanded = openIndex === index;
                    const answerId = `faq-pergjigja-${index}`;
                    return (
                      <li key={item.question} className="border-b border-cream/10 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setOpenIndex(expanded ? null : index)}
                          aria-expanded={expanded}
                          aria-controls={answerId}
                          className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold transition-colors hover:text-cream/80"
                        >
                          {item.question}
                          <ChevronDown
                            aria-hidden="true"
                            className={`size-5 shrink-0 text-cream/50 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <div
                          id={answerId}
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                        >
                          <p className="overflow-hidden text-sm leading-relaxed text-cream/70" aria-hidden={!expanded}>
                            <span className="block pb-4">{item.answer}</span>
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p aria-live="polite" className="py-10 text-center text-sm text-cream/60">
                  Nuk u gjet asnjë pyetje për “{query.trim()}”.
                </p>
              )}
            </div>

            <footer className="border-t border-cream/10 px-6 py-5">
              <p className="text-sm text-cream/60">Nuk e gjete përgjigjen?</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cream px-4 py-2.5 font-semibold text-charcoal transition-colors hover:bg-cream/85"
              >
                <Mail aria-hidden="true" className="size-4" />
                Na shkruaj në {contact.email}
              </a>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}

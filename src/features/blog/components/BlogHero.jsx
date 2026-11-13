import { ArrowDown, PenLine, Quote } from 'lucide-react';
import { ButtonLink } from '../../home/components/ui/Button';
import { Container } from '../../home/components/ui/Container';

export const SHARE_STORY_PATH = '/blog/shkruaj';

export function BlogHero({ stats, viewer, highlight }) {
  return (
    <section aria-labelledby="blog-titull" className="relative isolate overflow-hidden border-b border-cream/10">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-32 -z-10 size-[34rem] rounded-full bg-terracotta/20 blur-3xl"
      />
      <div aria-hidden="true" className="absolute -bottom-48 -left-40 -z-10 size-[30rem] rounded-full bg-navy/60 blur-3xl" />

      <Container className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-14 lg:py-20">
        <div className="motion-safe:animate-fade-up lg:col-span-7">
          <p className="text-sm font-semibold tracking-[0.18em] text-cream/70 uppercase">Student Blog · InternUp</p>
          <h1
            id="blog-titull"
            className="mt-6 font-hero text-5xl leading-[1] font-bold tracking-tight text-cream sm:text-6xl xl:text-7xl"
          >
            Real Stories.
            <span className="mt-2 block font-normal text-cream/70">Real Experience.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/75">
            Përvoja të vërteta nga studentët e Kosovës që kanë bërë praktikë — si aplikuan, çfarë mësuan dhe çfarë do
            t’i thoshin vetes para ditës së parë.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href={SHARE_STORY_PATH} icon={PenLine}>
              Share Your Story
            </ButtonLink>
            <ButtonLink href="#eksploro" variant="ghost" icon={ArrowDown}>
              Eksploro historitë
            </ButtonLink>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-cream/15 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-semibold tracking-wide text-cream/60 uppercase">{stat.label}</dt>
                <dd className="mt-1 font-display text-3xl font-medium text-cream tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {highlight && (
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="absolute inset-y-6 right-0 left-10 rotate-3 bg-terracotta/40" aria-hidden="true" />
            <figure className="relative h-full min-h-[26rem] -rotate-2 overflow-hidden bg-navy shadow-2xl motion-safe:animate-fade-up">
              <img src={highlight.coverImage} alt="" className="absolute inset-0 size-full object-cover opacity-80" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/40 to-transparent" />
              <blockquote className="absolute inset-x-0 bottom-0 p-7">
                <Quote aria-hidden="true" className="size-8 text-cream/70" />
                <p className="mt-3 font-display text-2xl leading-snug text-cream">“{highlight.excerpt}”</p>
                <figcaption className="mt-4 text-sm text-cream/75">
                  <span className="font-semibold text-cream">{highlight.author.name}</span> · {highlight.position},{' '}
                  {highlight.companyName}
                </figcaption>
              </blockquote>
            </figure>
          </div>
        )}
      </Container>
    </section>
  );
}

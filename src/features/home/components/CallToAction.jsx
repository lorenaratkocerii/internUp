import { authLinks } from '../content';
import { ButtonLink } from './ui/Button';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';

const decorativeSteps = ['h-1/4 bg-olive', 'h-1/2 bg-terracotta', 'h-3/4 bg-navy', 'h-full bg-cream'];

export function CallToAction() {
  return (
    <section id="krijo-llogari" aria-labelledby="cta-titull" className="pb-20 lg:pb-28">
      <Container>
        <Reveal className="relative overflow-hidden bg-mauve">
          <div className="relative z-10 px-6 py-14 sm:px-12 sm:py-20 lg:max-w-[64%] lg:px-16 lg:py-24">
            <h2
              id="cta-titull"
              className="font-display text-4xl leading-[1.05] font-medium tracking-tight text-cream sm:text-6xl"
            >
              Mundësia jote e parë fillon këtu.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/85">
              Krijo llogarinë tënde falas dhe bëhu gati për praktikën që të hap derën e karrierës.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={authLinks.signup}>
                Krijo llogari
              </ButtonLink>
              <ButtonLink href="/kompanite" variant="ghost">
                Shfleto kompanitë
              </ButtonLink>
            </div>
          </div>

          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/3 items-end gap-2 pt-10 lg:flex">
            {decorativeSteps.map((classes) => (
              <div key={classes} className={`flex-1 ${classes}`} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

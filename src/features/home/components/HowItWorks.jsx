import { Compass, Send, UserRoundPen } from 'lucide-react';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

const steps = [
  {
    icon: UserRoundPen,
    title: 'Krijo profilin',
    description: 'Shto studimet, aftësitë dhe projektet e tua, që kompanitë të shohin çfarë di të bësh.',
    classes: 'bg-charcoal text-cream md:min-h-[19rem]',
    muted: 'text-cream/75',
  },
  {
    icon: Compass,
    title: 'Zbulo mundësitë',
    description: 'Kërko sipas pozitës dhe lokacionit dhe gjej praktikat që u përshtaten interesave të tua.',
    classes: 'bg-mauve text-cream md:min-h-[25rem]',
    muted: 'text-cream/80',
  },
  {
    icon: Send,
    title: 'Apliko',
    description: 'Dërgo aplikimin me profilin tënd dhe bëj hapin e parë drejt karrierës që dëshiron.',
    classes: 'bg-cream text-charcoal md:min-h-[31rem]',
    muted: 'text-mauve',
  },
];

export function HowItWorks() {
  return (
    <section id="si-funksionon" aria-labelledby="si-funksionon-titull" className="bg-navy pt-20 lg:pt-28">
      <Container>
        <SectionHeading
          id="si-funksionon-titull"
          eyebrow="Si funksionon"
          title="Tre hapa, një drejtim: lart."
          description="Nga profili i parë deri te aplikimi, çdo hap të afron me përvojën që po kërkon."
          className="lg:max-w-[58%]"
        />

        <ol className="mt-14 grid items-end md:grid-cols-3 lg:-mt-16">
          {steps.map(({ icon: Icon, title, description, classes, muted }, index) => (
            <Reveal as="li" key={title} delay={index * 120}>
              <div className={`flex flex-col p-7 lg:p-10 ${classes}`}>
                <div className="flex items-start justify-between">
                  <span aria-hidden="true" className="font-display text-6xl font-medium tracking-tight lg:text-7xl">
                    {index + 1}
                  </span>
                  <Icon aria-hidden="true" className="size-7" strokeWidth={1.5} />
                </div>
                <h3 className="mt-auto pt-8 font-display text-3xl font-medium tracking-tight">{title}</h3>
                <p className={`mt-3 text-base leading-relaxed ${muted}`}>{description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

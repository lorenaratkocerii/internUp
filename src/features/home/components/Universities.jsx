import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { UniversityLogo } from '../../universities/components/UniversityLogo';
import { useUniversityDirectory } from '../../universities/hooks/useUniversityDirectory';
import { ButtonLink } from './ui/Button';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';

const ON_HOME = 6;

export function Universities({ useCases }) {
  const { universities } = useUniversityDirectory(useCases);
  if (universities.length === 0) return null;

  const featured = [...universities].sort((a, b) => b.verifiedStudents - a.verifiedStudents).slice(0, ON_HOME);

  return (
    <section id="universitetet" aria-labelledby="universitetet-titull" className="pb-20 lg:pb-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="universitetet-titull" eyebrow="Universitetet" title="Studentë nga gjithë Kosova." />
          <ButtonLink href="/universitetet" variant="ghost" icon={ArrowUpRight}>
            Të gjitha universitetet
          </ButtonLink>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-px bg-cream/15 p-px md:grid-cols-3 xl:grid-cols-6">
          {featured.map((university, index) => (
            <Reveal as="li" key={university.id} delay={index * 60} className="bg-charcoal">
              <Link
                to={`/universitetet/${university.id}`}
                className="group flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:bg-navy"
              >
                <UniversityLogo
                  university={university}
                  className="size-12 transition-transform duration-300 group-hover:-translate-y-1"
                  padding="p-1"
                />
                <div>
                  <p className="font-display text-xl leading-tight font-medium">{university.shortName}</p>
                  <p className="mt-1 text-sm text-cream/70">{university.city}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import { Link } from 'react-router';
import { UniversityLogo } from '../../universities/components/UniversityLogo';
import { useUniversityDirectory } from '../../universities/hooks/useUniversityDirectory';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { TextLink } from './ui/TextLink';

const ON_HOME = 6;

export function Universities({ useCases }) {
  const { universities } = useUniversityDirectory(useCases);
  if (universities.length === 0) return null;

  const featured = [...universities].sort((a, b) => b.verifiedStudents - a.verifiedStudents).slice(0, ON_HOME);

  return (
    <section id="universitetet" aria-labelledby="universitetet-titull" className="pb-20 lg:pb-28">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2
            id="universitetet-titull"
            className="font-display text-4xl leading-[1.08] font-medium tracking-tight text-cream sm:text-5xl"
          >
            Studentë nga gjithë Kosova.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-cream/75">
            {universities.length} universitete dhe kolegje i verifikojnë vetë studentët e tyre në InternUp.
          </p>
          <TextLink href="/universitetet" className="mt-4">
            Shiko të gjitha universitetet
          </TextLink>
        </div>

        <ul className="grid self-start border-t border-cream/15 sm:grid-cols-2 sm:gap-x-10 lg:col-span-8">
          {featured.map((university, index) => (
            <Reveal as="li" key={university.id} delay={index * 60} className="border-b border-cream/15">
              <Link to={`/universitetet/${university.id}`} className="group flex items-center gap-4 py-4">
                <UniversityLogo university={university} className="size-12 bg-[#fff]" padding="p-1" />
                <span className="min-w-0">
                  <span className="block truncate font-display text-xl leading-tight font-medium decoration-cream/40 underline-offset-4 group-hover:underline">
                    {university.shortName}
                  </span>
                  <span className="mt-0.5 block text-sm text-cream/65">{university.city}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import { Link } from 'react-router';
import { UniversityLogo } from './UniversityLogo';

const GRID = 'mx-auto flex max-w-[292px] flex-wrap justify-center gap-3 sm:max-w-[432px] sm:gap-4 lg:max-w-[768px]';
const TILE = 'size-16 sm:size-24';
const WHITE = 'bg-[#fff]';
const PLACEHOLDERS = 21;

export function LogoWall({ universities, loading = false }) {
  if (loading) {
    return (
      <ul aria-hidden="true" className={GRID}>
        {Array.from({ length: PLACEHOLDERS }, (_, index) => (
          <li key={index} className={`bg-cream/[0.08] ${TILE}`} />
        ))}
      </ul>
    );
  }

  const withLogos = universities.filter((university) => university.logo);
  if (withLogos.length === 0) return null;

  return (
    <ul aria-label="Universitetet" className={GRID}>
      {withLogos.map((university) => (
        <li key={university.id}>
          <Link
            to={`/universitetet/${university.id}`}
            title={university.shortName}
            className="block transition-transform duration-200 hover:-translate-y-1"
          >
            <UniversityLogo university={university} className={`${WHITE} ${TILE}`} padding="p-2 sm:p-3" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

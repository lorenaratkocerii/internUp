import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { ButtonLink } from './ui/Button';
import { Container } from './ui/Container';
import { SearchBar } from './SearchBar';
import { StepsGraphic } from './StepsGraphic';

export function Hero({ draft, options, filterOptions, onFieldChange, onSearch }) {
  return (
    <section id="kreu" aria-labelledby="hero-titull">
      <Container className="grid gap-12 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-16 lg:pt-20">
        <div className="pb-2 motion-safe:animate-fade-up lg:col-span-7 lg:pb-16">
          <p className="text-sm font-semibold tracking-[0.18em] text-cream/70 uppercase">
            Platforma e praktikave për studentë
          </p>
          <h1
            id="hero-titull"
            className="mt-6 font-hero text-5xl leading-[1] font-bold tracking-tight text-cream sm:text-6xl xl:text-7xl"
          >
            Gjej praktikën tënde të radhës.{' '}
            <span className="mt-2 block font-normal text-cream/70">Fillo karrierën që sot.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/75">
            InternUp lidh studentët me kompanitë që ofrojnë praktika profesionale. Krijo profilin,
            apliko në disa hapa dhe fito përvojën tënde të parë në tregun e punës.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/kompanite" icon={ArrowUpRight}>
              Shfleto kompanitë
            </ButtonLink>
            <ButtonLink href="#si-funksionon" variant="ghost" icon={ArrowDown}>
              Si funksionon
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <StepsGraphic />
        </div>
      </Container>

      <Container className="relative z-10 lg:-mt-8">
        <SearchBar
          draft={draft}
          options={options}
          filterOptions={filterOptions}
          onFieldChange={onFieldChange}
          onSubmit={onSearch}
        />
      </Container>
    </section>
  );
}

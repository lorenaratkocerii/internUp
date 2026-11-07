import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '../../home/components/ui/Button';
import { Container } from '../../home/components/ui/Container';

export function CompanySignup() {
  return (
    <section id="regjistro-kompanine" aria-labelledby="regjistro-kompanine-titull" className="bg-burgundy py-16 lg:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <h2
            id="regjistro-kompanine-titull"
            className="max-w-3xl font-display text-3xl leading-[1.1] font-medium tracking-tight text-cream sm:text-5xl"
          >
            {'Dëshironi që edhe kompania juaj të shfaqë publikime?'}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            {'Regjistrohuni dhe krijoni llogarinë e kompanisë suaj.'}
          </p>
          <ButtonLink href="/regjistrohu/kompani" icon={ArrowRight} className="mt-8">
            Regjistrohu si kompani
          </ButtonLink>
        </div>
        <img
          src="/images/companies/regjistrim-ikone.png"
          alt=""
          className="hidden size-64 object-contain lg:block xl:size-72"
        />
      </Container>
    </section>
  );
}

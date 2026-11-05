import { ArrowLeft } from 'lucide-react';
import { ButtonLink } from '../../home/components/ui/Button';
import { Container } from '../../home/components/ui/Container';

export function NotFoundMessage({ title, description, href = '/kompanite', linkLabel = 'Kthehu te kompanitë' }) {
  return (
    <Container className="py-24 lg:py-32">
      <h1 className="max-w-2xl font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-xl text-lg text-cream/75">{description}</p>}
      <ButtonLink href={href} className="mt-8 flex-row-reverse">
        {linkLabel}
        <ArrowLeft aria-hidden="true" className="size-5" />
      </ButtonLink>
    </Container>
  );
}

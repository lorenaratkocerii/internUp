import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { StatusMessage } from './ui/StatusMessage';

export function Statistics({ stats }) {
  return (
    <section aria-label="InternUp në shifra" className="py-16 lg:py-24">
      <Container>
        {stats.status === 'error' && (
          <StatusMessage className="text-cream/75">
            Statistikat nuk u ngarkuan. Provo përsëri më vonë.
          </StatusMessage>
        )}

        {stats.data && (
          <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {stats.data.map((stat, index) => (
              <Reveal
                key={stat.id}
                delay={index * 90}
                className="flex flex-col-reverse justify-end border-l border-cream/20 pr-3 pl-4 sm:pl-6"
              >
                <dt className="mt-2 text-sm leading-snug text-cream/75 sm:text-base">{stat.label}</dt>
                <dd className="font-display text-5xl font-medium tracking-tight text-cream sm:text-6xl xl:text-7xl">
                  {stat.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}

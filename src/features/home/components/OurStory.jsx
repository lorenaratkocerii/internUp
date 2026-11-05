import { useScrollProgress } from '../hooks/useScrollProgress';
import { Container } from './ui/Container';
import { StoryPaths } from './StoryPaths';

const chapters = [
  {
    when: 'Në fillim',
    title: 'Ishim katër studentë',
    text: 'Secili me studimet, provimet dhe orarin e vet. Por të katërt donim të njëjtën gjë: të mos e prisnim diplomën për të filluar punën.',
    more: 'Nuk kishim përvojë të madhe, as lidhje në kompani. Kishim kohën mes ligjëratave, disa projekte nga fakulteti dhe vullnetin për të mësuar atë që nuk gjendej në libra.',
    image: '/images/story/fillimi.jpg',
    alt: 'Katër të reja duke biseduar rreth një tavoline me laptop.',
    position: 'object-[center_68%]',
  },
  {
    when: 'Gjatë studimeve',
    title: 'Kërkonim një mundësi',
    text: 'Gjatë viteve të studimit kërkonim punë part-time dhe praktika. Mundësitë ishin të shpërndara, përgjigjet vinin rrallë dhe shpesh nuk e dinim as ku të trokitnim.',
    more: 'Dërgonim CV, pyesnim miq dhe profesorë dhe kontrollonim faqe të ndryshme njëra pas tjetrës. Çdo përgjigje negative na mësonte diçka, dhe çdo gjë që mësonim e ndanim me njëri-tjetrin.',
    image: '/images/story/kerkimi.jpg',
    alt: 'Një studente duke punuar në laptop mes librave, para raftit të bibliotekës.',
  },
  {
    when: 'Në fund',
    title: 'Ia dolëm',
    text: 'Një derë pas tjetrës, ajo që kërkonim u realizua. Por rruga na mësoi diçka: nuk duhej të ishte kaq e vështirë.',
    more: 'Puna part-time dhe praktikat na dhanë përvojën e parë të vërtetë: si punohet në ekip, si respektohet një afat dhe si zbatohet në praktikë ajo që kishim mësuar në fakultet.',
    image: '/images/story/ia-dolem.jpg',
    alt: 'Një e re dhe një burrë duke shtrënguar duart mbi një tavolinë mbledhjesh në zyrë.',
  },
  {
    when: 'Sot',
    title: 'Lindi InternUp',
    text: 'Kështu u realizua edhe kjo platformë. E ndërtuam për studentin që sot është aty ku ishim ne dikur, që praktikën ta gjejë më lehtë dhe karrierën ta nisë më herët.',
    more: 'Në InternUp, studentët kërkojnë praktika sipas pozitës dhe lokacionit dhe aplikojnë me profilin e tyre, të gjitha në një vend. Kompanitë, nga ana tjetër, takojnë studentë që duan të mësojnë dhe të kontribuojnë.',
    image: '/images/story/internup.jpg',
    alt: 'Një ekip prej katër vetash duke punuar në zyrë pranë një tabele të bardhë.',
  },
];

export function OurStory() {
  const [chaptersRef, progress] = useScrollProgress(0.85);
  const reached = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));

  return (
    <section id="historia" aria-labelledby="historia-titull" className="bg-cream py-20 text-charcoal lg:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-14">
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <p className="text-sm font-semibold tracking-[0.18em] text-mauve uppercase">Historia jonë</p>
            <h2
              id="historia-titull"
              className="mt-4 font-display text-4xl leading-[1.08] font-medium tracking-tight sm:text-5xl"
            >
              Katër studentë, <em className="font-normal">një kërkim i njëjtë.</em>
            </h2>
          </div>

          <div className="sticky top-18 z-10 -mx-5 bg-cream px-5 py-3 sm:-mx-8 sm:px-8 lg:top-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:h-[calc(100vh-8rem)] lg:self-start lg:border-l lg:border-charcoal/15 lg:py-0 lg:pr-0 lg:pl-12">
            <StoryPaths progress={progress} className="mx-auto h-44 sm:h-56 lg:h-full" />
          </div>

          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:pb-16">
            <ol ref={chaptersRef} className="space-y-12 lg:space-y-16">
              {chapters.map(({ when, title, text, more, image, alt, position = 'object-center' }, index) => (
                <li
                  key={title}
                  className={`grid gap-6 border-t border-charcoal/20 pt-8 transition-opacity duration-500 sm:grid-cols-[16rem_1fr] sm:gap-8 ${index <= reached ? 'opacity-100' : 'opacity-50'}`}
                >
                  <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className={`aspect-[16/10] w-full object-cover ${position}`}
                  />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-mauve uppercase">{when}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">{title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-charcoal/80">{text}</p>
                    <p className="mt-3 text-base leading-relaxed text-charcoal/80">{more}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-12 border-t border-charcoal/20 pt-8 font-display text-xl leading-snug italic lg:mt-16 lg:text-2xl">
              Katër rrugë u bashkuan në një. Tani kjo rrugë është edhe e jotja.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

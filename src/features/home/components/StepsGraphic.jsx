import { Briefcase, Compass, Send, TrendingUp, UserRound } from 'lucide-react';

const steps = [
  { icon: UserRound, height: 'h-[20%]', tone: 'bg-olive text-cream' },
  { icon: Compass, height: 'h-[38%]', tone: 'bg-mauve text-cream' },
  { icon: Send, height: 'h-[56%]', tone: 'bg-terracotta text-cream' },
  { icon: Briefcase, height: 'h-[78%]', tone: 'bg-navy text-cream' },
  { icon: TrendingUp, height: 'h-full', tone: 'bg-cream text-charcoal' },
];

export function StepsGraphic() {
  return (
    <div aria-hidden="true" className="relative h-72 sm:h-96 lg:h-full lg:min-h-[32rem]">
      <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2">
        {steps.map(({ icon: Icon, height, tone }, index) => (
          <div
            key={height}
            style={{ animationDelay: `${150 + index * 110}ms` }}
            className={`flex flex-1 origin-bottom justify-center pt-4 motion-safe:animate-rise sm:pt-5 ${height} ${tone}`}
          >
            <Icon className="size-5 sm:size-6" strokeWidth={1.75} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Roadmap({ steps }) {
  return (
    <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
      <span
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-6 w-px bg-linear-to-b from-terracotta via-cream/30 to-cream/10 md:top-6 md:right-6 md:bottom-auto md:left-6 md:h-px md:w-auto md:bg-linear-to-r"
      />
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-5 md:flex-col md:gap-0">
          <span
            className={`relative grid size-12 shrink-0 place-items-center rounded-full border font-display text-lg font-semibold ${
              index === 0 ? 'border-terracotta bg-terracotta text-cream' : 'border-cream/30 bg-charcoal text-cream'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="md:mt-5">
            <h3 className="font-display text-xl font-medium">{step.title}</h3>
            <p className="mt-1.5 leading-relaxed text-cream/70">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

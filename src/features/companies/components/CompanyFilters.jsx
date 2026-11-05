import { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const fieldClasses =
  'mt-1.5 min-h-11 w-full border border-cream/30 bg-charcoal px-3 text-base text-cream transition-colors duration-200 hover:border-cream/60';

function SelectFilter({ id, label, value, options, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-cream/85">
        {label}
      </label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClasses}>
        <option value="">Të gjitha</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CompanyFilters({ filters, options, onChange, onReset, hasActiveFilters }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <form
      role="search"
      aria-label="Filtro kompanitë"
      onSubmit={(event) => event.preventDefault()}
      className="bg-navy p-5 text-cream sm:p-6"
    >
      <div className="flex min-h-9 items-center justify-between gap-3">
        <h2 className="font-display text-xl font-medium">Filtrat</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 text-sm font-semibold underline underline-offset-4"
          >
            <X aria-hidden="true" className="size-4" />
            Pastro
          </button>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="kerko-kompani" className="text-sm font-semibold text-cream/85">
          Kërko
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 mt-[3px] size-4 -translate-y-1/2 text-cream/70"
          />
          <input
            id="kerko-kompani"
            type="search"
            value={filters.query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder="Emër, teknologji..."
            autoComplete="off"
            className={`${fieldClasses} pl-9 placeholder:text-cream/60`}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        aria-controls="filtrat-e-tjera"
        className="mt-4 flex min-h-11 w-full cursor-pointer items-center justify-between border border-cream/30 px-3 font-semibold lg:hidden"
      >
        {isExpanded ? 'Fshih filtrat' : 'Shfaq filtrat'}
        <ChevronDown
          aria-hidden="true"
          className={`size-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <div id="filtrat-e-tjera" className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <SelectFilter
            id="filtri-industria"
            label="Industria"
            value={filters.industry}
            options={options.industries}
            onChange={(value) => onChange('industry', value)}
          />
          <SelectFilter
            id="filtri-lokacioni"
            label="Lokacioni"
            value={filters.location}
            options={options.locations}
            onChange={(value) => onChange('location', value)}
          />
          <SelectFilter
            id="filtri-menyra"
            label="Remote / Hybrid / On-site"
            value={filters.workMode}
            options={options.workModes}
            onChange={(value) => onChange('workMode', value)}
          />
          <SelectFilter
            id="filtri-madhesia"
            label="Madhësia"
            value={filters.size}
            options={options.sizes}
            onChange={(value) => onChange('size', value)}
          />
        </div>

        <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={filters.hiringOnly}
            onChange={(event) => onChange('hiringOnly', event.target.checked)}
            className="size-5 shrink-0 cursor-pointer accent-cream"
          />
          Vetëm me pozita aktive
        </label>
      </div>
    </form>
  );
}

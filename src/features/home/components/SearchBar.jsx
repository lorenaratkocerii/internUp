import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import { buttonClasses } from './ui/Button';

function SearchField({ id, label, icon: Icon, placeholder, options, filterOptions, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const listId = `${id}-lista`;
  const visibleOptions = isTyping ? filterOptions(options, value) : options;
  const isExpanded = isOpen && visibleOptions.length > 0;

  useEffect(() => {
    if (activeIndex >= 0) listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const open = () => {
    setIsTyping(false);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const choose = (option) => {
    onChange(option);
    close();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isExpanded) {
        open();
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + step + visibleOptions.length) % visibleOptions.length);
    } else if (event.key === 'Escape') {
      close();
    } else if (event.key === 'Enter') {
      if (isExpanded && activeIndex >= 0) {
        event.preventDefault();
        choose(visibleOptions[activeIndex]);
      } else {
        close();
      }
    }
  };

  return (
    <div className="relative flex flex-1 items-center gap-3 px-4 py-3 transition-colors duration-200 outline-charcoal -outline-offset-2 focus-within:bg-charcoal/5 focus-within:outline-2 hover:bg-charcoal/5">
      <Icon aria-hidden="true" className="size-5 shrink-0 text-terracotta" />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-xs font-semibold tracking-wide text-mauve uppercase">
          {label}
        </label>
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isExpanded}
          aria-controls={listId}
          aria-activedescendant={isExpanded && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            onChange(event.target.value);
            setIsTyping(true);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onClick={() => {
            if (!isOpen) open();
          }}
          onKeyDown={handleKeyDown}
          onBlur={close}
          className="mt-0.5 w-full bg-transparent text-base text-charcoal outline-none! placeholder:text-charcoal/70"
        />
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-label={isExpanded ? `Mbyll listën: ${label}` : `Hap listën: ${label}`}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (isExpanded) {
            close();
          } else {
            open();
            inputRef.current?.focus();
          }
        }}
        className="-mr-1 grid size-9 shrink-0 cursor-pointer place-items-center text-charcoal/70 hover:text-charcoal"
      >
        <ChevronDown
          aria-hidden="true"
          className={`size-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={label}
        hidden={!isExpanded}
        onMouseDown={(event) => event.preventDefault()}
        className="absolute top-full right-0 left-0 z-30 mt-1 max-h-72 overflow-y-auto border border-charcoal/25 bg-cream py-1 text-charcoal shadow-lg shadow-charcoal/40"
      >
        {visibleOptions.map((option, index) => (
          <li
            key={option}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={option === value}
            onClick={() => choose(option)}
            onMouseEnter={() => setActiveIndex(index)}
            className={`cursor-pointer px-4 py-2.5 text-base aria-selected:font-semibold ${
              index === activeIndex ? 'bg-charcoal text-cream' : ''
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchBar({ draft, options, filterOptions, onFieldChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(draft);
  };

  return (
    <form
      role="search"
      aria-label="Kërko praktika"
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 bg-cream p-2 md:flex-row md:items-stretch"
    >
      <SearchField
        id="kerko-pozita"
        label="Pozita"
        icon={Search}
        placeholder="p.sh. Frontend Developer"
        options={options.positions}
        filterOptions={filterOptions}
        value={draft.position}
        onChange={(value) => onFieldChange('position', value)}
      />
      <div aria-hidden="true" className="h-px bg-charcoal/15 md:h-auto md:w-px" />
      <SearchField
        id="kerko-lokacioni"
        label="Lokacioni"
        icon={MapPin}
        placeholder="p.sh. Prishtinë"
        options={options.locations}
        filterOptions={filterOptions}
        value={draft.location}
        onChange={(value) => onFieldChange('location', value)}
      />
      <button type="submit" className={buttonClasses('charcoal', 'cursor-pointer md:px-9')}>
        Kërko
      </button>
    </form>
  );
}

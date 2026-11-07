import { ArrowRight, BriefcaseBusiness, CalendarClock, GraduationCap, Lightbulb, NotebookPen, Rocket, Scale } from 'lucide-react';
import { STORY_CATEGORIES, StoryCategory } from '../../../domain/blog/storyTaxonomy';
import { Reveal } from '../../home/components/ui/Reveal';

const ICONS = {
  [StoryCategory.FIRST_INTERNSHIP]: Rocket,
  [StoryCategory.DAY_AT_WORK]: CalendarClock,
  [StoryCategory.SKILLS_LEARNED]: GraduationCap,
  [StoryCategory.APPLICATION_DIARIES]: NotebookPen,
  [StoryCategory.LESSONS]: Lightbulb,
  [StoryCategory.INTERN_TO_EMPLOYEE]: BriefcaseBusiness,
  [StoryCategory.VS_EXPECTATIONS]: Scale,
};

export function CategoryGrid({ counts, activeCategory, onSelect }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STORY_CATEGORIES.map((category, index) => {
        const Icon = ICONS[category.id];
        const active = activeCategory === category.id;
        const count = counts[category.id] ?? 0;
        return (
          <Reveal as="li" key={category.id} delay={index * 60}>
            <button
              type="button"
              onClick={() => onSelect(category.id)}
              aria-pressed={active}
              aria-label={`Shiko historitë te ${category.label} (${count})`}
              className={`group flex h-full w-full cursor-pointer items-start gap-4 border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                active
                  ? 'border-cream bg-cream text-charcoal'
                  : 'border-cream/15 bg-cream/[0.03] text-cream hover:border-cream/45 hover:bg-cream/[0.07]'
              }`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center transition-colors ${
                  active ? 'bg-burgundy text-cream' : 'bg-terracotta/25 text-cream group-hover:bg-terracotta'
                }`}
              >
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{category.label}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                <span className={`mt-1 block text-sm ${active ? 'text-charcoal/75' : 'text-cream/65'}`}>
                  {category.description}
                </span>
                <span className={`mt-2 block text-xs font-semibold ${active ? 'text-burgundy' : 'text-cream/50'}`}>
                  {count === 1 ? '1 histori' : `${count} histori`}
                </span>
              </span>
            </button>
          </Reveal>
        );
      })}
    </ul>
  );
}

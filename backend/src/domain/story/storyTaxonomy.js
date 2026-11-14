export const STORY_CATEGORIES = Object.freeze([
  { id: 'first-internship', label: 'Praktika ime e parë' },
  { id: 'day-at-work', label: 'Një ditë pune' },
  { id: 'skills-learned', label: 'Aftësitë që mësova' },
  { id: 'application-diaries', label: 'Ditari i aplikimeve' },
  { id: 'lessons-i-wish-i-knew', label: 'Mësime që do t’i doja më herët' },
  { id: 'intern-to-employee', label: 'Nga praktikant në punonjës' },
  { id: 'internship-vs-expectations', label: 'Pritjet kundrejt realitetit' },
]);

export const isKnownCategory = (id) => STORY_CATEGORIES.some((category) => category.id === id);
export const categoryLabel = (id) => STORY_CATEGORIES.find((category) => category.id === id)?.label ?? id;

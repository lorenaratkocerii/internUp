export const StoryCategory = Object.freeze({
  FIRST_INTERNSHIP: 'first-internship',
  DAY_AT_WORK: 'day-at-work',
  SKILLS_LEARNED: 'skills-learned',
  APPLICATION_DIARIES: 'application-diaries',
  LESSONS: 'lessons-i-wish-i-knew',
  INTERN_TO_EMPLOYEE: 'intern-to-employee',
  VS_EXPECTATIONS: 'internship-vs-expectations',
});

export const STORY_CATEGORIES = Object.freeze([
  { id: StoryCategory.FIRST_INTERNSHIP, label: 'My First Internship', description: 'Hapi i parë në tregun e punës.' },
  { id: StoryCategory.DAY_AT_WORK, label: 'A Day at Work', description: 'Si duket një ditë e zakonshme pune.' },
  { id: StoryCategory.SKILLS_LEARNED, label: 'Skills I Learned', description: 'Aftësitë që i fitova gjatë praktikës.' },
  { id: StoryCategory.APPLICATION_DIARIES, label: 'Application Diaries', description: 'Nga CV-ja deri te intervista.' },
  { id: StoryCategory.LESSONS, label: 'Lessons I Wish I Knew', description: 'Gjërat që do t’i doja t’i dija më herët.' },
  { id: StoryCategory.INTERN_TO_EMPLOYEE, label: 'From Intern to Employee', description: 'Kur praktika kthehet në punë.' },
  { id: StoryCategory.VS_EXPECTATIONS, label: 'Internship vs Expectations', description: 'Pritjet kundrejt realitetit.' },
]);

export const STORY_FIELDS = Object.freeze([
  'Zhvillim softuerësh',
  'Dizajn',
  'Të dhëna dhe AI',
  'Marketing',
  'Financa',
  'Siguri kibernetike',
  'Inxhinieri',
  'Logjistikë',
  'Edukim',
]);

export const StoryWorkMode = Object.freeze({
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ON_SITE: 'On-site',
});

export const WORK_MODE_LABELS = Object.freeze({
  [StoryWorkMode.REMOTE]: 'Në distancë',
  [StoryWorkMode.HYBRID]: 'Hibrid',
  [StoryWorkMode.ON_SITE]: 'Në zyrë',
});

export const categoryLabel = (id) => STORY_CATEGORIES.find((category) => category.id === id)?.label ?? id;
export const isKnownCategory = (id) => STORY_CATEGORIES.some((category) => category.id === id);

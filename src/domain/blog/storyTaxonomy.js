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
  { id: StoryCategory.FIRST_INTERNSHIP, label: 'Praktika ime e parë', description: 'Hapi i parë në tregun e punës.' },
  { id: StoryCategory.DAY_AT_WORK, label: 'Një ditë pune', description: 'Si duket një ditë e zakonshme pune.' },
  { id: StoryCategory.SKILLS_LEARNED, label: 'Aftësitë që mësova', description: 'Aftësitë që i fitova gjatë praktikës.' },
  { id: StoryCategory.APPLICATION_DIARIES, label: 'Ditari i aplikimeve', description: 'Nga CV-ja deri te intervista.' },
  { id: StoryCategory.LESSONS, label: 'Mësime që do t’i doja më herët', description: 'Gjërat që do t’i doja t’i dija më herët.' },
  { id: StoryCategory.INTERN_TO_EMPLOYEE, label: 'Nga praktikant në punonjës', description: 'Kur praktika kthehet në punë.' },
  { id: StoryCategory.VS_EXPECTATIONS, label: 'Pritjet kundrejt realitetit', description: 'Çfarë prisja dhe çfarë gjeta.' },
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

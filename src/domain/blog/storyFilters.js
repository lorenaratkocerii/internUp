export const DateOrder = Object.freeze({
  NEWEST: 'newest',
  OLDEST: 'oldest',
});

export const DATE_ORDER_OPTIONS = Object.freeze([
  { value: DateOrder.NEWEST, label: 'Nga më e reja te më e vjetra' },
  { value: DateOrder.OLDEST, label: 'Nga më e vjetra te më e reja' },
]);

export function sortByDate(stories, order = DateOrder.NEWEST) {
  const direction = order === DateOrder.OLDEST ? 1 : -1;
  return [...stories].sort((a, b) => direction * (Date.parse(a.publishedAt) - Date.parse(b.publishedAt)));
}

export const sortByNewest = (stories) => sortByDate(stories, DateOrder.NEWEST);

export function browseStories(stories, { category = '', order = DateOrder.NEWEST } = {}) {
  return sortByDate(category ? stories.filter((story) => story.category === category) : stories, order);
}

export const ContentLimits = Object.freeze({
  COMPANY_NAME: { min: 2, max: 120 },
  COMPANY_INDUSTRY: { min: 2, max: 80 },
  INTERNSHIP_TITLE: { min: 3, max: 160 },
  STORY_TITLE: { min: 10, max: 160 },
  STORY_EXCERPT: { min: 30, max: 255 },
});

export function markHomeVisibility(items, isCandidate, limit) {
  let shown = 0;
  return items.map((item) => {
    const onHome = isCandidate(item) && shown < limit;
    if (onHome) shown += 1;
    return { ...item, onHome };
  });
}

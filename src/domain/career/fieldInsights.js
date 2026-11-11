export const companiesInField = (field, companies) =>
  companies.filter((company) => field.industries.includes(company.industry));

export function positionsInField(field, companies, internships) {
  const ids = new Set(companiesInField(field, companies).map((company) => company.id));
  return internships.filter((internship) => ids.has(internship.companyId));
}

export const storiesInField = (field, stories) => stories.filter((story) => story.field === field.name);

export function countSkills(positions, limit = 6) {
  const counts = new Map();
  positions.forEach((position) =>
    position.skills.forEach((skill) => counts.set(skill, (counts.get(skill) ?? 0) + 1)),
  );
  return [...counts]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'sq'))
    .slice(0, limit);
}

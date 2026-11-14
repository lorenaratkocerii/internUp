import { createInternship } from '../../../../domain/internship/Internship.js';
import { workModeFromDb } from './enumMaps.js';

export const internshipInclude = Object.freeze({
  company: { select: { slug: true, name: true } },
  city: { select: { name: true } },
  skills: { orderBy: { position: 'asc' }, select: { skill: { select: { name: true } } } },
});

const toIsoDay = (date) => date.toISOString().slice(0, 10);

export function toInternship(record) {
  return createInternship({
    id: record.slug,
    title: record.title,
    companyId: record.company.slug,
    company: record.company.name,
    location: record.city.name,
    workMode: workModeFromDb[record.workMode],
    durationMonths: record.durationMonths,
    schedule: record.schedule ?? '',
    paid: record.paid,
    stipend: record.stipend === null ? null : Number(record.stipend),
    description: record.description,
    skills: record.skills.map(({ skill }) => skill.name),
    opensAt: toIsoDay(record.opensAt),
    closesAt: toIsoDay(record.closesAt),
    seats: record.seats,
    featured: record.featured,
  });
}

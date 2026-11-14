import { createCompany } from '../../../../domain/company/Company.js';

export const companyInclude = Object.freeze({ city: { select: { name: true } } });

export function toCompany(record) {
  return createCompany({
    id: record.slug,
    name: record.name,
    shortDescription: record.shortDescription ?? '',
    industry: record.industry,
    location: record.city.name,
    foundedYear: record.foundedYear,
    website: record.website ?? '',
  });
}

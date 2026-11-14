import { DomainError } from '../shared/DomainError.js';

export function createPlatformStat({ id, value, label }) {
  if (!id || !label || !Number.isFinite(value)) {
    throw new DomainError('Një statistikë duhet të ketë id, vlerë numerike dhe etiketë.');
  }
  return Object.freeze({ id, value, label });
}

export function createPlatformStats({ internships, companies, universities, stories }) {
  return [
    { id: 'internships', value: internships, label: 'Praktika' },
    { id: 'companies', value: companies, label: 'Kompani' },
    { id: 'universities', value: universities, label: 'Universitete dhe kolegje' },
    { id: 'stories', value: stories, label: 'Histori nga studentët' },
  ].map(createPlatformStat);
}

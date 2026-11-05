import { containsAllWords } from './internshipSearch';

export const EMPTY_COMPANY_FILTERS = Object.freeze({
  query: '',
  industry: '',
  location: '',
  workMode: '',
  size: '',
  hiringOnly: false,
});

export const EMPTY_POSITION_FILTERS = Object.freeze({ query: '', status: '' });

const matchesOption = (value, selected) => !selected || value === selected;

export function matchesCompanyFilters(company, filters) {
  const searchable = [
    company.name,
    company.shortDescription,
    company.industry,
    company.location,
    ...company.technologies,
  ].join(' ');

  return (
    containsAllWords(searchable, filters.query) &&
    matchesOption(company.industry, filters.industry) &&
    matchesOption(company.location, filters.location) &&
    matchesOption(company.workMode, filters.workMode) &&
    matchesOption(company.size, filters.size) &&
    (!filters.hiringOnly || company.activePositions > 0)
  );
}

export function matchesPositionFilters(position, filters) {
  const searchable = [position.title, position.description, position.location, ...position.skills].join(' ');

  return containsAllWords(searchable, filters.query) && matchesOption(position.status, filters.status);
}

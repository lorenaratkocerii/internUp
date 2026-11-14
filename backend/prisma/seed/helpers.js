import { readFileSync } from 'node:fs';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function loadJson(name) {
  return JSON.parse(readFileSync(new URL(`./data/${name}.json`, import.meta.url), 'utf8'));
}

export function dayFromToday(offset) {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + offset));
}

export function daysAgo(days, hour = 9) {
  const date = new Date(Date.now() - days * MS_PER_DAY);
  date.setHours(hour, 0, 0, 0);
  return date;
}

export function indexBy(records, key, label) {
  const ids = new Map(records.map((record) => [record[key], record.id]));
  return (value) => {
    if (!ids.has(value)) throw new Error(`Seed: ${label} "${value}" nuk ekziston.`);
    return ids.get(value);
  };
}

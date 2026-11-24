import { createUniversity } from '../../../domain/university/University';
import { getJson, sendJson } from './httpClient';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5084').replace(/\/$/, '');
const BASE_PATH = '/api/universities';

const toUniversity = (record) => {
  try {
    return createUniversity(record);
  } catch {
    return null;
  }
};

const toRequest = (university) => ({
  id: university.id,
  name: university.name,
  shortName: university.shortName,
  type: university.type,
  city: university.city,
  logo: university.logo,
  photo: university.photo,
  website: university.website,
  emailDomains: [...(university.emailDomains ?? [])],
  description: university.description,
  aliases: [...(university.aliases ?? [])],
  representative: university.representative ? { ...university.representative } : null,
});

export function createHttpUniversityRepository() {
  const findById = async (id) => {
    const response = await fetch(`${API_URL}${BASE_PATH}/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Kërkesa ${BASE_PATH}/${id} dështoi me statusin ${response.status}.`);
    return toUniversity(await response.json());
  };

  return {
    findAll: async () => {
      const result = await getJson(BASE_PATH, { pageSize: 100 });
      return result.items.map(toUniversity).filter(Boolean);
    },
    findById,
    save: async (university) => {
      const body = toRequest(university);
      const saved = (await findById(university.id))
        ? await sendJson('PUT', `${BASE_PATH}/${encodeURIComponent(university.id)}`, body)
        : await sendJson('POST', BASE_PATH, body);
      return toUniversity(saved);
    },
  };
}

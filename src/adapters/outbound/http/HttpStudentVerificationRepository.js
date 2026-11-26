import { createVerificationRequest } from '../../../domain/university/studentVerification';
import { getJson, sendJson } from './httpClient';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5084').replace(/\/$/, '');
const BASE_PATH = '/api/verifications';

const toVerification = (record) => {
  try {
    return createVerificationRequest(record);
  } catch {
    return null;
  }
};

const findMany = async (params) => {
  const items = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await getJson(BASE_PATH, { ...params, page, pageSize: 100 });
    items.push(...result.items);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);
  return items.map(toVerification).filter(Boolean);
};

export function createHttpStudentVerificationRepository() {
  const findById = async (id) => {
    const response = await fetch(`${API_URL}${BASE_PATH}/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Kërkesa ${BASE_PATH}/${id} dështoi me statusin ${response.status}.`);
    return toVerification(await response.json());
  };

  return {
    findAll: () => findMany({}),
    findById,
    findByUniversity: (universityId) => findMany({ universityId }),
    findByStudent: (email) => findMany({ studentEmail: String(email ?? '').toLowerCase() }),
    save: async (request) => {
      const saved = (await findById(request.id))
        ? await sendJson('PUT', `${BASE_PATH}/${encodeURIComponent(request.id)}/decision`, {
            status: request.status,
            note: request.note,
            decidedBy: request.decidedBy,
          })
        : await sendJson('POST', BASE_PATH, {
            id: request.id,
            universityId: request.universityId,
            student: { email: request.student.email, name: request.student.name },
            studentNumber: request.studentNumber,
            universityEmail: request.universityEmail,
            faculty: request.faculty,
            program: request.program,
            studyYear: request.studyYear,
          });
      return toVerification(saved);
    },
  };
}

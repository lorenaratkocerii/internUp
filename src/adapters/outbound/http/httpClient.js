const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5084').replace(/\/$/, '');

export async function getJson(path, params = {}) {
  const url = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Kërkesa ${path} dështoi me statusin ${response.status}.`);
  }
  return response.json();
}

export async function sendJson(method, path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    const firstError = problem?.errors ? Object.values(problem.errors).flat()[0] : null;
    throw new Error(firstError || problem?.title || `Kërkesa ${path} dështoi me statusin ${response.status}.`);
  }
  return response.status === 204 ? null : response.json();
}

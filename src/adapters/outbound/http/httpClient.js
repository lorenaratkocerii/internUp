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

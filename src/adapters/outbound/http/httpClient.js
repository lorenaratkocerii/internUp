export class HttpError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details = null } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const isUnavailable = (error) => error instanceof HttpError && (error.status === 0 || error.status >= 500);

export function createHttpClient({ baseUrl, getToken = () => null, timeoutMs = 8000 }) {
  const root = baseUrl.replace(/\/+$/, '');

  async function request(method, path, { query, body } = {}) {
    const url = new URL(`${root}${path}`);
    for (const [name, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(name, value);
    }

    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      throw new HttpError('Serveri nuk u arrit. Sigurohu që backend-i është i ndezur dhe provo përsëri.');
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new HttpError(payload?.error?.message ?? 'Kërkesa dështoi. Provo përsëri.', {
        status: response.status,
        code: payload?.error?.code ?? 'HTTP_ERROR',
        details: payload?.error?.details ?? null,
      });
    }
    return payload.data;
  }

  return {
    get: (path, query) => request('GET', path, { query }),
    post: (path, body) => request('POST', path, { body }),
    put: (path, body) => request('PUT', path, { body }),
    patch: (path, body) => request('PATCH', path, { body }),
  };
}

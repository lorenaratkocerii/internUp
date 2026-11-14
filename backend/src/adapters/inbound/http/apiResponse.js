export function sendSuccess(res, data, { status = 200, meta = null } = {}) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

export function sendError(res, { status, code, message, details = null }) {
  const error = { code, message };
  if (details) error.details = details;
  return res.status(status).json({ success: false, error });
}

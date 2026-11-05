export function createPlatformStat({ id, value, label }) {
  if (!id || !label || !Number.isFinite(value)) {
    throw new Error('Një statistikë duhet të ketë id, vlerë numerike dhe etiketë.');
  }
  return Object.freeze({ id, value, label });
}

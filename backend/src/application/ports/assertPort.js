export function assertPort(adapter, portName, methods) {
  const missing = methods.filter((method) => typeof adapter?.[method] !== 'function');
  if (missing.length > 0) {
    throw new Error(`Adapter-i për ${portName} nuk ka: ${missing.join(', ')}`);
  }
  return adapter;
}

export function createLocalJsonStore(key, fallback) {
  const read = () => {
    if (typeof window === 'undefined') return structuredClone(fallback);
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : structuredClone(fallback);
    } catch {
      return structuredClone(fallback);
    }
  };

  const write = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      throw new Error('Të dhënat nuk u ruajtën. Hapësira e shfletuesit mund të jetë plot.');
    }
  };

  return { read, write, update: (change) => write(change(read())) };
}

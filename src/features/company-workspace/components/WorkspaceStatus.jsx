import { CircleAlert, LoaderCircle } from 'lucide-react';

export function WorkspaceLoading({ label = 'Po ngarkohen të dhënat…' }) {
  return (
    <p role="status" className="flex items-center gap-2 py-10 text-cream/70">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
      {label}
    </p>
  );
}

export function WorkspaceError({ error }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-cream/15 bg-burgundy/30 p-5 text-cream">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <p>{error?.message || 'Të dhënat nuk u ngarkuan. Provo përsëri.'}</p>
    </div>
  );
}

export function Flash({ message, tone = 'success' }) {
  if (!message) return null;
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
        tone === 'error' ? 'bg-burgundy text-cream' : 'bg-olive/25 text-cream'
      }`}
    >
      {message}
    </p>
  );
}

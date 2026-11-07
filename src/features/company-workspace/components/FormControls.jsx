export const inputClass =
  'mt-1.5 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white/70 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10 aria-invalid:border-terracotta aria-invalid:ring-2 aria-invalid:ring-terracotta/15 disabled:cursor-not-allowed disabled:bg-charcoal/5 disabled:text-charcoal/70';

export function Field({ id, label, required, hint, error, wide, children }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="block text-sm font-semibold text-charcoal">
        {label}
        {required && <span className="ml-1 text-terracotta">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-ndihme`} className="mt-1 text-xs text-charcoal/55">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-gabim`} role="alert" className="mt-1 text-xs font-semibold text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id, { error, hint }) => (error ? `${id}-gabim` : hint ? `${id}-ndihme` : undefined);

export function SectionCard({ id, number, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-cream/15 bg-cream p-5 text-charcoal shadow-lg sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-charcoal text-sm font-semibold text-cream">
          {number}
        </span>
        <div>
          <h3 className="font-display text-2xl">{title}</h3>
          {description && <p className="mt-1 text-sm text-charcoal/60">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function ConfirmDialog({ title, description, confirmLabel, tone = 'danger', busy, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-charcoal/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !busy) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="konfirmo-titull"
        aria-describedby="konfirmo-pershkrim"
        className="w-full max-w-md rounded-2xl bg-cream p-6 text-charcoal shadow-2xl sm:p-8"
      >
        <h2 id="konfirmo-titull" className="font-display text-2xl">
          {title}
        </h2>
        <p id="konfirmo-pershkrim" className="mt-2 leading-relaxed text-charcoal/70">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            disabled={busy}
            className="min-h-11 rounded-lg border border-charcoal/25 px-5 py-2.5 font-semibold hover:bg-charcoal/5 disabled:opacity-50"
          >
            Anulo
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`min-h-11 rounded-lg px-5 py-2.5 font-semibold text-cream disabled:cursor-wait disabled:opacity-70 ${
              tone === 'danger' ? 'bg-burgundy hover:bg-burgundy/90' : 'bg-olive hover:bg-olive/90'
            }`}
          >
            {busy ? 'Duke u ruajtur…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { inputClass } from '../../company-workspace/components/FormControls';

export function DecisionDialog({ title, description, confirmLabel, tone, needsNote, busy, error, onConfirm, onCancel }) {
  const [note, setNote] = useState('');

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
      <form
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="vendim-titull"
        aria-describedby="vendim-pershkrim"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm(note);
        }}
        className="w-full max-w-md rounded-2xl bg-cream p-6 text-charcoal shadow-2xl sm:p-8"
      >
        <h2 id="vendim-titull" className="font-display text-2xl">
          {title}
        </h2>
        <p id="vendim-pershkrim" className="mt-2 leading-relaxed text-charcoal/70">
          {description}
        </p>

        {needsNote && (
          <div className="mt-5">
            <label htmlFor="vendim-arsyeja" className="block text-sm font-semibold">
              Arsyeja<span className="ml-1 text-terracotta">*</span>
            </label>
            <textarea
              id="vendim-arsyeja"
              autoFocus
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-invalid={Boolean(error)}
              placeholder="p.sh. Numri i indeksit nuk përputhet me emrin në regjistër."
              className={`${inputClass} resize-y`}
            />
            <p className="mt-1 text-xs text-charcoal/55">Studenti e sheh këtë mesazh në panelin e vet.</p>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-terracotta">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus={!needsNote}
            onClick={onCancel}
            disabled={busy}
            className="min-h-11 rounded-lg border border-charcoal/25 px-5 py-2.5 font-semibold hover:bg-charcoal/5 disabled:opacity-50"
          >
            Anulo
          </button>
          <button
            type="submit"
            disabled={busy}
            className={`min-h-11 rounded-lg px-5 py-2.5 font-semibold text-cream disabled:cursor-wait disabled:opacity-70 ${
              tone === 'danger' ? 'bg-burgundy hover:bg-burgundy/90' : 'bg-olive hover:bg-olive/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { actionButton } from './adminUi';

const inputClass =
  'mt-1.5 w-full border border-cream/30 bg-charcoal/40 px-3 py-2 text-cream outline-none transition focus:border-cream focus:ring-2 focus:ring-cream/15';

export function InlineEditor({ idPrefix, fields, initialValues, busy, onSave, onCancel }) {
  const [values, setValues] = useState(initialValues);

  const changed = Object.fromEntries(
    fields.map(({ name }) => [name, values[name].trim()]).filter(([name, value]) => value !== initialValues[name]),
  );
  const hasChanges = Object.keys(changed).length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasChanges) return onCancel();
    if (await onSave(changed)) onCancel();
    return undefined;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 border-l-2 border-cream/30 pl-4">
      {fields.map(({ name, label, multiline, maxLength }) => {
        const id = `${idPrefix}-${name}`;
        const props = {
          id,
          value: values[name],
          maxLength,
          required: true,
          className: inputClass,
          onChange: (event) => setValues((current) => ({ ...current, [name]: event.target.value })),
        };
        return (
          <div key={name}>
            <label htmlFor={id} className="block text-sm font-semibold text-cream">
              {label}
            </label>
            {multiline ? <textarea rows={3} {...props} /> : <input type="text" {...props} />}
          </div>
        );
      })}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy}
          className="min-h-10 bg-cream px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:bg-cream/85 disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? 'Duke u ruajtur…' : 'Ruaj'}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={actionButton}>
          Anulo
        </button>
      </div>
    </form>
  );
}

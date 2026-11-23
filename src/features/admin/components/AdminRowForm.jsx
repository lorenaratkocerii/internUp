import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const initialValue = (field, row) => {
  const value = row?.[field.key];
  if (field.type === 'checkbox') return Boolean(value ?? field.defaultValue);
  if (value === null || value === undefined) return field.defaultValue ?? (field.type === 'number' ? 0 : '');
  return value;
};

const toPayloadValue = (field, value) => {
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'number') return value === '' ? 0 : Number(value);
  if (field.type === 'decimal') return value === '' ? null : Number(value);
  return typeof value === 'string' ? value.trim() : value;
};

const inputClass =
  'w-full rounded-[10px] border border-cream/15 bg-charcoal px-3 py-2 text-sm text-cream focus:border-cream/40 focus:outline-none disabled:opacity-60';

function useFieldOptions(fields, useCases) {
  const [options, setOptions] = useState({});

  useEffect(() => {
    let isCurrent = true;
    fields
      .filter((field) => field.optionsFrom)
      .forEach((field) => {
        const { table, valueKey, labelKey } = field.optionsFrom;
        useCases
          .getTableRows(table)
          .then((rows) => {
            if (!isCurrent) return;
            setOptions((previous) => ({
              ...previous,
              [field.key]: rows.map((row) => ({ value: row[valueKey], label: `${row[labelKey]} (${row[valueKey]})` })),
            }));
          })
          .catch(() => {});
      });
    return () => {
      isCurrent = false;
    };
  }, [fields, useCases]);

  return options;
}

export function AdminRowForm({ table, row, useCases, onCancel, onSaved }) {
  const isEditing = Boolean(row);
  const [values, setValues] = useState(() => Object.fromEntries(table.fields.map((field) => [field.key, initialValue(field, row)])));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const loadedOptions = useFieldOptions(table.fields, useCases);

  const setValue = (key, value) => setValues((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = Object.fromEntries(table.fields.map((field) => [field.key, toPayloadValue(field, values[field.key])]));
    try {
      if (isEditing) {
        await useCases.updateRow(table.id, row.id, payload);
      } else {
        await useCases.createRow(table.id, payload);
      }
      onSaved(isEditing ? 'Rreshti u përditësua.' : 'Rreshti u shtua.');
    } catch (saveError) {
      setError(saveError.message);
      setSaving(false);
    }
  };

  const optionsFor = (field) =>
    field.options ? field.options.map((option) => ({ value: option, label: option })) : (loadedOptions[field.key] ?? []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <button type="button" className="fixed inset-0 bg-charcoal/75 backdrop-blur-sm" onClick={onCancel} aria-label="Mbyll formularin" />
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-form-titulli"
        className="relative w-full max-w-xl rounded-[16px] border border-cream/15 bg-charcoal p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="admin-form-titulli" className="font-display text-2xl">
            {isEditing ? 'Ndrysho' : 'Shto'} · {table.label}
          </h2>
          <button type="button" onClick={onCancel} className="grid size-9 place-items-center rounded-[10px] text-cream/70 hover:bg-cream/[0.07]" aria-label="Mbyll">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="grid max-h-[65vh] gap-4 overflow-y-auto pr-1">
          {table.fields.map((field) => {
            const id = `fusha-${field.key}`;
            const disabled = isEditing && field.createOnly;

            if (field.type === 'checkbox') {
              return (
                <label key={field.key} htmlFor={id} className="flex items-center gap-3 text-sm">
                  <input
                    id={id}
                    type="checkbox"
                    checked={values[field.key]}
                    onChange={(event) => setValue(field.key, event.target.checked)}
                    className="size-4 accent-terracotta"
                  />
                  {field.label}
                </label>
              );
            }

            return (
              <div key={field.key}>
                <label htmlFor={id} className="mb-1.5 block text-sm text-cream/75">
                  {field.label}
                  {field.required && !disabled && <span className="text-terracotta"> *</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={id}
                    rows={3}
                    value={values[field.key]}
                    maxLength={field.maxLength}
                    required={field.required}
                    onChange={(event) => setValue(field.key, event.target.value)}
                    className={inputClass}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={id}
                    value={values[field.key]}
                    required={field.required}
                    onChange={(event) => setValue(field.key, event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Zgjidh…</option>
                    {optionsFor(field).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    type={field.type === 'decimal' ? 'number' : field.type}
                    step={field.type === 'decimal' ? '0.01' : field.type === 'number' ? '1' : undefined}
                    min={field.min}
                    value={values[field.key]}
                    maxLength={field.maxLength}
                    required={field.required && !disabled}
                    disabled={disabled}
                    onChange={(event) => setValue(field.key, event.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-[10px] border border-terracotta/40 bg-terracotta/10 p-3 text-sm">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="min-h-10 rounded-[10px] px-4 text-sm text-cream/75 hover:bg-cream/[0.07]">
            Anulo
          </button>
          <button
            type="submit"
            disabled={saving}
            className="min-h-10 rounded-[10px] bg-cream px-4 text-sm font-semibold text-charcoal hover:bg-cream/90 disabled:opacity-60"
          >
            {saving ? 'Duke ruajtur…' : 'Ruaj'}
          </button>
        </div>
      </form>
    </div>
  );
}

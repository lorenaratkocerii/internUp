import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { buttonClasses } from '../../home/components/ui/Button';

const EMPTY_FORM = { name: '', email: '', message: '' };

const inputClasses =
  'mt-1.5 w-full border border-charcoal/40 bg-transparent px-3 py-2.5 text-base text-charcoal transition-colors duration-200 hover:border-charcoal aria-invalid:border-terracotta aria-invalid:border-2';

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {hint && <span className="font-normal text-charcoal/70"> ({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-gabim`} className="mt-1.5 text-sm font-semibold text-mauve">
          {error}
        </p>
      )}
    </div>
  );
}

export function ApplicationForm({ position, useCases }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const validation = useCases.validateApplication(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSubmitting(true);
    try {
      await useCases.applyToPosition({ positionId: position.id, ...form });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div role="status" className="border-l-4 border-navy pl-4">
        <p className="flex items-center gap-2 font-display text-xl font-medium">
          <CircleCheck aria-hidden="true" className="size-5 shrink-0" />
          Aplikimi u regjistrua
        </p>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
          Ky është një demonstrim, ndaj aplikimi nuk i dërgohet asnjë kompanie.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <Field id="aplikim-emri" label="Emri dhe mbiemri" error={errors.name}>
        <input
          id="aplikim-emri"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'aplikim-emri-gabim' : undefined}
          className={inputClasses}
        />
      </Field>
      <Field id="aplikim-email" label="Email" error={errors.email}>
        <input
          id="aplikim-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'aplikim-email-gabim' : undefined}
          className={inputClasses}
        />
      </Field>
      <Field id="aplikim-mesazhi" label="Pse je i/e interesuar?" hint="opsionale">
        <textarea
          id="aplikim-mesazhi"
          rows={4}
          value={form.message}
          onChange={update('message')}
          className={inputClasses}
        />
      </Field>

      {submitError && (
        <p role="alert" className="text-sm font-semibold text-mauve">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonClasses('charcoal', 'w-full cursor-pointer disabled:cursor-wait disabled:opacity-70')}
      >
        {isSubmitting ? 'Duke dërguar...' : 'Apliko tani'}
      </button>
      <p className="text-xs leading-relaxed text-charcoal/75">
        Demonstrim: aplikimi nuk i dërgohet asnjë kompanie.
      </p>
    </form>
  );
}

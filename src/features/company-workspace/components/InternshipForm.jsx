import { Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { WorkspaceValidationError } from '../../../application/companyWorkspaceUseCases';
import { WORK_MODE_OPTIONS } from '../../../domain/internship/internshipDraft';
import { describedBy, Field, inputClass, SectionCard } from './FormControls';

export function InternshipForm({ initialValues, validate, onSubmit, submitLabel, cancelHref = '/kompani/pozitat' }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError('');
  };

  const control = (name, { hint } = {}) => ({
    id: `pozita-${name}`,
    name,
    value: values[name] ?? '',
    onChange: (event) => update(name, event.target.value),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': describedBy(`pozita-${name}`, { error: errors[name], hint }),
    className: inputClass,
  });

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const first = document.querySelector('[aria-invalid="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first?.focus({ preventScroll: true });
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFormError('Disa fusha kanë nevojë për vëmendje.');
      focusFirstError();
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof WorkspaceValidationError) {
        setErrors(error.fieldErrors);
        focusFirstError();
      }
      setFormError(error.message || 'Pozita nuk u ruajt. Provo përsëri.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <SectionCard id="pozita" number="01" title="Pozita" description="Çfarë do të bëjë studenti dhe çfarë mëson.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pozita-title" label="Titulli i pozitës" required wide error={errors.title}>
            <input {...control('title')} placeholder="p.sh. Praktikant/e në Zhvillim Frontend" />
          </Field>
          <Field id="pozita-description" label="Përshkrimi" required wide error={errors.description}>
            <textarea {...control('description')} rows={4} className={`${inputClass} py-2.5 leading-relaxed`} placeholder="Përshkruaj ekipin, projektin dhe mentorimin." />
          </Field>
          <Field id="pozita-responsibilities" label="Detyrat e studentit" wide error={errors.responsibilities} hint="Opsionale. Një detyrë për rresht.">
            <textarea {...control('responsibilities', { hint: true })} rows={3} className={`${inputClass} py-2.5 leading-relaxed`} placeholder={'Ndërto komponentë në React\nMerr pjesë në code review'} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard id="kerkesat" number="02" title="Kërkesat dhe aftësitë" description="Kë po kërkoni për këtë pozitë.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pozita-requirements" label="Kërkesat" required wide error={errors.requirements} hint="Një kërkesë për rresht, p.sh. viti i studimeve ose drejtimi.">
            <textarea {...control('requirements', { hint: true })} rows={3} className={`${inputClass} py-2.5 leading-relaxed`} placeholder={'Student/e i/e vitit të dytë ose më lart\nNjohuri bazë të JavaScript'} />
          </Field>
          <Field id="pozita-skills" label="Aftësitë e nevojshme" required wide error={errors.skills} hint="Ndaji me presje.">
            <input {...control('skills', { hint: true })} placeholder="React, JavaScript, Git" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard id="kushtet" number="03" title="Kushtet e praktikës" description="Ku, si dhe për sa kohë.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pozita-location" label="Lokacioni" required error={errors.location}>
            <input {...control('location')} placeholder="p.sh. Prishtinë" />
          </Field>
          <fieldset className="sm:row-span-1">
            <legend className="text-sm font-semibold text-charcoal">
              Work mode<span className="ml-1 text-terracotta">*</span>
            </legend>
            <div className="mt-1.5 grid grid-cols-3 gap-2" role="radiogroup">
              {WORK_MODE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-2 text-center text-xs font-semibold transition-colors sm:text-sm ${
                    values.workMode === option.value ? 'border-charcoal bg-charcoal text-cream' : 'border-charcoal/15 bg-white/70 hover:border-charcoal/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="workMode"
                    value={option.value}
                    checked={values.workMode === option.value}
                    onChange={() => update('workMode', option.value)}
                    className="sr-only"
                  />
                  {option.value}
                </label>
              ))}
            </div>
            {errors.workMode && <p role="alert" className="mt-1 text-xs font-semibold text-terracotta">{errors.workMode}</p>}
          </fieldset>
          <Field id="pozita-durationMonths" label="Kohëzgjatja (muaj)" required error={errors.durationMonths}>
            <input {...control('durationMonths')} type="number" min={1} max={24} inputMode="numeric" />
          </Field>
          <Field id="pozita-seats" label="Vende të lira" required error={errors.seats} hint="Sa interns mund të pranoni.">
            <input {...control('seats', { hint: true })} type="number" min={1} max={50} inputMode="numeric" />
          </Field>
          <Field id="pozita-schedule" label="Orari" wide error={errors.schedule} hint="Opsionale.">
            <input {...control('schedule', { hint: true })} placeholder="p.sh. Part-time, 20 orë në javë" />
          </Field>

          <div className="sm:col-span-2 rounded-xl border border-charcoal/15 bg-white/45 p-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={values.paid}
                onChange={(event) => update('paid', event.target.checked)}
                className="size-5 cursor-pointer accent-charcoal"
              />
              Praktikë me pagesë <span className="font-normal text-charcoal/60">(opsionale)</span>
            </label>
            {values.paid && (
              <div className="mt-3 max-w-xs">
                <Field id="pozita-stipend" label="Shuma mujore (€)" error={errors.stipend} hint="Lëre bosh nëse nuk dëshironi ta shfaqni.">
                  <input {...control('stipend', { hint: true })} type="number" min={1} inputMode="decimal" placeholder="p.sh. 300" />
                </Field>
              </div>
            )}
          </div>

          <Field id="pozita-opensAt" label="Data e hapjes" required error={errors.opensAt}>
            <input {...control('opensAt')} type="date" />
          </Field>
          <Field id="pozita-closesAt" label="Afati i aplikimit" required error={errors.closesAt}>
            <input {...control('closesAt')} type="date" min={values.opensAt || undefined} />
          </Field>
        </div>
      </SectionCard>

      {formError && (
        <p role="alert" className="rounded-xl bg-burgundy px-4 py-3 text-sm font-semibold text-cream">
          {formError}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-cream px-6 py-3 font-semibold text-charcoal hover:bg-cream/90 disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? 'Duke u ruajtur…' : submitLabel}
          <Send aria-hidden="true" className="size-4" />
        </button>
        <Link to={cancelHref} className="inline-flex min-h-12 items-center rounded-lg border border-cream/25 px-6 font-semibold text-cream hover:bg-cream/10">
          Anulo
        </Link>
      </div>
    </form>
  );
}

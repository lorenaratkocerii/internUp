import { useEffect, useRef, useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { buttonClasses } from '../../home/components/ui/Button';
import { Container } from '../../home/components/ui/Container';

const EMPTY_FORM = { companyName: '', email: '' };

const inputClasses =
  'mt-1.5 min-h-12 w-full border border-cream/50 bg-transparent px-3 text-base text-cream transition-colors duration-200 hover:border-cream aria-invalid:border-2 aria-invalid:border-cream';

function Field({ id, label, error, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-cream">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-gabim` : undefined}
        className={inputClasses}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-gabim`} className="mt-1.5 text-sm font-semibold text-cream">
          {error}
        </p>
      )}
    </div>
  );
}

export function CompanySignup({ useCases }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const confirmationRef = useRef(null);

  useEffect(() => {
    if (isSubmitted) confirmationRef.current?.focus({ preventScroll: true });
  }, [isSubmitted]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const validation = useCases.validateCompanyRegistration(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsSubmitting(true);
    try {
      await useCases.registerCompany(form);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="regjistro-kompanine" aria-labelledby="regjistro-kompanine-titull" className="bg-burgundy py-16 lg:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <h2
            id="regjistro-kompanine-titull"
            className="max-w-3xl font-display text-3xl leading-[1.1] font-medium tracking-tight text-cream sm:text-5xl"
          >
            Dëshironi që edhe kompania juaj të shfaqë publikime?
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85">
            Regjistrohuni tani dhe bëhuni pjesë e jona.
          </p>

          {isSubmitted ? (
            <div ref={confirmationRef} tabIndex={-1} role="status" className="mt-8 flex items-center gap-3 outline-none">
              <CircleCheck aria-hidden="true" className="size-6 shrink-0 text-cream" />
              <p className="font-display text-xl font-medium text-cream">Faleminderit! Regjistrimi u pranua.</p>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="mt-8 max-w-4xl">
              <div className="grid items-start gap-4 sm:grid-cols-[1fr_1fr_auto]">
                <Field
                  id="kompania-emri"
                  label="Emri i kompanisë"
                  type="text"
                  autoComplete="organization"
                  value={form.companyName}
                  onChange={update('companyName')}
                  error={errors.companyName}
                />
                <Field
                  id="kompania-email"
                  label="Email i kompanisë"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  error={errors.email}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={buttonClasses('cream', 'cursor-pointer disabled:cursor-wait disabled:opacity-70 sm:mt-7.5')}
                >
                  {isSubmitting ? 'Duke dërguar...' : 'Regjistrohu'}
                </button>
              </div>
              {submitError && (
                <p role="alert" className="mt-3 text-sm font-semibold text-cream">
                  {submitError}
                </p>
              )}
            </form>
          )}
        </div>
        <img
          src="/images/companies/regjistrim-ikone.png"
          alt=""
          className="hidden size-64 object-contain lg:block xl:size-72"
        />
      </Container>
    </section>
  );
}

import { ArrowUpRight, Pencil, Save, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { WorkspaceValidationError } from '../../../application/companyWorkspaceUseCases';
import { COMPANY_INDUSTRIES, COMPANY_SIZES, companyProfileDraft } from '../../../domain/internship/companyProfile';
import { CompanyLogo } from '../../companies/components/CompanyLogo';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { readImageFile, ACCEPTED_IMAGE_TYPES } from '../../blog/utils/imageFile';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { CompanyWorkspace } from '../components/CompanyWorkspace';
import { describedBy, Field, inputClass, SectionCard } from '../components/FormControls';
import { Flash, WorkspaceError, WorkspaceLoading } from '../components/WorkspaceStatus';
import { useWorkspaceData } from '../hooks/useWorkspaceData';

export function CompanyAccountProfilePage({ useCases }) {
  useDocumentTitle('Profili i kompanisë');
  const actor = useCurrentActor();
  const load = useCallback(() => useCases.getMyCompany(actor), [useCases, actor]);
  const { status, data: company, error, reload } = useWorkspaceData(load);

  const [values, setValues] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [flash, setFlash] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (company && !isEditing) setValues(companyProfileDraft(company));
  }, [company, isEditing]);

  const original = company ? companyProfileDraft(company) : null;
  const hasChanges = values && original && JSON.stringify(values) !== JSON.stringify(original);

  const update = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFlash(null);
  };

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      update('logo', await readImageFile(file, { maxDimension: 320, type: 'image/png' }));
    } catch (uploadError) {
      setErrors((current) => ({ ...current, logo: uploadError.message }));
    }
  };

  const save = async (event) => {
    event.preventDefault();
    const nextErrors = useCases.validateCompanyProfile(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setIsSaving(true);
    try {
      await useCases.updateMyCompany(actor, values);
      await reload();
      setIsEditing(false);
      setFlash({ message: 'Profili i kompanisë u ruajt. Ndryshimet shfaqen edhe në profilin publik.' });
    } catch (saveError) {
      if (saveError instanceof WorkspaceValidationError) setErrors(saveError.fieldErrors);
      setFlash({ message: saveError.message, tone: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const cancel = () => {
    setValues(original);
    setErrors({});
    setIsEditing(false);
    setFlash(null);
  };

  const control = (name, extra = {}) => ({
    id: `kompania-${name}`,
    name,
    value: values?.[name] ?? '',
    onChange: (event) => update(name, event.target.value),
    disabled: !isEditing,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': describedBy(`kompania-${name}`, { error: errors[name], hint: extra.hint }),
    className: inputClass,
  });

  return (
    <CompanyWorkspace title="Profili i kompanisë" subtitle="Përditësimi i profilit" companyName={company?.name}>
      {status === 'loading' && !company && <WorkspaceLoading />}
      {status === 'error' && <WorkspaceError error={error} />}
      {company && values && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-cream/50 uppercase">Të dhënat e kompanisë</p>
              <h2 className="mt-2 font-display text-4xl text-cream">Profili i kompanisë</h2>
              <p className="mt-2 text-cream/65">Kështu ju shohin studentët te faqja e kompanive dhe te çdo pozitë.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/kompanite/${company.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cream/25 px-4 py-2.5 font-semibold text-cream hover:bg-cream/10">
                Shiko profilin publik <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
              {isEditing && (
                <button type="button" onClick={cancel} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cream/25 px-4 py-2.5 font-semibold text-cream hover:bg-cream/10">
                  Anulo
                </button>
              )}
              {isEditing ? (
                hasChanges && (
                  <button type="submit" form="company-profile-form" disabled={isSaving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-4 py-2.5 font-semibold text-charcoal hover:bg-cream/90 disabled:opacity-70">
                    <Save aria-hidden="true" className="size-4" />
                    {isSaving ? 'Duke u ruajtur…' : 'Ruaj ndryshimet'}
                  </button>
                )
              ) : (
                <button type="button" onClick={() => { setIsEditing(true); setFlash(null); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cream px-4 py-2.5 font-semibold text-charcoal hover:bg-cream/90">
                  <Pencil aria-hidden="true" className="size-4" /> Ndrysho profilin
                </button>
              )}
            </div>
          </div>
          <Flash message={flash?.message} tone={flash?.tone} />

          <form id="company-profile-form" onSubmit={save} noValidate className="mt-6 space-y-5">
            <SectionCard id="identiteti" number="01" title="Identiteti" description="Logoja dhe emri që shfaqen në kartat e kompanisë.">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <CompanyLogo companyId={company.id} logo={values.logo} name={values.name} className="size-20 rounded-2xl" iconClassName="size-8" />
                {isEditing && (
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-charcoal/15 px-3 text-sm font-semibold hover:bg-white/60">
                      <Pencil aria-hidden="true" className="size-4" />
                      {values.logo ? 'Ndrysho logon' : 'Ngarko logon'}
                      <input type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={uploadLogo} className="sr-only" />
                    </label>
                    {values.logo && (
                      <button type="button" onClick={() => update('logo', '')} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-terracotta hover:bg-terracotta/10">
                        <Trash2 aria-hidden="true" className="size-4" /> Hiq logon
                      </button>
                    )}
                  </div>
                )}
                {errors.logo && <p role="alert" className="w-full text-xs font-semibold text-terracotta">{errors.logo}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="kompania-name" label="Emri i kompanisë" required error={errors.name}>
                  <input {...control('name')} autoComplete="organization" />
                </Field>
                <Field id="kompania-industry" label="Industria" required error={errors.industry}>
                  <select {...control('industry')}>
                    <option value="">Zgjidh...</option>
                    {[...new Set([...COMPANY_INDUSTRIES, values.industry].filter(Boolean))].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>
                <Field id="kompania-shortDescription" label="Përshkrimi i shkurtër" required wide error={errors.shortDescription} hint="Deri në 160 karaktere — shfaqet te kartat e kompanive.">
                  <input {...control('shortDescription', { hint: true })} maxLength={200} />
                </Field>
              </div>
            </SectionCard>

            <SectionCard id="rreth" number="02" title="Rreth kompanisë" description="Historia dhe madhësia e ekipit tuaj.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="kompania-description" label="Përshkrimi" required wide error={errors.description}>
                  <textarea {...control('description')} rows={5} className={`${inputClass} py-2.5 leading-relaxed`} />
                </Field>
                <Field id="kompania-foundedYear" label="Viti i themelimit" required error={errors.foundedYear}>
                  <input {...control('foundedYear')} type="number" inputMode="numeric" min={1900} max={new Date().getFullYear()} />
                </Field>
                <Field id="kompania-size" label="Madhësia e kompanisë" required error={errors.size}>
                  <select {...control('size')}>
                    <option value="">Zgjidh...</option>
                    {COMPANY_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </Field>
              </div>
            </SectionCard>

            <SectionCard id="kontakti" number="03" title="Lokacioni dhe website" description="Ku ndodheni dhe ku mund t’ju gjejnë studentët online.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="kompania-location" label="Lokacioni" required error={errors.location}>
                  <input {...control('location')} placeholder="p.sh. Prishtinë" autoComplete="address-level2" />
                </Field>
                <Field id="kompania-website" label="Website" error={errors.website}>
                  <input {...control('website')} type="url" placeholder="https://kompania.com" />
                </Field>
              </div>
            </SectionCard>
          </form>
        </>
      )}
    </CompanyWorkspace>
  );
}
